import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // decoded.id বা decoded._id যাই থাকুক সেফ থাকা
      const userId = decoded.id || decoded._id; 
      req.user = await User.findById(userId).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'ইউজার পাওয়া যায়নি' });
      }

      next();
    } catch (error) {
      console.error('JWT Auth Error:', error.message);
      return res.status(401).json({ message: 'টোকেন ভ্যালিড নয়, এক্সেস প্রত্যাখ্যাত' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'কোনো টোকেন পাওয়া যায়নি, লগইন করুন' });
  }
};

