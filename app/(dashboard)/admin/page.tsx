"use client";

import { useSession } from "@/lib/auth-client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useListUsersQuery } from "@/lib/store/api";

export default function AdminPage() {
  const { data: session } = useSession();
  const { data: users } = useListUsersQuery();

  return (
    <div>
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Admin
        </h1>
        <p className="text-sm text-muted-foreground">
          Signed in as{" "}
          <span className="text-foreground">{session?.user.email}</span>
          {session?.user.role ? ` (${session.user.role})` : ""}.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <Card size="sm">
          <CardHeader>
            <CardDescription>Users</CardDescription>
            <CardTitle className="text-2xl">
              {users?.length ?? "—"}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>Sessions</CardDescription>
            <CardTitle className="text-2xl">—</CardTitle>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription>Todos</CardDescription>
            <CardTitle className="text-2xl">—</CardTitle>
          </CardHeader>
        </Card>
      </section>
    </div>
  );
}
