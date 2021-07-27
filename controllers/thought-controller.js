const { Thought, Types, User } = require('../models');

const thoughtController = {
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
        Thought.findOne({_id: params.id})
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
    createThought({ params, body }, res) {
        Thought.create(body)
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { username: body.username },
                    { $push: { thought: _id } },
                    { new: true }
                );
            })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'im gonna cry' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    },

    removeThought({ params}, res) {
        Thought.findOneAndDelete({_id: params.thoughtId})
        .then(removeThought => {
            if (removeThought) {
                return res.status(404).json({ message: 'No thought found'})
            }
            return User.findOneAndUpdate(
                { _id: params.id},
                { $pull: { thoughts: params.thoughtId}},
                {new: true},
            );
        }) 
        .then(dbThoughtData => {
            res.json(dbThoughtData)
        })
        .catch(err => res.json(err))
    },

    updateThoughts({params, body}, res) {
        Thought.findOneAndUpdate({_id: params.id}, body, {new: true, runValidators: true})
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

    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
          { _id: params.id },
          { $push: { reactions: body } },
          { new: true }
        )
          .then((dbThoughtData) => {
            if (!dbThoughtData) {
              res.status(404).json({ message: "It is not finding it >:(" });
              return;
            }
            res.json(dbThoughtData);
          })
          .catch((err) => res.json(err));
      }, 

    // Delete a reaction by ID
    deleteReaction({params}, res) {
        Thought.findOneAndUpdate(
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