import User from '../models/user';
import { hashPassword, comparePassword } from '../helpers/auth';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  //   console.log('REGISTER ENDPOINT =>', req.body);
  const { name, email, password, secret } = req.body;

  // validation
  if (!name) {
    return res.json({
      error: 'Name is required.',
    });
  }

  if (!password || password.length < 6) {
    return res.json({
      error: 'Password is required and should be min 6 characters long.',
    });
  }

  if (!secret) {
    return res.json({
      error: 'Secret is required.',
    });
  }

  const exist = await User.findOne({ email });
  if (exist) {
    return res.json({
      error: 'Email is taken',
    });
  }

  // hash password
  const hashedPassword = await hashPassword(password);

  const user = new User({
    name,
    email,
    password: hashedPassword,
    secret,
    username: nanoid(),
  });
  try {
    await user.save();
    // console.log('REGISTERED USER => ', user);
    return res.json({ ok: true });
  } catch (err) {
    console.log('REGISTER FAILED => ', err);
    return res.json({
      error: 'Error. Try again.',
    });
  }
};

export const login = async (req, res) => {
  // console.log(req.body);
  try {
    const { email, password } = req.body;
    // check  if our db has user with that email
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        error: 'No user found.',
      });
    }
    // check password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.json({
        error: 'Wrong password.',
      });
    }
    // create signed token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    user.password = undefined;
    user.secret = undefined;
    res.json({
      token,
      user,
    });
  } catch (err) {
    console.log(err);
    return res.json({
      error: 'Error. Try again.',
    });
  }
};

export const forgotPassword = async (req, res) => {
  // console.log(req.body);
  const { email, newPassword, secret } = req.body;
  // validation
  if (!email) {
    return res.json({
      error: 'Email is required.',
    });
  }
  if (!newPassword || newPassword < 6) {
    return res.json({
      error: 'New password is required and should be min 6 characters long.',
    });
  }
  if (!secret) {
    return res.json({
      error: 'Secret is required.',
    });
  }

  const user = await User.findOne({ email, secret });
  if (!user) {
    return res.json({
      error: "We can't verify you with those details.",
    });
  }

  try {
    const hashed = await hashPassword(newPassword);
    await User.findByIdAndUpdate(user._id, { password: hashed });
    return res.json({
      success: 'You can now login with your new password.',
    });
  } catch (err) {
    console.log(err);
    return res.json({
      error: 'Something is wrong. Try again.',
    });
  }
};

export const currentUser = async (req, res) => {
  try {
    // console.log(req.auth._id);
    const user = await User.findById(req.auth._id);
    // res.json(user);
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};
