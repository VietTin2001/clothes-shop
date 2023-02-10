const mongoose = require ("mongoose")


const userSchema = mongoose.Schema({
    name:{
        type: String,
        require: true,
        minLength: 3,
        maxLength: 30
    },
    email:{
        type: String,
        require: true,
        unique: true,
        minLength: 3,
        maxLength: 200
    },
    password:{
       type: String,
       require: true,
       minLength: 6,
        maxLength: 1024     
    },
    isAdmin:{
        type: Boolean,
        require: true,
        default: false     
    },
    

},
{
    timestamps: true
}
)


const User = mongoose.model("User",userSchema)

exports.User = User