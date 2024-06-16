import { connect } from "@/lib/connectMongoDB";
import Category from "@/models/category.model";
import User from "@/models/user.model";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

connect();

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse("Invalid or missing userId", { status: 400 });
    }

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse("User not found in DB!", { status: 400 });
    }

    const categories = await Category.find({
      user: new Types.ObjectId(userId),
    });

    return new NextResponse(JSON.stringify(categories), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error in The Category Get request", {
      status: 500,
    });
  }
};

export const POST = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const { title } = await request.json();

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400 }
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse("User not found in DB!", { status: 404 });
    }

    const newCategory = new Category({
      title,
      user: new Types.ObjectId(userId),
    });

    await newCategory.save();

    return new NextResponse(
      JSON.stringify({
        message: "Category is created in DB!",
        category: newCategory,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error.message);

    return new NextResponse("Error in The Category POST request", {
      status: 500,
    });
  }
};
