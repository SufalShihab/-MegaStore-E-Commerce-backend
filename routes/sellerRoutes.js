import express from 'express';
import { registerSeller, loginSeller, getSellerProfile } from '../controllers/sellerController.js';

const router = express.Router();

router.post('/register', registerSeller);
router.post('/signup', registerSeller);
router.post('/login', loginSeller);
router.get('/me', getSellerProfile); // protectSeller সরিয়ে নেওয়া হয়েছে

// dynamic seller ID route যোগ করুন
router.get('/:id', getSellerProfile || ((req, res) => res.json({ name: 'Seller' })));

export default router;