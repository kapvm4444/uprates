"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import BusinessForm from "../_components/BusinessForm";
import { useParams } from "next/navigation";

export default function EditBusinessPage() {
    const params = useParams();
    const business = useQuery(api.businesses.get, { id: params.id });

    if (business === undefined) {
        return <div>Loading...</div>;
    }

    if (business === null) {
        return <div>Business not found</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Edit Business: {business.name}</h1>
            <BusinessForm initialData={business} />
        </div>
    );
}
