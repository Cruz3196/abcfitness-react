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
        console.log("Error in createProduct controller: ", error);
    }
};