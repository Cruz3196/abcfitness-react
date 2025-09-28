import Product  from '../models/product.model.js';

export const getCartProducts = async (req, res) => {
    try {
        const productIds = req.user.cartItems.map(item => item.id); 
        const products = await Product.find({ _id: { $in: productIds} });

        const cartItems = products.map((product) => {
            const item = req.user.cartItems.find((cartItem) => cartItem.id === product._id.toString()); 
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

        const existingItem = user.cartItems.find((item) => item.id === productId);
        if(existingItem){
            existingItem.quantity += 1;
        } else {
            user.cartItems.push({ id: productId, quantity: 1 });
        }
        
        await user.save();
        res.json(user.cartItems);
        console.log("Product added to cart successfully");
    } catch (error) {
        console.log("Error in addToCart controller", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Fixed removeFromCart - completely removes item from cart
export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;

        // Remove the item completely from cart
        user.cartItems = user.cartItems.filter((item) => item.id !== productId);

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
        const existingItem = user.cartItems.find((item) => item.id === productId);

        if (existingItem) {
            if (quantity === 0) {
                user.cartItems = user.cartItems.filter((item) => item.id !== productId);
                await user.save();
                return res.json(user.cartItems);
            }

            existingItem.quantity = quantity;
            await user.save();
            res.json(user.cartItems);
        }else{
            res.status(404).json({ message: "Product not found in cart" });
        }
    }catch (error){
        console.log("Error in updateQuantity controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};