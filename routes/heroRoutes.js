import express from 'express';
import { getHeroBanners, addHeroBanner, deleteHeroBanner } from '../controllers/heroController.js';

const router = express.Router();

router.get('/', getHeroBanners);
router.post('/', addHeroBanner); // প্রটেক্টেড বা এডমিন মিডলওয়্যার যুক্ত করতে পারেন
router.delete('/:id', deleteHeroBanner);

export default router;