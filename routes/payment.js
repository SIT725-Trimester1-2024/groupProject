const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');
const Order = require('../models/orders');
const Stripe = require('stripe')('sk_test_51PItrz2LidDOORGRkisEiM5UECjAwKjYRytvVg34wh4SAX1M91xRYmPvanvgxZBE3mP9bfwPW66fK10yr3DyOC0T002L0xZIjI');

router.post('/payment_gateway/stripe', isLoggedIn, async (req, res) => {
    const { token } = req.body;
    const amount = 10000 * 100;
    console.log(req);
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
            automatic_payment_methods: {enabled: true, allow_redirects: 'never'},
            receipt_email: req.user.username
        });
        if (payment.status === 'succeeded') {
            const order = {
                user: req.user._id,
                txnId: payment.id,
                amount: payment.amount,
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
            res.redirect(`/`);
        } else {
            req.flash(
                'error',
                'Cannot Place the Order at this moment.Please try again later!'
            );
            res.render('error');
        }
    } catch (err) {
        console.error('Error processing payment:', err);
        let message = 'An error occurred while processing your payment.';

        if (err.type === 'StripeCardError') {
            message = err.message;
        }

        res.status(500).send(message);
    }
});

module.exports = router;
