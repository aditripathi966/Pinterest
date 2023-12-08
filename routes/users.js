const mongoose = require('mongoose');


const plm = require("passport-local-mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/authenticationapi");


const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String },
  email: { type: String, required: true, unique: true },
  fullname: { type: String, required: true },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
 
});

userSchema.plugin(plm)

module.exports = mongoose.model('User', userSchema);

