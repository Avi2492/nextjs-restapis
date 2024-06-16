import { Schema, model, models } from "mongoose";

const BlogsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    descriptiom: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  {
    timestamps: true,
  }
);

const Blog = models.Blog || model("Blog", BlogsSchema);
export default Blog;
