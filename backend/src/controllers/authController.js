import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import Session from "../models/Session.js";

const ACCESS_TOKEN_TTL = "30m"; // usually below 15m
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14 days

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

export const signIn = async (req, res) => {
  try {
    // Get username and password that user sends
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required!" });
    }
    // Get hashedPassword in db to compare with the password user just input
    const user = await User.findOne({ username });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Username or password incorrect" });
    }

    // Compare password
    const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordCorrect) {
      return res
        .status(401)
        .json({ message: "Username or password incorrect" });
    }

    // If correct, then creating an access token with JWT
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL }
    );

    // Then, create a refresh token
    const refreshToken = crypto.randomBytes(64).toString("hex");

    // Create a new session to save the refresh token
    await Session.create({
      userId: user._id,
      refreshToken,
      expiredAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    // Return refresh token to client through cookies
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // This cookies can not be accessed through JS
      secure: true, // Make sure that this cookie is only sent through HTTP
      sameSite: "none", // Backend, frontend seperated
      maxAge: REFRESH_TOKEN_TTL,
    });

    // Return access token to client through response
    return res.status(200).json({
      message: `User ${user.displayName} logged in successfully!`,
      accessToken,
    });
  } catch (error) {
    console.log("Erorr when signing in:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
