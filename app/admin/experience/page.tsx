"use client";
import { Briefcase } from "lucide-react";
import { TimelinePage } from "@/components/admin/TimelinePage";

export default function ExperiencePage() {
  return (
    <TimelinePage
      endpoint="experience"
      title="Experience"
      icon={Briefcase}
      emptyDescription="Add freelance work, academic projects, or open source contributions."
    />
  );
}
