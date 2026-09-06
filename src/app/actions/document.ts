"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type SaveDocumentInput = {
    templateId: string;
    templateName: string;
    data: unknown;
};

export async function saveDocument(input: SaveDocumentInput) {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    console.log("Saving document for user:", session.user.id);

    const document = await prisma.document.create({
        data: {
            templateId: input.templateId,
            templateName: input.templateName,
            data: input.data as object,
            createdById: session.user.id,
        },
    });

    console.log("Document saved:", document.id);

    return {
        id: document.id,
        createdAt: document.createdAt,
    };
}