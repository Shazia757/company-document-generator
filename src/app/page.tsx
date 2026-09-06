import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import DocumentGenerator from "./DocumentGenerator";

export default async function Page() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const documents = await prisma.document.findMany({
    where: {
      createdById: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const history = documents.map((document) => ({
    id: document.id,
    templateId: document.templateId,
    templateName: document.templateName,
    data: document.data as Record<string, string>,
    createdAt: document.createdAt.toISOString(),
  }));

  return <DocumentGenerator initialDocuments={history} />;
}