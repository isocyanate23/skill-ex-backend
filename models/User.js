const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone_number: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
        default: ""
    },
    skills: {
        type: [String],
        required: true,
        default: [] 
    },
    age: {
        type: Number,
        required: true,
        default: 18
    },
    personal_description: {
        type: String,
        required: true,
        default: ""
    },
    working_professional: {
        type: Boolean,
        required: true,
        default: false
    },
    area_expertise: {
        type: String,
        required: function () {
            return this.working_professional;
        },
        default: null
    },
    work_experience: {
        type: Number,
        required: function () {
            return this.working_professional;
        },
        default: null
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    friends: [{ type: mongoose.Schema.Types.ObjectId , ref: 'User'}],
    friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
}, {timestamps: true}
);

userSchema.pre('save', async function(next) {
    const user = this;
    if ( !user.isModified('password') ) return next();

    try {
        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password, salt);
        next();
    } catch (error) {
        return next(error);
    }
});

userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;