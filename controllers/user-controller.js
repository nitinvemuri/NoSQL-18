const { User } = require('../models')

const userController = {
    getAllUser(req, res) {
        User.find({})
        .populate({
            path: 'Thoughts',
            select: '-__v'
        })
        .select('-__v')
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(400).json({message: 'Error my man' || err});
        })
    },

    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
            .populate({
                path: 'Thoughts',
                select: '-__v'
            })
            .populate({
                path: 'Friends',
                select: '-__v'
            })
            .select('-__v')
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err)
                res.status(500).json(err)
            });
    },

    createUser({ body }, res) {
        User.create(body)
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.status(400).json(err));
    },

    updateUser({params, body}, res) {
        User.findOneAndUpdate({ _id: params.id}, body, { new: true, runValidators: true})
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({message: 'No user found with this data'})
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err))
    },

    deleteUser ({ params }, res) {
        User.findOneAndDelete({_id: params.id})
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.json(err));
    },

    addFriend({ params}, res) {
       User.findByIdAndUpdate(
           { _id: params.userId},
           { $addToSet: {friends: params.friendsId}},
           { new: true},
       );
       then(dbUserData => {
           if(!dbUserData) {
               res.status(400).json({ message: "Nothing is found fool"})
               return;
           }
           res.json(dbUserData)
       })
       .catch(err => res.status(400).json(err));
    },

    removeFriend({ params}, res) {
        User.findOneAndDelete({ _id: params.friendsId})
        .then(removeFriend => {
            if(!removeFriend) {
                return res.status(404).json({ message: 'No friend with this id' })
            }
            return User.findByIdAndRemove(
                { _id: params.userId},
                { $pull: {friends: params.friendsId}},
                {new: true}
            );
        })
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({ message: 'No friend with this id or perhaps you have no friends'})
                return;
            }
            res.json(dbUserData);
        
        })
        .catch(err => res.json(err));
    }
    
}

module.exports = userController;