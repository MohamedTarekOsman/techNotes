const express=require('express');
const app=express;
const router = app.Router();
const path = require("path");
const noteController=require("../controllers/techNotes.controller")
const userController = require("../controllers/user.controller");
const authController=require("../controllers/auth.controllers.js");
const verifyJWT=require('../middleware/verifyJWT')
router.get('^/$|^/index(.html)?',(req,res)=>{
    res.sendFile(path.join(__dirname,"..","views","index.html"))
})

router.get("/notes", verifyJWT,noteController.getNotes);
router.get("/note/:id", verifyJWT, noteController.getNote);
router.post("/note", verifyJWT, noteController.postNote);
router.patch("/note/:id", verifyJWT, noteController.updateNote);
router.delete("/note/:id", verifyJWT, noteController.deleteNote);


router.get("/user", verifyJWT, userController.getUser);
router.post("/user", verifyJWT, userController.addUser);
router.patch("/user", verifyJWT, userController.updateUser);
router.delete("/user", verifyJWT, userController.deleteUser);

router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/refresh", authController.refresh);

module.exports=router




// for crud operations