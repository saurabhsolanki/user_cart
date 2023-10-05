const express = require("express");
const dbConnect = require("./config/db");
const userRouter = require("./features/user/user.router");
const productRouter = require("./features/product/product.router");
const cartRouter = require("./features/cart/cart.router");
const cors = require("cors");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.send("hello"));
app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/carts", cartRouter);

app.listen(8080, async () => {
  await dbConnect();
  console.log("server started at port 8080");
});
