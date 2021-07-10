const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: [true, "Please enter a name"],
    },
    email: {
        type: String,
        required: [true, "Please enter an email"],
        unique: true,
        lowercase: true,
        validate: { 
          validator: isEmail, 
          message: "Please enter a valid email"
        }
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        minLength: [6, "Minimum password length is 6 characters"]
    },
    validated: {
        type: Boolean,
        default: false,
    }
});

// fire a function before doc saved to db
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });
  
// static method to login user
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
      if(user.validated) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
          return user;
        }
        throw Error('incorrect password');
      }
      throw Error('not validated');
    }
    throw Error('incorrect email');
};

// static method to login user
userSchema.statics.validate = async function(_id) {
    const user = await this.findOne({ _id });
    if (user) {
      console.log("before validated check");
      if(user.validated) {
        throw Error('already been validated');
      }
      console.log("before updating");
      const res = await this.findByIdAndUpdate(user._id, { validated: true });
      console.log(res);
      if (res) {
        var userTmp = res;
        userTmp.validated = true;
        return userTmp;
      }
      throw Error('cannot be validated');
    }
    throw Error('account not found');
};

const User = mongoose.model('user', userSchema);

module.exports = User;