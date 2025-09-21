import User from '../models/user.model.js';
import Product from '../models/product.model.js';

export const getCartProducts = async (req, res) => {
    try {
        // .populate() will look at the 'product' field in the cartItems array
        // and fetch the full document from the 'products' collection.
        const user = await User.findById(req.user._id).populate({
            path: 'cartItems.product',
            model: 'Product'
        });
        // if user is not found, return 404
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // if user is logged and found, return cart items
        res.status(200).json(user.cartItems);

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

        // ✅ CORRECTED: Find the item by checking the 'product' sub-field.
        const existingItem = user.cartItems.find(
            (item) => item.product.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            // ✅ CORRECTED: Push the correct object shape, not just an ID.
            user.cartItems.push({ product: productId, quantity: 1 });
        }

        await user.save();
        res.status(200).json(user.cartItems);

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

        if (!productId) {
            user.cartItems = []; // Clear the entire cart
        } else {
            // ✅ CORRECTED: Filter by the 'product' sub-field.
            user.cartItems = user.cartItems.filter(
                (item) => item.product.toString() !== productId
            );
        }

        await user.save();
        res.status(200).json(user.cartItems);

    } catch (error) {
        console.log("Error in removeFromCart controller:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * Updates the quantity of a specific item in the cart.
 */
export const updateQuantity = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;
        const user = req.user;

        // Find by the 'product' sub-field.
        const existingItem = user.cartItems.find(
            (item) => item.product.toString() === productId
        );

        if (existingItem) {
            if (quantity <= 0) {
                // If quantity is 0 or less, remove the item from the cart.
                user.cartItems = user.cartItems.filter(
                    (item) => item.product.toString() !== productId
                );
            } else {
                existingItem.quantity = quantity;
            }

            await user.save();
            res.status(200).json(user.cartItems);
        } else {
            res.status(404).json({ message: "Product not found in cart" });
        }
    } catch (error) {
        console.log("Error in updateQuantity controller", error.message);
        res.status(500).json({ message: "Server error" });
    }
};