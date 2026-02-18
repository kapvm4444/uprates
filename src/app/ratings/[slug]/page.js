"use client";

import { useParams } from "next/navigation";
import { useQuery, useAction } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { toast, Toaster } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LiveBackground from "@/components/live-background";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import StepQuestions from "./_components/StepQuestions";
import StepOptions from "./_components/StepOptions";
import StepInstructions from "./_components/StepInstructions";

export default function RatingPage() {
  const { slug } = useParams();
  const business = useQuery(api.businesses.getBySlug, slug ? { slug } : "skip");
  const generateReviews = useAction(api.openai.generateReviewOptions);

  const [answers, setAnswers] = useState({});
  const [customAnswers, setCustomAnswers] = useState({});
  const [generatedOptions, setGeneratedOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Questions, 2: Selection, 3: Instructions

  // Check for existing session
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cached = sessionStorage.getItem(`uprate_generated_${slug}`);
      if (cached) {
        setGeneratedOptions(JSON.parse(cached));
        setStep(2);
      }
    }
  }, [slug]);

  if (business === undefined) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (business === null) return <div className="flex h-screen items-center justify-center text-red-500">Business not found</div>;

  const colorScheme = business.colorScheme || "zinc";

  // Dynamic Styles based on Color Scheme
  const getThemeStyles = () => {
    const styles = {
      zinc: { border: "border-zinc-500", ring: "focus:ring-zinc-500", btn: "bg-zinc-600 hover:bg-zinc-700", text: "text-zinc-600" },
      red: { border: "border-red-500", ring: "focus:ring-red-500", btn: "bg-red-600 hover:bg-red-700", text: "text-red-600" },
      rose: { border: "border-rose-500", ring: "focus:ring-rose-500", btn: "bg-rose-600 hover:bg-rose-700", text: "text-rose-600" },
      orange: { border: "border-orange-500", ring: "focus:ring-orange-500", btn: "bg-orange-600 hover:bg-orange-700", text: "text-orange-600" },
      green: { border: "border-green-500", ring: "focus:ring-green-500", btn: "bg-green-600 hover:bg-green-700", text: "text-green-600" },
      blue: { border: "border-blue-500", ring: "focus:ring-blue-500", btn: "bg-blue-600 hover:bg-blue-700", text: "text-blue-600" },
      yellow: { border: "border-yellow-500", ring: "focus:ring-yellow-500", btn: "bg-yellow-600 hover:bg-yellow-700", text: "text-yellow-600" },
      violet: { border: "border-violet-500", ring: "focus:ring-violet-500", btn: "bg-violet-600 hover:bg-violet-700", text: "text-violet-600" },
    };
    return styles[colorScheme] || styles.zinc;
  };

  const themeStyle = getThemeStyles();

  const handleAnswerChange = (idx, val) => {
    setAnswers(prev => ({ ...prev, [idx]: val }));
    if (val !== "Other") {
      setCustomAnswers(prev => {
        const newState = { ...prev };
        delete newState[idx];
        return newState;
      });
    }
  };

  const handleCustomAnswerChange = (idx, val) => {
    setCustomAnswers(prev => ({ ...prev, [idx]: val }));
  };

  const handleGenerate = async () => {
    // Validate answers
    if (business.questions.length > 0 && Object.keys(answers).length < business.questions.length) {
      toast.error("Please answer all questions");
      return;
    }

    // Check custom answers if "Other" selected
    for (const [key, value] of Object.entries(answers)) {
      if (value === "Other" && !customAnswers[key]?.trim()) {
        toast.error("Please specify your answer for 'Other'");
        return;
      }
    }

    setLoading(true);
    setStep(2); // Move to Skeleton view immediately

    try {
      const formattedAnswers = business.questions.map((q, idx) => ({
        question: q.question,
        answer: answers[idx] === "Other" ? customAnswers[idx] : answers[idx]
      }));

      const result = await generateReviews({
        businessName: business.name,
        businessType: business.type[0] || "business",
        answers: formattedAnswers
      });

      setGeneratedOptions(result);
      sessionStorage.setItem(`uprate_generated_${slug}`, JSON.stringify(result));
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate reviews");
      setStep(1); // Revert on failure
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (text, index) => {
    navigator.clipboard.writeText(text);
    toast.success("Review copied to clipboard!");
    setStep(3); // Go to instructions
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden" style={{ fontFamily: "var(--font-proxima)" }}>
      {/* Dark Mode Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ModeToggle />
      </div>

      <LiveBackground theme={colorScheme} />

      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: 'var(--background)',
            color: 'var(--foreground)',
            border: `1px solid ${themeStyle.border.replace('border-', 'var(--')})`,
          },
          className: cn(
            "border shadow-lg backdrop-blur-md",
            themeStyle.border
          ),
          success: {
            iconTheme: {
              primary: 'green', // Fallback
              secondary: 'white',
            },
          },
        }}
      />

      <div className="relative z-10 w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 space-y-2"
        >
          <h1 className={`text-5xl font-extrabold tracking-tight ${themeStyle.text} drop-shadow-sm`} style={{ fontFamily: "var(--font-gotham)" }}>
            {business.name}
          </h1>
          <p className="text-muted-foreground text-lg font-medium">We value your feedback!</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <StepQuestions
              business={business}
              themeStyle={themeStyle}
              answers={answers}
              customAnswers={customAnswers}
              handleAnswerChange={handleAnswerChange}
              handleCustomAnswerChange={handleCustomAnswerChange}
              handleGenerate={handleGenerate}
              loading={loading}
            />
          )}

          {step === 2 && (
            <StepOptions
              themeStyle={themeStyle}
              loading={loading}
              generatedOptions={generatedOptions}
              handleSelectOption={handleSelectOption}
            />
          )}

          {step === 3 && (
            <StepInstructions
              business={business}
              themeStyle={themeStyle}
              setStep={setStep}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
