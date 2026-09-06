"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

type SignUpResult =
    | { success: true }
    | { success: false; error: string };

export async function signUp(
    name: string,
    email: string,
    password: string
): Promise<SignUpResult> {
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedName || !normalizedEmail || !password) {
        return {
            success: false,
            error: "Please fill in all fields.",
        };
    }

    if (normalizedName.length < 2) {
        return {
            success: false,
            error: "Name must be at least 2 characters.",
        };
    }

    if (password.length < 8) {
        return {
            success: false,
            error: "Password must be at least 8 characters.",
        };
    }

    const existingUser = await prisma.user.findUnique({
        where: {
            email: normalizedEmail,
        },
    });

    if (existingUser) {
        return {
            success: false,
            error: "An account with this email already exists.",
        };
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.create({
        data: {
            name: normalizedName,
            email: normalizedEmail,
            passwordHash,
        },
    });

    return {
        success: true,
    };
}