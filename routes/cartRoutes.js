import express from 'express';
import { syncCart } from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js'; // আপনার অথেন্টিকেশন মিডলওয়্যার

const router = express.Router();

// গেস্ট কার্ট সিংক করার রাউট
router.post('/sync', protect, syncCart);

export default router;