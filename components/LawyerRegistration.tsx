'use client';

import { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Scale, 
  DollarSign, 
  Calendar, 
  FileText,
  Upload,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Plus,
  X,
  Award,
  Clock,
  Building2,
  Globe,
  Link2,
  Shield,
  TrendingUp,
  Users,
  MessageCircle,
  Star,
  FileCheck,
  AlertCircle,
  Image as ImageIcon,
  Trash2,
  Info
} from 'lucide-react';
import Link from 'next/link';

interface FormData {
  // Personal Info
  name: string;
  email: string;
  phone: string;
  location: string;
  state: string;
  profileImage: string;
  
  // Professional Info
  title: string;
  specialty: string[];
  yearsOfExperience: number;
  barAdmission: string[];
  barNumber: string;
  languages: string[];
  firmName: string;
  website: string;
  linkedin: string;
  
  // Credentials & Documents
  education: Array<{ degree: string; institution: string; year: string }>;
  certifications: Array<{ title: string; year: string }>;
  awards: Array<{ title: string; institution: string; year: string }>;
  barLicense: File | null;
  professionalHeadshot: File | null;
  malpracticeInsurance: File | null;
  
  // Practice
  bio: string;
  expertise: string[];
  practiceAreas: Array<{ area: string; yearsInField: number; caseCount: number }>;
  successStories: string[];
  
  // Pricing & Business
  consultations: Array<{ duration: number; price: number; description: string; popular?: boolean }>;
  responseTime: string;
  acceptedPaymentMethods: string[];
  subscriptionPlan: 'basic' | 'professional' | 'premium';
  
  // Availability & Preferences
  availability: Array<{ day: string; slots: string[] }>;
  timezone: string;
  preferredContactMethod: string;
  maxClientsPerWeek: number;
  
  // Terms & Verification
  agreedToTerms: boolean;
  agreedToBackgroundCheck: boolean;
  marketingConsent: boolean;
}

const initialFormData: FormData = {
  name: '',
  email: '',
  phone: '',
  location: '',
  state: '',
  profileImage: '',
  title: '',
  specialty: [],
  yearsOfExperience: 0,
  barAdmission: [],
  barNumber: '',
  languages: ['English'],
  firmName: '',
  website: '',
  linkedin: '',
  education: [{ degree: '', institution: '', year: '' }],
  certifications: [],
  awards: [],
  barLicense: null,
  professionalHeadshot: null,
  malpracticeInsurance: null,
  bio: '',
  expertise: [''],
  practiceAreas: [],
  successStories: [],
  consultations: [
    { duration: 15, price: 0, description: 'Quick contract review - identify top red flags', popular: false },
    { duration: 30, price: 150, description: 'Comprehensive contract analysis with recommendations', popular: true },
    { duration: 60, price: 275, description: 'Full negotiation strategy session', popular: false }
  ],
  responseTime: 'Within 4 hours',
  acceptedPaymentMethods: ['Credit Card', 'PayPal'],
  subscriptionPlan: 'professional',
  availability: [],
  timezone: 'America/New_York',
  preferredContactMethod: 'Email',
  maxClientsPerWeek: 10,
  agreedToTerms: false,
  agreedToBackgroundCheck: false,
  marketingConsent: false
};

const specialties = [
  'Employment Law',
  'Contract Negotiation',
  'SaaS Agreements',
  'Real Estate & Leases',
  'Freelance Contracts',
  'Partnership Agreements',
  'Business Law',
  'IP Rights',
  'General Contract Review',
  'Corporate Law',
  'Intellectual Property',
  'Tax Law',
  'Immigration Law',
  'Family Law',
  'Criminal Defense'
];

const states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const timeSlots = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'
];

const timezones = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Phoenix',
  'America/Anchorage',
  'Pacific/Honolulu'
];

const subscriptionPlans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 49,
    features: [
      'Profile on marketplace',
      'Up to 5 clients/month',
      'Basic analytics',
      'Email support',
      '10% platform fee'
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 99,
    features: [
      'Featured profile placement',
      'Unlimited clients',
      'Advanced analytics & insights',
      'Priority support',
      '7% platform fee',
      'Verified badge',
      'Calendar integration'
    ],
    popular: true
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 199,
    features: [
      'Top marketplace placement',
      'Unlimited clients',
      'White-label branding',
      'Dedicated account manager',
      '5% platform fee',
      'Verified badge',
      'All integrations',
      'Custom analytics'
    ]
  }
];

