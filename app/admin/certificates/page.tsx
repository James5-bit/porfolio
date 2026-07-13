"use client";
import { Award } from "lucide-react";
import { TimelinePage } from "@/components/admin/TimelinePage";

export default function CertificatesPage() {
  return (
    <TimelinePage
      endpoint="certificates"
      title="Certificates"
      icon={Award}
      emptyDescription="Add courses, certifications, or credentials you've earned."
    />
  );
}
