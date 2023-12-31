const express = require("express");
const Cart = require("./cart.model");
const User = require("../user/user.model");

const authMiddleware = async (req, res, next) => {
  let token = req.headers.token;
  if (token) {
    let [id, email, password] = token.split(":");
    let user = await User.findById(id);
    if (user.email === email && user.password === password) {
      req.userId = id;
      console.log(id,"id")
      next();
    } else {
      res.status(401).send("Cannot perform this operation, missing permission");
    }
  } else {
    res.status(401).send("Cannot perform this operation, missing permission");
  }
};

const app = express.Router();

app.use(authMiddleware);

app.get("/", async (req, res) => {
  try {
    let items = await Cart.find({ user: req.userId }).populate([
      "user",
      "product",
    ]);
    res.send(items);
  } catch (error) {
    res.status(500).send(e.message);
  }
});

app.post("/", async (req, res) => {
  try {
    let cartItem = await Cart.findOne({
      user: req.userId,
      product: req.body.product,
    }).populate("product");

    console.log(cartItem, 'cartitem')

    // if (cartItem.product.quantity < req.body.quantity) {
    //   return res.send(
    //     `This item is not able in the required quanitity, max quanity allowed is ${cartItem.product.quantity}`
    //   );
    // }

    if (cartItem) {
      let item = await Cart.findByIdAndUpdate(
          cartItem.id,
          {
            quantity: req.body.quantity,
          },
          {
            new: true,
          }
      ).populate("product")
      res.send(item);
    } else {
      let items = await Cart.create({ ...req.body, user: req.userId });
      res.send(items);
    }
  } catch (e) {
    res.status(500).send(e.message);
  }
});

module.exports = app;

// app.post("/", async (req, res) => {
//     try {
//       let cartItem = await Cart.findOne({
//         user: req.userId,
//         product: req.body.product,
//       }).populate("product");

//       if (cartItem.product.quantity < req.body.quantity) {
//         return res.send(
//           `This item is not able in the required quanitity, max quanity allowed is ${cartItem.product.quantity}`
//         );
//       }

//       if (cartItem) {
//         let item = await Cart.findByIdAndUpdate(
//           cartItem.id,
//           {
//             quantity: req.body.quantity,
//           },
//           {
//             new: true,
//           }
//         ).populate("product");
//         return res.send(item);
//       } else {
//         let item = await Cart.create({
//           ...req.body,
//           user: req.userId,
//         });
//         return res.send(item);
//       }
//     } catch (e) {
//       res.status(500).send(e.message);
//     }
//   });
