import Order from '../models/Order.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';

export const createOrder = async (req, res) => {
  try {
    console.log("Order Request Body");

    const { orderItems, customerInfo, shippingAddress, paymentMethod, totalAmount, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'কার্টে কোনো প্রোডাক্ট নেই' });
    }

    const customerId = req.user?._id || req.body.customer || "64a5f2c8e4b0123456789abc"; 

    const formattedOrderItems = orderItems.map(item => ({
      product: item.product || item._id,
      title: item.title || item.name || "Unnamed Product",
      name: item.name || item.title || "Unnamed Product",
      quantity: item.quantity || item.qty || 1,
      price: item.price,
      image: item.image || ""
    }));

    const finalShippingAddress = shippingAddress || customerInfo;

    const order = new Order({
      customer: customerId,
      orderItems: formattedOrderItems,
      shippingAddress: finalShippingAddress, 
      paymentMethod: paymentMethod ? paymentMethod.toUpperCase() : 'COD',
      totalPrice: totalPrice || totalAmount,
    });

    const createdOrder = await order.save();
    console.log("Order Saved Successfully in DB");
    res.status(201).json(createdOrder);

  } catch (error) {
    console.error("Create Order Error:", error.message);
    res.status(500).json({ message: 'সার্ভার এরর: ' + error.message });
  }
};

export const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.query.sellerId;

    if (!sellerId) {
      return res.status(400).json({ message: 'সেলার আইডি পাওয়া যায়নি' });
    }

    // ১. এই সেলারের আন্ডারে যত প্রোডাক্ট আছে তাদের আইডি বের করা
    const sellerProducts = await Product.find({ seller: sellerId }).select('_id');
    const productIds = sellerProducts.map(p => p._id);

    // ২. অর্ডার কালেকশন থেকে এই প্রোডাক্টগুলোর অর্ডারগুলো ফিল্টার করা
    const orders = await Order.find({ "orderItems.product": { $in: productIds } })
      .populate('customer', 'name email')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Get Seller Orders Error:", error.message);
    res.status(500).json({ message: 'সার্ভার এরর: ' + error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'অনুমোদিত নয়! অনুগ্রহ করে লগইন করুন।' });
    }

    const orders = await Order.find({ customer: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('getMyOrders Error:', error.message);
    res.status(500).json({ message: 'অর্ডার হিস্ট্রি পেতে সমস্যা হয়েছে: ' + error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'অর্ডার পাওয়া যায়নি' });
    }
  } catch (error) {
    console.error("Update Status Error:", error.message);
    res.status(500).json({ message: 'সার্ভার এরর: ' + error.message });
  }
};