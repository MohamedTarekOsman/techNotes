const asyncHandler = require("express-async-handler");
const techNotesSchema = require("../models/techNotes.model");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");

const getAllUsers = asyncHandler(async (req, res) => {
  const users = User.find().select("-password").lean();
  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }
  res.status(200).send(users);
});
const addUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;
  if (!username || !password) {
    return res.status(400).send("userName and password are required");
  }
  const duplicate = await User.findOne({ username })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();
  if (duplicate !== null) {
    res.status(409).send("Dublicated Username not allowed");
  }

  const hashedPassword = await bcrypt.hash(password, 8);

  const userObject =
    !Array.isArray(roles) || !roles.length
      ? { username, password: hashedPassword }
      : { username, password: hashedPassword, roles };


  const newUser = await User.create(userObject);

  if (newUser) {
    res.status(200).send(`new user ${username} created successfully`);
  } else {
    res.status(400).send("Invalied user data received");
  }
});

const getUser = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).send("User ID Required");
  }
  const user = User.findById(id).select("-password").lean().exec();
  if (!user) {
    return res.status(400).send("user not found");
  }
  res.status(200).send(user);
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).send("User ID Required");
  }
  const note =await techNotesSchema.findOne({user:id}).lean().exec()
  if(note){
    res.status(400).json({message:"user has assigned notes"})
  }
  const user = await User.findById({ id }).lean().exec();
  if (!user) {
    return res.status(400).send("User not found");
  }
  const result = await user.deleteOne();
  res.status(200).send(`Note ${result.username} with ID ${result._id} deleted`);
});

const updateUser = asyncHandler(async (req, res) => {
  const { id,username, password, roles, active } = req.body;
  if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !=='boolean') {
    return res.status(400).send("All Fields except password are required");
  }

  const user = await User.findById(id).lean().exec();
  if (!user) {
    return res.status(400).send("user not found");
  }

  const dublicate = await User.findOne({ username })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();
  if (dublicate && dublicate._id.toString() !== id) {
    return res.status(409).send("Dublicated Username not allowed");
  }

  user.username = username;
  user.roles = roles;
  user.active = active;

  if(password){
    user.password=await bcrypt.hash(password,8)
  }

  await user.save();
  res.status(200).send(`${user.username} Updated`);
});

module.exports = {
  getUser,
  addUser,
  deleteUser,
  updateUser,
  getAllUsers,
};
