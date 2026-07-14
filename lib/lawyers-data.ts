export interface Review {
  id: string;
  clientName: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  contractType?: string;
}

export interface Credential {
  type: 'education' | 'bar' | 'certification' | 'award';
  title: string;
  institution?: string;
  year?: number;
  description?: string;
}

export interface ConsultationType {
  duration: number; // minutes
  price: number; // 0 for free
  description: string;
  popular?: boolean;
}

export interface Availability {
  day: string;
  slots: string[];
}

export interface Lawyer {
  id: string;
  name: string;
  title: string;
  specialty: string[];
  location: string;
  state: string;
  yearsOfExperience: number;
  rating: number;
  reviewCount: number;
  verified: boolean;
  profileImage: string;
  bio: string;
  expertise: string[];
  languages: string[];
  consultationTypes: ConsultationType[];
  credentials: Credential[];
  reviews: Review[];
  availability: Availability[];
  responseTime: string; // e.g., "Within 2 hours"
  caseSuccessRate?: number;
  featuredBadges?: string[];
}

export const lawyers: Lawyer[] = [
  {
    id: "lawyer-001",
    name: "Sarah Chen",
    title: "Senior Employment Attorney",
    specialty: ["Employment Law", "Contract Negotiation", "Executive Compensation"],
    location: "San Francisco, CA",
    state: "CA",
    yearsOfExperience: 12,
    rating: 4.9,
    reviewCount: 127,
    verified: true,
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    bio: "I specialize in employment contracts, non-compete agreements, and executive negotiations. With over a decade representing both employers and employees, I understand both sides of the table. My goal is to ensure you get fair terms that protect your career and financial interests.",
    expertise: [
      "Employment contract review and negotiation",
      "Non-compete and non-solicitation clauses",
      "Executive compensation packages",
      "Severance agreement negotiation",
      "Stock option and equity analysis",
      "Remote work agreements"
    ],
    languages: ["English", "Mandarin"],
    consultationTypes: [
      {
        duration: 15,
        price: 0,
        description: "Quick contract review - I'll identify the top 3 red flags in your agreement"
      },
      {
        duration: 30,
        price: 150,
        description: "Comprehensive contract analysis with written recommendations",
        popular: true
      },
      {
        duration: 60,
        price: 275,
        description: "Full negotiation strategy session with script preparation"
      }
    ],
    credentials: [
      {
        type: "education",
        title: "J.D., Stanford Law School",
        institution: "Stanford University",
        year: 2012
      },
      {
        type: "bar",
        title: "California State Bar",
        year: 2012
      },
      {
        type: "award",
        title: "Top 40 Under 40 Employment Lawyers",
        institution: "National Employment Lawyers Association",
        year: 2023
      },
      {
        type: "certification",
        title: "Certified Employee Benefits Specialist",
        year: 2018
      }
    ],
    reviews: [
      {
        id: "rev-001",
        clientName: "Michael R.",
        rating: 5,
        date: "2024-11-15",
        comment: "Sarah found clauses in my employment contract that would have cost me $50K+ in unvested stock if I ever left. She negotiated better vesting terms and removed a predatory non-compete. Worth every penny.",
        verified: true,
        contractType: "Employment"
      },
      {
        id: "rev-002",
        clientName: "Jennifer K.",
        rating: 5,
        date: "2024-10-28",
        comment: "Incredibly knowledgeable about tech industry standards. She knew exactly what was negotiable and what wasn't. Got my signing bonus increased by 40%.",
        verified: true,
        contractType: "Employment"
      },
      {
        id: "rev-003",
        clientName: "David L.",
        rating: 4,
        date: "2024-09-12",
        comment: "Very thorough review. Only giving 4 stars because response time was a bit longer than expected during a busy period, but the quality of advice was excellent.",
        verified: true,
        contractType: "Executive Compensation"
      }
    ],
    availability: [
      { day: "Monday", slots: ["9:00 AM", "2:00 PM", "4:00 PM"] },
      { day: "Tuesday", slots: ["10:00 AM", "1:00 PM", "3:00 PM"] },
      { day: "Wednesday", slots: ["9:00 AM", "11:00 AM", "2:00 PM"] },
      { day: "Thursday", slots: ["10:00 AM", "3:00 PM", "5:00 PM"] },
      { day: "Friday", slots: ["9:00 AM", "1:00 PM"] }
    ],
    responseTime: "Within 2 hours",
    caseSuccessRate: 94,
    featuredBadges: ["Top Rated", "Quick Response", "Client Favorite"]
  },
  {
    id: "lawyer-002",
    name: "Marcus Johnson",
    title: "Contract & Business Attorney",
    specialty: ["SaaS Agreements", "Vendor Contracts", "Business Law"],
    location: "Austin, TX",
    state: "TX",
    yearsOfExperience: 8,
    rating: 4.8,
    reviewCount: 89,
    verified: true,
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    bio: "Former in-house counsel for a Fortune 500 tech company, now helping startups and small businesses navigate complex SaaS agreements and vendor contracts. I speak both legal and tech, so you get practical advice without the jargon.",
    expertise: [
      "SaaS subscription agreements",
      "Vendor and supplier contracts",
      "Data processing agreements (DPA)",
      "Service level agreements (SLA)",
      "Software licensing",
      "Terms of Service and Privacy Policies"
    ],
    languages: ["English", "Spanish"],
    consultationTypes: [
      {
        duration: 15,
        price: 0,
        description: "Free initial assessment - is this contract fair for your business?"
      },
      {
        duration: 45,
        price: 200,
        description: "Contract deep dive with negotiation roadmap",
        popular: true
      },
      {
        duration: 90,
        price: 350,
        description: "Full contract rewrite or counter-proposal drafting"
      }
    ],
    credentials: [
      {
        type: "education",
        title: "J.D., University of Texas School of Law",
        institution: "UT Austin",
        year: 2016
      },
      {
        type: "bar",
        title: "Texas State Bar",
        year: 2016
      },
      {
        type: "certification",
        title: "Certified Information Privacy Professional (CIPP/US)",
        year: 2020
      }
    ],
    reviews: [
      {
        id: "rev-004",
        clientName: "Lisa M.",
        rating: 5,
        date: "2024-11-20",
        comment: "Marcus saved our startup from a terrible SaaS contract. The vendor's liability cap was insane - they wanted to limit damages to one month's fees even if they lost all our data. He rewrote the whole thing.",
        verified: true,
        contractType: "SaaS"
      },
      {
        id: "rev-005",
        clientName: "Robert P.",
        rating: 5,
        date: "2024-10-05",
        comment: "Knows SaaS contracts inside and out. Found several auto-renewal traps and helped us negotiate better payment terms. Clear communicator.",
        verified: true,
        contractType: "SaaS"
      }
    ],
    availability: [
      { day: "Monday", slots: ["8:00 AM", "12:00 PM", "3:00 PM"] },
      { day: "Tuesday", slots: ["9:00 AM", "1:00 PM", "4:00 PM"] },
      { day: "Wednesday", slots: ["8:00 AM", "2:00 PM", "5:00 PM"] },
      { day: "Thursday", slots: ["10:00 AM", "12:00 PM", "3:00 PM"] },
      { day: "Friday", slots: ["9:00 AM", "2:00 PM"] }
    ],
    responseTime: "Within 4 hours",
    caseSuccessRate: 91,
    featuredBadges: ["Tech Specialist", "Startup Friendly"]
  },
  {
    id: "lawyer-003",
    name: "Amanda Rodriguez",
    title: "Real Estate & Lease Attorney",
    specialty: ["Residential Leases", "Commercial Real Estate", "Landlord-Tenant Law"],
    location: "New York, NY",
    state: "NY",
    yearsOfExperience: 15,
    rating: 4.9,
    reviewCount: 203,
    verified: true,
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amanda",
    bio: "I've reviewed over 2,000 lease agreements in NYC, from rent-stabilized apartments to high-end commercial spaces. New York has some of the most tenant-friendly laws in the country, but only if you know how to use them. Let me help you avoid the common traps.",
    expertise: [
      "Residential lease review and negotiation",
      "Commercial lease analysis",
      "Rent stabilization and rent control",
      "Security deposit disputes",
      "Lease renewal negotiations",
      "Sublease agreements"
    ],
    languages: ["English", "Spanish"],
    consultationTypes: [
      {
        duration: 20,
        price: 0,
        description: "Free lease red flag check - I'll tell you the top 3 issues"
      },
      {
        duration: 30,
        price: 125,
        description: "Complete lease review with NYC-specific guidance",
        popular: true
      },
      {
        duration: 60,
        price: 225,
        description: "Negotiation strategy + landlord communication templates"
      }
    ],
    credentials: [
      {
        type: "education",
        title: "J.D., Columbia Law School",
        institution: "Columbia University",
        year: 2009
      },
      {
        type: "bar",
        title: "New York State Bar",
        year: 2009
      },
      {
        type: "award",
        title: "NYC Tenant Advocate of the Year",
        institution: "NYC Bar Association",
        year: 2022
      }
    ],
    reviews: [
      {
        id: "rev-006",
        clientName: "Thomas B.",
        rating: 5,
        date: "2024-11-10",
        comment: "Amanda caught an illegal clause that would have let my landlord keep my entire security deposit for any reason. She knows NYC housing law better than anyone.",
        verified: true,
        contractType: "Lease"
      },
      {
        id: "rev-007",
        clientName: "Sarah W.",
        rating: 5,
        date: "2024-09-22",
        comment: "Helped me negotiate a $400/month rent reduction on a commercial space. Paid for itself 10x over in the first month.",
        verified: true,
        contractType: "Commercial Lease"
      },
      {
        id: "rev-008",
        clientName: "Emily R.",
        rating: 5,
        date: "2024-08-15",
        comment: "Super responsive and knows all the NYC quirks. She found that my building was rent-stabilized (landlord didn't mention this!) and saved me thousands.",
        verified: true,
        contractType: "Residential Lease"
      }
    ],
    availability: [
      { day: "Monday", slots: ["10:00 AM", "2:00 PM", "6:00 PM"] },
      { day: "Tuesday", slots: ["9:00 AM", "1:00 PM", "5:00 PM"] },
      { day: "Wednesday", slots: ["10:00 AM", "3:00 PM", "7:00 PM"] },
      { day: "Thursday", slots: ["9:00 AM", "2:00 PM", "4:00 PM"] },
      { day: "Friday", slots: ["10:00 AM", "1:00 PM", "3:00 PM"] }
    ],
    responseTime: "Within 1 hour",
    caseSuccessRate: 96,
    featuredBadges: ["Top Rated", "NYC Expert", "Quick Response"]
  },
  {
    id: "lawyer-004",
    name: "James Patterson",
    title: "Freelance & Independent Contractor Attorney",
    specialty: ["Freelance Contracts", "1099 Agreements", "IP Rights"],
    location: "Denver, CO",
    state: "CO",
    yearsOfExperience: 10,
    rating: 4.7,
    reviewCount: 156,
    verified: true,
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    bio: "I'm a freelancer who became a lawyer to stop getting screwed by bad contracts. I've been on your side of the table, so I know what matters: payment terms, IP ownership, and scope creep protection. Let's make sure you get paid fairly and keep your work.",
    expertise: [
      "Freelance service agreements",
      "Work-for-hire vs. IP retention",
      "Payment terms and milestone structures",
      "Scope of work definitions",
      "Kill fees and cancellation clauses",
      "Master service agreements (MSA)"
    ],
    languages: ["English"],
    consultationTypes: [
      {
        duration: 15,
        price: 0,
        description: "Quick contract sanity check - is this fair for a freelancer?"
      },
      {
        duration: 30,
        price: 100,
        description: "Full contract review with freelancer-specific advice",
        popular: true
      },
      {
        duration: 60,
        price: 180,
        description: "Custom contract template creation for your services"
      }
    ],
    credentials: [
      {
        type: "education",
        title: "J.D., University of Colorado Law School",
        institution: "CU Boulder",
        year: 2014
      },
      {
        type: "bar",
        title: "Colorado State Bar",
        year: 2014
      }
    ],
    reviews: [
      {
        id: "rev-009",
        clientName: "Maria G.",
        rating: 5,
        date: "2024-11-01",
        comment: "James gets freelancers. He added a clause that saved me when a client tried to ghost after I delivered the work. Now I use his templates for every project.",
        verified: true,
        contractType: "Freelance"
      },
      {
        id: "rev-010",
        clientName: "Kevin T.",
        rating: 4,
        date: "2024-09-18",
        comment: "Good advice on IP rights. Helped me keep ownership of my designs while giving the client usage rights. Fair pricing too.",
        verified: true,
        contractType: "Freelance"
      }
    ],
    availability: [
      { day: "Monday", slots: ["11:00 AM", "3:00 PM", "5:00 PM"] },
      { day: "Tuesday", slots: ["10:00 AM", "2:00 PM", "4:00 PM"] },
      { day: "Wednesday", slots: ["9:00 AM", "1:00 PM", "6:00 PM"] },
      { day: "Thursday", slots: ["11:00 AM", "3:00 PM"] },
      { day: "Friday", slots: ["10:00 AM", "2:00 PM", "4:00 PM"] }
    ],
    responseTime: "Within 3 hours",
    caseSuccessRate: 88,
    featuredBadges: ["Freelancer Friendly", "Affordable"]
  },
  {
    id: "lawyer-005",
    name: "Dr. Rachel Kim",
    title: "Partnership & Business Formation Attorney",
    specialty: ["Partnership Agreements", "LLC Formation", "Shareholder Agreements"],
    location: "Seattle, WA",
    state: "WA",
    yearsOfExperience: 14,
    rating: 4.9,
    reviewCount: 112,
    verified: true,
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel",
    bio: "I have a PhD in Economics and a J.D., so I approach partnership agreements with both legal precision and financial strategy. Starting a business with partners? 70% of partnerships fail due to unclear agreements. Let's make sure yours is in the 30%.",
    expertise: [
      "Partnership agreement drafting",
      "Buy-sell agreements",
      "Equity split negotiations",
      "Vesting schedules for co-founders",
      "Operating agreements (LLC)",
      "Shareholder agreements"
    ],
    languages: ["English", "Korean"],
    consultationTypes: [
      {
        duration: 20,
        price: 0,
        description: "Partnership agreement health check"
      },
      {
        duration: 45,
        price: 225,
        description: "Comprehensive partnership agreement review",
        popular: true
      },
      {
        duration: 120,
        price: 500,
        description: "Custom partnership agreement drafting session"
      }
    ],
    credentials: [
      {
        type: "education",
        title: "J.D., Yale Law School",
        institution: "Yale University",
        year: 2010
      },
      {
        type: "education",
        title: "Ph.D. in Economics",
        institution: "MIT",
        year: 2007
      },
      {
        type: "bar",
        title: "Washington State Bar",
        year: 2010
      },
      {
        type: "award",
        title: "Best Business Attorney - Seattle",
        institution: "Seattle Business Magazine",
        year: 2023
      }
    ],
    reviews: [
      {
        id: "rev-011",
        clientName: "Alex M.",
        rating: 5,
        date: "2024-10-12",
        comment: "Rachel saved our startup from disaster. Our initial 50/50 split had no provisions for what happens if someone leaves. She created a proper vesting schedule and buyout terms.",
        verified: true,
        contractType: "Partnership"
      },
      {
        id: "rev-012",
        clientName: "Christine L.",
        rating: 5,
        date: "2024-08-30",
        comment: "Incredibly thorough. She thinks through scenarios we never considered. Her economics background really shows in how she structures equity.",
        verified: true,
        contractType: "Shareholder Agreement"
      }
    ],
    availability: [
      { day: "Monday", slots: ["9:00 AM", "1:00 PM", "4:00 PM"] },
      { day: "Tuesday", slots: ["10:00 AM", "2:00 PM"] },
      { day: "Wednesday", slots: ["9:00 AM", "11:00 AM", "3:00 PM"] },
      { day: "Thursday", slots: ["10:00 AM", "1:00 PM", "4:00 PM"] },
      { day: "Friday", slots: ["9:00 AM", "12:00 PM"] }
    ],
    responseTime: "Within 2 hours",
    caseSuccessRate: 95,
    featuredBadges: ["Top Rated", "Startup Expert"]
  },
  {
    id: "lawyer-006",
    name: "Carlos Mendez",
    title: "General Contract Attorney",
    specialty: ["General Contract Review", "Business Agreements", "Consumer Contracts"],
    location: "Miami, FL",
    state: "FL",
    yearsOfExperience: 9,
    rating: 4.6,
    reviewCount: 94,
    verified: true,
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
    bio: "Your go-to lawyer for any contract that doesn't fit a neat category. I've reviewed everything from gym memberships to construction agreements. If it's got legal language that makes your head spin, I can help.",
    expertise: [
      "General contract review",
      "Service agreements",
      "Purchase agreements",
      "Settlement agreements",
      "Confidentiality agreements (NDA)",
      "Independent contractor agreements"
    ],
    languages: ["English", "Spanish"],
    consultationTypes: [
      {
        duration: 15,
        price: 0,
        description: "Quick contract overview - should you be worried?"
      },
      {
        duration: 30,
        price: 95,
        description: "Standard contract review with plain-English summary",
        popular: true
      },
      {
        duration: 60,
        price: 175,
        description: "Detailed analysis with negotiation suggestions"
      }
    ],
    credentials: [
      {
        type: "education",
        title: "J.D., University of Miami School of Law",
        institution: "University of Miami",
        year: 2015
      },
      {
        type: "bar",
        title: "Florida State Bar",
        year: 2015
      }
    ],
    reviews: [
      {
        id: "rev-013",
        clientName: "Patricia H.",
        rating: 5,
        date: "2024-11-05",
        comment: "Carlos reviewed a construction contract for my home renovation. Found several clauses that would have let the contractor charge unlimited 'change order fees.' Super affordable too.",
        verified: true,
        contractType: "Service Agreement"
      },
      {
        id: "rev-014",
        clientName: "Brandon K.",
        rating: 4,
        date: "2024-09-14",
        comment: "Solid advice, nothing fancy but got the job done. Helped me understand an NDA my new employer wanted me to sign.",
        verified: true,
        contractType: "NDA"
      }
    ],
    availability: [
      { day: "Monday", slots: ["8:00 AM", "12:00 PM", "4:00 PM", "6:00 PM"] },
      { day: "Tuesday", slots: ["9:00 AM", "1:00 PM", "5:00 PM"] },
      { day: "Wednesday", slots: ["8:00 AM", "2:00 PM", "6:00 PM"] },
      { day: "Thursday", slots: ["10:00 AM", "3:00 PM", "5:00 PM"] },
      { day: "Friday", slots: ["9:00 AM", "1:00 PM", "4:00 PM"] }
    ],
    responseTime: "Within 6 hours",
    caseSuccessRate: 87,
    featuredBadges: ["Affordable", "Bilingual"]
  }
];

export const specialties = [
  "Employment Law",
  "Contract Negotiation",
  "SaaS Agreements",
  "Real Estate & Leases",
  "Freelance Contracts",
  "Partnership Agreements",
  "Business Law",
  "IP Rights",
  "General Contract Review"
];

export const states = ["CA", "TX", "NY", "CO", "WA", "FL"];

export const priceRanges = [
  { label: "Free Consultation", min: 0, max: 0 },
  { label: "Under $100", min: 0, max: 100 },
  { label: "$100 - $200", min: 100, max: 200 },
  { label: "$200 - $300", min: 200, max: 300 },
  { label: "$300+", min: 300, max: 10000 }
];
