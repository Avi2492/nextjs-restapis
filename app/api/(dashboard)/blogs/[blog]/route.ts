import { connect } from "@/lib/connectMongoDB";
import Blog from "@/models/blog.model";
import Category from "@/models/category.model";
import User from "@/models/user.model";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

connect();

export const GET = async (request: Request, context: { params: any }) => {
  const blogId = context.params.blog;

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        {
          status: 400,
        }
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing categoryId" }),
        {
          status: 400,
        }
      );
    }

    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing blogId" }),
        {
          status: 400,
        }
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found!" }), {
        status: 404,
      });
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found!" }),
        {
          status: 400,
        }
      );
    }

    const blog = await Blog.findOne({
      _id: blogId,
      user: userId,
      category: categoryId,
    });

    if (!blog) {
      return new NextResponse(JSON.stringify({ message: "Blog not found!" }), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify({ blog }), {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse("Error in fetching blogs" + error.message, {
      status: 500,
    });
  }
};

export const PATCH = async (request: Request, context: { params: any }) => {
  const blogId = context.params.blog;

  try {
    const body = await request.json();
    const { title, description } = body;

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        {
          status: 400,
        }
      );
    }

    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing blogId" }),
        {
          status: 400,
        }
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found!" }), {
        status: 404,
      });
    }

    const blog = await Blog.findOne({
      _id: blogId,
      user: userId,
    });

    if (!blog) {
      return new NextResponse(JSON.stringify({ message: "Blog not found!" }), {
        status: 404,
      });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { title, description },
      { new: true }
    );

    return new NextResponse(JSON.stringify({ blog: updatedBlog }), {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse("Error in updating blogs" + error.message, {
      status: 500,
    });
  }
};

export const DELETE = async (request: Request, context: { params: any }) => {
  const blogId = context.params.blog;

  try {
    const { searchParams } = new URL(request.url);

    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        {
          status: 400,
        }
      );
    }

    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing blogId" }),
        {
          status: 400,
        }
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found!" }), {
        status: 404,
      });
    }

    const blog = await Blog.findOne({
      _id: blogId,
      user: userId,
    });

    if (!blog) {
      return new NextResponse(JSON.stringify({ message: "Blog not found!" }), {
        status: 404,
      });
    }

    await Blog.findByIdAndDelete(blogId);

    return new NextResponse(
      JSON.stringify({ message: "Blog is Deleted Successfull" }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return new NextResponse("Error in deleting blogs" + error.message, {
      status: 500,
    });
  }
};
