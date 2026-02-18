"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Search } from "lucide-react";
import BusinessForm from "./_components/BusinessForm";
import BusinessTable from "./_components/BusinessTable";
import { toast } from "react-hot-toast";

export default function BusinessesPage() {
  const businesses = useQuery(api.businesses.list);
  const deleteBusiness = useMutation(api.businesses.remove);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("list"); // 'list', 'create', 'edit', 'view'

  const filteredBusinesses = businesses?.filter(
    (b) =>
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.slug.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const confirmDelete = (id) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteBusiness({ id: deleteId });
      toast.success("Business deleted");
      setIsDeleteOpen(false);
    } catch (err) {
      toast.error("Failed to delete business");
    }
  };

  const openCreate = () => {
    setSelectedBusiness(null);
    setViewMode("create");
    setIsModalOpen(true);
  };

  const openEdit = (business) => {
    setSelectedBusiness(business);
    setViewMode("edit");
    setIsModalOpen(true);
  };

  const openView = (business) => {
    setSelectedBusiness(business);
    setViewMode("view");
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Businesses</h1>
          <p className="text-muted-foreground">Manage your client portfolio.</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search businesses..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        </div>
      </div>

      <BusinessTable
        filteredBusinesses={filteredBusinesses}
        openView={openView}
        openEdit={openEdit}
        confirmDelete={confirmDelete}
      />

      {/* Delete Confirmation Alert */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the business and remove all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Delete Business
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Floating Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {viewMode === "create" && "Add New Business"}
              {viewMode === "edit" && "Edit Business"}
              {viewMode === "view" && "Business Details"}
            </DialogTitle>
            <DialogDescription>
              {viewMode === "view"
                ? "Detailed information about the business."
                : "Fill in the details below."}
            </DialogDescription>
          </DialogHeader>

          {viewMode === "view" && selectedBusiness ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold text-sm text-muted-foreground">
                    Name
                  </span>
                  <p className="text-lg font-medium">{selectedBusiness.name}</p>
                </div>
                <div>
                  <span className="font-semibold text-sm text-muted-foreground">
                    Slug
                  </span>
                  <p className="font-mono bg-muted px-2 py-1 rounded w-fit">
                    {selectedBusiness.slug}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold text-sm text-muted-foreground">
                    Location
                  </span>
                  <p>
                    {selectedBusiness.location.lat},{" "}
                    {selectedBusiness.location.lng}
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-sm text-muted-foreground">
                    Theme
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`h-4 w-8 rounded-full bg-${selectedBusiness.colorScheme}-500`}
                    />
                    <span className="capitalize">
                      {selectedBusiness.colorScheme}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <span className="font-semibold text-sm text-muted-foreground">
                  Google Link
                </span>
                <p className="text-sm truncate text-blue-500 underline">
                  {selectedBusiness.googleLink || "N/A"}
                </p>
              </div>
              <div>
                <span className="font-semibold text-sm text-muted-foreground">
                  Questions
                </span>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  {selectedBusiness.questions.map((q, i) => (
                    <li key={i}>
                      <span className="font-medium">{q.question}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({q.answers.join(", ")})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <BusinessForm
              initialData={selectedBusiness}
              onSuccess={() => setIsModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
