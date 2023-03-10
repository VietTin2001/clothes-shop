const {User} = require("../Models/UserModel")
const {auth,isUser,isAdmin} = require("../middleware/auth");
const moment = require("moment");

const router = require("express").Router();



//Get user status

router.get("/stats",async(req,res)=>{
    const previousMonth = moment()
    .month(moment().month()-1)
    .set("date",1)
    .format("YYYY-MM-DD HH:mm:ss");
    try{
        const users = await User.aggregate([
            {
                $match: {createdAt:{$gte: new Date(previousMonth)}}
            },
            {
                $project:{
                    month: {$month:"$createdAt"}
                }
            },
            {
                $group:{
                    _id:"$month",
                    total:{$sum: 1}
                }
            }
        ])
        res.status(200).send(users);
        console.log(users);
    }
    catch(err){
        console.log(err)
        res.status(500).send(err)
    }
})

module.exports= router