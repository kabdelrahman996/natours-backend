const reviewControllers = require('../controllers/reviewControllers');
const authController = require('../controllers/authController');
const express = require('express');

const router = express.Router({ mergeParams: true });

// Protect all routes after this middleware
router.use(authController.protect);

router
  .route('/')
  .get(reviewControllers.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewControllers.setTourUserIds,
    reviewControllers.createReview
  );

router
  .route('/:id')
  .patch(authController.restrictTo('user'), reviewControllers.updateReview)
  .delete(authController.restrictTo('admin'), reviewControllers.deleteReview);

module.exports = router;
