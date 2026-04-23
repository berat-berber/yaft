import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Wallet, Shield, Lock, LayoutDashboard, CopyX, Edit3 } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

export default function WelcomePage() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wallet className="h-4 w-4" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">YAFT</span>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <Button asChild>
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full max-w-4xl px-4 py-24 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight mb-6">
            Take Control of Your <br />
            <span className="text-primary">Financial Data</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Yet Another Finance Tracker is a privacy-focused multi-bank transaction aggregator that allows you to upload, analyze, and manage financial data from multiple Turkish banks in one unified interface.
          </p>
          <div className="flex items-center justify-center gap-4">
            {!isAuthenticated && (
              <Button size="lg" className="h-12 px-8 text-lg" asChild>
                <Link to="/register">Get Started</Link>
              </Button>
            )}
            <Button size="lg" variant="outline" className="h-12 px-8 text-lg" asChild>
              <a href="https://github.com/berat-berber/yaft" target="_blank" rel="noreferrer">
                View on GitHub
              </a>
            </Button>
          </div>
        </section>

        {/* Problem Statement Section */}
        <section className="w-full bg-muted/50 py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Why YAFT?</h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Turkish banks provide transaction history through Excel exports, but each bank uses different formats and there's no way to view transactions across multiple accounts in one place. Existing solutions require sharing bank credentials with third parties, raising privacy concerns.
              <br /><br />
              <strong>YAFT solves this</strong> by allowing you to upload your own bank exports while maintaining complete control over your financial data.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Core Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Wallet className="h-6 w-6" />}
                title="Multi-Bank Support"
                description="Upload and parse Excel files from Ziraat Bank and Is Bank (more banks coming soon)."
              />
              <FeatureCard
                icon={<LayoutDashboard className="h-6 w-6" />}
                title="Unified Dashboard"
                description="View transactions from all your accounts in one single, organized place."
              />
              <FeatureCard
                icon={<Shield className="h-6 w-6" />}
                title="Privacy-First"
                description="Your data never leaves your control - no bank credentials required."
              />
              <FeatureCard
                icon={<Edit3 className="h-6 w-6" />}
                title="Transaction Editing"
                description="Modify transaction descriptions to protect sensitive information."
              />
              <FeatureCard
                icon={<CopyX className="h-6 w-6" />}
                title="Duplicate Detection"
                description="Automatically prevents duplicate transactions when uploading the same file multiple times."
              />
              <FeatureCard
                icon={<Lock className="h-6 w-6" />}
                title="Secure Authentication"
                description="JWT-based authentication with role-based authorization for maximum security."
              />
            </div>
          </div>
        </section>

        {/* How to Use Section */}
        <section className="w-full bg-muted/50 py-20 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-16">How to Use YAFT</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 text-left">
              <div className="relative p-6 rounded-2xl bg-background border shadow-sm">
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-sm">1</div>
                <h3 className="text-xl font-semibold mb-2 mt-2">Export Data</h3>
                <p className="text-muted-foreground">Download your transaction history as an Excel file from Ziraat Bank or Is Bank.</p>
              </div>
              <div className="relative p-6 rounded-2xl bg-background border shadow-sm">
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-sm">2</div>
                <h3 className="text-xl font-semibold mb-2 mt-2">Create Account</h3>
                <p className="text-muted-foreground">Add a bank account in YAFT that matches your real-world bank account details.</p>
              </div>
              <div className="relative p-6 rounded-2xl bg-background border shadow-sm">
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-sm">3</div>
                <h3 className="text-xl font-semibold mb-2 mt-2">Upload to YAFT</h3>
                <p className="text-muted-foreground">Securely upload your Excel files. Your transactions are safely stored in your account.</p>
              </div>
              <div className="relative p-6 rounded-2xl bg-background border shadow-sm">
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-sm">4</div>
                <h3 className="text-xl font-semibold mb-2 mt-2">Take Control</h3>
                <p className="text-muted-foreground">Analyze your balances, view across multiple accounts, and manage your financial data.</p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border shadow-xl bg-black/5 aspect-video flex items-center justify-center relative mx-auto max-w-4xl">
              <video
                className="w-full h-full object-cover"
                controls
                preload="metadata"
                src={import.meta.env.VITE_TUTORIAL_VIDEO_URL}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-muted-foreground">
        <p>© {new Date().getFullYear()} YAFT. MIT Licensed.</p>
        <p className="text-sm mt-2">Built by Berat Berber</p>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-card border text-card-foreground shadow-sm hover:shadow-md transition-shadow">
      <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
