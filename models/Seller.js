import mongoose from 'mongoose';

const sellerSchema = new mongoose.Schema(
  {
    shopName: { type: String, required: true },
    ownerName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, default: '' },
    password: { type: String, required: true },
    role: { type: String, default: 'seller' },
  },
  { timestamps: true }
);

const Seller = mongoose.models.Seller || mongoose.model('Seller', sellerSchema);

export default Seller;