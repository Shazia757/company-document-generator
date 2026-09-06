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

export async function getDocuments() {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const documents = await prisma.document.findMany({
        where: {
            createdById: session.user.id,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return documents;
}

export async function deleteDocument(documentId: string) {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const document = await prisma.document.findFirst({
        where: {
            id: documentId,
            createdById: session.user.id,
        },
    });

    if (!document) {
        throw new Error("Document not found");
    }

    await prisma.document.delete({
        where: {
            id: document.id,
        },
    });

    return {
        success: true,
    };
}