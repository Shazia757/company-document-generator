import { NextResponse } from "next/server";

export default function middleware() {
    return new NextResponse("MIDDLEWARE WORKS");
}

export const config = {
    matcher: ["/"],
};