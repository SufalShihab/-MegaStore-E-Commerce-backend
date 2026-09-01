import Seller from '../models/Seller.js';

// Register Seller
export const registerSeller = async (req, res) => {
  try {
    // frontend থেকে name অথবা ownerName যেকোনো একটি আসলেই তা রিসিভ করবে
    const { name, ownerName, email, password, phone, shopName, address } = req.body;

    const sellerExists = await Seller.findOne({ email });
    if (sellerExists) {
      return res.status(400).json({ message: 'Seller already exists with this email' });
    }

    // Model Field name 맞춰 Object তৈরি
    const seller = await Seller.create({
      ownerName: ownerName || name || 'Seller Owner',
      shopName: shopName || 'My Shop',
      email,
      password, // নিরাপদ করতে চাইলে bcrypt ব্যবহার করা উচিত
      phone: phone || '',
      address: address || ''
    });

    res.status(201).json({
      _id: seller._id,
      ownerName: seller.ownerName,
      email: seller.email,
      shopName: seller.shopName,
    });
  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Login Seller
export const loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;
    const seller = await Seller.findOne({ email });

    if (seller && seller.password === password) {
      res.json({
        _id: seller._id,
        ownerName: seller.ownerName || seller.name,
        email: seller.email,
        shopName: seller.shopName,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get Seller Profile
export const getSellerProfile = async (req, res) => {
  try {
    const sellerId = req.params.id;
    let seller = null;

    // MongoDB ObjectId ভ্যালিড কিনা চেক অথবা 'me' হ্যান্ডেল করা
    if (sellerId && sellerId !== 'me' && sellerId.match(/^[0-9a-fA-F]{24}$/)) {
      seller = await Seller.findById(sellerId);
    } else {
      // আইডি না মিললে বা 'me' হলে ডাটাবেজের ১ম সেলারকে নিয়ে আসবে (Testing/Fallback)
      seller = await Seller.findOne();
    }

    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    res.json(seller);
  } catch (error) {
    console.error("Profile Fetch Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};