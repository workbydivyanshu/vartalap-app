import mongoose, { Document, Schema } from 'mongoose';

export interface IServer extends Document {
  name: string;
  icon?: string;
  owner: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  channels: mongoose.Types.ObjectId[];
  inviteCode: string;
  createdAt: Date;
  updatedAt: Date;
}

const serverSchema = new Schema<IServer>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    icon: {
      type: String,
      default: '',
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    channels: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Channel',
      },
    ],
    inviteCode: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

serverSchema.pre('save', function (next) {
  if (!this.inviteCode) {
    this.inviteCode = generateInviteCode();
  }
  next();
});

export const Server = mongoose.model<IServer>('Server', serverSchema);
