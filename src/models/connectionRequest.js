const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    status: {
        type: String,   
        enum: ['interested', 'accepted', 'rejected','ignored'],
        message: '{VALUE} is not supported'
    }

},
{timestamps: true}
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre('save',  function() {
    if (this.toUserId.equals(this.fromUserId)) {
        throw new Error('Cannot send connection request to yourself');
    }
});
const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema);

module.exports = ConnectionRequest;