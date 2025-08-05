import { model, Schema } from 'mongoose';

// Friendship Schema
const friendshipSchema = new Schema({
  requester: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'accepted', 'declined', 'blocked'],
      message: 'Status must be one of: pending, accepted, declined, blocked'
    },
    required: true,
    default: 'pending',
    index: true
  },
  acceptedAt: {
    type: Date,
    default: null
  },
  metadata: {
    mutualFriends: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      trim: true
    },
    source: {
      type: String,
      enum: ['search', 'suggestion', 'contact_import', 'direct'],
      default: 'direct'
    }
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  collection: 'friendships'
});

// Compound indexes for efficient queries
friendshipSchema.index({ requester: 1, recipient: 1 }, { unique: true });
friendshipSchema.index({ requester: 1, status: 1 });
friendshipSchema.index({ recipient: 1, status: 1 });
friendshipSchema.index({ status: 1, createdAt: -1 });

// Pre-save middleware to prevent self-friendship
friendshipSchema.pre('save', function (next) {
  if (this.requester.equals(this.recipient)) {
    const error = new Error('Users cannot befriend themselves');
    return next(error);
  }
  next();
});

// Pre-save middleware to set acceptedAt when status changes to accepted
friendshipSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'accepted' && !this.acceptedAt) {
    this.acceptedAt = new Date();
  }
  next();
});

// Instance Methods
friendshipSchema.methods.accept = function () {
  this.status = 'accepted';
  this.acceptedAt = new Date();
  return this.save();
};

friendshipSchema.methods.decline = function () {
  this.status = 'declined';
  return this.save();
};

friendshipSchema.methods.block = function () {
  this.status = 'blocked';
  return this.save();
};

friendshipSchema.methods.getOtherUser = function (currentUserId) {
  return this.requester.equals(currentUserId) ? this.recipient : this.requester;
};

// Static Methods
friendshipSchema.statics.findFriendship = function (userId1, userId2) {
  return this.findOne({
    $or: [
      { requester: userId1, recipient: userId2 },
      { requester: userId2, recipient: userId1 }
    ]
  });
};

// friendshipSchema.statics.getFriends = function(userId, populateUsers = false) {
//   const query = this.find({
//     $or: [
//       { requester: userId },
//       { recipient: userId }
//     ],
//     status: 'accepted'
//   });

//   if (populateUsers) {
//     return query.populate('requester recipient', 'username email avatar');
//   }
//   return query;
// };

friendshipSchema.statics.getFriends = async function (userId) {
  // Find all accepted friendships involving the user
  const friendships = await this.find({
    $or: [
      { requester: userId },
      { recipient: userId }
    ],
    status: 'accepted'
  }).populate('requester recipient', 'username email');

  // Map friendships to return only friend info (exclude current user)
  return friendships.map(friendship => {
    const friend = friendship.requester._id.equals(userId)
      ? friendship.recipient
      : friendship.requester;

    return {
      _id: friend._id,
      username: friend.username,
      email: friend.email
    };
  });
};

friendshipSchema.statics.getPendingRequests = function (userId, type = 'received') {
  const filter = {
    status: 'pending'
  };

  if (type === 'received') {
    filter.recipient = userId;
  } else if (type === 'sent') {
    filter.requester = userId;
  }

  return this.find(filter).populate('requester recipient', 'username email avatar');
};

friendshipSchema.statics.areFriends = async function (userId1, userId2) {
  const friendship = await this.findFriendship(userId1, userId2);
  return friendship && friendship.status === 'accepted';
};

friendshipSchema.statics.createFriendRequest = async function (requesterId, recipientId, metadata = {}) {
  // Check if friendship already exists
  const existingFriendship = await this.findFriendship(requesterId, recipientId);

  if (existingFriendship) {
    throw new Error('Friendship already exists');
  }

  const friendship = new this({
    requester: requesterId,
    recipient: recipientId,
    status: 'pending',
    metadata
  });

  return friendship.save();
};

friendshipSchema.statics.getFriendCount = function (userId) {
  return this.countDocuments({
    $or: [
      { requester: userId },
      { recipient: userId }
    ],
    status: 'accepted'
  });
};

// Virtual for getting friend user details
friendshipSchema.virtual('friend').get(function () {
  // This would be populated based on context of which user is viewing
  return this.populated('requester') || this.populated('recipient');
});

// Transform output to remove sensitive data
friendshipSchema.methods.toJSON = function () {
  const friendship = this.toObject();

  // Only include metadata if friendship is accepted
  if (friendship.status !== 'accepted') {
    delete friendship.metadata;
  }

  return friendship;
};

// Create the model
export const Friendship = model('Friendship', friendshipSchema);

// Usage Examples:

/*
// Create a friend request
const friendship = await Friendship.createFriendRequest(
  requesterId, 
  recipientId, 
  { source: 'search', notes: 'Met at conference' }
);

// Accept a friend request
const friendship = await Friendship.findById(friendshipId);
await friendship.accept();

// Get all friends for a user (with user details populated)
const friends = await Friendship.getFriends(userId, true);

// Get pending friend requests received by user
const pendingRequests = await Friendship.getPendingRequests(userId, 'received');

// Check if two users are friends
const areFriends = await Friendship.areFriends(userId1, userId2);

// Get friend count
const friendCount = await Friendship.getFriendCount(userId);

// Find specific friendship
const friendship = await Friendship.findFriendship(userId1, userId2);
*/
