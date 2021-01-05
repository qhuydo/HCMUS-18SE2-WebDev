const express = require('express');
const moment = require('moment');
const course_model = require('../models/course_model');

const router = express.Router();

function bill(items) {
    
}

router.get('/', async function (req, res) {
    const items = [];
    full_price = 0.0;
    total_price = 0.0;

    for(const ci of req.session.cart) {
        const course = await course_model.getCourseDataForCart(ci.course_id);
        items.push(course);
        full_price += Number.parseFloat(course.full_price);
        total_price += Number.parseFloat(course.price);
    }

    discount = full_price - total_price;
    console.log(items);

    res.render('vwCart/index.hbs', {
        items,
        full_price,
        total_price,
        discount
    });
});

// router.post('/add', async function (req, res) {
//   const item = {
//     id: +req.body.id,
//     quantity: +req.body.quantity
//   }

//   cartModel.add(req.session.cart, item);
//   res.redirect(req.headers.referer);
// })

// router.post('/remove', async function (req, res) {
//   cartModel.remove(req.session.cart, +req.body.id);
//   res.redirect(req.headers.referer);
// })

// router.post('/checkout', async function (req, res) {
//   let total = 0;

//   const details = [];
//   for (const ci of req.session.cart) {
//     const product = await productModel.single(ci.id);
//     const amount = product.Price * ci.quantity;
//     total += amount;

//     details.push({
//       ProID: product.ProID,
//       Quantity: ci.quantity,
//       Price: product.Price,
//       Amount: amount,
//       OrderID: -1
//     });
//   }

//   const order = {
//     OrderDate: moment().format('YYYY-MM-DD HH:mm:ss'),
//     UserID: req.session.authUser.id,
//     Total: total
//   }
//   const rs = await orderModel.add(order);
//   for (const detail of details) {
//     detail.OrderID = rs.insertId;
//     await detailModel.add(detail);
//   }

//   req.session.cart = [];
//   res.redirect(req.headers.referer);
// })

module.exports = router;