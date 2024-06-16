import { connect } from "@/lib/connectMongoDB";
import User from "@/models/user.model";
import { Types } from "mongoose";

import { NextResponse } from "next/server";

connect();

const ObjectId = require("mongoose").Types.ObjectId;

export const GET = async () => {
  try {
    const users = await User.find();

    return new NextResponse(JSON.stringify(users), {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse("Error in Fetching Users API" + error, {
      status: 500,
    });
  }
};

// SignUp API
export const POST = async (request: Request) => {
  try {
    const body = await request.json();

    const newUser = await new User(body);

    await newUser.save();

    return new NextResponse(
      JSON.stringify({ message: "User is created Success!", newUser }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return new NextResponse("Error in Post Users API" + error, {
      status: 500,
    });
  }
};

// Update User
export const PATCH = async (request: Request) => {
  try {
    const body = await request.json();

    const { userId, newUsername } = body;

    if (!userId || !newUsername) {
      return new NextResponse(
        JSON.stringify({ message: "ID or new username not found!" }),
        {
          status: 400,
        }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse("Invalid userId", {
        status: 500,
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      {
        _id: new ObjectId(userId),
      },
      {
        username: newUsername,
      },
      {
        new: true,
      }
    );

    if (!updatedUser) {
      return new NextResponse(
        JSON.stringify({ message: "User is not found in DB!" }),
        { status: 400 }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "User is Updated!", user: updatedUser }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error in PATCH Users API" + error, {
      status: 500,
    });
  }
};
