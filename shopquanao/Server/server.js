const express = require("express")
const cors = require("cors");
const products = require("./data/products");
const mongoose = require("mongoose");
const register = require("./routes/register");
const login = require("./routes/login");
const stripe = require("./routes/stripe");
const productRoute = require("./routes/product");
const users = require("./routes/user");
const orders = require("./routes/order");
require("dotenv").config

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/register", register)
app.use("/api/login", login)
app.use("/api/stripe", stripe)
app.use("/api/product", productRoute)
app.use("/api/users", users)
app.use("/api/orders", orders)


app.get("/", (req,res) =>{
    res.send("Welcome to our online shop API");
})

app.get("/product", (req,res) =>{
    res.send(products);
})
const PORT = process.env.PORT || 5000;

app.listen(PORT,console.log(`Server listening on port ${PORT}`));    

mongoose.connect( "mongodb+srv://admin:admin123@shopquanao.rgkloxh.mongodb.net/e-commerce?retryWrites=true&w=majority",{
    useUnifiedTopology: true,
    useNewUrlParser: true,
}).then(()=> console.log("Connected to Mongoose"))
.catch((error)=> console.log("Failed to connect to Mongoose",error.message))