"use client";

import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { UploadForm } from "@/components/upload/upload-form";

export default function UploadPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  
  if (!isLoaded) {
    return null; // Or a loading spinner
  }
  
  if (!isSignedIn) {
    redirect("/sign-in");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Upload Recording</h1>
      <UploadForm />
    </div>
  );
}