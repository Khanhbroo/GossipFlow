import mongoose from "mongoose";
import Friend from "../models/Friend.js";
import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export const sendFriendRequest = async (req, res) => {
  try {
    const { to, message } = req.body;
    const from = req.user._id;

    if (!from) {
      return res.status(404).json({ message: "User not existed" });
    }

    if (from.toString() === to.toString()) {
      return res
        .status(400)
        .json({ message: "Can not send friend request to your self" });
    }

    const userExists = await User.exists({ _id: to });

    if (!userExists) {
      return res.status(404).json({ message: "This friend is not existed" });
    }

    let userA = from.toString();
    let userB = to.toString();

    if (userA > userB) {
      [userA, userB] = [userB, userA];
    }

    const [alreadyFriends, existingRequest] = await Promise.all([
      Friend.findOne({
        userA: new mongoose.Types.ObjectId(userA),
        userB: new mongoose.Types.ObjectId(userB),
      }),
      FriendRequest.findOne({
        $or: [
          { from, to },
          { from: to, to: from },
        ],
      }), // Check 2 ways of existing any friend request between A and B. 1st one is A to B, 2nd one is B to A
    ]);

    if (alreadyFriends) {
      return res.status(400).json({ message: "You guys are already friends" });
    }

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "You have already sent a friend request before" });
    }

    const request = await FriendRequest.create({ from, to, message });

    return res
      .status(201)
      .json({ message: "Sent friend request successfully", request });
  } catch (error) {
    console.log("Error when adding friend", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ messsage: "No friend request found" });
    }

    if (request.to.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You do not have authorization to accept this invitation",
      });
    }

    await Friend.create({
      userA: request.from,
      userB: request.to,
    });

    await FriendRequest.findByIdAndDelete(requestId);

    const from = await User.findById(request.from)
      .select("_id displayName avatarUrl")
      .lean();

    return res.status(200).json({
      message: "Accepting friend request successfully!",
      newFriend: {
        _id: from?._id,
        displayName: from?.displayName,
        avatarUrl: from?.avatarUrl,
      },
    });
  } catch (error) {
    console.log("Error when accepting friend request", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// export const declineFriendRequest = async (req, res) => {
//   try {
//     const { requestId } = req.params;
//     const userId = req.user._id;

//     const request = await FriendRequest.findById(requestId);

//     if (!request) {
//       return res.status(404).json({ message: "No friend request found" });
//     }

//     if (request.to.toString() !== userId) {
//       return res.status(403).json({
//         message: "You do not have authorization to decline this friend request",
//       });
//     }

//     await FriendRequest.findByIdAndDelete(requestId);

//     return res
//       .status(201)
//       .json({ message: "Decline friend request successfully!" });
//   } catch (error) {
//     console.log("Error when declining friend request", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

export const declineFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found!" });
    }

    if (friendRequest.to.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You can not do this!" });
    }

    await FriendRequest.findByIdAndDelete(requestId);

    return res.status(200).json({ message: "Decline friend successfully!" });
  } catch (error) {
    console.log("Error declining friend", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllFriends = async (req, res) => {
  try {
    const userId = req.user._id;

    const friendships = await Friend.find({
      $or: [
        {
          userA: userId,
        },
        {
          userB: userId,
        },
      ],
    })
      .populate("userA", "_id displayName avatarUrl")
      .populate("userB", "_id displayName avatarUrl")
      .lean();

    if (!friendships.length) {
      return res.status(200).json({ friends: [] });
    }

    const friends = friendships.map((friend) => {
      return friend.userA._id.toString() === userId.toString()
        ? friend.userB
        : friend.userA;
    });

    return res.status(200).json({ friends });
  } catch (error) {
    console.log("Error when getting friend list", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const populateFields = "_id username displayName avatarUrl";

    const [sent, received] = await Promise.all([
      FriendRequest.find({ from: userId }).populate("to", populateFields),
      FriendRequest.find({ to: userId }).populate("from", populateFields),
    ]);

    res.status(200).json({sent, received});
  } catch (error) {
    console.log("Error when getting all requests", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
