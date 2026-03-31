import mongoose, { Document, Schema } from 'mongoose';

export interface IDMConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const dmConversationSchema = new Schema<IDMConversation>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

dmConversationSchema.index({ participants: 1 });

export const DMConversation = mongoose.model<IDMConversation>(
  'DMConversation',
  dmConversationSchema
);
