const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateformat');

const reactionSchema = new Schema(
    {

        reactBodyyyy: {
            type: String,
            minlength: 1,
            maxlength: 280,
        },

        username: {
            type: String,
            required: true,
            trim: true,
        },

        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
            },

        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        }
    },
    {
        toJSON: {
            getters: true,
        }
    }
)

const thoughtSchema = new Schema({
    thoughtText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
    },
    username: {
        type: String,
        required: true,
    },
    reactions: [reactionSchema]
},
{
    toJSON: {
        getters: true,
        virtuals: true
    },
    id: false,
}
);

thoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length
})

const Thought = model('Thought', thoughtSchema)

module.exports = Thought;