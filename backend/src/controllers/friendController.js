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

    if (from === to) {
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
      Friend.findOne({ userA, userB }),
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
  } catch (error) {
    console.log("Error when accepting friend request", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const declineFriendRequest = async (req, res) => {
  try {
  } catch (error) {
    console.log("Error when declining friend request", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllFriends = async (req, res) => {
  try {
  } catch (error) {
    console.log("Error when getting friend list", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllRequests = async (req, res) => {
  try {
  } catch (error) {
    console.log("Error when getting all requests", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
