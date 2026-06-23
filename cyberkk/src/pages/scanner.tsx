import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useCreateScan, useGetScan } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, ShieldAlert, CheckCircle, Search, Download, AlertTriangle, AlertOctagon, Activity, Printer, Info } from "lucide-react";
import { ThreatGauge } from "@/components/ui/threat-gauge";
import { toast } from "sonner";

export default function Scanner() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialId = searchParams.get("id");
  
  const [url, setUrl] = useState("");
  const [scanId, setScanId] = useState<number | null>(initialId ? parseInt(initialId) : null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const createScan = useCreateScan();
  const { data: scanResult, isLoading: isFetchingResult } = useGetScan(scanId as number, { 
    query: { enabled: !!scanId }
  });

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    let validUrl = url;
    if (!validUrl.startsWith("http://") && !validUrl.startsWith("https://")) {
      validUrl = "https://" + validUrl;
    }

    setIsScanning(true);
    setScanProgress(0);
    setScanId(null);

    // Simulate scanning progress
    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.floor(Math.random() * 15);
      });
    }, 400);

    try {
      const result = await createScan.mutateAsync({ data: { url: validUrl } });
      clearInterval(progressInterval);
      setScanProgress(100);
      
      setTimeout(() => {
        setScanId(result.id);
        setIsScanning(false);
      }, 600);
    } catch (error) {
      clearInterval(progressInterval);
      setIsScanning(false);
      toast.error("Failed to scan URL. Please try again.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl flex-1 flex flex-col">
      
      {/* CSS for print mode to hide UI elements and format the report */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-report, #print-report * {
            visibility: visible;
          }
          #print-report {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .print-text-black {
            color: black !important;
          }
          .dark {
            --background: 0 0% 100%;
            --foreground: 0 0% 0%;
          }
        }
      `}</style>

      <div className="text-center mb-12 no-print">
        <h1 className="text-4xl font-display font-bold text-white mb-4">URL Scanner</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Enter any suspicious link below. Our engine will analyze the domain, content, and heuristics to determine the risk level.
        </p>
      </div>

      <Card className="bg-card/40 border-white/10 backdrop-blur-md mb-8 no-print shadow-xl">
        <CardContent className="p-6">
          <form onSubmit={handleScan} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                type="text"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-10 h-14 bg-background/50 border-white/20 text-lg font-mono placeholder:font-sans"
                disabled={isScanning}
              />
            </div>
            <Button 
              type="submit" 
              disabled={isScanning || !url} 
              className="h-14 px-8 text-lg font-medium shadow-[0_0_20px_-5px_var(--color-primary)]"
            >
              {isScanning ? (
                <>
                  <Activity className="mr-2 h-5 w-5 animate-pulse" />
                  Scanning...
                </>
              ) : (
                "Analyze Target"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Scanning Animation State */}
      {isScanning && (
        <div className="flex-1 flex flex-col items-center justify-center py-20 no-print">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
            <div className="absolute inset-2 border-4 border-primary/40 rounded-full animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]" />
            <Shield className="h-12 w-12 text-primary animate-pulse" />
          </div>
          <h3 className="mt-8 text-xl font-bold text-white">Analyzing Threat Vectors</h3>
          <p className="text-muted-foreground mt-2 font-mono text-sm">{url}</p>
          <div className="w-64 h-2 bg-white/10 rounded-full mt-6 overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-out" 
              style={{ width: `${scanProgress}%` }} 
            />
          </div>
        </div>
      )}

      {/* Result Card */}
      {scanResult && !isScanning && (
        <div id="print-report" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="bg-card border-white/10 shadow-2xl overflow-hidden print:shadow-none print:border-black/20">
            {/* Header / Summary */}
            <div className={`p-8 border-b ${
              scanResult.status === 'safe' ? 'bg-green-500/10 border-green-500/20' : 
              scanResult.status === 'suspicious' ? 'bg-yellow-500/10 border-yellow-500/20' : 
              'bg-red-500/10 border-red-500/20'
            }`}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-display font-bold text-white print-text-black">Scan Report</h2>
                    <Badge variant="outline" className={`text-sm px-3 py-1 uppercase tracking-wider ${
                      scanResult.status === 'safe' ? 'border-green-500 text-green-500' : 
                      scanResult.status === 'suspicious' ? 'border-yellow-500 text-yellow-500' : 
                      'border-red-500 text-red-500'
                    }`}>
                      {scanResult.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="font-mono text-muted-foreground break-all text-lg">{scanResult.url}</p>
                  <p className="text-sm text-muted-foreground">Scanned at: {new Date(scanResult.scanDate).toLocaleString()}</p>
                </div>
                
                <div className="flex items-center gap-6 bg-background/50 p-4 rounded-xl print:bg-transparent">
                  <ThreatGauge score={scanResult.score} status={scanResult.status} />
                  
                  <div className="no-print">
                    <Button variant="outline" size="icon" onClick={handlePrint} title="Print / Save PDF">
                      <Printer className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10 print:divide-black/20">
              {/* Left Column: Reasons */}
              <div className="p-8 space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertOctagon className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-xl font-bold text-white print-text-black">Detection Details</h3>
                </div>
                
                {scanResult.reasons && scanResult.reasons.length > 0 ? (
                  <ul className="space-y-4">
                    {scanResult.reasons.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        {scanResult.status === 'safe' ? (
                          <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className={`h-5 w-5 shrink-0 mt-0.5 ${scanResult.status === 'high_risk' ? 'text-red-500' : 'text-yellow-500'}`} />
                        )}
                        <span className="text-muted-foreground print-text-black leading-relaxed">{reason}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>No threats detected in analysis.</span>
                  </div>
                )}
              </div>

              {/* Right Column: Recommendations */}
              <div className="p-8 space-y-6 bg-white/[0.01]">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-xl font-bold text-white print-text-black">Security Recommendations</h3>
                </div>
                
                {scanResult.recommendations && scanResult.recommendations.length > 0 ? (
                  <ul className="space-y-4">
                    {scanResult.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground print-text-black leading-relaxed">{rec}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">Standard security practices apply.</p>
                )}
              </div>
            </div>
            
            <div className="p-4 bg-muted/30 text-center border-t border-white/10 print:border-black/20">
              <p className="text-xs text-muted-foreground">
                Generated by CyberKK Engine v2.4.1. This report is for informational purposes. Think Before You Click.
              </p>
            </div>
          </Card>
        </div>
      )}

    </div>
  );
}
