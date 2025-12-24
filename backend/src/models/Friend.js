import mongoose from "mongoose";

const friendSchema = new mongoose.Schema(
  {
    userA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userB: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

friendSchema.pre("save", async function () {
  const a = this.userA.toString();
  const b = this.userB.toString();

  if (a > b) {
    this.userA = new mongoose.Types.ObjectId(b);
    this.userB = new mongoose.Types.ObjectId(a);
  }

  return;
});

friendSchema.index({ userA: 1, userB: 1 }, { unique: true }); // Make sure to create a unique index for A and B, this won't be duplicated

const Friend = mongoose.model("Friend", friendSchema);
export default Friend;
