// IMPORT MONGOOSE TO CREATE USER MODEL
const mongoose = require("mongoose");

// IMPORT BCRYPT
const bcrypt = require("bcryptjs");

// Use mongoose to create userSchema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // required: [true, "Each user must have a name"],
    },
    email: {
      type: String,
      trim: true,
      // required: [true, "Email is a required field"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      trim: true,
      minLength: [3, "Password must be at least 3 characters long"],
      // required: [true, "Password is a required field"],
      select: false,
    },
    age:{
      type: String,
      default: 3
    },
    natural: {
      type: Boolean,
      default: false      
    },
    male: {
      type: Boolean,
      default: false
    },
    coach: {
      type: Boolean,
      default: false
    }

  },

  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);
userSchema.virtual('macros',{
  ref: 'Macros',
  localField: '_id',
  foreignField: 'owner'
})
userSchema.virtual('workouts',{
  ref: 'Workout',
  localField: '_id',
  foreignField: 'owner'
})
// Create a document middleware to encrypt the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    // Call the next middleware in the stack
    next();

    // Return early
    return;
  }

  // Encrypt password
  this.password = await bcrypt.hash(this.password, 12);

  // Call the next middleware in the stack
  next();
});

userSchema.methods.comparePassword = async function (
  plainText,
  hashedPassword
) {
  return await bcrypt.compare(plainText, hashedPassword);
};

// Use mongoose and schema to create user model
const User = mongoose.model("User", userSchema);

// EXPORT MODEL TO BE USED IN OTHER PARTS OF OUR APPLICATION
module.exports = User;
