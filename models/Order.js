import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    customer: { 
      type: String, 
      default: 'CUSTOMER_DEFAULT' 
    },
    orderItems: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false },
        name: { type: String, required: true }, // CheckoutPage-এ name পাঠানো হচ্ছে
        title: { type: String, required: false }, // ব্যাকআপের জন্য
        qty: { type: Number, required: false },
        quantity: { type: Number, required: true }, // CheckoutPage-এ quantity পাঠানো হচ্ছে
        image: { type: String, required: false },
        price: { type: Number, required: true }
      }
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, default: '' },
      address: { type: String, required: true },
      city: { type: String, required: true },
      district: { type: String, required: true },
      note: { type: String, default: '' }
    },
    paymentMethod: { type: String, default: 'cod' },
    shippingFee: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true }, // CheckoutPage-এর totalAmount এখানে সেভ হবে
    totalAmount: { type: Number, required: false },
    status: { type: String, default: 'Confirmed' }
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;