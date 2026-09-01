import mongoose from 'mongoose';

const heroBannerSchema = new mongoose.Schema({
  image: { type: String, required: true }, // ব্যানার ছবির লিংক বা পাথ
  link: { type: String, default: '#' }    // 'Shop Now' ক্লিক করলে যেখানে যাবে
}, { timestamps: true });

export default mongoose.model('HeroBanner', heroBannerSchema);