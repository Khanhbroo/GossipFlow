import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Authorization - verify user
export const protectedRoute = (req, res, next) => {
  try {
    // Get access token from header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access token not found" });
    }

    // Verify the access token
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (error, decodedUser) => {
        if (error) {
          console.log(error);
          return res
            .status(403)
            .json({ message: "Access token is incorrect or expired" });
        }

        // Look for user
        const user = await User.findById(decodedUser.userId).select(
          "-hashedPassword"
        );

        if (!user) {
          return res.status(404).json({ message: "User not found." });
        }

        // Return user in req
        req.user = user;
        next();
      }
    );
  } catch (error) {
    console.log("Error when verifying JWT in authMiddleware:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
