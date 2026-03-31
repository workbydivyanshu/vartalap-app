import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  content: string;
  author: mongoose.Types.ObjectId;
  channel?: mongoose.Types.ObjectId;
  dmConversation?: mongoose.Types.ObjectId;
  attachments?: string[];
  reactions?: { emoji: string; users: mongoose.Types.ObjectId[] }[];
  replyTo?: mongoose.Types.ObjectId;
  editedAt?: Date;
  pinned?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    content: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    channel: {
      type: Schema.Types.ObjectId,
      ref: 'Channel',
    },
    dmConversation: {
      type: Schema.Types.ObjectId,
      ref: 'DMConversation',
    },
    attachments: [{ type: String }],
    reactions: [{
      emoji: String,
      users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    }],
    replyTo: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },
    editedAt: { type: Date },
    pinned: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

messageSchema.index({ channel: 1, createdAt: -1 });
messageSchema.index({ dmConversation: 1, createdAt: -1 });

export const Message = mongoose.model<IMessage>('Message', messageSchema);
