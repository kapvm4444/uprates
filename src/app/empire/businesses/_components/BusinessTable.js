"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye, Pencil, Trash2, ExternalLink } from "lucide-react";

export default function BusinessTable({
    filteredBusinesses,
    openView,
    openEdit,
    confirmDelete
}) {
    // Basic loading state handling if null/undefined
    if (!filteredBusinesses) {
        return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
    }

    if (filteredBusinesses.length === 0) {
        return <div className="p-8 text-center text-muted-foreground">No businesses found.</div>;
    }

    return (
        <div className="rounded-md border bg-card text-card-foreground shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground border-b">
                        <tr>
                            <th className="px-4 py-3 font-medium">Name</th>
                            <th className="px-4 py-3 font-medium">Slug</th>
                            <th className="px-4 py-3 font-medium">Categories</th>
                            <th className="px-4 py-3 font-medium">Location</th>
                            <th className="px-4 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filteredBusinesses.map((business) => (
                            <tr
                                key={business._id}
                                className="hover:bg-muted/50 transition-colors"
                            >
                                <td className="px-4 py-3 font-medium">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`h-2 w-2 rounded-full bg-${business.colorScheme}-500`}
                                        />
                                        {business.name}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">
                                    {business.slug}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex flex-wrap gap-1">
                                        {business.type.map((t, i) => (
                                            <span
                                                key={i}
                                                className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs"
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                                    {business.location.lat.toFixed(4)},{" "}
                                    {business.location.lng.toFixed(4)}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => openView(business)}
                                            title="View Details"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => openEdit(business)}
                                            title="Edit"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => confirmDelete(business._id)}
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <Link
                                            href={`/ratings/${business.slug}`}
                                            target="_blank"
                                        >
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                title="Open Public Page"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
