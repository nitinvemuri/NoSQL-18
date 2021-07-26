const router = require('express').Router();

const{
    addThought,
    removeThought,
    getAllThought,
    getThoughtsById,
    addReaction,
    deleteReaction,
    updateThoughts,
} = require('../../controllers/thought-controller');

router
    .route('/')
    .get(getAllThought);

router
    .route('/:id')
    .get(getThoughtsById)
    .post(addThought)
    .put(updateThoughts)
    .delete(removeThought)

router
    .route('/api/thoughts/:thoughtId/reactions')
    .post(addReaction)
    .delete(deleteReaction)

module.exports = router;
    