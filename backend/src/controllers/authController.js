import bcrypt from "bcrypt";
import User from "../models/User.js";

export const signUp = async (req, res) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;

    if (!username || !password || !email || !firstName || !lastName) {
      return res.status(400).json({
        message:
          "Username, password, email, firstName, lastName must be provided",
      });
    }

    // Check if user is existed
    const duplicate = await User.findOne({ username });

    if (duplicate) {
      return res.status(409).json({ message: "Username already existed" });
    }

    // If not existed, hash password
    const saltRound = 10;
    const hashedPassword = await bcrypt.hash(password, saltRound);

    // Then create a new user
    await User.create({
      username,
      hashedPassword,
      email,
      displayName: `${firstName} ${lastName}`,
    });

    // Return success response
    return res.sendStatus(204);
  } catch (error) {
    console.log("Error when signing up:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
