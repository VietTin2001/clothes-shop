const mongoose = require ("mongoose")
const {object} = require("joi")
const orderSchema = mongoose.Schema({
    userId:{
        type: String,
        require: true,
    },
    customerId:{type: String},
    paymentId:{type: String},
    product:[],
   
    subtotal:{
        type: Number,
        require: true,
    },
    total:{
        type:Number,
        require: true
    },
    shipping:{
        type: Object,
        require: true
    },
    delivery_status:{
        type: String,
        default:'pending'
    },
    payment_status:{
        type: String,
        require: true
    }

},
{
    timestamps: true
}
)

const Order = mongoose.model("Order",orderSchema)

exports.Order = Order