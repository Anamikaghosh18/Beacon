import { Hexagon, ArrowRight, Zap, Users, Compass, Activity, CheckCircle2, PlayCircle, BarChart3, MessageSquare, TerminalSquare, LineChart } from "lucide-react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"

export function Landing() {
  const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  return (
    <div className="min-h-screen bg-background text-textPrimary selection:bg-primary/20 flex flex-col font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="h-14 border-b border-border/50 bg-card/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center shadow-sm">
              <Hexagon className="w-3.5 h-3.5 text-white" />
            </div>
            Beacon
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#platform" className="text-textSecondary hover:text-textPrimary transition-colors">Platform</a>
            <a href="#strategist" className="text-textSecondary hover:text-textPrimary transition-colors">Strategist</a>
            <a href="#customers" className="text-textSecondary hover:text-textPrimary transition-colors">Customers</a>
            <a href="#pricing" className="text-textSecondary hover:text-textPrimary transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-sm font-medium text-textSecondary hover:text-textPrimary transition-colors hidden sm:block">Sign in</button>
            <Link to="/app" className="bg-primary text-white px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm ring-1 ring-black/10">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-20 pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10"></div>
          
          <div className="max-w-5xl mx-auto px-6 flex flex-col items-center text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs text-primary font-medium mb-6 shadow-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              Beacon Strategist 2.0 is now live
            </motion.div>
            
            <motion.h1 
              {...fadeIn}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl leading-[1.1] mb-6 text-textPrimary"
            >
              Customer engagement, <br className="hidden md:block"/> engineered for reality.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-base md:text-lg text-textSecondary max-w-2xl mb-8 leading-relaxed"
            >
              The orchestration platform for modern growth teams. Build intelligent segments, map delivery pipelines, and execute campaigns with an AI strategist that actually understands your business logic.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto"
            >
              <Link to="/app" className="w-full sm:w-auto bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group">
                Start Building Free <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <button className="w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm font-semibold border border-border bg-card hover:bg-background text-textPrimary transition-all shadow-sm flex items-center justify-center gap-2">
                <PlayCircle className="w-4 h-4" /> Watch Demo
              </button>
            </motion.div>
          </div>
        </section>

        {/* Structured Dashboard UI Mockup */}
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full rounded-xl border border-border shadow-2xl bg-card overflow-hidden ring-1 ring-black/8"
          >
            {/* Header */}
            <div className="h-10 border-b border-border bg-background flex items-center px-4 gap-4 shadow-xs">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-border"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-border"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-border"></div>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-card border border-border rounded px-3 py-1 text-[10px] text-textMuted font-medium shadow-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-success"></span> app.beacon.io
                </div>
              </div>
            </div>
            
            {/* Mock UI Content */}
            <div className="flex h-[400px]">
              {/* Sidebar */}
              <div className="w-56 border-r border-border bg-card p-4 hidden md:flex flex-col gap-1">
                <div className="text-[10px] font-semibold text-textMuted uppercase mb-2 px-2">Menu</div>
                <div className="px-2 py-1.5 bg-background text-primary text-xs font-medium rounded border border-border flex items-center gap-2"><BarChart3 className="w-3 h-3"/> Overview</div>
                <div className="px-2 py-1.5 text-textSecondary text-xs font-medium rounded flex items-center gap-2"><Compass className="w-3 h-3"/> Strategist</div>
                <div className="px-2 py-1.5 text-textSecondary text-xs font-medium rounded flex items-center gap-2"><Users className="w-3 h-3"/> Audiences</div>
              </div>
              
              {/* Main Area */}
              <div className="flex-1 bg-background p-6 overflow-hidden flex flex-col gap-4">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <h2 className="text-lg font-bold text-textPrimary">Good morning, Sarah.</h2>
                    <p className="text-xs text-textSecondary">Here's your engagement overview.</p>
                  </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Active Users", val: "124,500", trend: "+12%" },
                    { label: "Revenue Influenced", val: "$842,100", trend: "+8%" },
                    { label: "Avg Open Rate", val: "42.3%", trend: "+2.1%" }
                  ].map((kpi, i) => (
                    <div key={i} className="bg-card border border-border rounded-lg p-3 shadow-sm">
                      <p className="text-[10px] font-medium text-textSecondary uppercase mb-1">{kpi.label}</p>
                      <div className="flex justify-between items-end">
                        <p className="text-lg font-bold text-textPrimary">{kpi.val}</p>
                        <p className="text-[10px] font-medium text-success bg-success/10 px-1 rounded">{kpi.trend}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Imagery mixed with UI */}
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden relative">
                    <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070" className="absolute inset-0 w-full h-full object-cover opacity-80" alt="Analytics" />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-xs font-semibold text-textPrimary mb-1">Q3 Performance</p>
                      <p className="text-[10px] text-textSecondary">Outperforming control group by 24%</p>
                    </div>
                  </div>
                  <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden relative">
                    <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=2070" className="absolute inset-0 w-full h-full object-cover opacity-80" alt="Team" />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur border border-border p-3 rounded shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <Compass className="w-3 h-3 text-aiAccent" />
                        <p className="text-[10px] font-semibold text-textPrimary">Strategist Insight</p>
                      </div>
                      <p className="text-[10px] text-textSecondary">Recommend win-back campaign.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Customer Logos */}
          <div className="mt-12 flex justify-center gap-8 md:gap-16 opacity-40 grayscale items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-textMuted mr-4">Trusted By</span>
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Linear_Logo.svg" alt="Linear" className="h-4" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Notion-logo.svg" alt="Notion" className="h-4" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/Vercel_logo_black.svg" alt="Vercel" className="h-3 mt-0.5" />
          </div>
        </section>

        {/* Feature Blocks - Highly Structured with Real Photos */}
        <section id="platform" className="py-20 bg-card border-y border-border">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-textPrimary mb-4">
                Real insights. Real teams.
              </h2>
              <p className="text-sm text-textSecondary">
                Designed for human collaboration. We provide the intelligence, but you remain in control of every campaign and customer interaction.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Feature 1 */}
              <div className="space-y-6">
                <div className="rounded-xl overflow-hidden border border-border shadow-lg mb-6 aspect-video relative">
                  <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover" alt="Team meeting" />
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center ring-1 ring-primary/20">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-textPrimary mb-2">Dynamic Segments</h3>
                    <p className="text-sm text-textSecondary leading-relaxed mb-4">
                      Stop writing complex SQL queries. Beacon automatically categorizes your users based on purchasing behavior, engagement history, and LTV. 
                    </p>
                    <div className="bg-background border border-border p-4 rounded-lg shadow-sm">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-textPrimary">VIP Customers</span>
                        <span className="text-[10px] font-bold text-success bg-success/10 px-1.5 py-0.5 rounded">+12%</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150" className="w-6 h-6 rounded-full border-2 border-background object-cover" />
                          <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150" className="w-6 h-6 rounded-full border-2 border-background object-cover" />
                          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150" className="w-6 h-6 rounded-full border-2 border-background object-cover" />
                        </div>
                        <p className="text-[10px] text-textMuted">1,240 users updated 2m ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="space-y-6">
                <div className="rounded-xl overflow-hidden border border-border shadow-sm mb-6 aspect-video relative bg-background flex items-center justify-center p-6">
                  {/* Embedded Chat Mockup instead of a full photo to keep it balanced */}
                  <div className="w-full bg-card border border-border p-4 rounded-lg shadow-md">
                    <div className="flex gap-3 mb-3">
                      <div className="w-6 h-6 rounded-full bg-aiAccent text-white flex items-center justify-center font-serif italic text-[10px] font-bold shrink-0">B</div>
                      <div className="bg-background border border-border p-2 rounded rounded-tl-none text-xs text-textPrimary shadow-sm">
                        I recommend a win-back SMS for dormant users.
                      </div>
                    </div>
                    <div className="flex gap-3 flex-row-reverse">
                      <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" className="w-6 h-6 rounded-full border border-border shrink-0 object-cover" />
                      <div className="bg-primary text-white p-2 rounded rounded-tr-none text-xs shadow-sm">
                        Looks perfect. Launch it.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-lg bg-aiAccent/10 flex items-center justify-center ring-1 ring-aiAccent/20">
                    <Compass className="w-5 h-5 text-aiAccent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-textPrimary mb-2">Beacon Strategist</h3>
                    <p className="text-sm text-textSecondary leading-relaxed mb-4">
                      An intelligent partner that understands your specific business model. Ask it to analyze drop-offs and draft multi-channel campaigns.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid - Tighter */}
        <section className="py-20 bg-background">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-textPrimary text-center mb-10">Everything a growth team needs</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="md:col-span-2 bg-card p-6 rounded-2xl border border-border shadow-md hover:shadow-lg transition-shadow ring-1 ring-black/5 flex flex-col justify-between relative overflow-hidden">
                <div className="relative z-10">
                  <BarChart3 className="w-5 h-5 text-primary mb-3" />
                  <h3 className="text-lg font-bold text-textPrimary mb-1">Deep Performance Analytics</h3>
                  <p className="text-xs text-textSecondary max-w-sm">Track open rates, CTR, and direct revenue attribution in real-time. See exactly which channel is driving growth.</p>
                </div>
                {/* Real photo overlay for analytics */}
                <div className="absolute right-0 bottom-0 top-0 w-1/2 overflow-hidden opacity-50 md:opacity-100 hidden sm:block">
                  <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2015" className="w-full h-full object-cover object-left mask-image-gradient-left" />
                  <div className="absolute inset-0 bg-gradient-to-r from-card to-transparent"></div>
                </div>
              </div>
              
              <div className="bg-card p-6 rounded-2xl border border-border shadow-md hover:shadow-lg transition-shadow ring-1 ring-black/5 relative overflow-hidden">
                <div className="relative z-10">
                  <MessageSquare className="w-5 h-5 text-warning mb-3" />
                  <h3 className="text-lg font-bold text-textPrimary mb-1">Omnichannel</h3>
                  <p className="text-xs text-textSecondary mb-4">Reach customers via Email, SMS, WhatsApp, and Push.</p>
                </div>
                <img src="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=2070" className="absolute inset-0 w-full h-full object-cover opacity-20" />
              </div>

              <div className="bg-card p-6 rounded-2xl border border-border shadow-md hover:shadow-lg transition-shadow ring-1 ring-black/5">
                <Activity className="w-5 h-5 text-success mb-3" />
                <h3 className="text-lg font-bold text-textPrimary mb-1">Event Stream</h3>
                <p className="text-xs text-textSecondary mb-4">Datadog-level observability.</p>
                <div className="space-y-2 relative z-10">
                  <div className="flex items-center gap-2 text-[10px]"><Activity className="w-3 h-3 text-success"/> Message Sent <span className="text-textMuted ml-auto">Just now</span></div>
                  <div className="flex items-center gap-2 text-[10px]"><CheckCircle2 className="w-3 h-3 text-aiAccent"/> Message Opened <span className="text-textMuted ml-auto">2m ago</span></div>
                </div>
              </div>

              <div className="md:col-span-2 bg-card p-6 rounded-2xl border border-border shadow-md hover:shadow-lg transition-shadow ring-1 ring-black/5 flex items-center justify-between relative overflow-hidden">
                <div className="relative z-10 max-w-sm">
                  <h3 className="text-lg font-bold text-textPrimary mb-1">Enterprise Grade Security</h3>
                  <p className="text-xs text-textSecondary">SOC2 Type II certified. Your customer data is encrypted, isolated, and never used to train global AI models.</p>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-1/3">
                  <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover opacity-30 mask-image-gradient-left" />
                  <div className="absolute inset-0 bg-gradient-to-r from-card to-transparent"></div>
                </div>
              </div>
              
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-textPrimary text-card relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2070')] opacity-20 bg-cover bg-center grayscale mix-blend-overlay"></div>
          <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Start orchestrating today.</h2>
            <p className="text-sm text-textMuted mb-8">Join modern growth engineers who use Beacon to automate their pipelines.</p>
            <div className="flex justify-center gap-3">
              <Link to="/app" className="bg-white text-textPrimary px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-100 transition-all shadow-md">
                Get Started
              </Link>
              <button className="px-6 py-2.5 rounded-lg text-sm font-bold border border-white/20 hover:bg-white/10 transition-colors">
                Talk to Sales
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Compact */}
      <footer className="bg-card border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-sm text-textPrimary">
            <div className="w-5 h-5 rounded bg-primary flex items-center justify-center">
              <Hexagon className="w-3 h-3 text-white" />
            </div>
            Beacon Platform Inc.
          </div>
          <div className="flex gap-4 text-xs text-textSecondary">
            <a href="#" className="hover:text-textPrimary">Product</a>
            <a href="#" className="hover:text-textPrimary">Pricing</a>
            <a href="#" className="hover:text-textPrimary">Privacy</a>
            <a href="#" className="hover:text-textPrimary">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
