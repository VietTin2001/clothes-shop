const bcrypt = require("bcrypt");
const {User} = require ( "./../Models/UserModel.js")
const Joi = require("joi");

const generateAuthToken = require("./../utils/genAuthtoken.js");
const express = require("express");

const router = express.Router()

router.post("/", async (req, res) => {
    const schema = Joi.object({
      email: Joi.string().min(3).max(200).required().email(),
      password: Joi.string().min(6).max(200).required(),
    });
  
    const { error } = schema.validate(req.body);
  
    if (error) return res.status(400).send(error.details[0].message);
  
    let user = await User.findOne({ email: req.body.email });
    console.log(user);
    if (!user) return res.status(400).send("Invalid email or password...");
  
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    console.log(req.body.password)
    console.log(user.password)
    console.log(validPassword);
    if (!validPassword)
      return res.status(400).send("Invalid email or password...");
  
    const token = generateAuthToken(user);
  
    res.send(token);
  });
  
  module.exports = router;