import User from '../models/User.js';

// Get User Profile Data
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'ইউজার পাওয়া যায়নি' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({ message: 'সার্ভার এরর: ' + error.message });
  }
};

// Update User Profile (Phone, Address, Name)
export const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: 'ইউজার অথেন্টিকেশন ব্যর্থ' });
    }

    const userId = req.user._id || req.user.id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        ...(name && { name }),
        ...(phone !== undefined && { phone }),
        ...(address !== undefined && { address })
      },
      { new: true, runValidators: false }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'ইউজার পাওয়া যায়নি' });
    }

    res.status(200).json({
      message: 'প্রোফাইল সফলভাবে আপডেট হয়েছে',
      user: updatedUser,
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address,
      role: updatedUser.role
    });
  } catch (error) {
    console.error('Update Profile Error Details:', error);
    res.status(500).json({ message: 'সার্ভার এরর: ' + error.message });
  }
};