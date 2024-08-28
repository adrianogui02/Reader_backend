import mongoose, { Schema, Document } from 'mongoose';

interface IMeasure extends Document {
  customer_code: string;
  measure_datetime: Date;
  measure_type: 'WATER' | 'GAS';
  measure_value: number;
  measure_uuid: string;
  image_url: string;
  has_confirmed: boolean;
}

const MeasureSchema: Schema = new Schema({
  customer_code: { type: String, required: true },
  measure_datetime: { type: Date, required: true },
  measure_type: { type: String, enum: ['WATER', 'GAS'], required: true },
  measure_value: { type: Number, required: true },
  measure_uuid: { type: String, required: true, unique: true },
  image_url: { type: String, required: true },
  has_confirmed: { type: Boolean, default: false },
});

export default mongoose.model<IMeasure>('Measure', MeasureSchema);
