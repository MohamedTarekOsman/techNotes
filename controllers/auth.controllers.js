const User=require("../models/user.model")
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const asyncHandler=require('express-async-handler')

const login =asyncHandler(async(req,res)=>{
    const {username,password}=req.body
    if(!username||!password){
        return res.status(400).send("user name and password are required")
    }
    const user=await User.findOne({username}).exec()
    if(!user||!user.active){
        return res.status(400).send("unAuthorized")
    }
    const match=await bcrypt.compare(password,user.password)
    if(!match){
        return res.status(400).send("unAuthorized");
    }
    const accessToken=jwt.sign({
        UserInfo:{
            username:user.username,
            roles:user.roles
        }
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:'15m'
    }
    )

    const refreshToken = jwt.sign(
      {
        username: user.username,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie('jwt',refreshToken,{
        httpOnly:true,
        secure:true,
        sameSite:'None',
        maxAge: 7 * 24 * 60 * 60 *1000
    })
    res.json({accessToken})
})

const refresh=(req,res)=>{
    const cookies =req.cookies
    if(!cookies?.jwt){
        return res.status(401).send("Unauthorized")
    }

    const refreshToken=cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async(err,decoded)=>{
            if(err){
                return res.status(403).send("Forbidden")
            }
            const foundUser=await User.findOne({username:decoded.username}).exec()
            if(!foundUser){
                return res.status(401).send("Unauthorized")
            }
            const accessToken = jwt.sign(
                {
                    userinfo: {
                    username: user.username,
                    roles: user.roles,
                    },
                },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: "15m",
                }
            );
            res.send({accessToken})
        })
    )
}

const logout=(req,res)=>{
    const cookies=req.cookies
    if(!cookies?.jwt){
        return res.sendStatus(204)
    }
    res.clearCookie('jwt',{
        httpOnly:true,
        secure:true,
        sameSite:'None'
    })
    res.json({message:"Cookie cleared"})
}

module.exports={   
    login,
    refresh,
    logout
}