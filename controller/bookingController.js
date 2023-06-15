const paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY);
const Tour = require('../Models/tourModel');
const Booking = require('../Models/bookingModel');
const catchAsync = require('../utiles/catchAsync');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);

  // 2) Generate a unique reference using the tour ID
  const reference = `TOUR-${tour.id}-${Date.now()}`;

  // 3) Create the checkout session
  const session = await paystack.transaction.initialize({
    email: req.user.email,
    amount: tour.price * 100,
    currency: 'NGN',
    callback_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`, // replace with your callback URL
    // cancel_url: , // replace with your cancel URL
    channels: ['card'],
    reference,
    metadata: {
      custom_fields: [
        {
          display_name: `${tour.name} Tour`,
        },
      ],
      cancel_action: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    },
  });

  // 3)Create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // This is only, TEMPORARY, because it's UNSECURE: everyone can make bookings without paying
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) return next();
  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
});

exports.createBooking = factory.createOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.getBooking = factory.getOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
