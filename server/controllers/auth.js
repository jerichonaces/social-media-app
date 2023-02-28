import User from '../models/user';
import { hashPassword, comparePassword } from '../helpers/auth';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import Post from '../models/post';

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
    username: nanoid(6),
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

export const profileUpdate = async (req, res) => {
  try {
    // console.log('profile update req.body', req.body);
    const data = {};
    if (req.body.username) data.username = req.body.username;
    if (req.body.about) data.about = req.body.about;
    if (req.body.name) data.name = req.body.name;
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.json({
          error: 'Password is required and should be min 6 characters long.',
        });
      } else {
        data.password = await hashPassword(req.body.password);
      }
    }
    if (req.body.secret) data.secret = req.body.secret;
    if (req.body.image) data.image = req.body.image;

    let user = await User.findByIdAndUpdate(req.auth._id, data, { new: true });
    console.log('updated user', user);
    user.password = undefined;
    user.secret = undefined;
    res.json(user);
  } catch (error) {
    if (error.code == 11000) {
      return res.json({ error: 'Duplicate username' });
    }
    console.log(error);
  }
};

export const findPeople = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id);
    let following = user.following;
    following.push(user._id);

    const people = await User.find({ _id: { $nin: following } })
      .select('-password -secret')
      .limit(10);
    people;
    res.json(people);
  } catch (error) {
    console.log(error);
  }
};

// middleware for userFollow
export const addFollower = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.body._id, {
      $addToSet: { followers: req.auth._id },
    });
    next();
  } catch (error) {
    console.log(error);
  }
};

export const userFollow = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.auth._id,
      {
        $addToSet: { following: req.body._id },
      },
      { new: true }
    ).select('-password -secret');
    res.json(user);
  } catch (error) {
    console.log(error);
  }
};

export const userFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id);
    const following = await User.find({ _id: user.following }).limit(100);
    res.json(following);
    console.log(
      '🚀 ~ file: auth.js:227 ~ userFollowing ~ following:',
      following
    );
  } catch (error) {
    console.log(error);
  }
};

export const removeFollower = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.body._id, {
      $pull: { followers: req.auth._id },
    });
    next();
  } catch (error) {
    console.log(error);
  }
};

export const userUnfollow = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.auth._id,
      {
        $pull: { following: req.body._id },
      },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    console.log(error);
  }
};

export const likePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.body._id,
      {
        $addToSet: { likes: req.auth._id },
      },
      { new: true }
    );
    res.json(post);
  } catch (error) {
    console.log(error);
  }
};

export const unlikePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.body._id,
      {
        $pull: { likes: req.auth._id },
      },
      { new: true }
    );
    res.json(post);
  } catch (error) {
    console.log(error);
  }
};
