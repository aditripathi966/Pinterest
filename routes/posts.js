const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: {type:mongoose.Schema.Types.ObjectId ,ref:"user"},
  title: { type: String,required:true },
  description: { type: String, required: true,},
   image:{type:String}
 
});


module.exports = mongoose.model('posts', postSchema);

