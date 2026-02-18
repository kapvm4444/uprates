"use client";

import { useState } from "react";
import { useQuery, useAction, useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import UserTable from "./_components/UserTable";

export default function UsersPage() {
  const users = useQuery(api.users.list);
  const createUser = useAction(api.users.create);
  const removeUser = useMutation(api.users.remove);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    active: true,
  });
  const [loading, setLoading] = useState(false);

  const handleDelete = async (userId) => {
    try {
      await removeUser({ id: userId });
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error("Failed to delete user");
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createUser(formData);
      toast.success("User created successfully");
      setFormData({ name: "", email: "", password: "", active: true });
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to create user. Email might be taken.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Users</h1>
          <p className="text-muted-foreground">
            Manage system access and permissions.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Admin
        </Button>
      </div>

      <UserTable users={users} handleDelete={handleDelete} />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Admin</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                placeholder="••••••••"
                minLength={6}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) =>
                  setFormData({ ...formData, active: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="active">Active Account</Label>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Admin"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
