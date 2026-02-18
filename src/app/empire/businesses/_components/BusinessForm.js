"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash, Save, Loader2, Link as LinkIcon, MapPin } from "lucide-react";
import { toast } from "react-hot-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const THEME_COLORS = [
    { name: "zinc", class: "bg-zinc-500" },
    { name: "red", class: "bg-red-500" },
    { name: "rose", class: "bg-rose-500" },
    { name: "orange", class: "bg-orange-500" },
    { name: "green", class: "bg-green-500" },
    { name: "blue", class: "bg-blue-500" },
    { name: "yellow", class: "bg-yellow-500" },
    { name: "violet", class: "bg-violet-500" },
];

export default function BusinessForm({ initialData = null, onSuccess }) {
    const createBusiness = useMutation(api.businesses.create);
    const updateBusiness = useMutation(api.businesses.update);

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(
        initialData || {
            name: "",
            slug: "",
            location: { lat: 0, lng: 0 },
            type: [""],
            googleLink: "",
            reviewPageLink: "",
            questions: [{ question: "", answers: [""] }],
            colorScheme: "zinc",
        }
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const updates = { ...prev, [name]: value };

            // Auto-slug logic
            if (name === "name" && !initialData) {
                updates.slug = value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
            }

            // Lat/Lng extraction from Google Link
            if (name === "googleLink") {
                const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
                const match = value.match(regex);
                if (match) {
                    updates.location = {
                        lat: parseFloat(match[1]),
                        lng: parseFloat(match[2])
                    };
                    toast.success("Location extracted from link!");
                }
            }

            return updates;
        });
    };

    const handleLocationChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            location: { ...prev.location, [name]: parseFloat(value) || 0 },
        }));
    };

    const addType = () => setFormData((prev) => ({ ...prev, type: [...prev.type, ""] }));
    const removeType = (index) => setFormData((prev) => ({ ...prev, type: prev.type.filter((_, i) => i !== index) }));
    const handleTypeChange = (index, value) => {
        const newTypes = [...formData.type];
        newTypes[index] = value;
        setFormData((prev) => ({ ...prev, type: newTypes }));
    };

    const addQuestion = () => setFormData((prev) => ({ ...prev, questions: [...prev.questions, { question: "", answers: [""] }] }));
    const removeQuestion = (index) => setFormData((prev) => ({ ...prev, questions: prev.questions.filter((_, i) => i !== index) }));
    const handleQuestionChange = (index, value) => {
        const newQuestions = [...formData.questions];
        newQuestions[index].question = value;
        setFormData((prev) => ({ ...prev, questions: newQuestions }));
    };

    const addAnswer = (qIndex) => {
        const newQuestions = [...formData.questions];
        newQuestions[qIndex].answers.push("");
        setFormData((prev) => ({ ...prev, questions: newQuestions }));
    };
    const removeAnswer = (qIndex, aIndex) => {
        const newQuestions = [...formData.questions];
        newQuestions[qIndex].answers = newQuestions[qIndex].answers.filter((_, i) => i !== aIndex);
        setFormData((prev) => ({ ...prev, questions: newQuestions }));
    };
    const handleAnswerChange = (qIndex, aIndex, value) => {
        const newQuestions = [...formData.questions];
        newQuestions[qIndex].answers[aIndex] = value;
        setFormData((prev) => ({ ...prev, questions: newQuestions }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.slug) {
            toast.error("Name and Slug are required.");
            return;
        }
        setLoading(true);

        try {
            if (initialData) {
                const { _id, _creationTime, uniqueID, createdAt, updatedAt, ...updates } = formData;
                await updateBusiness({ id: initialData._id, updates });
                toast.success("Business updated!");
            } else {
                await createBusiness(formData);
                toast.success("Business created!");
            }
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error(error);
            toast.error("Operation failed. Slug might be taken.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Business Name</Label>
                    <Input name="name" value={formData.name} onChange={handleChange} required placeholder="My Business" />
                </div>
                <div className="space-y-2">
                    <Label>Slug (URL)</Label>
                    <Input name="slug" value={formData.slug} onChange={handleChange} required placeholder="my-business" />
                    <p className="text-xs text-muted-foreground">Auto-generated from name.</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Google Maps Link</Label>
                    <div className="relative">
                        <LinkIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-8" name="googleLink" value={formData.googleLink || ""} onChange={handleChange} placeholder="https://maps.google.com/..." />
                    </div>
                    <p className="text-xs text-muted-foreground">Paste link to extract Lat/Lng.</p>
                </div>
                <div className="space-y-2">
                    <Label>Rating Page Link</Label>
                    <Input name="reviewPageLink" value={formData.reviewPageLink || ""} onChange={handleChange} placeholder="Optional" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Latitude</Label>
                    <Input type="number" step="any" name="lat" value={formData.location.lat} onChange={handleLocationChange} />
                </div>
                <div className="space-y-2">
                    <Label>Longitude</Label>
                    <Input type="number" step="any" name="lng" value={formData.location.lng} onChange={handleLocationChange} />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Color Scheme</Label>
                <Select
                    value={formData.colorScheme}
                    onValueChange={(val) => setFormData(prev => ({ ...prev, colorScheme: val }))}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select a color" />
                    </SelectTrigger>
                    <SelectContent>
                        {THEME_COLORS.map(color => (
                            <SelectItem key={color.name} value={color.name}>
                                <div className="flex items-center gap-2">
                                    <div className={`h-3 w-8 rounded-full ${color.class}`} />
                                    <span className="capitalize">{color.name}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Categories</Label>
                {formData.type.map((t, i) => (
                    <div key={i} className="flex gap-2">
                        <Input value={t} onChange={(e) => handleTypeChange(i, e.target.value)} placeholder="e.g. Restaurant" />
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeType(i)}><Trash className="w-4 h-4" /></Button>
                    </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addType}><Plus className="w-4 h-4 mr-2" /> Add Category</Button>
            </div>

            <div className="space-y-4 border p-4 rounded-md bg-muted/20">
                <Label className="text-lg font-semibold">AI Questions</Label>
                {formData.questions.map((q, qIndex) => (
                    <div key={qIndex} className="space-y-2 p-4 border rounded-md bg-background">
                        <div className="flex gap-2 items-end">
                            <div className="flex-1 space-y-1">
                                <Label>Question {qIndex + 1}</Label>
                                <Input value={q.question} onChange={(e) => handleQuestionChange(qIndex, e.target.value)} placeholder="e.g. How was the food?" />
                            </div>
                            <Button type="button" variant="destructive" size="icon" onClick={() => removeQuestion(qIndex)}><Trash className="w-4 h-4" /></Button>
                        </div>

                        <div className="ml-4 space-y-2 border-l-2 pl-4 mt-2">
                            <Label className="text-xs text-muted-foreground">Answers (Options)</Label>
                            {q.answers.map((a, aIndex) => (
                                <div key={aIndex} className="flex gap-2">
                                    <Input className="h-8 text-sm" value={a} onChange={(e) => handleAnswerChange(qIndex, aIndex, e.target.value)} placeholder="Answer option" />
                                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeAnswer(qIndex, aIndex)}><Trash className="w-3 h-3" /></Button>
                                </div>
                            ))}
                            <Button type="button" variant="link" size="sm" onClick={() => addAnswer(qIndex)} className="text-xs h-6 p-0"><Plus className="w-3 h-3 mr-1" /> Add Answer Option</Button>
                        </div>
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={addQuestion} className="w-full"><Plus className="w-4 h-4 mr-2" /> Add Question</Button>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {initialData ? "Update Business" : "Create Business"}
            </Button>
        </form>
    );
}
