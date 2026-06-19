'use client';

import { Lawyer } from '@/lib/lawyers-data';
import { Star, MapPin, Clock, Award, GraduationCap, Scale, MessageSquare, Calendar, DollarSign, TrendingUp, Shield, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function LawyerProfile({ lawyer }: { lawyer: Lawyer }) {
  const minPrice = Math.min(...lawyer.consultationTypes.map(c => c.price));

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <img
              src={lawyer.profileImage}
              alt={lawyer.name}
              className="w-32 h-32 rounded-2xl border-4 border-stone-200"
            />
            
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-bold text-stone-900">{lawyer.name}</h1>
                    {lawyer.verified && (
                      <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                        <Award className="w-4 h-4" />
                        Verified
                      </div>
                    )}
                  </div>
                  <p className="text-xl text-stone-600 mb-4">{lawyer.title}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-stone-600 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-stone-900 text-lg">{lawyer.rating}</span>
                      <span className="text-stone-500">({lawyer.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {lawyer.location}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {lawyer.responseTime}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4" />
                      {lawyer.yearsOfExperience} years experience
                    </div>
                  </div>

                  {lawyer.featuredBadges && lawyer.featuredBadges.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {lawyer.featuredBadges.map(badge => (
                        <span key={badge} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="lg:text-right">
                  <div className="text-sm text-stone-600 mb-1">Starting at</div>
                  <div className="text-3xl font-bold text-stone-900 mb-4">
                    {minPrice === 0 ? 'Free' : `$${minPrice}`}
                  </div>
                  <Link href={`/book/${lawyer.id}`}>
                    <button className="w-full lg:w-auto px-8 py-3 bg-stone-900 text-white rounded-xl font-semibold hover:bg-stone-800 transition-colors flex items-center justify-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Book Consultation
                    </button>
                  </Link>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {lawyer.specialty.map(spec => (
                  <span key={spec} className="px-3 py-1.5 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-white border border-stone-200 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-stone-900 mb-4">About</h2>
              <p className="text-stone-700 leading-relaxed whitespace-pre-line">{lawyer.bio}</p>
            </div>

            {/* Expertise */}
            <div className="bg-white border border-stone-200 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-stone-900 mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-stone-700" />
                Areas of Expertise
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {lawyer.expertise.map((item, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-stone-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Credentials */}
            <div className="bg-white border border-stone-200 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-stone-900 mb-4 flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-stone-700" />
                Credentials
              </h2>
              <div className="space-y-4">
                {lawyer.credentials.map((cred, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-stone-50 rounded-lg">
                    <div className="flex-shrink-0 w-10 h-10 bg-stone-200 rounded-lg flex items-center justify-center">
                      {cred.type === 'education' && <GraduationCap className="w-5 h-5 text-stone-700" />}
                      {cred.type === 'bar' && <Scale className="w-5 h-5 text-stone-700" />}
                      {cred.type === 'certification' && <Award className="w-5 h-5 text-stone-700" />}
                      {cred.type === 'award' && <Star className="w-5 h-5 text-stone-700" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-stone-900">{cred.title}</h4>
                      {cred.institution && (
                        <p className="text-sm text-stone-600">{cred.institution}</p>
                      )}
                      {cred.year && (
                        <p className="text-xs text-stone-500 mt-1">{cred.year}</p>
                      )}
                      {cred.description && (
                        <p className="text-sm text-stone-600 mt-2">{cred.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white border border-stone-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-stone-700" />
                  Client Reviews
                </h2>
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                  <span className="text-2xl font-bold text-stone-900">{lawyer.rating}</span>
                  <span className="text-stone-600">/ 5</span>
                </div>
              </div>

              <div className="space-y-6">
                {lawyer.reviews.map(review => (
                  <div key={review.id} className="border-b border-stone-200 last:border-0 pb-6 last:pb-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-stone-900">{review.clientName}</span>
                          {review.verified && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                              Verified Client
                            </span>
                          )}
                          {review.contractType && (
                            <span className="px-2 py-0.5 bg-stone-100 text-stone-600 rounded text-xs">
                              {review.contractType}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-stone-500">{review.date}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-stone-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-stone-700 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Consultation Types */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 sticky top-6">
              <h3 className="text-lg font-bold text-stone-900 mb-4">Consultation Options</h3>
              <div className="space-y-3">
                {lawyer.consultationTypes.map((consult, index) => (
                  <div
                    key={index}
                    className={`border-2 rounded-xl p-4 transition-all ${
                      consult.popular
                        ? 'border-stone-900 bg-stone-50'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    {consult.popular && (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-stone-900 text-white rounded-full text-xs font-semibold mb-2">
                        <Star className="w-3 h-3" />
                        Most Popular
                      </div>
                    )}
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-2xl font-bold text-stone-900">
                        {consult.price === 0 ? 'Free' : `$${consult.price}`}
                      </span>
                      <span className="text-sm text-stone-600">/ {consult.duration} min</span>
                    </div>
                    <p className="text-sm text-stone-600 mb-3">{consult.description}</p>
                    <Link href={`/book/${lawyer.id}?type=${index}`}>
                      <button className="w-full px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors text-sm font-semibold">
                        Select This Option
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            {lawyer.caseSuccessRate && (
              <div className="bg-white border border-stone-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-stone-900 mb-4">Success Stats</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-stone-600">Case Success Rate</span>
                      <span className="text-xl font-bold text-green-600">{lawyer.caseSuccessRate}%</span>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${lawyer.caseSuccessRate}%` }}
                      />
                    </div>
                  </div>
                  <div className="pt-4 border-t border-stone-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-stone-600">Total Reviews</span>
                      <span className="text-xl font-bold text-stone-900">{lawyer.reviewCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Languages */}
            <div className="bg-white border border-stone-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-stone-900 mb-4">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {lawyer.languages.map(lang => (
                  <span key={lang} className="px-3 py-1.5 bg-stone-100 text-stone-700 rounded-lg text-sm">
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            {/* Availability Preview */}
            <div className="bg-white border border-stone-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-stone-900 mb-4">Availability This Week</h3>
              <div className="space-y-2">
                {lawyer.availability.slice(0, 3).map(day => (
                  <div key={day.day} className="flex items-center justify-between text-sm">
                    <span className="font-medium text-stone-900">{day.day}</span>
                    <span className="text-stone-600">{day.slots.length} slots</span>
                  </div>
                ))}
              </div>
              <Link href={`/book/${lawyer.id}`}>
                <button className="w-full mt-4 px-4 py-2 border-2 border-stone-900 text-stone-900 rounded-lg hover:bg-stone-900 hover:text-white transition-colors text-sm font-semibold">
                  View Full Calendar
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
