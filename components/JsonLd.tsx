/**
 * JsonLd — reusable server component that injects structured data into <head>.
 * Usage: <JsonLd data={schemaObject} />
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ─── Pre-built schema factories ──────────────────────────────────────────────

const BASE_URL = "https://beforeyousign.vercel.app";

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "BeforeYouSign",
    url: BASE_URL,
    description:
      "AI-powered contract analysis platform that identifies risks, decodes legalese, and provides strategic recommendations.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BeforeYouSign",
    url: BASE_URL,
    logo: `${BASE_URL}/favicon.ico`,
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: `${BASE_URL}/lawyers`,
    },
    description:
      "Democratizing legal comprehension through institutional-grade AI contract intelligence.",
    foundingDate: "2025",
    numberOfEmployees: { "@type": "QuantitativeValue", value: "1-10" },
  };
}

export function softwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "BeforeYouSign",
    operatingSystem: "Web",
    applicationCategory: "BusinessApplication",
    url: BASE_URL,
    screenshot: `${BASE_URL}/opengraph-image`,
    description:
      "Upload any contract and receive instant AI-powered risk analysis, hidden clause detection, obligation tracking, and negotiation recommendations.",
    featureList: [
      "AI contract risk analysis",
      "Hidden clause detection",
      "Plain language translation",
      "Obligation tracking and deadline alerts",
      "AI negotiation recommendations",
      "Contract comparison",
      "Dispute probability prediction",
      "50+ language support",
      "Clause library with 5000+ vetted clauses",
    ],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free contract analysis — no account required",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "847",
      bestRating: "5",
    },
  };
}

export function homepageFaqSchema() {
  const faqs = [
    {
      question: "Is BeforeYouSign free to use?",
      answer:
        "Yes, the core contract analysis is completely free with no account required. Upload your contract and get instant results.",
    },
    {
      question: "What types of contracts can I analyze?",
      answer:
        "BeforeYouSign supports all common contract types including employment agreements, NDAs, lease agreements, SaaS contracts, freelance contracts, service agreements, and more. You can upload PDF or plain text files.",
    },
    {
      question: "Is my contract data kept private?",
      answer:
        "Your contracts are never stored on our servers. All analysis happens in real-time and the document is discarded immediately after processing. Your sensitive information stays private.",
    },
    {
      question: "How accurate is the AI contract analysis?",
      answer:
        "BeforeYouSign uses cutting-edge Llama 3.1 language models to analyze contracts with industry-leading accuracy. Our risk predictor achieves 82-95% accuracy on dispute probability forecasting.",
    },
    {
      question: "Can BeforeYouSign replace a lawyer?",
      answer:
        "BeforeYouSign provides analytical intelligence and educational insights, not legal advice. For complex matters or high-stakes contracts, we recommend consulting a qualified lawyer. We make it easy to connect with verified legal professionals through our lawyer marketplace.",
    },
    {
      question: "How long does contract analysis take?",
      answer:
        "Most contracts are fully analyzed in under 30 seconds. Our streaming AI provides real-time feedback so you can see the analysis as it happens.",
    },
    {
      question: "Does BeforeYouSign support multiple languages?",
      answer:
        "Yes, BeforeYouSign can analyze contracts written in 50+ languages and provides analysis in English. Our multi-language feature ensures you're protected regardless of the contract's original language.",
    },
    {
      question: "What risks does the AI detect?",
      answer:
        "Our AI detects unlimited liability clauses, automatic renewal traps, IP assignment provisions, one-sided termination rights, non-compete overreach, hidden penalties, jurisdiction issues, and many more unfavorable conditions.",
    },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}

export function analyzeHowToSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Analyze a Contract with AI",
    description:
      "Use BeforeYouSign to get free, instant AI-powered contract analysis and identify hidden risks.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Upload Your Contract",
        text: "Upload your contract as a PDF or paste the text directly. Supported formats include PDF, DOCX, and plain text.",
        url: `${BASE_URL}/analyze`,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Select Your Jurisdiction",
        text: "Choose the relevant jurisdiction so the AI can apply the correct legal framework for your analysis.",
        url: `${BASE_URL}/analyze`,
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Review AI Analysis",
        text: "Receive a comprehensive risk report including hidden clauses, risk scores, plain-language summaries, and negotiation recommendations within 30 seconds.",
        url: `${BASE_URL}/analyze`,
      },
    ],
  };
}

export function breadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
