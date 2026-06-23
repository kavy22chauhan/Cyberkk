import React from "react";
import { Link } from "wouter";
import { Shield, ShieldAlert, Activity, ArrowRight, CheckCircle, Search, Zap, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetStatsSummary, useGetRecentScans } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const { data: stats } = useGetStatsSummary();
  const { data: recentScans } = useGetRecentScans();

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
              <Shield className="h-4 w-4" />
              <span>Advanced Phishing Detection Engine</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-white drop-shadow-sm">
              Think Before You <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">Click.</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Professional-grade URL scanning and analysis. Protect your organization from sophisticated phishing campaigns with real-time threat intelligence.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/scanner">
                <Button size="lg" className="h-14 px-8 text-lg font-medium shadow-[0_0_40px_-10px_var(--color-primary)]">
                  <Search className="mr-2 h-5 w-5" />
                  Scan URL Now
                </Button>
              </Link>
              <Link href="/awareness">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg bg-card/50 hover:bg-card border-white/10">
                  <Activity className="mr-2 h-5 w-5" />
                  View Training Center
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {stats && (
        <section className="py-12 border-y border-white/5 bg-white/[0.02]">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <h4 className="text-4xl font-display font-bold text-white tabular-nums">{stats.total.toLocaleString()}</h4>
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Total Scans</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-4xl font-display font-bold text-red-500 tabular-nums">{stats.highRisk.toLocaleString()}</h4>
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Threats Blocked</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-4xl font-display font-bold text-primary tabular-nums">{stats.todayCount.toLocaleString()}</h4>
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Scanned Today</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-4xl font-display font-bold text-green-500 tabular-nums">{stats.safe.toLocaleString()}</h4>
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Safe URLs</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-white mb-4">Why CyberKK?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our analysis engine evaluates dozens of heuristics in milliseconds to provide an authoritative verdict on any URL.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-card/50 border-white/10 backdrop-blur">
              <CardContent className="pt-6 space-y-4">
                <div className="h-12 w-12 rounded bg-primary/20 flex items-center justify-center border border-primary/30">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white">Real-Time Analysis</h3>
                <p className="text-muted-foreground">
                  Instant scanning of domains, SSL certificates, redirects, and page content to detect zero-day phishing attempts.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-white/10 backdrop-blur">
              <CardContent className="pt-6 space-y-4">
                <div className="h-12 w-12 rounded bg-red-500/20 flex items-center justify-center border border-red-500/30">
                  <ShieldAlert className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white">Deep Heuristics</h3>
                <p className="text-muted-foreground">
                  We look past simple blacklists to analyze DOM structure, hidden iframes, homograph attacks, and credential-harvesting forms.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-white/10 backdrop-blur">
              <CardContent className="pt-6 space-y-4">
                <div className="h-12 w-12 rounded bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                  <Lock className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Actionable Intel</h3>
                <p className="text-muted-foreground">
                  Receive detailed reports, clear risk scoring, and exportable PDF summaries to share with your security operations team.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Scans Ticker/List */}
      {recentScans && recentScans.length > 0 && (
        <section className="py-24 border-t border-white/5 bg-background relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-display font-bold text-white">Live Detections</h2>
              <Link href="/history" className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm font-medium">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {recentScans.slice(0, 5).map((scan) => (
                <div key={scan.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg bg-card/50 border border-white/10 hover:border-white/20 transition-colors gap-4">
                  <div className="flex-1 truncate w-full">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={scan.status === "safe" ? "default" : scan.status === "suspicious" ? "secondary" : "destructive"} className={
                        scan.status === "safe" ? "bg-green-500/20 text-green-500 hover:bg-green-500/30" : 
                        scan.status === "suspicious" ? "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30" : ""
                      }>
                        {scan.status.replace("_", " ").toUpperCase()}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(scan.scanDate).toLocaleString()}
                      </span>
                    </div>
                    <div className="font-mono text-sm text-white truncate max-w-full">
                      {scan.url}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="text-sm font-medium text-white tabular-nums">Score: {scan.score}/100</div>
                    </div>
                    <Link href={`/scanner?id=${scan.id}`}>
                      <Button variant="ghost" size="sm">Details</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-primary/5 border-t border-primary/20" />
        <div className="container mx-auto px-4 relative text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white">Ready to secure your network?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start analyzing suspicious links immediately without creating an account.
          </p>
          <div className="pt-4">
            <Link href="/scanner">
              <Button size="lg" className="h-14 px-8 text-lg font-medium shadow-[0_0_40px_-10px_var(--color-primary)]">
                Launch Scanner
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
