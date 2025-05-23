const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures.js');

exports.deleteOne = (model) =>
  catchAsync(async (req, res, next) => {
    const doc = await model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (model) =>
  catchAsync(async (req, res, next) => {
    // console.log(req.body);
    ['startDates', 'startLocation', 'locations'].forEach((key) => {
      if (req.body[key] && typeof req.body[key] === 'string') {
        req.body[key] = JSON.parse(req.body[key]);
      }
    });
    ['duration', 'maxGroupSize', 'price', 'priceDiscount'].forEach((key) => {
      if (req.body[key]) req.body[key] = Number(req.body[key]);
    });

    // check price and price discount
    if (req.body.priceDiscount > req.body.price) {
      return next(
        new AppError(
          'Discount price ({VALUE}) must be less than original price',
          400
        )
      );
    }

    const doc = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

exports.createOne = (model) =>
  catchAsync(async (req, res, next) => {
    // console.log(req.body);
    // Parse JSON fields
    ['startDates', 'startLocation', 'locations'].forEach((key) => {
      if (req.body[key] && typeof req.body[key] === 'string') {
        req.body[key] = JSON.parse(req.body[key]);
      }
    });
    // Convert strings to numbers where required, if Multer (form-data) sends them as strings
    ['duration', 'maxGroupSize', 'price', 'priceDiscount'].forEach((key) => {
      if (req.body[key]) req.body[key] = Number(req.body[key]);
    });

    const doc = await model.create(req.body);

    res.status(200).json({
      status: 'success',
      tour: doc,
    });
  });

exports.getOne = (model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    // doc.findOne({_id: req.params.id})

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

exports.getAll = (model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const doc = await features.query.explain();
    const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: doc,
    });
  });
