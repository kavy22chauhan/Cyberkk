interface DetectionResult {
  score: number;
  status: "safe" | "suspicious" | "high_risk";
  reasons: string[];
  recommendations: string[];
}

const SUSPICIOUS_KEYWORDS = [
  "login", "signin", "verify", "update", "secure", "bank",
  "account", "password", "wallet", "payment", "confirm",
  "credential", "webscr", "ebayisapi", "paypal",
];

const SUSPICIOUS_TLDS = [
  ".tk", ".ml", ".ga", ".cf", ".gq", ".xyz", ".top", ".club",
  ".online", ".site", ".info", ".biz", ".ws", ".cc", ".pw",
];

const REDIRECT_PATTERNS = ["redirect", "redir", "url=", "link=", "goto=", "return=", "returnurl="];

export function analyzeUrl(rawUrl: string): DetectionResult {
  const reasons: string[] = [];
  let score = 0;

  let url: URL;
  try {
    const urlStr = rawUrl.startsWith("http") ? rawUrl : `http://${rawUrl}`;
    url = new URL(urlStr);
  } catch {
    return {
      score: 85,
      status: "high_risk",
      reasons: ["Invalid or malformed URL"],
      recommendations: getRecommendations(85),
    };
  }

  const hostname = url.hostname.toLowerCase();
  const fullUrl = rawUrl.toLowerCase();
  const path = url.pathname.toLowerCase();
  const searchParams = url.search.toLowerCase();

  // 1. HTTPS check
  if (url.protocol !== "https:") {
    score += 20;
    reasons.push("URL does not use HTTPS — connection is unencrypted");
  }

  // 2. IP address in hostname
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
    score += 30;
    reasons.push("URL uses an IP address instead of a domain name — common phishing tactic");
  }

  // 3. URL length
  if (rawUrl.length > 100) {
    score += 10;
    reasons.push(`Unusually long URL (${rawUrl.length} characters) — phishing URLs tend to be long`);
  } else if (rawUrl.length > 75) {
    score += 5;
    reasons.push(`Long URL detected (${rawUrl.length} characters)`);
  }

  // 4. Number of subdomains
  const parts = hostname.split(".");
  const subdomainCount = parts.length - 2;
  if (subdomainCount >= 3) {
    score += 15;
    reasons.push(`Excessive subdomains detected (${subdomainCount}) — used to disguise fake domains`);
  } else if (subdomainCount === 2) {
    score += 8;
    reasons.push("Multiple subdomains detected — verify the actual domain carefully");
  }

  // 5. @ symbol in URL
  if (fullUrl.includes("@")) {
    score += 25;
    reasons.push("URL contains '@' symbol — browsers ignore everything before @ in a URL, used to deceive");
  }

  // 6. Excessive hyphens
  const hyphenCount = (hostname.match(/-/g) || []).length;
  if (hyphenCount >= 4) {
    score += 15;
    reasons.push(`Many hyphens in domain (${hyphenCount}) — frequently used in phishing domains`);
  } else if (hyphenCount >= 2) {
    score += 8;
    reasons.push(`Multiple hyphens in domain (${hyphenCount})`);
  }

  // 7. Suspicious keywords
  const foundKeywords = SUSPICIOUS_KEYWORDS.filter(kw =>
    fullUrl.includes(kw)
  );
  if (foundKeywords.length >= 3) {
    score += 20;
    reasons.push(`Multiple suspicious keywords found: ${foundKeywords.slice(0, 3).join(", ")}`);
  } else if (foundKeywords.length > 0) {
    score += 10;
    reasons.push(`Suspicious keyword(s) in URL: ${foundKeywords.join(", ")}`);
  }

  // 8. Encoded characters (percent-encoding abuse)
  const encodedCount = (fullUrl.match(/%[0-9a-f]{2}/gi) || []).length;
  if (encodedCount >= 4) {
    score += 15;
    reasons.push(`High number of encoded characters (${encodedCount}) — used to obfuscate malicious URLs`);
  } else if (encodedCount >= 2) {
    score += 8;
    reasons.push(`URL contains encoded characters — may be obfuscating content`);
  }

  // 9. Redirect patterns
  const hasRedirect = REDIRECT_PATTERNS.some(p => searchParams.includes(p) || path.includes(p));
  if (hasRedirect) {
    score += 15;
    reasons.push("URL contains redirect parameters — could forward you to a malicious site");
  }

  // 10. Suspicious TLDs
  const tld = hostname.substring(hostname.lastIndexOf("."));
  if (SUSPICIOUS_TLDS.includes(tld)) {
    score += 20;
    reasons.push(`Suspicious top-level domain "${tld}" — commonly used for free/disposable phishing domains`);
  }

  // Cap score at 100
  score = Math.min(score, 100);

  let status: "safe" | "suspicious" | "high_risk";
  if (score <= 30) {
    status = "safe";
  } else if (score <= 70) {
    status = "suspicious";
  } else {
    status = "high_risk";
  }

  if (reasons.length === 0) {
    reasons.push("No phishing indicators detected");
  }

  return {
    score,
    status,
    reasons,
    recommendations: getRecommendations(score),
  };
}

function getRecommendations(score: number): string[] {
  if (score <= 30) {
    return [
      "This URL appears safe — always verify the sender before clicking links in emails",
      "Keep your browser and security software up to date",
      "Look for the padlock icon and HTTPS in the address bar",
    ];
  } else if (score <= 70) {
    return [
      "Exercise caution before visiting this URL — verify its legitimacy through official channels",
      "Do not enter personal information, passwords, or payment details",
      "Check the URL carefully — phishing sites often misspell legitimate domain names",
      "Contact the organization directly using official contact information",
      "Consider using a link scanner or VPN before visiting",
    ];
  } else {
    return [
      "DO NOT visit this URL — it shows strong indicators of being a phishing site",
      "Never enter credentials, credit card details, or personal information",
      "Report this URL to your email provider and to phishing databases",
      "If you have already visited this site, change your passwords immediately",
      "Run a security scan on your device if you clicked this link",
      "Enable two-factor authentication on all important accounts",
    ];
  }
}
