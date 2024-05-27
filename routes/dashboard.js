const express = require('express');
const User = require('../models/user');
const Order = require('../models/orders');
const isLoggedIn = require('../middlewares/isLoggedIn');
const isValid = require('../middlewares/isValid');
const isAdmin = require('../middlewares/isAdmin');
const router = express.Router();

router.get('/user/:id', isLoggedIn, isValid, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.render('dashboard/user', { user });
    } catch (err) {
        console.log(err);
        req.flash('error', 'forbidden');
        res.status(401).render('error');
    }
});
router.patch('/user/:id', isLoggedIn, isValid, async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndUpdate(id, req.body.user);
        req.flash('success', 'Successfully updated your profile');

        res.redirect(`/user/${id}`);
    } catch (e) {
        console.log(err);
        req.flash('error', 'forbidden');
        res.status(401).render('error');
    }
});
router.get('/orders/:id', isLoggedIn, isValid, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.id }).populate(
            'products'
        );
        res.render('account/order', { orders });
    } catch (err) {
        console.log(err);
        req.flash('error', 'Unable to fetch your orders');
        res.status(500).render('error');
    }
});
//get all orders of all user admin role
router.get('/ordersadmin', isLoggedIn, isAdmin, async (req, res) => {
    try {
        const orders = await Order.find().populate('products');
        res.render('account/order-admin', { orders });
    } catch (err) {
        console.log(err);
        req.flash('error', 'Unable to fetch your orders');
        res.status(500).render('error');
    }
});
//admin change order status 
router.patch('/adminfinishorder/:id', isLoggedIn, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        //find by order id and update status to delivered
        await Order.findByIdAndUpdate(id, { delivered: 'true' });
        req.flash('success', 'Successfully updated order status');
    } catch (err) {
        console.log(err);
        req.flash('error', 'Unable to update order status');

    }
});

module.exports = router;
