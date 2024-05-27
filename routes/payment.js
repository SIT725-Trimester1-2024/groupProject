const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');
const Order = require('../models/orders');
const Stripe = require('stripe')('sk_test_51PItrz2LidDOORGRkisEiM5UECjAwKjYRytvVg34wh4SAX1M91xRYmPvanvgxZBE3mP9bfwPW66fK10yr3DyOC0T002L0xZIjI');

router.post('/payment_gateway/stripe', isLoggedIn, async (req, res) => {
    const { token } = req.body;
    const amount = 10000 * 100;
    console.log(req.body);
    try {
        const payment = await Stripe.paymentIntents.create({
            amount: amount,
            currency: 'aud',
            description: 'E-commerce Payment',
            payment_method_data: {
                type: 'card',
                card: {
                    token: token
                },
            },
            confirm: true,
            automatic_payment_methods: {enabled: true, allow_redirects: 'never'}
        });
        res.send('Payment successful');
    } catch (err) {
        console.error('Error processing payment:', err);
        let message = 'An error occurred while processing your payment.';

        if (err.type === 'StripeCardError') {
            message = err.message;
        }

        res.status(500).send(message);
    }
});



router.post('/payment/success', isLoggedIn, async (req, res) => {
    //Payumoney will send Success Transaction data to req body.
    //  Based on the response Implement UI as per you want

    try {
        const order = {
            user: req.user._id,
            txnId: req.body.txnid,
            amount: req.body.amount,
            createdAt: Date.now(),
            products: req.user.cart
        };

        req.user.cart = [];
        await Order.create(order);
        await req.user.save();

        req.flash(
            'success',
            'Your Order has been Successfully Placed.Thanks for Shopping with us!'
        );
        res.redirect(`/orders/${req.user._id}`);
    } catch (e) {
        console.log(e.message);
        req.flash(
            'error',
            'Cannot Place the Order at this moment.Please try again later!'
        );
        res.render('error');
    }
});

router.post('/payment/fail', isLoggedIn, (req, res) => {
    //Payumoney will send Fail Transaction data to req body.
    //  Based on the response Implement UI as per you want
    req.flash(
        'error',
        `Your Payment Failed.Try again after sometime ${req.body}`
    );
    res.render('error');
});

module.exports = router;
