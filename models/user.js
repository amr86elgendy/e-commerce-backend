import mongoose from 'mongoose';
import pkg from 'validator';
const { isEmail } = pkg;
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter an username'],
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, 'Please enter an email'],
      unique: true,
      lowercase: true,
      validate: [isEmail, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please enter an password'],
      minlength: [6, 'Password cannot be lower than 6 character'],
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    address: String,
  },
  { timestamps: true }
);

// Fire a function before doc saved to db
userSchema.pre('save', async function () {
  // console.log('this.modifiedPaths()', this.modifiedPaths());
  // console.log('this.isModified(name)', this.isModified('name'));
  // console.log('this.isModified(password)', this.isModified('password'));
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  return isMatch;
};

export default  mongoose.model('User', userSchema);;
