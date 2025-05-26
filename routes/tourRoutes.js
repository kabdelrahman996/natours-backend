const express = require('express');
const tourController = require('../controllers/tourControllers');
const authController = require('./../controllers/authController');
const bookingController = require('./../controllers/bookingController');
const reviewRourer = require('./reviewRoutes');

const router = express.Router();

router.use('/:tourId/reviews', reviewRourer);

router
  .route('/top-5-cheap')
  .get(
    bookingController.createBookingCheckout,
    tourController.aliasTopTours,
    tourController.getAllTours
  );

router.route('/tour-stats').get(tourController.getTourStats);

router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.getMonthlyPlan
  );

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

router.route('/distance/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.creatTour
  );
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deletTour
  );

module.exports = router;
