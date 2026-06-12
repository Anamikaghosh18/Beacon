import { SignIn } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import logoImg from "../assets/beaconlogo.png";

export function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex flex-1">
        {/* Left — Branding Panel */}
        <div className="hidden lg:flex w-1/2 bg-textPrimary flex-col justify-between p-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2070')] opacity-10 bg-cover bg-center"></div>
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
              Welcome back. <br />
              Your customers missed you.
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed max-w-md">
              Sign in to see what's happening with your campaigns, check which
              customer groups need attention, and take action — all in one
              place.
            </p>
          </div>

          {/* Testimonial */}
          <div className="relative z-10 border border-white/10 rounded-2xl p-6 bg-white/5 backdrop-blur">
            <p className="text-white/80 text-sm leading-relaxed mb-4">
              "Beacon helped us recover ₹4.2 lakh in lost sales in our first
              month by sending a simple message to customers we thought were
              gone."
            </p>
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150"
                className="w-8 h-8 rounded-full border border-white/20 object-cover"
                alt="Testimonial"
              />
              <div>
                <p className="text-white text-sm font-semibold">Deepa Menon</p>
                <p className="text-gray-400 text-xs">Founder, The Loom Store</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Clerk Sign In */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-textPrimary mb-2">
                Sign in to Beacon
              </h1>
              <p className="text-textSecondary text-sm">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-primary font-semibold hover:underline"
                >
                  Sign up for free
                </Link>
              </p>
            </div>
            <SignIn
              routing="path"
              signUpUrl="/signup"
              afterSignInUrl="/app/dashboard"
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
                  identityPreviewText: "text-textPrimary",
                  identityPreviewEditButton: "text-primary",
                  formFieldSuccessText: "text-success",
                  formFieldErrorText: "text-error text-xs",
                  alertText: "text-sm",
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
