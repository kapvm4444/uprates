import BusinessForm from "../_components/BusinessForm";

export default function NewBusinessPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Add New Business</h1>
            <BusinessForm />
        </div>
    );
}
