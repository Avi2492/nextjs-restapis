import { connect } from "@/lib/connectMongoDB";
import Blog from "@/models/blog.model";
import Category from "@/models/category.model";
import User from "@/models/user.model";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

connect();

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const categoryId = searchParams.get("categoryId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse("Invalid or missing userId", { status: 400 });
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse("Invalid or missing categoryId", { status: 400 });
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

    const filter: any = {
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId),
    };

    const blogs = await Blog.find(filter);

    return new NextResponse(JSON.stringify({ blogs }), {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse("Error in The Blogs Get request", {
      status: 500,
    });
  }
};

export const POST = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    const body = await request.json();
    const { title, description } = body;

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse("Invalid or missing userId", { status: 400 });
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse("Invalid or missing categoryId", { status: 400 });
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

    const newBlog = new Blog({
      title,
      description,
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId),
    });

    await newBlog.save();

    return new NextResponse(
      JSON.stringify({ message: "Blog is Created!", blog: newBlog }),
      { status: 200 }
    );
  } catch (error: any) {
    // console.log(error.message);

    return new NextResponse("Error in The Blogs Post request", {
      status: 500,
    });
  }
};
