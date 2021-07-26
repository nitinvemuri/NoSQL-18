const { Thought, Types, User } = require('../models');

const thoughtController = {
    addThought({ params, body}, res) {
        console.log(body);
        Thought.create(body)
        .then(({ _id}) => {
            return Thought.findOneAndUpdate(
                { _id: params.userId},
                { $push: {thoughts: _id}},
                { new: true}
            );
        })
        .then(dbThoughtData => {
            if(!dbThoughtData) {
                res.status(404).json({ message: 'No thought found'})
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    },

    removeThought({ params}, res) {
        Thought.findOneAndDelete({_id: params.thoughtId})
        .then(deletedThought => {
            if (deletedThought) {
                return res.status(404).json({ message: 'No thought found'})
            }
            return Thought.findOneAndUpdate(
                { _id: params.userId},
                { $pull: { thoughts: params.thoughtId}},
                {new: true},
            );
        }) 
        .then(dbThoughtData => {
            res.json(dbThoughtData)
        })
        .catch(err => res.json(err))
    },

    getAllThought(req, res) {
        Thought.find({})
        .populate(
            {path: 'reactions', select: '-__v'
        })
        .select('-__v')
        .sort({_id: -1})
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err)
            res.sendStatus(400);
        });
    },

    getThoughtsById({params}, res) {
        User.findOne({_id: params.id})
        .populate({
            path: 'reactions',
            select: '-__v'
        })
        .select('-__v')
        .sort({_id: -1})
        .then(dbThoughtData => {
            if(!dbThoughtData) {
                res.status(404).json({message: 'No thought with that id'});
                return;
            }
            res.json(dbThoughtData)
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        })

    },

    updateThoughts({params, body}, res) {
        Thoughts.findOneAndUpdate({_id: params.id}, body, {new: true, runValidators: true})
        .populate({path: 'reactions', select: '-__v'})
        .select('-___v')
        .then(dbThoughtsData => {
            if (!dbThoughtsData) {
                res.status(404).json({message: 'No thoughts with this particular ID!'});
                return;
            }
                res.json(dbThoughtsData);
        })
        .catch(err => res.json(err));
    },

    addReaction({params, body}, res) {
        Thoughts.findOneAndUpdate(
            {_id: params.thoughtId},
            {$push: {reactions: body}}, 
            {new: true, runValidators: true})
        .populate(
            {path: 'reactions', 
            select: '-__v'})
        .select('-__v')
        .then(dbThoughtsData => {
        if (!dbThoughtsData) {
            res.status(404).json({message: 'No thoughts'});
            return;
        }
        res.json(dbThoughtsData);
        })
        .catch(err => res.status(400).json(err))

    },

    // Delete a reaction by ID
    deleteReaction({params}, res) {
        Thoughts.findOneAndUpdate(
            {_id: params.thoughtId}, 
            {$pull: {reactions: {reactionId: params.reactionId}}}, 
            {new : true})
        .then(dbThoughtsData => {
            if (!dbThoughtsData) {
                res.status(404).json({message: 'No thoughts foo!'});
                return;
            }
            res.json(dbThoughtsData);
        })
        .catch(err => res.status(400).json(err));
    }

}

module.exports = thoughtController;