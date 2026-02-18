"use client";

import { Button } from "@/components/ui/button";
import { Shield, Trash2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function UserTable({ users, handleDelete }) {
    if (!users) {
        return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
    }

    if (users.length === 0) {
        return <div className="p-8 text-center text-muted-foreground">No users found.</div>;
    }

    return (
        <div className="rounded-md border bg-card text-card-foreground shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground border-b">
                        <tr>
                            <th className="px-4 py-3 font-medium">Name</th>
                            <th className="px-4 py-3 font-medium">Email</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium">Created At</th>
                            <th className="px-4 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {users.map((user) => (
                            <tr
                                key={user._id}
                                className="hover:bg-muted/50 transition-colors"
                            >
                                <td className="px-4 py-3 font-medium flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-primary" />
                                    {user.name}
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">
                                    {user.email}
                                </td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${user.active ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}
                                    >
                                        {user.active ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete Admin User?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently remove <b>{user.name}</b> from the system.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(user._id)} className="bg-red-600 hover:bg-red-700 text-white">Delete User</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
