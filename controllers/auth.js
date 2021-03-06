import User from '../models/user.js';
import { StatusCodes } from 'http-status-codes';
import CustomError from '../errors/index.js';
import { attachCookiesToResponse } from '../utils/index.js';
import createTokenUser from '../utils/createToken.js';
import { createJWT } from '../utils/jwt.js';

export const register = async (req, res) => {
  const { email, name, password } = req.body;

  const emailUser = await User.findOne({ email });

  if (emailUser) {
    throw new CustomError.BadRequestError('Email is already taken');
  }
  // first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? 'admin' : 'user';

  // Create the user
  const user = await User.create({ email, name, password, role });
  // Create Token User
  const tokenUser = createTokenUser(user);
  const token = createJWT({ payload: tokenUser });
  attachCookiesToResponse({ res, user: tokenUser });

  // Return the user
  res.status(StatusCodes.CREATED).json({ user: tokenUser, token });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide email and password');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }

  const isPasswordMatches = await user.comparePassword(password);

  if (!isPasswordMatches) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }

  const tokenUser = createTokenUser(user);
  const token = createJWT({ payload: tokenUser });
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser, token });
};

export const logout = (_, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });

  res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};
