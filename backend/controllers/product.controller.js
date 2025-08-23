import Product from "../models/product.model.js";
import cloudinary from "../lib/cloudinaryConfig.js";

export const createProduct = async(req, res) => {
    try{
        const { name, description, price, img} = req.body;

        let cloudinaryResponse = null;

        if(img){
            cloudinaryResponse = await cloudinary.uploader.upload(img,{folder:"products"});
        }

        const product = await Product.create({
            name,
            description,
            price,
            img: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : ""
        });

        res.status(201).json(product);

    } catch (error){
        res.status(500).json({ error: "Error Creating Product" });
        console.log("Error in createProduct controller: ", error);
    }
};

export const getAllProducts = async (req, res) => {
    try{
        const products = await Product.find();
        res.status(200).json(products);
    }catch (error){
        res.status(500).json({ error: "Error fetching products" });
        console.log("Error in getting all products controller: ", error);
    }
};

export const getProductId = async (req, res) => {
    try{
        const product = await Product.findById(req.params.id);
        if(!product){
            return res.status(404).json({ message: "Product not found" }); 
        }
        res.status(200).json(product);
    }catch (error){
        res.status(500).json({ error: "Error fetching product" });
        console.log("Error in getting product controller: ", error);
    }
}

export const updateProduct = async (req, res) => {
    
}

export const deleteProduct = async (req, res) => {
    try{
        const product = await Product.findByIdAndDelete(req.params.id);
        if(!product){
            return res.status(404).json({ message: "Product not found" }); 
        }
        // If the product has an image on Cloudinary, delete it
        if (product.img) {
            // Extract the public_id from the URL
            const publicId = product.img.split('/').pop().split('.')[0]; // this will get the id of the image 
            try{
                await cloudinary.uploader.destroy(`products/${publicId}`);
                console.log("Image deleted from Cloudinary");
            }catch (error){
                console.log("error deleting image from cloudinary: ", error);
            }
        }
        await Product.findByIdAndDelete(req.params.id);

        res.json({message: "Product deleted"});
    }catch (error){
        res.status(500).json({ error: "Error deleting product" });
        console.log("Error in deleting product controller: ", error);
    }
}