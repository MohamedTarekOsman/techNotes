const mongoose = require("mongoose");
const Schema = mongoose.model;



const userSchema = new Schema("userSchema", {
  username: { type: String, required: true },
  password: {
    type: String,
    required: true,
    trim: true,
    match: "^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,}$",
  },
  roles: { type: String , default:'employee' },
  active: { type: Boolean,default:true },
});




module.exports =  userSchema;