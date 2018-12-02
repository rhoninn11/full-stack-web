const mongoose = require('mongoose');
const Validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

let TokenSchema = new mongoose.Schema(
    {
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }
)

let UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: Validator.isEmail,
            msg: '{VALUE} is not an email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    tokens: [TokenSchema]
});

UserSchema.methods.toJSON = function () {
    let userObject = this.toObject();

    return _.pick(userObject, ['_id', 'email'])
}

UserSchema.methods.saveWithAuthToken = function () {

    let user = this;
    let access = 'auth';
    let token = jwt.sign({ id: user._id, access }, 'hasło').toString();

    user.tokens.push({ token, access });
    return user.save().then((dbUser) => {
        return { dbUser, token };
    })
}

UserSchema.statics.findByToken = function (token) {
 
    let User = this;
    let decoded;

    try {
        decoded = jwt.verify(token, 'hasło');
    } catch (e) {
        return Promise.reject();
    }

    return User.findOne({
        _id: decoded.id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
}



let User = mongoose.model('User', UserSchema)
exports = module.exports = { User: User }