import mongoose, { Document, Schema } from 'mongoose';

export interface IChannel extends Document {
  name: string;
  type: 'text' | 'voice';
  server: mongoose.Types.ObjectId;
  topic?: string;
  createdAt: Date;
  updatedAt: Date;
}

const channelSchema = new Schema<IChannel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    type: {
      type: String,
      enum: ['text', 'voice'],
      default: 'text',
    },
    server: {
      type: Schema.Types.ObjectId,
      ref: 'Server',
      required: true,
    },
    topic: {
      type: String,
      default: '',
      maxlength: 1024,
    },
  },
  {
    timestamps: true,
  }
);

export const Channel = mongoose.model<IChannel>('Channel', channelSchema);
