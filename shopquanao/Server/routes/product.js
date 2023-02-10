const express = require('express');
const { Product } = require('../Models/ProductModel');
const cloudinary = require("../utils/cloudinary")

const router = express.Router();

// CREATE 
router.post("/", async (req, res) => {
  const {title, slug,categorySlug,colors, size ,description, price, image1,image2}= req.body;
  try{
    if(image1 && image2){
      const upload_preset1 = await cloudinary.uploader.upload(image1,{
        upload_preset:"shopquanao"
       
      })

      console.log(upload_preset1)
      const upload_preset2 = await cloudinary.uploader.upload(image2,{
        upload_preset:"shopquanao"
      })
      console.log(upload_preset2)
      if(upload_preset1 && upload_preset2){
        const product = new Product({
          title,
          categorySlug,
          description,
          price,
          colors,
          size,
          slug,
          image1: upload_preset1,
          image2: upload_preset2,
      })
      
      console.log(image1)
      console.log(image2)
      
      const saveProduct = await product.save()
      res.status(200).send(saveProduct);
      }
      
       

        
  
      
  }
}
  catch(error){
      console.log(error);
      res.status(500).send(error);
  }
  
router.get("/",async(req, res)=>{
  try{
     const product = await Product.find()
     res.status(200).send(product)
  }
  catch(error){
    console.log(error);
    res.status(500).send(error);
  }
})


} )
module.exports = router