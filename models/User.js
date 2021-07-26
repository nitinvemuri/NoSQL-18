const { Schema, model} = require('mongoose')
const dateFormat = require('../utils/dateformat')


var validateEmail = function(email) {
    var regex =  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email)
};


const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: 'Need a Username Yo',
            trim: true,
        },
        email: {
            type: String,
            required: 'Please enter a valid email address',
            unique: true,
            validate: {
                validator(validEmail) {
                  return /^([a-zA-Z0-9_\.-]+)@([\da-z\.-]+)\.([a-z]{2,6})(\.[a-z]{2,6})?$/.test(
                    validEmail
                  );
                },
                message: "Please enter a valid email address",
              },
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thoughts'
            }
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Friends'
            }
        ],

    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false
        
    }
);

userSchema.virtual('friendCount').get(function() {
    return this.friends.length
});

const User = model('User', userSchema)

module.exports = User;