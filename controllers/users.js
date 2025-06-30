const { response } = require('express');
const User = require('../models/User');

const searchByUsername = async (req, res) => {

    try {
        const { username } = req.query;

        if (!username) {
            return res.status(400).json({ message: 'Username is required' });
        }

        const user = await User.findOne(
            { username },
            'username name skills age working_professional'
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getProfileData = async (req, res) => {
    try {
        const { username } = req.query;
        if ( !username ) {
            return res.status(400).json({ message: 'Username is required' });
        }

        const user = await User.findOne(
            { username },
            "username name email age personal_description skills working_professional area_expertise work_experience"
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error', error: error.message });
    }
};

const sendFriendRequest = async (req, res) => {
    try {
        const { friendUsername } = req.body;
        const userId = req.user._id;
        // const sender = await User.findById(userId);
        const reciever = await User.findOne({ friendUsername });

        if (!reciever) {
            return res.status(404).json({ message: 'User not found!'});   
        }

        const friendId = reciever._id;
        if ( userId.toString()==friendId.toString() ) {
            return res.status(400).json({ message: 'Invalid Request' });
        }

        if ( reciever.friendRequests.includes(userId)) {
            return res.status(400).json({ message: 'Friend request already sent'});
        }

        reciever.friendRequests.push(userId);
        await reciever.save();

        res.status(200).json({ message: 'Friend request sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message});
    }
};

const acceptFriendRequest = async (req, res) => {
    try {
        const { friendUsername } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        const friend = await User.findOne({ friendUsername });
        const friendId = friend._id;
        if ( !friend ) {
            res.status(404).json({ message: 'User Not Found' });
        }

        if ( !user.friendRequests.includes(friendId) ) {
            return res.status(400).json( {message: 'No friend requests from this user'} );
        }

        user.friends.push(friendId);
        friend.friends.push(userId);

        user.friendRequests = user.friendRequests.filter(id=> id.toString() !== friendId);
        await user.save();
        await friend.save();

        res.status(200).json({ message: "Friend request accepted" });

    } catch ( error ) {
        res.status(500).json({ message: 'Server Error', error: error.message});
    }
};

const rejectFriendRequest = async (req, res) => {
    try {
        const {friendUsername} = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        const friend = await User.findOne({ friendUsername });
        const friendId = friend._id;

        if ( !user.friendRequests.includes(friendId) ) {
            return res.status(400).json({ message: 'No friend request from this user'});
        }

        user.friendRequests = user.friendRequests.filter(id=> id.toString() !== friendId);
        await user.save();

        res.status(200).json({ message: 'Friend request rejected'});
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message});
    }
};

const getFriendRequests = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).populate('friendRequests', 'username name');
        
        res.status(200).json({ friendRequests: user.friendRequests });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message});
    }
};


const getFriendList = async ( req, res ) => {

    try {
        const userId = req.user._id;
        const user = await User.findById(userId).populate('friends', 'username name');

        res.status(200).json({ friends: user.friends });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message});
    }
};

module.exports = { 
    searchByUsername, 
    sendFriendRequest,
    acceptFriendRequest, 
    rejectFriendRequest, 
    getFriendRequests,
    getFriendList, 
    getProfileData
};