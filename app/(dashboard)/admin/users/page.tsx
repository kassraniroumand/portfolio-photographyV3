"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useCreateUserMutation,
  useListUsersQuery,
  useSetUserRoleMutation,
} from "@/lib/store/api";

export default function UsersPage() {
  const { data: users = [], isLoading } = useListUsersQuery();
  const [createUser, { isLoading: creating }] = useCreateUserMutation();
  const [setUserRole] = useSetUserRoleMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    try {
      await createUser({ name: name.trim(), email: email.trim() }).unwrap();
      setName("");
      setEmail("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create user");
    }
  }

  return (
    <div>
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Users
        </h1>
        <p className="text-sm text-muted-foreground">
          {isLoading
            ? "Loading…"
            : `${users.length} ${users.length === 1 ? "user" : "users"}`}
        </p>
      </header>

      <Card size="sm">
        <CardHeader>
          <CardTitle>Add user</CardTitle>
          <CardDescription>
            Create a user shell. They&apos;ll need to set a password to sign in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleCreate}
            className="flex flex-col gap-3 sm:flex-row sm:items-end"
          >
            <div className="flex flex-1 flex-col gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={creating}
              />
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={creating}
              />
            </div>
            <Button type="submit" disabled={creating}>
              {creating ? "Adding…" : "Add user"}
            </Button>
          </form>
          {error && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
        </CardContent>
      </Card>

      <Card size="sm">
        {users.length === 0 ? (
          <CardContent>
            <p className="text-sm text-muted-foreground">No users yet.</p>
          </CardContent>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.role ?? "user"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setUserRole({
                          id: user.id,
                          role: user.role === "admin" ? "user" : "admin",
                        })
                      }
                    >
                      {user.role === "admin" ? "Demote" : "Promote"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
