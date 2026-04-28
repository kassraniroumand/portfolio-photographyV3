import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/todos/[id]">) {
  const { id } = await ctx.params;
  const todo = await prisma.todo.findUnique({ where: { id } });

  if (!todo) {
    return Response.json({ error: "not found" }, { status: 404 });
  }

  return Response.json(todo);
}

export async function PATCH(req: NextRequest, ctx: RouteContext<"/api/todos/[id]">) {
  const { id } = await ctx.params;
  const body = await req.json();

  const data: { title?: string; completed?: boolean } = {};
  if (typeof body?.title === "string") data.title = body.title.trim();
  if (typeof body?.completed === "boolean") data.completed = body.completed;

  const todo = await prisma.todo.update({ where: { id }, data });
  return Response.json(todo);
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<"/api/todos/[id]">) {
  const { id } = await ctx.params;
  await prisma.todo.delete({ where: { id } });
  return new Response(null, { status: 204 });
}