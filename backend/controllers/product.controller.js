import Product from "../models/product.model.js";
import cloudinary from "../lib/cloudinaryConfig.js";
import {redis} from "../lib/redis.js";

// redis cache for keeping feature products up to date 
async function updateFeaturedProductsCache() {
    try {
        const featuredProducts = await Product.find({ isFeatured: true }).lean();
        // ✅ STANDARDIZED: Use the same key as your GET function for consistency.
        await redis.set("featuredProducts", JSON.stringify(featuredProducts));
        console.log("Featured products cache updated.");
    } catch (error) {
        console.log("Error in updateFeaturedProductsCache helper:", error);
    };
};


//! Admin Controllers
export const createProduct = async(req, res) => {
    try{
        const { productName, productDescription, productPrice, img, productCategory} = req.body;

        let cloudinaryResponse = null;

        if(img){
            cloudinaryResponse = await cloudinary.uploader.upload(img,{folder:"products"});
        }

        const product = await Product.create({
            productName,
            productDescription,
            productPrice,
            productCategory,
            img: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : ""
        });
        // calling the upfeatured products cache to update it if needed
        await updateFeaturedProductsCache();
        res.status(201).json(product);

    } catch (error){
        res.status(500).json({ error: "Error Creating Product" });
        console.log("Error in createProduct controller: ", error);
    }
};

// this will be done on the admin side to make a product isFeatured
export const toggleFeaturedProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            product.isFeatured = !product.isFeatured;
            const updatedProduct = await product.save();
            await updateFeaturedProductsCache(); // Update the cache immediately
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        console.log("Error in toggleFeaturedProduct controller:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

export const getAllProducts = async (req, res) => {
    try{
        const products = await Product.find({});
        res.status(200).json({ products });
    }catch (error){
        res.status(500).json({ error: "Error fetching products" });
        console.log("Error in getting all products controller: ", error);
    }
};

export const updateProduct = async (req, res) => {
    const productId = req.params.id;
    const updatedName = req.body.productName;
    const updatedDescription = req.body.productDescription;
    const updatedPrice = req.body.productPrice;
    const updatedImage = req.body.img;
    const updatedCategory = req.body.productCategory;

    try{
        const product = await Product.findByIdAndUpdate(productId, {
            productName: updatedName,
            productDescription: updatedDescription,
            productPrice: updatedPrice,
            img: updatedImage,
            productCategory: updatedCategory
        }, {new: true});
        if(!product){
            return res.status(404).json({ message: "Product not found" }); 
        }

        // calling the upfeatured products cache to update it if needed
        await updateFeaturedProductsCache();
        res.status(200).json(product);
    }catch (error){
        res.status(500).json({ error: "Error updating product" });
        console.log("Error in updating product controller: ", error);
    }
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
        // Update the featured products cache
        await updateFeaturedProductsCache();
        await Product.findByIdAndDelete(req.params.id);

        res.json({message: "Product deleted"});
    }catch (error){
        res.status(500).json({ error: "Error deleting product" });
        console.log("Error in deleting product controller: ", error);
    }
}

// getting a product by id for customer & admin
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

// ? User Controllers =========================
export const getFeaturedProducts = async (req, res) => {
    try{
        let featuredProducts = await redis.get("featuredProducts");
        // If not in cache, fetch from DB and store in cache
        if(featuredProducts){
            return res.json(JSON.parse(featuredProducts));
        }

        featuredProducts = await Product.find({ isFeatured: true }).lean();

        if(!featuredProducts){
            return res.status(404).json({ message: "No featured products found" }); 
        };

        await redis.set("featuredProducts", JSON.stringify(featuredProducts));

        res.json(featuredProducts);

    }catch (error){
        console.log("Error in getting featured products controller: ", error);
        res.status(500).json({ error: "Error fetching featured products" });
    };
};

export const getRecommendedProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            { $sample: { size: 4 } },
            {
                // seleting only the fields we need to reduce payload
                $project: {
                    _id: 1,
                    productName: 1,
                    productDescription: 1,
                    img: 1,
                    productPrice: 1,
                },
            },
        ]);

        res.json(products);
    } catch (error) {
        console.log("Error in getRecommendedProducts controller:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Gets all products that match a specific category.
export const getProductsByCategory = async (req, res) => {
    const { category } = req.params;
    try {
        // creating a variable to find products by category
        const products = await Product.find({ productCategory: category });
        res.json({ products });
    } catch (error) {
        console.log("Error in getProductsByCategory controller:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};