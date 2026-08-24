import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Leaf,
  ScanLine,
  Droplets,
  CloudSun,
  Bot,
  Cpu,
  Activity,
  Mic,
  FileText,
  Github,
  BookOpen,
  BarChart3,
  Sprout,
  Star,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AgriGuardian AI — Smart Farming Platform" },
      {
        name: "description",
        content:
          "AI-powered crop monitoring, leaf disease detection, smart irrigation and hyperlocal weather in one intelligent farming platform.",
      },
      { property: "og:title", content: "AgriGuardian AI — Smart Farming Platform" },
      {
        property: "og:description",
        content:
          "Monitor crops, detect diseases and predict irrigation with AI-driven recommendations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

const STATS = [
  { value: "35%", label: "Water Saved" },
  { value: "25%", label: "Higher Yield" },
  { value: "95%", label: "Disease Accuracy" },
  { value: "10,000+", label: "Farmers Supported" },
];


const FEATURES = [
  { icon: Cpu, title: "IoT Monitoring", desc: "Connect sensors to monitor soil, temperature, and moisture in real-time." },
  { icon: Bot, title: "AI Crop Advisor", desc: "Get tailored recommendations based on millions of agricultural data points." },
  { icon: ScanLine, title: "Disease Detection", desc: "Upload a photo and instantly identify crop diseases with 95% accuracy." },
  { icon: CloudSun, title: "Weather Forecast", desc: "Hyper-local weather integrated directly into your irrigation plan." },
  { icon: Droplets, title: "Smart Irrigation", desc: "Save water by irrigating only when and where it's needed." },
  { icon: BarChart3, title: "Health Analytics", desc: "Visualise trends over time and compare yield across seasons." },
  { icon: Mic, title: "Voice Assistant", desc: "Ask questions naturally while your hands are busy in the field." },
  { icon: FileText, title: "Automated Reports", desc: "Generate compliance and farm health reports in one click." },
  { icon: Sprout, title: "Crop Playbooks", desc: "Stage-by-stage agronomy guidance for every crop in your rotation." },
];

const REVIEWS = [
  {
    quote:
      "Saved 40% water in the first season. The smart irrigation planner is incredibly accurate.",
    name: "Rajesh Kumar",
    place: "Punjab",
  },
  {
    quote:
      "Disease detected 2 weeks before visible symptoms. Paid for itself 10x over in one scan.",
    name: "Priya Singh",
    place: "Maharashtra",
  },
  {
    quote:
      "AI recommendations increased our yield by 30%. Like having an agronomist in your pocket.",
    name: "David Chen",
    place: "California",
  },
];


function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6 lg:flex lg:justify-between">
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="truncate font-heading text-lg font-extrabold">AgriGuardian</span>
            <span className="shrink-0 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-accent-foreground">
              AI
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-semibold text-muted-foreground lg:flex">
            <a href="#features" className="transition-colors hover:text-foreground">
              Everything Your Farm Needs
            </a>
          </nav>


          <div className="flex shrink-0 items-center gap-2">
            <Link
              to="/dashboard"
              className="hidden px-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground sm:block"
            >
              Log In
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Start Monitoring
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-primary" />
          AgriGuardian v2.0 is now live
        </span>
        <h1 className="mt-6 font-heading text-4xl font-extrabold leading-tight sm:text-6xl">
          <span className="text-primary">AI-Powered</span> Smart Farming for a{" "}
          <span className="text-primary">Sustainable Future</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
          Monitor crops, detect diseases, predict irrigation, and receive AI-driven
          recommendations from one intelligent platform.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Start Monitoring
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/detection"
            className="inline-flex items-center rounded-full border border-border bg-card px-6 py-3 text-sm font-bold transition-colors hover:bg-accent"
          >
            View Live Demo
          </Link>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="font-heading text-3xl font-extrabold text-primary">{s.value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">

        <div className="text-center">
          <h2 className="font-heading text-3xl font-extrabold sm:text-4xl">
            Everything Your Farm Needs
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            AI-powered tools that work together to maximize your harvest
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent">
                <Icon className="h-5 w-5 text-accent-foreground" />
              </div>
              <p className="mt-4 font-heading text-base font-extrabold">{title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>




      {/* Testimonials */}
      <section className="bg-sidebar py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-center font-heading text-3xl font-extrabold text-sidebar-foreground sm:text-4xl">
            Trusted by modern farmers.
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {REVIEWS.map((r) => (
              <figure
                key={r.name}
                className="rounded-2xl bg-sidebar-accent p-6 shadow-lg"
              >
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-sidebar-foreground">
                  "{r.quote}"
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sidebar-primary font-heading text-sm font-extrabold text-sidebar-primary-foreground">
                    {r.name.charAt(0)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-heading text-sm font-extrabold text-sidebar-foreground">
                      {r.name}
                    </span>
                    <span className="block truncate text-xs font-semibold text-sidebar-muted-foreground">
                      {r.place}
                    </span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[2fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-heading text-lg font-extrabold">AgriGuardian AI</span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              Empowering farmers with artificial intelligence and real-time IoT data to build a
              sustainable agricultural future.
            </p>
            <div className="mt-4 flex items-center gap-3 text-muted-foreground">
              <a href="#features" aria-label="GitHub" className="transition-colors hover:text-foreground">
                <Github className="h-5 w-5" />
              </a>
              <a href="#features" aria-label="Docs" className="transition-colors hover:text-foreground">
                <BookOpen className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              Product
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="#features" className="hover:text-primary">Features</a></li>
              <li><Link to="/detection" className="hover:text-primary">Disease API</Link></li>
              <li><a href="#features" className="hover:text-primary">Hardware</a></li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              Company
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="#features" className="hover:text-primary">About Us</a></li>
              <li><a href="#features" className="hover:text-primary">Contact</a></li>
              <li><a href="#features" className="hover:text-primary">FAQ</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground sm:px-6">
            <p>© 2026 AgriGuardian AI Inc. All rights reserved.</p>
            <p className="inline-flex items-center gap-1">
              Made with <Activity className="h-3.5 w-3.5 text-primary" /> for farmers worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
