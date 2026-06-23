import React, { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Shield, ShieldAlert, Activity, BarChart3, BookOpen, Info, Mail, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const navLinks = [
    { href: "/", label: "Home", icon: Shield },
    { href: "/scanner", label: "Scanner", icon: ShieldAlert },
    { href: "/history", label: "History", icon: Activity },
    { href: "/stats", label: "Statistics", icon: BarChart3 },
    { href: "/awareness", label: "Awareness", icon: BookOpen },
    { href: "/about", label: "About Hacker", icon: Info },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/about" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded bg-primary/20 flex items-center justify-center border border-primary/50 group-hover:bg-primary/30 transition-colors">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-white">Cyber<span className="text-primary">KK</span></span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 ml-8">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant={location === link.href ? "secondary" : "ghost"}
                className={`gap-2 ${location === link.href ? "bg-white/10 text-white" : "text-muted-foreground hover:text-white"}`}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Button>
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Link href="/contact">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white" title="Contact">
              <Mail className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/scanner">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
              Scan URL
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-background/95 backdrop-blur-xl p-4 flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant={location === link.href ? "secondary" : "ghost"}
                className={`w-full justify-start gap-2 ${location === link.href ? "bg-white/10 text-white" : "text-muted-foreground"}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Button>
            </Link>
          ))}
          <div className="h-px bg-white/10 my-2" />
          <Link href="/contact">
            <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground" onClick={() => setIsMobileMenuOpen(false)}>
              <Mail className="h-4 w-4" /> Contact
            </Button>
          </Link>
          <Link href="/scanner">
            <Button className="w-full mt-2" onClick={() => setIsMobileMenuOpen(false)}>
              Scan URL Now
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
