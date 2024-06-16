import { connect } from "@/lib/connectMongoDB";
import { NextResponse } from "next/server";

connect();

export const GET = async (request: Request) => {
  try {
  } catch (error: any) {
    return new NextResponse("Error in The Blogs Get request", {
      status: 500,
    });
  }
};
