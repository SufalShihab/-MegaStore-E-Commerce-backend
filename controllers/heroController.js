import HeroBanner from '../models/HeroBanner.js';

export const getHeroBanners = async (req, res) => {
  try {
    const banners = await HeroBanner.find({});
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addHeroBanner = async (req, res) => {
  try {
    const { image, link } = req.body;
    const newBanner = new HeroBanner({ image, link });
    const savedBanner = await newBanner.save();
    res.status(201).json(savedBanner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteHeroBanner = async (req, res) => {
  try {
    await HeroBanner.findByIdAndDelete(req.params.id);
    res.json({ message: 'ব্যানার সফলভাবে ডিলিট করা হয়েছে' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};