
const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    title:{
        type: String,
        require: true
    },
    colors:{
        type: String,
        require: true
    },
    size:{
        type: String,
        require: true
    },
    price:{
        type: Number,
        require: true,
        default: 0, 
    },
    description:{
        type: String,
        require: true
    },
    categorySlug:{
        type: String,
        require: true,
    },
    img1:{
        type: Object,
        require: true
    },
    img2:{
       type: Object,
       require: true     
    },
    slug:{
        type: String,
        require: true
    }
   
    

},
{
    timestamps: true
}
)

const Product = mongoose.model("Product",productSchema)

exports.Product = Product