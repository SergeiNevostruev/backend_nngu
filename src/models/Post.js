import mongoose, { Schema } from 'mongoose';

const PostSchema = new Schema(
  {
    header: {
      type: String,
      required: true,
      minlength: 4,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      minlength: 4,
    },
    authorId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Post', PostSchema);
