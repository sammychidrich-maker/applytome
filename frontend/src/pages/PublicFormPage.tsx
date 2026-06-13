import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formApi, responseApi } from '../api';
import { Send, ChevronDown, Circle, CheckSquare, Calendar } from 'lucide-react';
import type { FormType, Question } from '../types';

export default function PublicFormPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!slug) return;
    formApi.getBySlug(slug)
      .then(setForm)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug) return;
    setSubmitting(true);
    try {
      await responseApi.submit(slug, { applicantName, applicantEmail, answers });
      navigate(`/apply/${slug}/success`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
      setSubmitting(false);
    }
  };

  const renderQuestionInput = (q: Question) => {
    const opts = q.options ? JSON.parse(q.options) : [];
    switch (q.type) {
      case 'short_text':
        return (
          <input
            type="text"
            required={q.required}
            value={answers[q.id] || ''}
            onChange={(e) => handleAnswer(q.id, e.target.value)}
            placeholder={q.placeholder || ''}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          />
        );
      case 'long_text':
        return (
          <textarea
            required={q.required}
            value={answers[q.id] || ''}
            onChange={(e) => handleAnswer(q.id, e.target.value)}
            placeholder={q.placeholder || ''}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          />
        );
      case 'multiple_choice':
        return (
          <div className="space-y-2">
            {opts.map((opt: string) => (
              <label key={opt} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name={q.id}
                  required={q.required}
                  value={opt}
                  checked={answers[q.id] === opt}
                  onChange={(e) => handleAnswer(q.id, e.target.value)}
                  className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <Circle className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{opt}</span>
              </label>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="space-y-2">
            {opts.map((opt: string) => {
              const selected = (answers[q.id] || '').split(',').filter(Boolean);
              const isChecked = selected.includes(opt);
              return (
                <label key={opt} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    value={opt}
                    checked={isChecked}
                    onChange={(e) => {
                      const newSelected = e.target.checked
                        ? [...selected, opt]
                        : selected.filter((s) => s !== opt);
                      handleAnswer(q.id, newSelected.join(','));
                    }}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <CheckSquare className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{opt}</span>
                </label>
              );
            })}
          </div>
        );
      case 'rating':
        return (
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => handleAnswer(q.id, String(n))}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition ${answers[q.id] === String(n) ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {n}
              </button>
            ))}
          </div>
        );
      case 'yes_no':
        return (
          <div className="flex gap-3">
            {['Yes', 'No'].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleAnswer(q.id, val)}
                className={`px-6 py-2 rounded-lg font-medium transition ${answers[q.id] === val ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {val}
              </button>
            ))}
          </div>
        );
      case 'dropdown':
        return (
          <div className="relative">
            <ChevronDown className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
            <select
              required={q.required}
              value={answers[q.id] || ''}
              onChange={(e) => handleAnswer(q.id, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none appearance-none bg-white"
            >
              <option value="">Select an option</option>
              {opts.map((opt: string) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        );
      case 'date':
        return (
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="date"
              required={q.required}
              value={answers[q.id] || ''}
              onChange={(e) => handleAnswer(q.id, e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
        );
      case 'emoji':
        return (
          <div className="flex gap-3">
            {[
              { emoji: '😡', label: 'Terrible', val: '1' },
              { emoji: '😟', label: 'Bad', val: '2' },
              { emoji: '😐', label: 'Okay', val: '3' },
              { emoji: '🙂', label: 'Good', val: '4' },
              { emoji: '😍', label: 'Amazing', val: '5' },
            ].map(({ emoji, val }) => (
              <button
                key={val}
                type="button"
                onClick={() => handleAnswer(q.id, val)}
                className={`text-3xl p-2 rounded-lg transition ${answers[q.id] === val ? 'bg-primary-100 ring-2 ring-primary-500' : 'hover:bg-gray-100'}`}
                title={`${val}/5`}
              >
                {emoji}
              </button>
            ))}
          </div>
        );
      default:
        return <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />;
    }
  };

  if (loading) return <div className="p-8 text-center">Loading form...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!form) return <div className="p-8 text-center">Form not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 mb-6">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">✨</div>
            <h1 className="text-2xl font-bold text-gray-900">{form.title}</h1>
            {form.description && <p className="text-gray-600 mt-2">{form.description}</p>}
            <div className="mt-3 text-sm text-gray-500">
              Apply for access
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">About You</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
              <input
                type="text"
                required
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Email *</label>
              <input
                type="email"
                required
                value={applicantEmail}
                onChange={(e) => setApplicantEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {form.questions?.map((q) => (
            <div key={q.id} className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {q.label}
                {q.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div className="mt-2">{renderQuestionInput(q)}</div>
            </div>
          ))}

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-primary-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}
