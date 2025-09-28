import Product  from '../models/product.model.js';

export const getCartProducts = async (req, res) => {
    try {
        const products = await Product.find({ _id: { $in: req.user.cartItems} });

        const cartItems = products.map((product) => {
            const item = req.user.cartItems.find((cartItem) => cartItem.id === product.id)
            return {...product.toJSON(), quantity: item.quantity };
        })
        res.json(cartItems);
    } catch (error) {
        console.log("Error in getCart controller", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * Adds a product to the user's cart or increments its quantity.
 */
export const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;

        const existingItem = user.cartItems.find((item) => item.id === productId);
        if(existingItem){
            existingItem.quantity += 1;
        } else {
            user.cartItems.push(productId);
        }

        await user.save();
        res.json(user.cartItems);
        console.log("Product added to cart successfully");
    } catch (error) {
        console.log("Error in addToCart controller", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * Removes an item completely from the cart or clears the entire cart.
 */
export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body; // If no productId is sent, clear the whole cart.
        const user = req.user;


        const existingItem = user.cartItems.find((item) => item.id === productId);
        if (existingItem) {
            // if the item exist then remove it from the cart
            existingItem.quantity -= 1;
        } else {
            user.cartItems.pop(productId);
        }

        await user.save();
        res.json(user.cartItems);
        console.log("Product removed from cart successfully");
    } catch (error) {
        console.log("Error in removeFromCart controller:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

// clearing all the items in the cart 
export const clearCart = async (req, res) => {
    try{
        const { productId } = req.body;
        const user = req.user;
        
        if(!productId){
            user.cartItems = [];
    }else{
        user.cartItems = user.cartItems.filter((item) => item.id !== productId);
    }
    await user.save();
    res.json(user.cartItems);
    console.log("Cart cleared successfully");
    }catch (error){
        console.log("Error in clearCart controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



// Updates the quantity of a specific item in the cart.

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