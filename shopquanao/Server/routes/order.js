const {Order} = require("../Models/OrderModel")
const {auth,isUser,isAdmin} = require("../middleware/auth");
const moment = require("moment");

const router = require("express").Router();


//get order 

router.get("/",async(req, res)=>{
    const querry = req.query.new;
    try {
        const orders = querry
        ? await Order.find().sort({_id:-1}).limit(4)
        :await Order.find().sort({_id:-1});
        res.status(200).send(orders)
    }
    catch(err){
        console.log(err)
        res.status(500).send(err)
    }
})




//Get order status

router.get("/stats",async(req,res)=>{
    const previousMonth = moment()
    .month(moment().month()-1)
    .set("date",1)
    .format("YYYY-MM-DD HH:mm:ss");
    try{
        const orders = await Order.aggregate([
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
        res.status(200).send(orders);
        console.log(orders);
    }
    catch(err){
        console.log(err)
        res.status(500).send(err)
    }
})


//Get income status

router.get("/income/stats",async(req,res)=>{
    const previousMonth = moment()
    .month(moment().month()-1)
    .set("date",1)
    .format("YYYY-MM-DD HH:mm:ss");
    try{
        const income = await Order.aggregate([
            {
                $match: {createdAt:{$gte: new Date(previousMonth)}}
            },
            {
                $project:{
                    month: {$month:"$createdAt"},
                    sale:"$total"
                }
            },
            {
                $group:{
                    _id:"$month",
                    total:{$sum: "$sale"}
                }
            }
        ])
        res.status(200).send(income);
        console.log(income);
    }
    catch(err){
        console.log(err)
        res.status(500).send(err)
    }
})


//Get 1 week sale 

router.get("/week-sale",async(req,res)=>{
    const last7day = moment()
    .month(moment().month()-7)
    .set("date",1)
    .format("YYYY-MM-DD HH:mm:ss");
    try{
        const income = await Order.aggregate([
            {
                $match: {createdAt:{$gte: new Date(previousMonth)}}
            },
            {
                $project:{
                    day: {$dayOfWeek:"$createdAt"},
                    sale:"$total"
                }
            },
            {
                $group:{
                    _id:"$day",
                    total:{$sum: "$sale"}
                }
            }
        ])
        res.status(200).send(income);
        console.log(income);
    }
    catch(err){
        console.log(err)
        res.status(500).send(err)
    }
})
module.exports= router