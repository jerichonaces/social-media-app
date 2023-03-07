import express from 'express';

const router = express.Router();

// middlewares
import { isAdmin, requireSignin } from '../middlewares';

// controllers
import {
  register,
  login,
  forgotPassword,
  currentUser,
  profileUpdate,
  findPeople,
  addFollower,
  userFollow,
  userFollowing,
  removeFollower,
  userUnfollow,
  searchUser,
  getUser,
} from '../controllers/auth';

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.get('/current-user', requireSignin, currentUser);
router.put('/profile-update', requireSignin, profileUpdate);
router.get('/find-people', requireSignin, findPeople);
router.put('/user-follow', requireSignin, addFollower, userFollow);
router.get('/user-following', requireSignin, userFollowing);
router.put('/user-unfollow', requireSignin, removeFollower, userUnfollow);
router.get('/search-user/:query', searchUser);
router.get('/user/:username', getUser);

// admin
router.get('/current-admin', requireSignin, isAdmin, currentUser);

module.exports = router;
