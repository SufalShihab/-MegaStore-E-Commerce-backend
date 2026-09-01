const express = require('express');
const router = express.Router();
const { getHeroBanners, addHeroBanner, deleteHeroBanner } = require('../controllers/heroController');

router.get('/', getHeroBanners);
router.post('/', addHeroBanner); // প্রোটেক্টেড বা অ্যাডমিন মিডলওয়্যার যুক্ত করতে পারেন
router.delete('/:id', deleteHeroBanner);

module.exports = router;