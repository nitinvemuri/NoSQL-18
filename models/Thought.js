const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateformat');

const reactionSchema = new Schema(
    {
        reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId()
        },

        reactionBody: {
            type: String,
            required: true,
            match: '/&.{0,280}$/'
        },

        username: {
            type: String,
            required: true,
            trim: true,
        },

        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        }
    }
)

const thoughtSchema = new Schema({
    thoughtText: {
        type: String,
        required: true,
        match: '/&.{1,280}$/'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
    },
    username: {
        type: String,
        required: true,
        trim: true,
    },
    reactions: [reactionSchema]
}
);

thoughtSchema.virtual('reactionCount').get(function() {
    return this.reaction.length
})

const Thought = model('Thought', thoughtSchema)

module.exports = Thought;