import Product from '../models/Product.js';

// ১. সমস্ত প্রোডাক্ট পড়া (Customer View - Search & Filter সহ)
export const getProducts = async (req, res) => {
  try {
    const { keyword, category, sellerId } = req.query;
    let query = {};

    // যদি সেলার আইডি দিয়ে কুয়েরি করা হয়
    if (sellerId) {
      query.seller = sellerId;
    }

    // ১.১ টাইটেল, ডেসক্রিপশন অথবা ট্যাগের মধ্যে সার্চ করা
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { tags: { $in: [new RegExp(keyword, 'i')] } }
      ];
    }

    // ১.২ নির্দিষ্ট ক্যাটাগরি অনুযায়ী ফিল্টার করা
    if (category && category !== 'all') {
      query.category = category;
    }

    const products = await Product.find(query)
      .populate('seller', 'name shopName')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'সার্ভার এরর: ' + error.message });
  }
};

// ২. নির্দিষ্ট একটি প্রোডাক্টের ডিটেইলস
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name shopName');
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'প্রোডাক্ট পাওয়া যায়নি' });
    }
  } catch (error) {
    res.status(500).json({ message: 'সার্ভার এরর: ' + error.message });
  }
};

// ৩. নতুন প্রোডাক্ট তৈরি করা (Seller Only)
export const createProduct = async (req, res) => {
  try {
    const { title, name, description, price, category, tags, image, stock, seller, sellerId } = req.body;

    const sellerRef = req.user?._id || seller || sellerId;

    if (!sellerRef) {
      return res.status(400).json({ message: 'সেলার আইডি পাওয়া যায়নি। অনুগ্রহ করে লগইন করুন।' });
    }

    const product = new Product({
      seller: sellerRef,
      title: title || name,
      description,
      price: Number(price),
      category,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
      image,
      stock: Number(stock) || 0,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Product Creation Error:", error);
    res.status(500).json({ message: 'সার্ভার এরর: ' + error.message });
  }
};

// ৪. সেলারের নিজস্ব প্রোডাক্টের লিস্ট (Seller Dashboard)
export const getSellerProducts = async (req, res) => {
  try {
    const sellerId = req.user?._id || req.query.sellerId || req.query.seller;
    
    if (!sellerId) {
      return res.status(400).json({ message: 'সেলার আইডি প্রয়োজন' });
    }

    const products = await Product.find({ seller: sellerId });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'সার্ভার এরর: ' + error.message });
  }
};

// ৫. প্রোডাক্ট ডিলিট করা
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      // টেস্টিং বা সহজ করার জন্য যদি req.user না থাকে তবে ডিলিট করতে দেবে
      if (req.user && product.seller.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'আপনার এই প্রোডাক্ট ডিলিট করার অনুমতি নেই' });
      }
      await product.deleteOne();
      res.json({ message: 'প্রোডাক্ট সফলভাবে ডিলিট করা হয়েছে' });
    } else {
      res.status(404).json({ message: 'প্রোডাক্ট পাওয়া যায়নি' });
    }
  } catch (error) {
    res.status(500).json({ message: 'সার্ভার এরর: ' + error.message });
  }
};

export const addProductReview = async (req, res) => {
  try {
    const { rating, comment, images } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'প্রোডাক্ট পাওয়া যায়নি' });
    }

    const review = {
      user: req.user._id, // অথেন্টিকেটেড ইউজারের আইডি
      userName: req.user.name || req.user.username || 'ইউজার',
      rating: Number(rating),
      comment,
      images,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    product.reviews.unshift(review); // নতুন রিভিউ সবার উপরে যোগ হবে
    await product.save();

    res.status(201).json(product.reviews);
  } catch (error) {
    res.status(500).json({ message: 'সার্ভার এরর: ' + error.message });
  }
};