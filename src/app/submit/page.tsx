import type { Metadata } from "next";
import { NewLocationForm } from "@/components/submit/NewLocationForm";

export const metadata: Metadata = {
  title: "Submit a Service",
};

export default function SubmitPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <h1 className="text-2xl font-bold">Submit a new service</h1>
      <p className="mt-2 text-muted-foreground">
        Know a place that offers free meals in Perth? Help others find it by
        sharing the details below. We will review your submission before it
        goes live.
      </p>
      <NewLocationForm />
    </div>
  );
}
