import mongoose from 'mongoose';

// Define the user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Enforces unique email at schema level
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: function () { return this.provider === 'local'; },
        default: null
    },
    contact: {
        type: String,
        default: '',
    },
    provider: {
        type: String,
        enum: ['local', 'google', 'facebook'],
        default: 'local',
    },
    social: {
        googleId: {
            type: String,
            default: '',
        }
    },
}, {
    timestamps: true // adds createdAt and updatedAt fields automatically
});

// Static methods
userSchema.statics.createUser = async function ({ username, email, password, contact = '', provider = 'local', social = {} }) {
    const newUser = await this.create({
        username,
        email,
        password,
        contact,
        provider,
        social: {
            googleId: social.googleId || '',
            facebookId: social.facebookId || '',
        }
    });
    return newUser;
};

userSchema.statics.findByEmail = function (email) {
    return this.findOne({ email });
};

userSchema.statics.findById = function (id) {
    return this.findOne({ _id: id });
};

userSchema.statics.findByGoogleId = function (googleId) {
    return this.findOne({ 'social.googleId': googleId });
};

userSchema.statics.findByUsername = function (username) {
    return this.findOne({ username });
};

// Create model
const User = mongoose.model('User', userSchema);

export default User;
