import express from 'express';
import { 
  createOrder, 
  getSellerOrders, 
  updateOrderStatus, 
  getMyOrders 
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js'; // যদি টোকেন ভেরিফিকেশন মিডওয়্যার থাকে

const router = express.Router();

// ১. নতুন অর্ডার তৈরি করা
router.post('/', createOrder);

// ২. কাস্টমারের নিজের দেওয়া অর্ডার লিস্ট
router.get('/my-orders', protect, getMyOrders);
// ৩. সেলারের কাছে আসা অর্ডারের লিস্ট
// router.get('/seller/:sellerId', getSellerOrders);
router.get('/seller', getSellerOrders);
// ৪. অর্ডারের স্ট্যাটাস আপডেট করা
router.put('/:id/status', updateOrderStatus);

export default router;