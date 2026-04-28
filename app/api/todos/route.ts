import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const todos = await prisma.todo.findMany({
    orderBy: { createdAt: "desc" },
  });
  return Response.json(todos);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const title = typeof body?.title === "string" ? body.title.trim() : "";

  if (!title) {
    return Response.json({ error: "title is required" }, { status: 400 });
  }

  const todo = await prisma.todo.create({
    data: { title },
  });

  return Response.json(todo, { status: 201 });
}