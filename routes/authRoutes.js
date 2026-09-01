import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile, 
  adminLogin // ১. এডমিন কন্ট্রোলার ফাংশনটি ইমপোর্ট করুন
} from '../controllers/authController.js';
import { getAdminStats } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// রেজিস্টার ও লগইন রাউট
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/admin/stats', getAdminStats);

// 🔥 নতুন এডমিন লগইন রাউট
router.post('/admin-login', adminLogin);

// প্রোফাইল গেট এবং আপডেট করার জন্য
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;