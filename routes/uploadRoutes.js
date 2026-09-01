import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config(); // env লোড নিশ্চিত করা হলো

const router = express.Router();

// ক্লাউডিনারি কনফিগারেশন
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith('video');
    return {
      folder: 'megastore_products',
      resource_type: isVideo ? 'video' : 'image',
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'mp4', 'mkv'],
    };
  },
});

const upload = multer({ storage });

router.post('/', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'কোনো ফাইল পাওয়া যায়নি' });
    }
    res.json({ url: req.file.path });
  } catch (error) {
    console.error('Cloudinary Error:', error); // টার্মিনালে আসল এরর দেখার জন্য
    res.status(500).json({ message: 'ফাইল আপলোড ব্যর্থ হয়েছে: ' + error.message });
  }
});

export default router;