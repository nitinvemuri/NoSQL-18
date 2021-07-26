const router = require('express').Router();

const{
    createThought,
    removeThought,
    getAllThought,
    getThoughtsById,
    addReaction,
    deleteReaction,
    updateThoughts,
} = require('../../controllers/thought-controller');

router
    .route('/')
    .get(getAllThought)
    .post(createThought)

router
    .route('/:id')
    .get(getThoughtsById)
    .post(createThought)
    .put(updateThoughts)
    .delete(removeThought)

router
    .route('/:thoughtId/reactions')
    .post(addReaction)

router
    .route('/:thoughtId/reactions/:reactionId')
    .delete(deleteReaction)

module.exports = router;
    