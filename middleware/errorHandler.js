const { logEvents } = require("./logger")

const errorHandler=(err,req,res,next)=>{
        logEvents(`${err.name}: ${err.name}\t${err.name}\t${err.name}\t${err.name}`,'errLog.log');
        const status=res.statusCode?res.statusCode:500

        res.status(status)
        res.json({message:err.message,isError:true})
}

module.exports=errorHandler