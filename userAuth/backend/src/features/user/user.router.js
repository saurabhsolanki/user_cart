const express = require("express");

const User = require("./user.model");

const app = express.Router();

app.post("/login", async (req, res) => {
  let { email, password } = req.body;
  try {
    let user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).send("Authentication fail, create your account first");
    }

    res.send({
      token: `${user.id}:${user.email}:${user.password}`,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/signup", async (req, res) => {
  let { email } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(404).send("cannot create a user with existing email");
    }

    let newUser = await User.create(req.body);
    res.send({
      token: `${newUser.id}:${newUser.email}:${newUser.password}`,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = app;
