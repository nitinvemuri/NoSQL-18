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
    .put(updateThoughts)
    .delete(removeThought)

router
    .route('/:id/reactions')
    .post(addReaction)

router
    .route('/:id/reactions/:reactionId')
    .delete(deleteReaction)

module.exports = router;
    