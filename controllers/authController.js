const User = require("../models/User");
const jwt = require('jsonwebtoken');
const { secret } = require("../constants/keys");
const mailer = require('../utils/mailer');

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '', validation: '', index: '' };

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // already been validated
  if (err.message === 'already been validated') {
    errors.validation = 'Account is already been validated';
  }

  // not validated
  if (err.message === 'not validated') {
    errors.validation = 'Account is not validated';
  }

  // cannot be validated
  if (err.message === 'cannot be validated') {
    errors.validation = 'Account cannot be validated';
  }

  // account not found
  if (err.message === 'account not found') {
    errors.index = 'Account does not exist';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, secret, {
    expiresIn: maxAge
  });
};

module.exports.signup_post = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.create({ name, email, password });
    const token = createToken(user._id);
    mailer.sendMail('www.thaymin27@gmail.com', user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
}

module.exports.validate_post = async (req, res) => {
    const id = req.params.id;
  
    try {
      const user = await User.validate(id);
      res.status(200).json({ user: user._id });
    }
    catch(err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
   
  }

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } 
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }

}

module.exports.logout_post = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.send('logged out');
}