import Cart from '../models/cartModel.js'; // আপনার কার্ট মডেলের পাথ অনুযায়ী দিন

export const syncCart = async (req, res) => {
  try {
    const userId = req.user._id; // অথ মিডলওয়্যার থেকে ইউজার আইডি পাবে
    const { items } = req.body;

    let userCart = await Cart.findOne({ user: userId });

    if (!userCart) {
      userCart = new Cart({ user: userId, items: [] });
    }

    // গেস্ট কার্টের আইটেমগুলো ডাটাবেজ কার্টের সাথে যুক্ত করা
    items.forEach(guestItem => {
      const productId = guestItem.product._id || guestItem.product;
      const itemIndex = userCart.items.findIndex(
        i => i.product.toString() === productId.toString()
      );

      if (itemIndex > -1) {
        userCart.items[itemIndex].quantity += guestItem.quantity;
      } else {
        userCart.items.push({
          product: productId,
          quantity: guestItem.quantity
        });
      }
    });

    await userCart.save();
    res.status(200).json({ message: 'Cart synced successfully', userCart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};