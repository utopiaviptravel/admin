import mongoose from 'mongoose';

const HistorySchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    note: { type: String, default: '' },
    state: { type: String, enum: ['done', 'now', 'fail'], default: 'done' },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    ref: { type: String, required: true, unique: true }, // e.g. UT-482137
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    personalId: { type: String, default: '' },
    tour: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
    people: { type: Number, required: true, min: 1 },
    total: { type: Number, required: true },
    method: { type: String, enum: ['card', 'split', 'later'], required: true },
    status: { type: String, enum: ['paid', 'pending', 'failed', 'refunded'], default: 'pending' },
    bank: { type: String, default: '' }, // for installments
    months: { type: Number, default: 0 }, // for installments
    history: { type: [HistorySchema], default: [] },
  },
  { timestamps: true }
);

OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ status: 1 });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
