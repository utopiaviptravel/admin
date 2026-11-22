import mongoose from 'mongoose';

const TourSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    place: { type: String, default: '' },
    price: { type: Number, required: true }, // ₾ per person
    date: { type: String, default: '' },
    seats: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 }, // sort order in lists
  },
  { timestamps: true }
);

export default mongoose.models.Tour || mongoose.model('Tour', TourSchema);
