'use client';

import { useState } from 'react';
import { Lawyer } from '@/lib/lawyers-data';
import { Calendar, Clock, DollarSign, CreditCard, Mail, Phone, MessageSquare, CheckCircle, ArrowLeft, User } from 'lucide-react';
import Link from 'next/link';

export default function BookingForm({ lawyer }: { lawyer: Lawyer }) {
  const [step, setStep] = useState<'consultation' | 'datetime' | 'details' | 'payment' | 'confirmation'>('consultation');
  const [selectedConsultation, setSelectedConsultation] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    contractType: '',
    notes: ''
  });

  const selectedConsultationType = selectedConsultation !== null ? lawyer.consultationTypes[selectedConsultation] : null;
  const selectedAvailability = selectedDay ? lawyer.availability.find(a => a.day === selectedDay) : null;

  const handleConsultationSelect = (index: number) => {
    setSelectedConsultation(index);
    setStep('datetime');
  };

  const handleDateTimeConfirm = () => {
    if (selectedDay && selectedTime) {
      setStep('details');
    }
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedConsultationType && selectedConsultationType.price === 0) {
      setStep('confirmation');
    } else {
      setStep('payment');
    }
  };

  const handlePayment = () => {
    setStep('confirmation');
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/lawyers/${lawyer.id}`} className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to {lawyer.name}\'s profile
          </Link>
          <h1 className="text-4xl font-bold text-stone-900 mb-2">Book a Consultation</h1>
          <p className="text-lg text-stone-600">Schedule your session with {lawyer.name}</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center gap-2">
            {['consultation', 'datetime', 'details', 'payment', 'confirmation'].map((s, index) => {
              const stepIndex = ['consultation', 'datetime', 'details', 'payment', 'confirmation'].indexOf(step);
              const currentIndex = ['consultation', 'datetime', 'details', 'payment', 'confirmation'].indexOf(s);
              const isActive = currentIndex <= stepIndex;
              const isCurrent = s === step;

              // Skip payment step if free consultation
              if (s === 'payment' && selectedConsultationType && selectedConsultationType.price === 0) {
                return null;
              }

              return (
                <div key={s} className="flex items-center flex-1">
                  <div className={`flex items-center gap-2 ${isActive ? 'text-stone-900' : 'text-stone-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      isActive ? 'bg-stone-900 text-white' : 'bg-stone-200'
                    } ${isCurrent ? 'ring-4 ring-stone-300' : ''}`}>
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium hidden sm:inline capitalize">{s}</span>
                  </div>
                  {index < 4 && (selectedConsultationType?.price !== 0 || s !== 'details') && (
                    <div className={`flex-1 h-0.5 mx-2 ${isActive ? 'bg-stone-900' : 'bg-stone-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white border border-stone-200 rounded-xl p-8">
          {step === 'consultation' && (
            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-2">Choose Consultation Type</h2>
              <p className="text-stone-600 mb-6">Select the consultation option that best fits your needs</p>

              <div className="space-y-4">
                {lawyer.consultationTypes.map((consult, index) => (
                  <button
                    key={index}
                    onClick={() => handleConsultationSelect(index)}
                    className={`w-full text-left border-2 rounded-xl p-6 transition-all ${
                      consult.popular
                        ? 'border-stone-900 bg-stone-50'
                        : 'border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    {consult.popular && (
                      <div className="inline-flex items-center gap-1 px-2 py-1 bg-stone-900 text-white rounded-full text-xs font-semibold mb-3">
                        ⭐ Recommended
                      </div>
                    )}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-3xl font-bold text-stone-900">
                            {consult.price === 0 ? 'Free' : `$${consult.price}`}
                          </span>
                          <span className="text-stone-600">for {consult.duration} minutes</span>
                        </div>
                      </div>
                      <Clock className="w-6 h-6 text-stone-400" />
                    </div>
                    <p className="text-stone-700">{consult.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'datetime' && selectedConsultationType && (
            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-2">Select Date & Time</h2>
              <p className="text-stone-600 mb-6">Choose a convenient time for your {selectedConsultationType.duration}-minute consultation</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Day Selection */}
                <div>
                  <h3 className="font-semibold text-stone-900 mb-3">Available Days</h3>
                  <div className="space-y-2">
                    {lawyer.availability.map(day => (
                      <button
                        key={day.day}
                        onClick={() => {
                          setSelectedDay(day.day);
                          setSelectedTime('');
                        }}
                        className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                          selectedDay === day.day
                            ? 'border-stone-900 bg-stone-50'
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-stone-900">{day.day}</span>
                          <span className="text-sm text-stone-600">{day.slots.length} slots available</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Selection */}
                <div>
                  <h3 className="font-semibold text-stone-900 mb-3">
                    {selectedDay ? `Times for ${selectedDay}` : 'Select a day first'}
                  </h3>
                  {selectedAvailability ? (
                    <div className="grid grid-cols-2 gap-2">
                      {selectedAvailability.slots.map(time => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`px-4 py-3 rounded-lg border-2 transition-all text-center ${
                            selectedTime === time
                              ? 'border-stone-900 bg-stone-900 text-white'
                              : 'border-stone-200 hover:border-stone-300 text-stone-700'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-stone-400">
                      <Calendar className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-sm">No day selected</p>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleDateTimeConfirm}
                disabled={!selectedDay || !selectedTime}
                className="w-full mt-6 px-6 py-3 bg-stone-900 text-white rounded-xl font-semibold hover:bg-stone-800 transition-colors disabled:bg-stone-300 disabled:cursor-not-allowed"
              >
                Continue to Details
              </button>
            </div>
          )}

          {step === 'details' && (
            <form onSubmit={handleDetailsSubmit}>
              <h2 className="text-2xl font-bold text-stone-900 mb-2">Your Information</h2>
              <p className="text-stone-600 mb-6">Tell us a bit about yourself and your needs</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-stone-900 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-stone-900 focus:outline-none"
                    placeholder="John Doe"
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
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-stone-900 focus:outline-none"
                    placeholder="john@example.com"
                  />
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
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-stone-900 focus:outline-none"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label htmlFor="contract-type-select" className="block text-sm font-semibold text-stone-900 mb-2">
                    Contract Type *
                  </label>
                  <select
                    id="contract-type-select"
                    required
                    value={formData.contractType}
                    onChange={(e) => setFormData({ ...formData, contractType: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-stone-900 focus:outline-none"
                  >
                    <option value="">Select contract type...</option>
                    <option value="employment">Employment Contract</option>
                    <option value="freelance">Freelance Agreement</option>
                    <option value="saas">SaaS Agreement</option>
                    <option value="lease">Lease Agreement</option>
                    <option value="vendor">Vendor Contract</option>
                    <option value="partnership">Partnership Agreement</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-900 mb-2">
                    <MessageSquare className="w-4 h-4 inline mr-1" />
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-stone-900 focus:outline-none h-32 resize-none"
                    placeholder="Tell the lawyer about your situation, specific concerns, or questions..."
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-6 px-6 py-3 bg-stone-900 text-white rounded-xl font-semibold hover:bg-stone-800 transition-colors"
              >
                {selectedConsultationType && selectedConsultationType.price === 0 ? 'Confirm Booking' : 'Continue to Payment'}
              </button>
            </form>
          )}

          {step === 'payment' && selectedConsultationType && (
            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-2">Payment Details</h2>
              <p className="text-stone-600 mb-6">Secure payment processing</p>

              <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-stone-700">Consultation ({selectedConsultationType.duration} min)</span>
                  <span className="font-semibold text-stone-900">${selectedConsultationType.price}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-stone-600">
                  <span>Processing Fee</span>
                  <span>$0</span>
                </div>
                <div className="border-t border-stone-300 my-3" />
                <div className="flex items-center justify-between text-lg font-bold">
                  <span className="text-stone-900">Total</span>
                  <span className="text-stone-900">${selectedConsultationType.price}</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-stone-900 mb-2">
                    <CreditCard className="w-4 h-4 inline mr-1" />
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-stone-900 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-stone-900 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-stone-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-900 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-stone-900 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-900">
                  🔒 Your payment information is secure and encrypted. We use industry-standard security measures to protect your data.
                </p>
              </div>

              <button
                onClick={handlePayment}
                className="w-full px-6 py-3 bg-stone-900 text-white rounded-xl font-semibold hover:bg-stone-800 transition-colors"
              >
                Pay ${selectedConsultationType.price} & Confirm Booking
              </button>
            </div>
          )}

          {step === 'confirmation' && selectedConsultationType && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              
              <h2 className="text-3xl font-bold text-stone-900 mb-2">Booking Confirmed!</h2>
              <p className="text-lg text-stone-600 mb-8">
                Your consultation with {lawyer.name} has been scheduled
              </p>

              <div className="bg-stone-50 border border-stone-200 rounded-xl p-6 mb-6 text-left max-w-md mx-auto">
                <h3 className="font-semibold text-stone-900 mb-4">Appointment Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-stone-600" />
                    <span className="text-stone-700">{selectedDay} at {selectedTime}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-stone-600" />
                    <span className="text-stone-700">{selectedConsultationType.duration} minutes</span>
                  </div>
                  {selectedConsultationType.price > 0 && (
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-stone-600" />
                      <span className="text-stone-700">Paid: ${selectedConsultationType.price}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-stone-600" />
                    <span className="text-stone-700">{formData.email}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
                <p className="text-sm text-blue-900">
                  📧 A confirmation email with video call details has been sent to {formData.email}. 
                  You\'ll receive a reminder 24 hours before your appointment.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/">
                  <button className="px-6 py-3 bg-stone-900 text-white rounded-xl font-semibold hover:bg-stone-800 transition-colors">
                    Back to Home
                  </button>
                </Link>
                <Link href={`/lawyers/${lawyer.id}`}>
                  <button className="px-6 py-3 border-2 border-stone-900 text-stone-900 rounded-xl font-semibold hover:bg-stone-50 transition-colors">
                    View Lawyer Profile
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
