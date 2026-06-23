import React from "react";
import { Link } from "wouter";
import { Shield, Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background/50 backdrop-blur-sm py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-display font-bold text-lg text-white">CyberKK</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Professional phishing URL detection and cybersecurity awareness platform.
              Think Before You Click.
            </p>
            <div className="text-xs text-muted-foreground font-mono space-y-1">
              <p className="text-primary font-bold text-sm">KAVY CHAUHAN</p>
              <p>Diploma in IT Student</p>
              <p>IBM Internship 2026 · CSRBOX</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/scanner" className="hover:text-primary transition-colors">URL Scanner</Link></li>
              <li><Link href="/history" className="hover:text-primary transition-colors">Scan History</Link></li>
              <li><Link href="/stats" className="hover:text-primary transition-colors">Global Statistics</Link></li>
              <li><Link href="/awareness" className="hover:text-primary transition-colors">Awareness Center</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About Developer</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Connect</h4>
            <div className="flex flex-col gap-3">
              <a
                href="https://github.com/kavy22chauhan/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                <Github className="h-4 w-4" />
                github.com/kavy22chauhan
              </a>
              <a
                href="https://www.linkedin.com/in/kavvy-chauhan-033626375/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                <Linkedin className="h-4 w-4" />
                kavvy-chauhan
              </a>
              <a
                href="mailto:kavychauhan2209@gmail.com"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                <Mail className="h-4 w-4" />
                kavychauhan2209@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} CyberKK by <span className="text-primary font-semibold">KAVY CHAUHAN</span> · IBM Internship Online Project 2026 · CSRBOX
          </p>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            <span className="text-xs font-mono text-muted-foreground">Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
