import React from "react";
import { SignUp, useUser } from "@clerk/clerk-react";
import { CheckCircle2 } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import logoImg from "../assets/beaconlogo.png";

const BENEFITS = [
  "See all your customer activity in one place",
  "Send campaigns with a single click",
  "Get smart suggestions on what to do next",
  "No setup, no coding required",
];

export function SignupPage() {
  const { isLoaded, isSignedIn } = useUser();

  if (isLoaded && isSignedIn) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex flex-1">
        {/* Left — Branding Panel */}
        <div className="hidden lg:flex w-1/2 bg-textPrimary flex-col justify-between p-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=2070')] opacity-10 bg-cover bg-center"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-8 h-8 overflow-hidden rounded-lg shadow-button-primary bg-white/5">
                <img
                  src={logoImg}
                  alt="Beacon"
                  className="w-full h-full object-cover scale-125"
                />
              </div>
              <span className="text-white font-bold text-3xl">Beacon</span>
            </div>
            <h2 className="text-4xl font-bold text-white leading-snug mb-6">
              Start growing your <br />
              business today.
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed max-w-md mb-12">
              Join thousands of businesses who use Beacon to keep customers
              coming back and revenue growing — without needing a marketing
              team.
            </p>
            <ul className="space-y-4">
              {BENEFITS.map((b, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-white/80 text-sm"
                >
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* Social proof avatars */}
          <div className="relative z-10 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150",
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150",
                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150",
                "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150",
              ].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  className="w-9 h-9 rounded-full border-2 border-textPrimary object-cover shadow-sm"
                  alt=""
                />
              ))}
            </div>
            <div>
              <p className="text-white font-semibold text-sm">
                Join 12,000+ businesses
              </p>
              <p className="text-gray-400 text-xs">
                already growing with Beacon
              </p>
            </div>
          </div>
        </div>

        {/* Right — Clerk Sign Up */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-textPrimary mb-2">
                Create your account
              </h1>
              <p className="text-textSecondary text-sm">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary font-semibold hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
            <SignUp
              routing="path"
              path="/signup"
              signInUrl="/login"
              afterSignUpUrl="/app/dashboard"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none border border-border rounded-xl p-6 w-full bg-card",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton:
                    "border border-border bg-background hover:bg-background/80 text-textPrimary font-medium rounded-lg shadow-xs transition-all",
                  dividerLine: "bg-border",
                  dividerText: "text-textMuted text-xs",
                  formFieldLabel: "text-sm font-medium text-textPrimary",
                  formFieldInput:
                    "border border-border rounded-lg bg-background text-textPrimary placeholder:text-textMuted shadow-input focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all",
                  formButtonPrimary:
                    "bg-primary hover:bg-blue-700 text-white font-semibold rounded-lg shadow-button-primary transition-all",
                  footerActionText: "text-textSecondary text-xs",
                  footerActionLink:
                    "text-primary font-semibold hover:underline",
                  formFieldSuccessText: "text-success",
                  formFieldErrorText: "text-error text-xs",
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
