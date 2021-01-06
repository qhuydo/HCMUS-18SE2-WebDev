const express = require('express');
const moment = require('moment');

const courseModel = require('../models/course.model');
const cartModel = require('../models/cart.model');
const watchlistModel = require('../models/watchlist.model');

const router = express.Router();
const Decimal = require('decimal.js');

router.get('/', async function (req, res) {
    const items = [];

    full_price = new Decimal(0);
    total_price = new Decimal(0);
    discount = new Decimal(0);

    if (req.session.cart !== null && req.session.cart.length !== 0) {
      for(const ci of req.session.cart) {
          const course = await courseModel.getCourseDataForCart(ci.course_id);
          items.push(course);
          full_price = full_price.plus(Number.parseFloat(course.full_price));
          total_price = total_price.plus(Number.parseFloat(course.price));
      }
  
      discount = full_price.minus(total_price);

    }
    // console.log(items);

    res.render('vwCart/index.hbs', {
        items,
        full_price,
        total_price,
        discount
    });
});

router.post('/add', async function (req, res) {
  const course_id = +req.body.course_id;
  const username = req.session.username;
  
  await cartModel.addItemToCart(username, course_id);
  
  await req.session.save(function (err) {
    console.log(err);
    res.redirect(req.headers.referer);
  });

})

router.post('/remove', async function (req, res) {
  const course_id = +req.body.course_id;
  const username = req.session.username;

  await cartModel.removeItemFromCart(username, course_id);
  await req.session.save(function (err) {
    console.log(err);
    res.redirect(req.headers.referer);
  });
  
});

router.post('/move-to-watchlist', async function (req, res) {
  const course_id = +req.body.course_id;
  const username = req.session.username;
  // console.log(`${course_id} | ${username}`);

  await cartModel.removeItemFromCart(username, course_id);
  await watchlistModel.addItemToWatchlist(username, course_id);
  
  await req.session.save(function (err) {
    res.redirect(req.headers.referer);
  });

});

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