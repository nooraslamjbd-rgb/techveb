import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Education Hub - Jobs, Results, Admissions | TechVeb",
  description:
    "Latest education news, job opportunities, board results, university admissions, and career guidance in Pakistan.",
  alternates: { canonical: "https://techveb.com/education" },
  openGraph: {
    title: "Education Hub - TechVeb",
    description: "Jobs, results, admissions, and career guidance.",
    url: "https://techveb.com/education",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Education Hub - TechVeb",
    description: "Jobs, results, admissions, and career guidance.",
  },
};

const boardResults = [
  { board: "BISE Lahore", class: "10th Class", status: "Declared", date: "Jul 2026" },
  { board: "BISE Karachi", class: "10th Class", status: "Declared", date: "Jul 2026" },
  { board: "BISE Islamabad", class: "12th Class", status: "Declared", date: "Jun 2026" },
  { board: "BISE Rawalpindi", class: "11th Class", status: "Pending", date: "Expected Sep 2026" },
  { board: "BISE Faisalabad", class: "10th Class", status: "Declared", date: "Jul 2026" },
  { board: "BISE Multan", class: "12th Class", status: "Declared", date: "Jun 2026" },
];

const latestAdmissions = [
  { university: "University of the Punjab", program: "Fall 2026 Admissions", deadline: "Sep 15, 2026", status: "Open" },
  { university: "COMSATS University", program: "MS/MPhil Programs", deadline: "Aug 30, 2026", status: "Open" },
  { university: "NUST", program: "Engineering Programs", deadline: "Sep 01, 2026", status: "Open" },
  { university: "LUMS", program: "Undergraduate Fall 2026", deadline: "Sep 20, 2026", status: "Open" },
  { university: "IBA Karachi", program: "BBA/MBA Programs", deadline: "Aug 25, 2026", status: "Closing Soon" },
  { university: "UET Lahore", program: "Engineering Fall 2026", deadline: "Sep 10, 2026", status: "Open" },
];

const latestJobs = [
  { title: "Software Engineer", company: "Tech Corp Pakistan", location: "Karachi", type: "Full-time", salary: "PKR 80K-150K" },
  { title: "Data Analyst", company: "FinServe Ltd", location: "Lahore", type: "Full-time", salary: "PKR 60K-100K" },
  { title: "DevOps Engineer", company: "CloudNine Solutions", location: "Islamabad", type: "Full-time", salary: "PKR 100K-180K" },
  { title: "UI/UX Designer", company: "CreativeHub", location: "Remote", type: "Remote", salary: "PKR 70K-120K" },
  { title: "AI/ML Engineer", company: "DataVision AI", location: "Karachi", type: "Full-time", salary: "PKR 120K-200K" },
  { title: "Cybersecurity Analyst", company: "SecureNet PK", location: "Lahore", type: "Full-time", salary: "PKR 90K-160K" },
];

export default function EducationPage() {
  const educationJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Education Hub - TechVeb",
    description: "Jobs, results, admissions, and career guidance in Pakistan",
    url: "https://techveb.com/education",
  };

  return (
    <>
      <JsonLd data={educationJsonLd} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-purple-600/10 to-transparent">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <h1 className="font-heading text-3xl font-bold sm:text-4xl mb-2">Education Hub</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Jobs, board results, university admissions, and career guidance
          </p>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Board Results", value: "6 Boards", icon: "📋", color: "bg-blue-500/10 text-blue-600" },
            { label: "Open Admissions", value: "6 Universities", icon: "🎓", color: "bg-purple-500/10 text-purple-600" },
            { label: "Latest Jobs", value: "6 Positions", icon: "💼", color: "bg-green-500/10 text-green-600" },
            { label: "Scholarships", value: "12 Active", icon: "🏆", color: "bg-yellow-500/10 text-yellow-600" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-surface p-4">
              <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center text-lg mb-2`}>
                {stat.icon}
              </div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-lg font-bold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Board Results */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <h2 className="font-heading text-xl font-bold mb-4 flex items-center gap-2">
          <span>📋</span> Board Results 2026
        </h2>
        <div className="rounded-xl border border-border bg-surface overflow-x-auto">
          <div className="grid grid-cols-4 gap-4 px-4 py-2.5 border-b border-border text-xs font-medium text-muted-foreground">
            <span>Board</span>
            <span>Class</span>
            <span>Status</span>
            <span>Date</span>
          </div>
          {boardResults.map((result, idx) => (
            <div key={idx} className="grid grid-cols-4 gap-4 px-4 py-3 border-b border-border last:border-0 hover:bg-surface-hover transition-colors">
              <span className="text-sm font-medium text-foreground">{result.board}</span>
              <span className="text-sm text-muted-foreground">{result.class}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded w-fit ${result.status === "Declared" ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600"}`}>
                {result.status}
              </span>
              <span className="text-sm text-muted-foreground">{result.date}</span>
            </div>
          ))}
        </div>
      </section>

      {/* University Admissions */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <h2 className="font-heading text-xl font-bold mb-4 flex items-center gap-2">
          <span>🎓</span> University Admissions
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {latestAdmissions.map((admission, idx) => (
            <div key={idx} className="rounded-xl border border-border bg-surface p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-heading font-bold text-sm text-foreground">{admission.university}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${admission.status === "Closing Soon" ? "bg-red-500/10 text-red-600" : "bg-green-500/10 text-green-600"}`}>
                  {admission.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{admission.program}</p>
              <p className="text-xs font-medium text-foreground">
                Deadline: {admission.deadline}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Jobs */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="font-heading text-xl font-bold mb-4 flex items-center gap-2">
          <span>💼</span> Latest Tech Jobs
        </h2>
        <div className="rounded-xl border border-border bg-surface overflow-x-auto">
          {latestJobs.map((job, idx) => (
            <div key={idx} className={`flex items-center justify-between px-4 py-4 hover:bg-surface-hover transition-colors ${idx < latestJobs.length - 1 ? "border-b border-border" : ""}`}>
              <div>
                <h3 className="font-heading font-bold text-sm text-foreground">{job.title}</h3>
                <p className="text-xs text-muted-foreground">{job.company} • {job.location}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-primary block">{job.salary}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${job.type === "Remote" ? "bg-purple-500/10 text-purple-600" : "bg-blue-500/10 text-blue-600"}`}>
                  {job.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
