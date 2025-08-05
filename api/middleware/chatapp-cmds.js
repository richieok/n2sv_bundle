import mongoose from 'mongoose';
import { DB_URI } from '../initDB.js';
import { Friendship } from '../models/friendship.js';
import { User } from '../models/user.js';

export const getProfile = async (req, res) => {
    res.status(200).json({ message: 'Profile' })
}

export const sendFriendReq = async (req, res) => {
    await mongoose.connect(DB_URI);
    // console.log(req.originalUrl);
    console.log(req.user);
    console.log(req.query.friendUsername);
    let friend = await User.findByUsername(req.query.friendUsername);
    if (!friend) {
        return res.status(404).json({ message: 'Friend not found' });
    }
    Friendship.createFriendRequest(req.user.id, friend._id)
        .then(() => {
            console.log("Friend request sent");
            res.status(200).json({ message: 'Friend request sent' })
        })
        .catch((error) => {
            if (error.message === 'Friendship already exists') {
                return res.status(400).json({ message: 'Friend request already sent' });
            }
            res.status(500).json({ message: 'Error sending friend request' });
        });
}

export const pendingFriendRequests = async (req, res) => {
    await mongoose.connect(DB_URI);
    const userId = req.user.id;
    const type = req.query.type || 'received'; // 'received' or 'sent'
    
    try {
        const requests = await Friendship.getPendingRequests(userId, type);
        res.status(200).json({ requests });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pending friend requests', error: error.message });
    }
}

export const acceptFriendReq = async (req, res) => {
    await mongoose.connect(DB_URI);
    const friendshipId = req.query.friendshipId;

    try {
        const friendship = await Friendship.findById(friendshipId);
        friendship.accept()
        res.status(200).json({ message: 'Friend request accepted' });
    } catch (error) {
        res.status(500).json({ message: 'Error accepting friend request', error: error.message });
    }
}

export const getFriends = async (req, res)=>{
    await mongoose.connect(DB_URI);
    const userId = req.user.id;
    try {
        const friends = await Friendship.getFriends(userId);
        res.status(200).json({ friends });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching friends', error: error.message });
    }
}