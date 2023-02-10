import express from 'express';

import users from './data/user.js'
import products from './data/products.js'
import Product from './Models/ProductModel.js';
import User from './Models/UserModel.js';
import asyncHandler from 'express-async-handler'


const ImportData = express.Router();

ImportData.post(
    "/user", 
asyncHandler(
    async(req,res) => {
        await User.deleteMany({});
        const importUser = await User.insertMany(users);
        res.send({importUser});
    }
));

ImportData.post(
    "/products", 
    asyncHandler(
    async(req,res) => {
        await Product.deleteMany({});
        const importProduct = await Product.insertMany(products);
        res.send({importProduct});
    }
));

export default ImportData;