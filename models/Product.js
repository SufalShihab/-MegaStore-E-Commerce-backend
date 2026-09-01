// import mongoose from 'mongoose';

// const productSchema = new mongoose.Schema(
//   {
//     // seller কে ObjectId এর পরিবর্তে String করা হলো যাতে কাস্টম আইডি (যেমন: SELLER_xxx) সেভ হতে পারে
//     seller: { 
//       type: String, 
//       required: false, 
//       default: 'SELLER_DEFAULT'
//     },
//     title: { type: String, required: true },
//     price: { type: Number, required: true },
//     originalPrice: { type: Number, default: null },
//     brand: { type: String, default: '' },
//     category: { type: String, required: true },
//     image: { type: String, required: true },
//     stock: { type: Number, required: true, default: 10 },
//     deliveryTime: { type: String, default: '2-4 days' },
//     returnPolicy: { type: String, default: '14 days easy return' },
//     warranty: { type: String, default: 'Warranty not available' },
//     cashOnDelivery: { type: Boolean, default: true },
    
//     // ট্যাগ বা কী-ওয়ার্ড যা সার্চবারে কাজে লাগবে
//     tags: { type: [String], default: [] },
    
//     description: { type: String, default: '' },
//     rating: { type: Number, default: 4.5 },
//   },
//   { timestamps: true }
// );

// const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

// export default Product;


import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  userName: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  images: [{ type: String }],
  date: { type: String, required: true }
}, { timestamps: true });

const productSchema = new mongoose.Schema(
  {
    // seller কে ObjectId এর পরিবর্তে String করা হলো যাতে কাস্টম আইডি (যেমন: SELLER_xxx) সেভ হতে পারে
    seller: { 
      type: String, 
      required: false, 
      default: 'SELLER_DEFAULT'
    },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, default: null },
    brand: { type: String, default: '' },
    category: { type: String, required: true },
    image: { type: String, required: true },
    stock: { type: Number, required: true, default: 10 },
    deliveryTime: { type: String, default: '2-4 days' },
    returnPolicy: { type: String, default: '14 days easy return' },
    warranty: { type: String, default: 'Warranty not available' },
    cashOnDelivery: { type: Boolean, default: true },
    
    // ট্যাগ বা কী-ওয়ার্ড যা সার্চবারে কাজে লাগবে
    tags: { type: [String], default: [] },
    
    description: { type: String, default: '' },
    rating: { type: Number, default: 4.5 },

    // 🔥 এখানে নতুন রিভিউ স্কিমাটি যুক্ত করে দেওয়া হলো
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;