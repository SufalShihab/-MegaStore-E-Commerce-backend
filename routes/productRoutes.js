import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  getSellerProducts, 
  deleteProduct,
  addProductReview
} from '../controllers/productController.js';

const router = express.Router();

// ১. সমস্ত প্রোডাক্টের লিস্ট পাওয়ার রুট (Public)
router.get('/', getProducts);

// ২. সেলারের নিজস্ব প্রোডাক্টের লিস্ট পাওয়ার রুট (Seller Dashboard)
// (দ্রষ্টব্য: যদি আপনার মিডলওয়্যার থাকে তবে protectSeller যোগ করতে পারেন)
router.get('/seller', getSellerProducts);

// ৩. নতুন প্রোডাক্ট তৈরি করার রুট
router.post('/', createProduct);

// ৪. নির্দিষ্ট একটি প্রোডাক্টের ডিটেইলস পাওয়ার রুট
router.get('/:id', getProductById);

// ৫. প্রোডাক্ট ডিলিট করার রুট
router.delete('/:id', deleteProduct);
router.post('/:id/reviews', protect, addProductReview);

export default router;