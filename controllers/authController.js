import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ১. নতুন ইউজার/সেলার রেজিস্ট্রেশন
// ১. নতুন ইউজার/সেলার রেজিস্ট্রেশন
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, role, shopName } = req.body; // <-- এখানে phone যোগ করা হয়েছে

    // ইমেইল আগে থেকেই আছে কিনা চেক করা
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'এই ইমেইল দিয়ে ইতিপূর্বে অ্যাকাউন্ট তৈরি করা হয়েছে' });
    }

    // পাসওয়ার্ড হ্যাশ করা
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ডাটাবেজে ইউজার সেভ করা
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone: phone || '', // <-- এখানে phone সেভ করা হচ্ছে
      role: role || 'customer',
      shopName: role === 'seller' ? shopName : undefined,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone, // <-- রেসপন্সে ফোন পাঠানো হলো
        role: user.role,
        shopName: user.shopName,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'সার্ভার এরর: ' + error.message });
  }
};

// ২. ইউজার/সেলার লগইন
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // ইমেইল ও পাসওয়ার্ড ভেরিফাই করা
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        shopName: user.shopName,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'ইমেইল অথবা পাসওয়ার্ড ভুল দেওয়া হয়েছে' });
    }
  } catch (error) {
    res.status(500).json({ message: 'সার্ভার এরর: ' + error.message });
  }
};

// JWT টোকেন তৈরি করার হেলপার ফাংশন
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// ইউজারের প্রোফাইল ডাটা পাওয়া
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'ইউজার পাওয়া যায়নি' });
    }
  } catch (error) {
    res.status(500).json({ message: 'সার্ভার এরর' });
  }
};

// ইউজারের প্রোফাইল আপডেট করা
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      user.address = req.body.address || user.address;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: 'ইউজার পাওয়া যায়নি' });
    }
  } catch (error) {
    res.status(500).json({ message: 'প্রোফাইল আপডেট করতে সমস্যা হয়েছে' });
  }
};

// এডমিন লগইন কন্ট্রোলার
export const adminLogin = async (req, res) => {
  const { email, password, secretKey } = req.body;

  // .env ফাইল থেকে ভ্যালুগুলো চেক করা
  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD &&
    secretKey === process.env.ADMIN_SECRET_KEY
  ) {
    return res.status(200).json({ 
      success: true, 
      message: 'এডমিন লগইন সফল হয়েছে!'
    });
  } else {
    return res.status(401).json({ 
      success: false, 
      message: 'ভুল ইমেইল, পাসওয়ার্ড অথবা সিক্রেট কি!' 
    });
  }
};