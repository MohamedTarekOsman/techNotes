require('dotenv').config();
const express=require('express');
const app=express();
const path=require('path')
const port =process.env.PORT || 5000
const cookieParser=require('cookie-parser');
const cors=require('cors')
const dbconn=require('./config/dbConn')
const mongoose=require('mongoose')
const {logger}=require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const corsOptions=require('./config/corsOptions')
const router=require('./routes/root')
//////////////////////////////////////////////////////////////////////////////

dbconn()
app.use(logger)
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use(router)
app.use('/',express.static(path.join(__dirname,'public')))
app.use('/',require('./routes/root'))


//////////////////////////////////////////////////////////////////////////////






app.all('*',(req,res)=>{
    res.status(404)
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,'views',"404.html"))
    }else if(req.accepts('json')){
        res.send({message:"page not found"})
    }else{
        res.type('text').send("404 page not found")
    }
})
//////////////////////////////////////////////////////////////////////////////
app.use(errorHandler)
mongoose.connection.once("open", () => {
    console.log("connected to db successfully");
    app.listen(port,()=>{console.log(`server running on port ${port}`)})
});

//////////////////////////////////////////////////////////////////////////////


// call every function here and make app.use for them