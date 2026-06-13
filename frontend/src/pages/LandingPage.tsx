import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Heart, Share2, BarChart3, Sparkles, Users, Shield, Zap } from 'lucide-react';
import { CATEGORIES } from '../types';

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-white pt-16 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            The new way to find your people
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            Apply for access to a <span className="text-primary-600">person</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Create a custom application form for relationships, friendships, partnerships, roommates, or anything else. Share your link. Review applicants. Find your match.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-700 transition shadow-lg">
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/apply/demo" className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition">
              See a Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-12">What are you looking for?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.value}
                to="/register"
                className="bg-white rounded-xl p-5 border border-gray-200 hover:border-primary-300 hover:shadow-md transition text-center group"
              >
                <div className="text-3xl mb-2">{cat.emoji}</div>
                <div className="font-semibold text-gray-900 group-hover:text-primary-600">{cat.label}</div>
                <div className="text-sm text-gray-500 mt-1">Application</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-12">How it works</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">1. Create your form</h3>
              <p className="text-gray-600">Pick a category, add your questions, and customize your form. Our AI can suggest questions too.</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">2. Share your link</h3>
              <p className="text-gray-600">Get a unique, shareable link. Post it on social media, send it to friends, or put it in your bio.</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">3. Review applicants</h3>
              <p className="text-gray-600">See all submissions ranked by compatibility. Accept, reject, or shortlist — you're in control.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-12">Built for real connections</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <Zap className="w-6 h-6 text-primary-600 mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Smart Scoring</h3>
              <p className="text-sm text-gray-600">Compatibility engine ranks applicants by communication, humor, lifestyle, and values.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <Heart className="w-6 h-6 text-primary-600 mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Rich Media</h3>
              <p className="text-sm text-gray-600">Applicants can upload photos, voice notes, and videos alongside their answers.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <Shield className="w-6 h-6 text-primary-600 mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Privacy First</h3>
              <p className="text-sm text-gray-600">Public, private, or invite-only. You control who can apply and what data is shared.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <Users className="w-6 h-6 text-primary-600 mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Any Relationship</h3>
              <p className="text-sm text-gray-600">From dating to business partners to travel buddies. One platform, infinite connections.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to find your people?</h2>
          <p className="text-primary-100 text-lg mb-8">Create your first application form in under 60 seconds. Free forever.</p>
          <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-50 transition">
            Create Your Form
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>ApplyToMe — Apply for access to a person.</p>
        </div>
      </footer>
    </div>
  );
}
