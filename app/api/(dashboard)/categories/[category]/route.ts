import { connect } from "@/lib/connectMongoDB";
import Category from "@/models/category.model";
import User from "@/models/user.model";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

connect();

export const PATCH = async (request: Request, context: { params: any }) => {
  const categoryId = context.params.category;

  try {
    const body = await request.json();
    const { title } = body;

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400 }
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing categoryId" }),
        { status: 400 }
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User Not Found!" }), {
        status: 404,
      });
    }

    const category = await Category.findOne({ _id: categoryId, user: userId });

    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found!" }),
        { status: 400 }
      );
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      {
        title,
      },
      { new: true }
    );

    return new NextResponse(
      JSON.stringify({
        message: "Category updated Success!",
        category: updatedCategory,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error.message);

    return new NextResponse(
      JSON.stringify({ message: "Error in updating category" }),
      {
        status: 500,
      }
    );
  }
};

export const DELETE = async (request: Request, context: { params: any }) => {
  const categoryId = context.params.category;

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400 }
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing categoryId" }),
        { status: 400 }
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User Not Found!" }), {
        status: 404,
      });
    }

    const category = await Category.findOne({ _id: categoryId, user: userId });

    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found!" }),
        { status: 400 }
      );
    }

    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    return new NextResponse(
      JSON.stringify({
        message: "Category deleted Success!",
        category: deletedCategory,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Error in deleting category" }),
      {
        status: 500,
      }
    );
  }
};
