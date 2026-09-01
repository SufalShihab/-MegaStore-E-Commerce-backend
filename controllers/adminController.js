import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Seller from '../models/Seller.js'; // আপনার সেলার মডেলের সঠিক পাথ দিয়ে নেবেন

export const getAdminStats = async (req, res) => {
  try {
    // ১. মোট প্রোডাক্ট সংখ্যা গণনা
    const totalProducts = await Product.countDocuments();

    // ২. মোট অর্ডার সংখ্যা গণনা
    const totalOrders = await Order.countDocuments();

    // ৩. মোট সেলার সংখ্যা গণনা
    const totalSellers = await Seller.countDocuments();

    // ৪. মোট সেলস বা রেভিনিউ হিসাব করা (সব অর্ডারের totalPrice যোগ করে)
    const orders = await Order.find({});
    const totalSales = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);

    res.status(200).json({
      success: true,
      totalSales,
      totalOrders,
      totalProducts,
      totalSellers,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};