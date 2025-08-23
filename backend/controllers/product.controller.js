import Product from "../models/product.model.js";

export const createProduct = async(req, res) => {
    try{

        const { name, description, price, img, category, stock } = req.body;

        const newProduct = new Product({
            name,
            description,
            price,
            img,
            category,
            stock,
        });

        const savedProduct = await newProduct.save();

        res.status(201).json(savedProduct);

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
            return res.status(404).send(); 
        }
        res.status(200).json(product);
    }catch (error){
        res.status(500).json({ error: "Error fetching product" });
        console.log("Error in getting product controller: ", error);
    }
}

export const deleteProduct = async (req, res) => {
    try{
        const product = await Product.findByIdAndDelete(req.params.id);
        if(!product){
            return res.status(404).send(); 
        }
        res.json({message: "Product deleted"});
    }catch (error){
        res.status(500).json({ error: "Error deleting product" });
        console.log("Error in deleting product controller: ", error);
    }
}