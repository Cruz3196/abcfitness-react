import Product from '../models/product.model.js';

export const getCartProducts = async (req, res) => {
    try {
        // Fix: use _id instead of id
        const productIds = req.user.cartItems.map(item => item._id || item.id); 
        const products = await Product.find({ _id: { $in: productIds} });

        const cartItems = products.map((product) => {
            // Fix: check both _id and id
            const item = req.user.cartItems.find((cartItem) => 
                (cartItem._id && cartItem._id.toString() === product._id.toString()) ||
                (cartItem.id && cartItem.id.toString() === product._id.toString())
            ); 
            return {...product.toJSON(), quantity: item.quantity };
        })
        res.json(cartItems);
    } catch (error) {
        console.log("Error in getCart controller", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

export const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;

        // Fix: check both _id and id fields
        const existingItem = user.cartItems.find((item) => 
            (item._id && item._id.toString() === productId.toString()) ||
            (item.id && item.id.toString() === productId.toString())
        );
        
        if(existingItem){
            existingItem.quantity += 1;
        } else {
            user.cartItems.push({ _id: productId, quantity: 1 }); // Use _id consistently
        }
        
        await user.save();
        res.json(user.cartItems);
        console.log("Product added to cart successfully");
    } catch (error) {
        console.log("Error in addToCart controller", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const user = req.user;

        console.log("Removing product:", productId);
        
        // Fix: handle both _id and id fields
        user.cartItems = user.cartItems.filter((item) => {
            const itemId = item._id || item.id;
            return itemId.toString() !== productId.toString();
        });

        await user.save();
        
        res.json(user.cartItems);
        console.log("Product removed from cart successfully");
    } catch (error) {
        console.log("Error in removeFromCart controller:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

export const clearCart = async (req, res) => {
    try{
        const user = req.user;
        user.cartItems = [];
        
        await user.save();
        res.json(user.cartItems);
        console.log("Cart cleared successfully");
    }catch (error){
        console.log("Error in clearCart controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const updateQuantity = async (req, res) => {
    try{
        const { productId } = req.params;
        const { quantity } = req.body;
        const user = req.user;
        
        console.log("Updating quantity for product:", productId, "to:", quantity);
        
        // Fix: handle both _id and id fields
        const existingItem = user.cartItems.find((item) => {
            const itemId = item._id || item.id;
            return itemId.toString() === productId.toString();
        });

        if (existingItem) {
            if (quantity === 0) {
                user.cartItems = user.cartItems.filter((item) => {
                    const itemId = item._id || item.id;
                    return itemId.toString() !== productId.toString();
                });
                await user.save();
                return res.json(user.cartItems);
            }

            existingItem.quantity = quantity;
            await user.save();
            res.json(user.cartItems);
            console.log("Quantity updated successfully");
        } else {
            res.status(404).json({ message: "Product not found in cart" });
        }
    }catch (error){
        console.log("Error in updateQuantity controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};