export default function LawyerRegistration() {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const addArrayItem = <K extends keyof FormData>(key: K, item: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: [...(prev[key] as any[]), item]
    }));
  };

  const removeArrayItem = <K extends keyof FormData>(key: K, index: number) => {
    setFormData(prev => ({
      ...prev,
      [key]: (prev[key] as any[]).filter((_, i) => i !== index)
    }));
  };

  const updateArrayItem = <K extends keyof FormData>(key: K, index: number, updates: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: (prev[key] as any[]).map((item, i) => i === index ? { ...item, ...updates } : item)
    }));
  };

  const toggleSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialty: prev.specialty.includes(specialty)
        ? prev.specialty.filter(s => s !== specialty)
        : [...prev.specialty, specialty]
    }));
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
      if (!formData.location.trim()) newErrors.location = 'Location is required';
      if (!formData.state) newErrors.state = 'State is required';
      if (formData.yearsOfExperience < 1) newErrors.yearsOfExperience = 'Must have at least 1 year of experience';
    }

    if (currentStep === 2) {
      if (formData.specialty.length === 0) newErrors.specialty = 'Select at least one practice area';
      if (formData.barAdmission.length === 0) newErrors.barAdmission = 'Bar admission is required';
      if (!formData.barNumber.trim()) newErrors.barNumber = 'Bar number is required';
      if (formData.education.length === 0 || !formData.education[0].degree) newErrors.education = 'Education is required';
      if (!formData.barLicense) newErrors.barLicense = 'Bar license document is required';
      if (!formData.professionalHeadshot) newErrors.professionalHeadshot = 'Professional headshot is required';
    }

    if (currentStep === 3) {
      if (!formData.bio.trim() || formData.bio.length < 200) newErrors.bio = 'Bio must be at least 200 characters';
      if (formData.expertise.filter(e => e.trim()).length === 0) newErrors.expertise = 'Add at least one area of expertise';
    }

    if (currentStep === 4) {
      if (formData.consultations.length === 0) newErrors.consultations = 'Add at least one consultation package';
      if (formData.availability.length === 0) newErrors.availability = 'Set your availability';
    }

    if (currentStep === 6) {
      if (!formData.agreedToTerms) newErrors.terms = 'You must agree to the terms and conditions';
      if (!formData.agreedToBackgroundCheck) newErrors.background = 'Background check consent is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileUpload = (field: 'barLicense' | 'professionalHeadshot' | 'malpracticeInsurance', file: File) => {
    // Simulate upload progress
    setUploadProgress(prev => ({ ...prev, [field]: 0 }));
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const current = prev[field] || 0;
        if (current >= 100) {
          clearInterval(interval);
          return prev;
        }
        return { ...prev, [field]: current + 10 };
      });
    }, 100);

    // Update form data
    updateFormData({ [field]: file } as any);
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep((step + 1) as any);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = () => {
    if (validateStep(6)) {
      setSubmitted(true);
      // TODO: Send formData to backend API endpoint
    }
  };

  const toggleBarState = (state: string) => {
    setFormData(prev => ({
      ...prev,
      barAdmission: prev.barAdmission.includes(state)
        ? prev.barAdmission.filter(s => s !== state)
        : [...prev.barAdmission, state]
    }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
        <div className="max-w-2xl w-full bg-white border border-stone-200 rounded-2xl p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-stone-900 mb-4">Application Submitted!</h1>
          <p className="text-lg text-stone-600 mb-8">
            Thank you for registering, {formData.name}. Our team will review your application and credentials within 2-3 business days.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-semibold text-blue-900 mb-3">What happens next?</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>We\'ll verify your bar admission and credentials</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>You\'ll receive an email with next steps and profile setup</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Once approved, your profile goes live on the marketplace</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Start accepting consultations and building your client base</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/lawyers">
              <button className="px-8 py-3 bg-stone-900 text-white rounded-xl font-semibold hover:bg-stone-800 transition-colors">
                Browse Lawyers
              </button>
            </Link>
            <Link href="/">
              <button className="px-8 py-3 border-2 border-stone-900 text-stone-900 rounded-xl font-semibold hover:bg-stone-50 transition-colors">
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 light-section-pattern">
      {/* Header */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white py-12 dark-section-pattern">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-3">Join Our Lawyer Network</h1>
          <p className="text-xl text-stone-300">
            Connect with clients who need expert contract review and negotiation help
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {[
              { num: 1, title: 'Personal Info', icon: User },
              { num: 2, title: 'Credentials', icon: Shield },
              { num: 3, title: 'Practice Details', icon: Briefcase },
              { num: 4, title: 'Pricing & Availability', icon: DollarSign },
              { num: 5, title: 'Subscription', icon: TrendingUp },
              { num: 6, title: 'Review & Submit', icon: CheckCircle }
            ].map((s, index) => {
              const stepIndex = step;
              const currentIndex = s.num;
              const isActive = currentIndex <= stepIndex;
              const isCurrent = s.num === step;
              const Icon = s.icon;

              return (
                <div key={s.num} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold mb-2 transition-all ${
                      isActive ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-600'
                    } ${isCurrent ? 'ring-4 ring-stone-300 scale-110' : ''}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-xs font-medium text-center ${step >= s.num ? 'text-stone-900' : 'text-stone-500'}`}>
                      {s.title}
                    </span>
                  </div>
                  {index < 5 && (
                    <div className={`h-0.5 w-full -mt-8 ${step > s.num ? 'bg-stone-900' : 'bg-stone-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white border border-stone-200 rounded-xl p-8">
          
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-stone-900 mb-2">Personal Information</h2>
                <p className="text-stone-600">Let's start with the basics about you and your practice</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-stone-900 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => updateFormData({ name: e.target.value })}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${
                      errors.name ? 'border-red-500 focus:border-red-500' : 'border-stone-200 focus:border-stone-900'
                    }`}
                    placeholder="Dr. Jane Smith, Esq."
                  />
                  {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-900 mb-2">
                    <Briefcase className="w-4 h-4 inline mr-1" />
                    Professional Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => updateFormData({ title: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-stone-900 focus:outline-none"
                    placeholder="Senior Employment Attorney"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-900 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => updateFormData({ email: e.target.value })}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${
                      errors.email ? 'border-red-500 focus:border-red-500' : 'border-stone-200 focus:border-stone-900'
                    }`}
                    placeholder="jane.smith@lawfirm.com"
                  />
                  {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-900 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => updateFormData({ phone: e.target.value })}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${
                      errors.phone ? 'border-red-500 focus:border-red-500' : 'border-stone-200 focus:border-stone-900'
                    }`}
                    placeholder="(555) 123-4567"
                  />
                  {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-900 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    City & State *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => updateFormData({ location: e.target.value })}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${
                      errors.location ? 'border-red-500 focus:border-red-500' : 'border-stone-200 focus:border-stone-900'
                    }`}
                    placeholder="San Francisco, CA"
                  />
                  {errors.location && <p className="text-red-600 text-xs mt-1">{errors.location}</p>}
                </div>

                <div>
                  <label htmlFor="primary-state-select" className="block text-sm font-semibold text-stone-900 mb-2">
                    Primary State *
                  </label>
                  <select
                    id="primary-state-select"
                    value={formData.state}
                    onChange={(e) => updateFormData({ state: e.target.value })}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${
                      errors.state ? 'border-red-500 focus:border-red-500' : 'border-stone-200 focus:border-stone-900'
                    }`}
                  >
                    <option value="">Select state...</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  {errors.state && <p className="text-red-600 text-xs mt-1">{errors.state}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-900 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Years of Experience *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.yearsOfExperience || ''}
                    onChange={(e) => updateFormData({ yearsOfExperience: parseInt(e.target.value) || 0 })}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${
                      errors.yearsOfExperience ? 'border-red-500 focus:border-red-500' : 'border-stone-200 focus:border-stone-900'
                    }`}
                    placeholder="10"
                  />
                  {errors.yearsOfExperience && <p className="text-red-600 text-xs mt-1">{errors.yearsOfExperience}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-900 mb-2">
                    <Building2 className="w-4 h-4 inline mr-1" />
                    Law Firm / Practice Name
                  </label>
                  <input
                    type="text"
                    value={formData.firmName}
                    onChange={(e) => updateFormData({ firmName: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-stone-900 focus:outline-none"
                    placeholder="Smith & Associates Law Firm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-900 mb-2">
                    <Globe className="w-4 h-4 inline mr-1" />
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => updateFormData({ website: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-stone-900 focus:outline-none"
                    placeholder="https://www.yourfirm.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-900 mb-2">
                    <Link2 className="w-4 h-4 inline mr-1" />
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => updateFormData({ linkedin: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-stone-900 focus:outline-none"
                    placeholder="https://linkedin.com/in/janesmith"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-1">Verification Required</p>
                    <p>All information will be verified before your profile goes live. Make sure your details match your bar records and professional credentials.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Credentials */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-stone-900 mb-2">Professional Credentials</h2>
                <p className="text-stone-600">Provide your credentials and supporting documents for verification</p>
              </div>

              {/* Document Uploads */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <h3 className="font-semibold text-amber-900 mb-4 flex items-center gap-2">
                  <FileCheck className="w-5 h-5" />
                  Required Documents
                </h3>
                
                <div className="space-y-4">
                  {/* Professional Headshot */}
                  <div>
                    <label className="block text-sm font-semibold text-stone-900 mb-2">
                      <ImageIcon className="w-4 h-4 inline mr-1" />
                      Professional Headshot *
                    </label>
                    <div className="border-2 border-dashed border-stone-300 rounded-lg p-6 text-center hover:border-stone-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload('professionalHeadshot', e.target.files[0])}
                        className="hidden"
                        id="headshot-upload"
                      />
                      <label htmlFor="headshot-upload" className="cursor-pointer">
                        {formData.professionalHeadshot ? (
                          <div className="flex items-center justify-center gap-3">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                            <div>
                              <p className="font-medium text-green-900">{formData.professionalHeadshot.name}</p>
                              <p className="text-xs text-green-700">Click to replace</p>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <Upload className="w-12 h-12 text-stone-400 mx-auto mb-3" />
                            <p className="text-sm font-medium text-stone-900 mb-1">Upload professional photo</p>
                            <p className="text-xs text-stone-600">JPG, PNG up to 5MB. Professional business attire recommended.</p>
                          </div>
                        )}
                      </label>
                      {uploadProgress.professionalHeadshot !== undefined && uploadProgress.professionalHeadshot < 100 && (
                        <div className="mt-3">
                          <div className="w-full bg-stone-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full progress-bar" style={{ width: `${uploadProgress.professionalHeadshot}%` }} />
                          </div>
                        </div>
                      )}
                    </div>
                    {errors.professionalHeadshot && <p className="text-red-600 text-xs mt-1">{errors.professionalHeadshot}</p>}
                  </div>

                  {/* Bar License */}
                  <div>
                    <label className="block text-sm font-semibold text-stone-900 mb-2">
                      <Shield className="w-4 h-4 inline mr-1" />
                      Bar License Certificate *
                    </label>
                    <div className="border-2 border-dashed border-stone-300 rounded-lg p-6 text-center hover:border-stone-400 transition-colors">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload('barLicense', e.target.files[0])}
                        className="hidden"
                        id="bar-license-upload"
                      />
                      <label htmlFor="bar-license-upload" className="cursor-pointer">
                        {formData.barLicense ? (
                          <div className="flex items-center justify-center gap-3">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                            <div>
                              <p className="font-medium text-green-900">{formData.barLicense.name}</p>
                              <p className="text-xs text-green-700">Click to replace</p>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <FileCheck className="w-12 h-12 text-stone-400 mx-auto mb-3" />
                            <p className="text-sm font-medium text-stone-900 mb-1">Upload bar certificate</p>
                            <p className="text-xs text-stone-600">PDF or image up to 10MB</p>
                          </div>
                        )}
                      </label>
                      {uploadProgress.barLicense !== undefined && uploadProgress.barLicense < 100 && (
                        <div className="mt-3">
                          <div className="w-full bg-stone-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full progress-bar" style={{ width: `${uploadProgress.barLicense}%` }} />
                          </div>
                        </div>
                      )}
                    </div>
                    {errors.barLicense && <p className="text-red-600 text-xs mt-1">{errors.barLicense}</p>}
                  </div>

                  {/* Malpractice Insurance */}
                  <div>
                    <label className="block text-sm font-semibold text-stone-900 mb-2">
                      <Shield className="w-4 h-4 inline mr-1" />
                      Malpractice Insurance (Optional but Recommended)
                    </label>
                    <div className="border-2 border-dashed border-stone-300 rounded-lg p-6 text-center hover:border-stone-400 transition-colors">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload('malpracticeInsurance', e.target.files[0])}
                        className="hidden"
                        id="insurance-upload"
                      />
                      <label htmlFor="insurance-upload" className="cursor-pointer">
                        {formData.malpracticeInsurance ? (
                          <div className="flex items-center justify-center gap-3">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                            <div>
                              <p className="font-medium text-green-900">{formData.malpracticeInsurance.name}</p>
                              <p className="text-xs text-green-700">Click to replace</p>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <Shield className="w-12 h-12 text-stone-400 mx-auto mb-3" />
                            <p className="text-sm font-medium text-stone-900 mb-1">Upload insurance certificate</p>
                            <p className="text-xs text-stone-600">Clients prefer lawyers with malpractice insurance</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bar Admission */}
              <div>
                <label className="block text-sm font-semibold text-stone-900 mb-2">
                  <Scale className="w-4 h-4 inline mr-1" />
                  Bar Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.barNumber}
                  onChange={(e) => updateFormData({ barNumber: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${
                    errors.barNumber ? 'border-red-500 focus:border-red-500' : 'border-stone-200 focus:border-stone-900'
                  }`}
                  placeholder="123456"
                />
                {errors.barNumber && <p className="text-red-600 text-xs mt-1">{errors.barNumber}</p>}
                <p className="text-xs text-stone-500 mt-1">Your state bar registration number will be verified</p>
              </div>

              {/* Specialties */}
              <div>
                <label className="block text-sm font-semibold text-stone-900 mb-3">
                  Practice Areas * (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {specialties.map(spec => (
                    <label key={spec} className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.specialty.includes(spec)
                        ? 'border-stone-900 bg-stone-50'
                        : 'border-stone-200 hover:border-stone-400'
                    }`}>
                      <input
                        type="checkbox"
                        checked={formData.specialty.includes(spec)}
                        onChange={() => toggleSpecialty(spec)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-stone-700">{spec}</span>
                    </label>
                  ))}
                </div>
                {errors.specialty && <p className="text-red-600 text-xs mt-1">{errors.specialty}</p>}
              </div>

              {/* Bar Admission States */}
              <div>
                <label className="block text-sm font-semibold text-stone-900 mb-3">
                  <Scale className="w-4 h-4 inline mr-1" />
                  Bar Admission * (Select all states where you\'re admitted to practice)
                </label>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-2 max-h-64 overflow-y-auto p-4 bg-stone-50 rounded-lg border border-stone-200">
                  {states.map(state => (
                    <label key={state} className={`flex items-center gap-2 p-2 border rounded cursor-pointer transition-all ${
                      formData.barAdmission.includes(state)
                        ? 'border-stone-900 bg-white shadow-sm'
                        : 'border-stone-200 bg-white hover:border-stone-400'
                    }`}>
                      <input
                        type="checkbox"
                        checked={formData.barAdmission.includes(state)}
                        onChange={() => toggleBarState(state)}
                        className="w-3 h-3"
                      />
                      <span className="text-xs text-stone-700 font-medium">{state}</span>
                    </label>
                  ))}
                </div>
                {errors.barAdmission && <p className="text-red-600 text-xs mt-1">{errors.barAdmission}</p>}
              </div>

              {/* Education */}
              <div>
                <label className="block text-sm font-semibold text-stone-900 mb-3">
                  <GraduationCap className="w-4 h-4 inline mr-1" />
                  Education *
                </label>
                {formData.education.map((edu, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3 p-4 bg-stone-50 rounded-lg border border-stone-200">
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateArrayItem('education', index, { degree: e.target.value })}
                      className="px-3 py-2 border border-stone-300 rounded-lg focus:border-stone-900 focus:outline-none bg-white"
                      placeholder="J.D."
                    />
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => updateArrayItem('education', index, { institution: e.target.value })}
                      className="px-3 py-2 border border-stone-300 rounded-lg focus:border-stone-900 focus:outline-none bg-white"
                      placeholder="Stanford Law School"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={edu.year}
                        onChange={(e) => updateArrayItem('education', index, { year: e.target.value })}
                        className="flex-1 px-3 py-2 border border-stone-300 rounded-lg focus:border-stone-900 focus:outline-none bg-white"
                        placeholder="2015"
                      />
                      {formData.education.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('education', index)}
                          aria-label="Remove education entry"
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('education', { degree: '', institution: '', year: '' })}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-stone-600 hover:text-stone-900 border-2 border-dashed border-stone-300 hover:border-stone-400 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Another Degree
                </button>
                {errors.education && <p className="text-red-600 text-xs mt-1">{errors.education}</p>}
              </div>

              {/* Certifications */}
              <div>
                <label className="block text-sm font-semibold text-stone-900 mb-3">
                  <Award className="w-4 h-4 inline mr-1" />
                  Certifications (Optional)
                </label>
                {formData.certifications.map((cert, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 p-4 bg-stone-50 rounded-lg border border-stone-200">
                    <input
                      type="text"
                      value={cert.title}
                      onChange={(e) => updateArrayItem('certifications', index, { title: e.target.value })}
                      className="px-3 py-2 border border-stone-300 rounded-lg focus:border-stone-900 focus:outline-none bg-white"
                      placeholder="Certified Employee Benefits Specialist"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={cert.year}
                        onChange={(e) => updateArrayItem('certifications', index, { year: e.target.value })}
                        className="flex-1 px-3 py-2 border border-stone-300 rounded-lg focus:border-stone-900 focus:outline-none bg-white"
                        placeholder="2020"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem('certifications', index)}
                        aria-label="Remove certification"
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('certifications', { title: '', year: '' })}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-stone-600 hover:text-stone-900 border-2 border-dashed border-stone-300 hover:border-stone-400 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Certification
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Practice Details */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2 text-stone-900">Practice Details</h2>
                <p className="text-stone-600">Tell us about your practice and expertise to help clients find you</p>
              </div>

              {/* Professional Bio */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Make Your Bio Stand Out</p>
                    <p>Include your unique approach, notable achievements, and what sets you apart. This is often the first thing potential clients read.</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-stone-900">
                  Professional Bio *
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => {
                    if (e.target.value.length <= 1000) {
                      updateFormData({ bio: e.target.value })
                    }
                  }}
                  placeholder="Describe your legal practice, approach, and what makes you unique. Include notable cases, years of experience, and your philosophy on client service..."
                  rows={8}
                  className={`w-full px-4 py-3 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all ${
                    errors.bio ? 'border-red-500' : 'border-stone-300'
                  }`}
                />
                <div className="flex items-center justify-between mt-1">
                  {errors.bio && (
                    <p className="text-sm text-red-600">{errors.bio}</p>
                  )}
                  <p className={`text-sm ml-auto ${
                    formData.bio.length > 900 ? 'text-amber-600 font-semibold' : 'text-stone-500'
                  }`}>
                    {formData.bio.length}/1000 characters
                  </p>
                </div>
              </div>

              {/* Languages */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-stone-900">
                  Languages Spoken *
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {['English', 'Spanish', 'Mandarin', 'French', 'German', 'Portuguese', 'Arabic', 'Hindi', 'Japanese', 'Korean'].map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => {
                        const newLangs = formData.languages.includes(lang)
                          ? formData.languages.filter(l => l !== lang)
                          : [...formData.languages, lang];
                        updateFormData({ languages: newLangs });
                      }}
                      className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                        formData.languages.includes(lang)
                          ? 'bg-stone-900 text-white border-stone-900'
                          : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
                {errors.languages && (
                  <p className="text-sm text-red-600">{errors.languages}</p>
                )}
              </div>

              {/* Expertise Areas */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-stone-900">
                  Areas of Expertise * (What specific services do you offer?)
                </label>
                <p className="text-sm text-stone-600 mb-3">List specific legal services or areas where you have deep expertise</p>
                
                <div className="space-y-2 mb-3">
                  {formData.expertise.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const newExpertise = [...formData.expertise];
                          newExpertise[index] = e.target.value;
                          updateFormData({ expertise: newExpertise });
                        }}
                        className="flex-1 px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-stone-900 focus:outline-none"
                        placeholder="e.g., Employment contract review and negotiation"
                      />
                      {formData.expertise.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            updateFormData({ expertise: formData.expertise.filter((_, i) => i !== index) });
                          }}
                          aria-label="Remove expertise area"
                          className="px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => updateFormData({ expertise: [...formData.expertise, ''] })}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-stone-300 rounded-lg text-stone-600 hover:border-stone-400 hover:text-stone-900 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add Expertise Area
                </button>
              </div>

              {/* Practice Areas with Detail */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-stone-900">
                  Practice Areas with Experience
                </label>
                <p className="text-sm text-stone-600 mb-3">Provide details about your experience in specific practice areas</p>
                
                <div className="space-y-3 mb-3">
                  {formData.practiceAreas.map((area, index) => (
                    <div key={index} className="bg-stone-50 border border-stone-200 rounded-xl p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-2">
                          <input
                            type="text"
                            value={area.area}
                            onChange={(e) => {
                              const newAreas = [...formData.practiceAreas];
                              newAreas[index].area = e.target.value;
                              updateFormData({ practiceAreas: newAreas });
                            }}
                            placeholder="e.g., Employment Discrimination, Contract Disputes"
                            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                          />
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={area.yearsInField || ''}
                            onChange={(e) => {
                              const newAreas = [...formData.practiceAreas];
                              newAreas[index].yearsInField = parseInt(e.target.value) || 0;
                              updateFormData({ practiceAreas: newAreas });
                            }}
                            placeholder="Years"
                            className="flex-1 px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              updateFormData({ practiceAreas: formData.practiceAreas.filter((_, i) => i !== index) });
                            }}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label="Remove practice area"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-2">
                        <input
                          type="number"
                          value={area.caseCount || ''}
                          onChange={(e) => {
                            const newAreas = [...formData.practiceAreas];
                            newAreas[index].caseCount = parseInt(e.target.value) || 0;
                            updateFormData({ practiceAreas: newAreas });
                          }}
                          placeholder="Approximate number of cases handled"
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    updateFormData({
                      practiceAreas: [...formData.practiceAreas, { area: '', yearsInField: 0, caseCount: 0 }]
                    });
                  }}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-stone-300 rounded-lg text-stone-600 hover:border-stone-400 hover:text-stone-900 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add Practice Area
                </button>
                {errors.practiceAreas && (
                  <p className="text-sm text-red-600 mt-2">{errors.practiceAreas}</p>
                )}
              </div>

              {/* Success Stories (Optional) */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-stone-900">
                  Notable Cases or Achievements <span className="text-stone-500 font-normal">(Optional)</span>
                </label>
                <p className="text-sm text-stone-600 mb-3">Share success stories or significant achievements to build credibility</p>
                
                <div className="space-y-3">
                  {formData.successStories.map((story, index) => (
                    <div key={index} className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <Award className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                        <button
                          type="button"
                          onClick={() => {
                            updateFormData({ successStories: formData.successStories.filter((_, i) => i !== index) });
                          }}
                          aria-label="Remove success story"
                          className="px-2 py-1 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <textarea
                        value={story}
                        onChange={(e) => {
                          const newStories = [...formData.successStories];
                          newStories[index] = e.target.value;
                          updateFormData({ successStories: newStories });
                        }}
                        placeholder="e.g., Successfully negotiated $2M settlement for wrongful termination case..."
                        rows={3}
                        className="w-full px-3 py-2 border border-green-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    updateFormData({ successStories: [...formData.successStories, ''] });
                  }}
                  className="mt-3 flex items-center gap-2 px-4 py-2 border-2 border-dashed border-green-300 rounded-lg text-green-700 hover:border-green-400 hover:text-green-800 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add Success Story
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Pricing & Availability */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2 text-stone-900">Pricing & Availability</h2>
                <p className="text-stone-600">Set your rates and let clients know when you're available</p>
              </div>

              {/* Consultation Packages */}
              <div>
                <label className="block text-sm font-semibold text-stone-900 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Consultation Packages *
                </label>
                
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-green-800">
                      <p className="font-semibold mb-1">Pro Tip: Free Consultation</p>
                      <p>Lawyers offering a free 15-minute consultation get 3x more inquiries. Consider starting with a quick intro call.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  {formData.consultations.map((consult, index) => (
                    <div key={index} className={`border-2 rounded-xl p-5 transition-all ${
                      consult.popular ? 'border-blue-500 bg-blue-50' : 'border-stone-200 bg-white'
                    }`}>
                      {consult.popular && (
                        <div className="mb-3">
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                            <Star className="w-3 h-3 fill-white" />
                            MOST POPULAR
                          </span>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                        <div>
                          <label htmlFor={`consultation-duration-${index}`} className="text-xs font-semibold text-stone-700 block mb-2">Duration</label>
                          <div className="relative">
                            <select
                              id={`consultation-duration-${index}`}
                              value={consult.duration}
                              onChange={(e) => updateArrayItem('consultations', index, { duration: parseInt(e.target.value) })}
                              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 appearance-none bg-white"
                            >
                              <option value={15}>15 minutes</option>
                              <option value={30}>30 minutes</option>
                              <option value={45}>45 minutes</option>
                              <option value={60}>1 hour</option>
                              <option value={90}>1.5 hours</option>
                              <option value={120}>2 hours</option>
                            </select>
                            <Clock className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-xs font-semibold text-stone-700 block mb-2">Price</label>
                          <div className="relative">
                            <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                            <input
                              type="number"
                              value={consult.price}
                              onChange={(e) => updateArrayItem('consultations', index, { price: parseInt(e.target.value) || 0 })}
                              className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                              placeholder="0"
                            />
                          </div>
                          {consult.price === 0 && (
                            <p className="text-xs text-green-600 mt-1 font-medium">FREE - Great for leads!</p>
                          )}
                        </div>
                        
                        <div className="flex items-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              updateArrayItem('consultations', index, { popular: !consult.popular });
                            }}
                            className={`flex-1 px-3 py-2 border-2 rounded-lg font-medium transition-all ${
                              consult.popular
                                ? 'border-blue-600 bg-blue-600 text-white'
                                : 'border-stone-300 text-stone-600 hover:border-stone-400'
                            }`}
                          >
                            <Star className={`w-4 h-4 inline mr-1 ${consult.popular ? 'fill-white' : ''}`} />
                            {consult.popular ? 'Popular' : 'Mark Popular'}
                          </button>
                          {formData.consultations.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeArrayItem('consultations', index)}
                              aria-label="Remove consultation option"
                              className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-xs font-semibold text-stone-700 block mb-2">Description</label>
                        <input
                          type="text"
                          value={consult.description}
                          onChange={(e) => updateArrayItem('consultations', index, { description: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                          placeholder="Quick contract review - I'll identify the top 3 red flags"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                <button
                  type="button"
                  onClick={() => addArrayItem('consultations', { duration: 60, price: 0, description: '', popular: false })}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-stone-300 rounded-lg text-stone-600 hover:border-stone-400 hover:text-stone-900 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add Consultation Package
                </button>
              </div>

              {/* Response Time & Payment Methods */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="response-time-select" className="block text-sm font-semibold text-stone-900 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Typical Response Time
                  </label>
                  <select
                    id="response-time-select"
                    value={formData.responseTime}
                    onChange={(e) => updateFormData({ responseTime: e.target.value })}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 bg-white"
                  >
                    <option value="within-1-hour">Within 1 hour</option>
                    <option value="within-4-hours">Within 4 hours</option>
                    <option value="within-24-hours">Within 24 hours</option>
                    <option value="within-48-hours">Within 48 hours</option>
                    <option value="1-3-business-days">1-3 business days</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="timezone-select" className="block text-sm font-semibold text-stone-900 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Time Zone
                  </label>
                  <select
                    id="timezone-select"
                    value={formData.timezone}
                    onChange={(e) => updateFormData({ timezone: e.target.value })}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 bg-white"
                  >
                    {timezones.map(tz => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-sm font-semibold text-stone-900 mb-3">
                  Accepted Payment Methods
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Credit Card', 'PayPal', 'Bank Transfer', 'Venmo', 'Zelle', 'Cash', 'Check', 'Wire Transfer'].map((method) => (
                    <label key={method} className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.acceptedPaymentMethods.includes(method)
                        ? 'border-stone-900 bg-stone-50'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}>
                      <input
                        type="checkbox"
                        checked={formData.acceptedPaymentMethods.includes(method)}
                        onChange={(e) => {
                          const newMethods = e.target.checked
                            ? [...formData.acceptedPaymentMethods, method]
                            : formData.acceptedPaymentMethods.filter(m => m !== method);
                          updateFormData({ acceptedPaymentMethods: newMethods });
                        }}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium text-stone-700">{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Weekly Availability */}
              <div>
                <label className="block text-sm font-semibold text-stone-900 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Weekly Availability *
                </label>
                <p className="text-sm text-stone-600 mb-4">Select the days and times you're typically available for consultations</p>
                
                <div className="space-y-3">
                  {daysOfWeek.map(day => {
                    const dayAvailability = formData.availability.find(a => a.day === day);
                    const isSelected = !!dayAvailability;
                    
                    return (
                      <div key={day} className={`border-2 rounded-xl p-4 transition-all ${
                        isSelected ? 'border-stone-300 bg-stone-50' : 'border-stone-200 bg-white'
                      }`}>
                        <label className="flex items-center gap-3 mb-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                addArrayItem('availability', { day, slots: [] });
                              } else {
                                updateFormData({
                                  availability: formData.availability.filter(a => a.day !== day)
                                });
                              }
                            }}
                            className="w-5 h-5"
                          />
                          <span className="font-semibold text-stone-900 group-hover:text-stone-700 transition-colors">{day}</span>
                          {isSelected && dayAvailability?.slots.length > 0 && (
                            <span className="text-xs text-stone-600 ml-auto">
                              {dayAvailability.slots.length} time slot{dayAvailability.slots.length !== 1 ? 's' : ''} selected
                            </span>
                          )}
                        </label>
                        
                        {isSelected && (
                          <div className="ml-8">
                            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                              {timeSlots.map(slot => {
                                const slotSelected = dayAvailability?.slots.includes(slot);
                                return (
                                  <button
                                    key={slot}
                                    type="button"
                                    onClick={() => {
                                      const dayIndex = formData.availability.findIndex(a => a.day === day);
                                      if (dayIndex !== -1) {
                                        const currentSlots = formData.availability[dayIndex].slots;
                                        const newSlots = slotSelected
                                          ? currentSlots.filter(s => s !== slot)
                                          : [...currentSlots, slot];
                                        updateArrayItem('availability', dayIndex, { slots: newSlots });
                                      }
                                    }}
                                    className={`text-xs px-3 py-2 rounded-lg border-2 font-medium transition-all ${
                                      slotSelected
                                        ? 'bg-stone-900 text-white border-stone-900 shadow-md'
                                        : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                                    }`}
                                  >
                                    {slot}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Subscription Plan */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-stone-900 mb-2">Choose Your Plan</h2>
                <p className="text-stone-600">Select the plan that best fits your practice goals</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {subscriptionPlans.map(plan => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => updateFormData({ subscriptionPlan: plan.id as any })}
                    className={`text-left border-4 rounded-2xl p-6 transition-all relative ${
                      formData.subscriptionPlan === plan.id
                        ? 'border-stone-900 shadow-xl scale-105'
                        : 'border-stone-200 hover:border-stone-300 hover:shadow-lg'
                    } ${plan.popular ? 'bg-stone-50' : 'bg-white'}`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-green-600 text-white text-xs font-bold rounded-full">
                        MOST POPULAR
                      </div>
                    )}
                    
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-stone-900 mb-2">{plan.name}</h3>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-stone-900">${plan.price}</span>
                        <span className="text-stone-600">/month</span>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-stone-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {formData.subscriptionPlan === plan.id && (
                      <div className="flex items-center justify-center gap-2 py-2 bg-stone-900 text-white rounded-lg font-semibold">
                        <CheckCircle className="w-5 h-5" />
                        Selected
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  What's Included in All Plans
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-900">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>Secure payment processing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>Client management dashboard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>Automated scheduling</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>Email notifications</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>Profile customization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>Client reviews system</span>
                  </div>
                </div>
              </div>

              <div className="bg-stone-100 border border-stone-200 rounded-lg p-4">
                <p className="text-sm text-stone-700">
                  <strong>Note:</strong> Your subscription will start only after your profile is approved. You can cancel or change your plan anytime from your dashboard. First month is 50% off!
                </p>
              </div>
            </div>
          )}

          {/* Step 6: Review & Submit */}
          {step === 6 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-stone-900 mb-6">Review Your Profile</h2>

              <div className="space-y-4">
                <div className="border border-stone-200 rounded-lg p-6">
                  <h3 className="font-semibold text-stone-900 mb-3">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-stone-600">Name:</span> <span className="font-medium">{formData.name}</span></div>
                    <div><span className="text-stone-600">Title:</span> <span className="font-medium">{formData.title}</span></div>
                    <div><span className="text-stone-600">Email:</span> <span className="font-medium">{formData.email}</span></div>
                    <div><span className="text-stone-600">Phone:</span> <span className="font-medium">{formData.phone}</span></div>
                    <div><span className="text-stone-600">Location:</span> <span className="font-medium">{formData.location}</span></div>
                    <div><span className="text-stone-600">Experience:</span> <span className="font-medium">{formData.yearsOfExperience} years</span></div>
                  </div>
                </div>

                <div className="border border-stone-200 rounded-lg p-6">
                  <h3 className="font-semibold text-stone-900 mb-3">Specialties & Bar Admission</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-stone-600">Practice Areas: </span>
                      <span className="font-medium">{formData.specialty.join(', ')}</span>
                    </div>
                    <div>
                      <span className="text-stone-600">Bar Admission: </span>
                      <span className="font-medium">{formData.barAdmission.join(', ')}</span>
                    </div>
                  </div>
                </div>

                <div className="border border-stone-200 rounded-lg p-6">
                  <h3 className="font-semibold text-stone-900 mb-3">Education</h3>
                  {formData.education.map((edu, i) => (
                    <div key={i} className="text-sm mb-2">
                      {edu.degree} - {edu.institution} ({edu.year})
                    </div>
                  ))}
                </div>

                <div className="border border-stone-200 rounded-lg p-6">
                  <h3 className="font-semibold text-stone-900 mb-3">Consultation Packages</h3>
                  {formData.consultations.map((c, i) => (
                    <div key={i} className="text-sm mb-2">
                      {c.duration} min - ${c.price === 0 ? 'Free' : c.price}
                      {c.description && <div className="text-stone-600 text-xs">{c.description}</div>}
                    </div>
                  ))}
                </div>

                <div className="border border-stone-200 rounded-lg p-6">
                  <h3 className="font-semibold text-stone-900 mb-3">Availability</h3>
                  <div className="text-sm">
                    {formData.availability.length > 0 ? (
                      formData.availability.map(a => (
                        <div key={a.day} className="mb-1">
                          <span className="font-medium">{a.day}:</span> {a.slots.length} time slots
                        </div>
                      ))
                    ) : (
                      <span className="text-stone-600">No availability set</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Terms & Agreements */}
              <div className="border-2 border-amber-300 bg-amber-50 rounded-xl p-6">
                <h3 className="font-semibold text-amber-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Required Agreements
                </h3>
                
                <div className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agreedToTerms}
                      onChange={(e) => updateFormData({ agreedToTerms: e.target.checked })}
                      className="w-5 h-5 mt-0.5 flex-shrink-0"
                    />
                    <div className="text-sm">
                      <p className="text-stone-900 font-medium mb-1">
                        I agree to the Terms of Service and Attorney Network Guidelines *
                      </p>
                      <p className="text-stone-600 text-xs">
                        This includes our code of conduct, client interaction policies, and platform usage rules.{' '}
                        <Link href="/terms" className="text-blue-600 hover:underline">Read full terms</Link>
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agreedToBackgroundCheck}
                      onChange={(e) => updateFormData({ agreedToBackgroundCheck: e.target.checked })}
                      className="w-5 h-5 mt-0.5 flex-shrink-0"
                    />
                    <div className="text-sm">
                      <p className="text-stone-900 font-medium mb-1">
                        I consent to background and credential verification *
                      </p>
                      <p className="text-stone-600 text-xs">
                        We will verify your bar admission, education, and professional standing to ensure client safety.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.marketingConsent}
                      onChange={(e) => updateFormData({ marketingConsent: e.target.checked })}
                      className="w-5 h-5 mt-0.5 flex-shrink-0"
                    />
                    <div className="text-sm">
                      <p className="text-stone-900 font-medium mb-1">
                        Send me tips and updates about growing my practice (Optional)
                      </p>
                      <p className="text-stone-600 text-xs">
                        Marketing tips, feature updates, and success stories from other attorneys.
                      </p>
                    </div>
                  </label>
                </div>

                {(errors.terms || errors.background) && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm font-medium">
                      Please review and agree to all required terms before submitting.
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  What Happens Next?
                </h3>
                <ol className="space-y-2 text-sm text-green-900">
                  <li className="flex gap-3">
                    <span className="font-bold flex-shrink-0">1.</span>
                    <span>We verify your credentials (bar admission, education, malpractice insurance)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold flex-shrink-0">2.</span>
                    <span>You'll receive approval email within 2-3 business days</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold flex-shrink-0">3.</span>
                    <span>Complete profile setup and payment information in your dashboard</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold flex-shrink-0">4.</span>
                    <span>Your profile goes live and you start receiving consultation requests!</span>
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-stone-200">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((step - 1) as any)}
                className="flex items-center gap-2 px-6 py-3 text-stone-600 hover:text-stone-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
            )}
            
            {step < 6 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="ml-auto flex items-center gap-2 px-8 py-3 bg-stone-900 text-white rounded-xl font-semibold hover:bg-stone-800 transition-colors disabled:bg-stone-400 disabled:cursor-not-allowed"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!formData.agreedToTerms || !formData.agreedToBackgroundCheck}
                className="ml-auto flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:bg-stone-400 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-5 h-5" />
                Submit Application
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
