
const express = require('express');
const { authenticate, refreshTokenHandler } = require('../middlewares/auth');
const { searchByUsername } = require('../controllers/users');
const { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, getFriendRequests, getProfileData } = require('../controllers/users');
const router = express.Router();


// authentication end point
router.get('/profile', authenticate, (req, res) => {
    res.status(201).json({ 
        message: 'Authentication Successful!',
        user_id: req.user.id,
        username: req.user.username,
        name: req.user.name,
        email: req.user.email,
        age: req.user.age,
        phone_number: req.user.phone_number,
        skills: req.user.skills,
        personal_description: req.user.personal_description,
        working_professional: req.user.working_professional,
        area_expertise: req.user.area_expertise,
        work_experience: req.user.work_experience,
        friends: req.user.friends,
        friendRequests: req.user.friendRequests
    });
});

// refreshing user session
router.get('/refresh', refreshTokenHandler);

// search by username
router.get('/search_username', authenticate, searchByUsername);

// getting profile data
router.get('/profile_data', authenticate, getProfileData)

// friend request endpoints
router.post('/send_friend_request', authenticate, sendFriendRequest);
router.post('/accept_friend_request', authenticate, acceptFriendRequest);
router.post('/reject_friend_request', authenticate, rejectFriendRequest);
router.get('/friend_requests', authenticate, getFriendRequests);

module.exports = router;
