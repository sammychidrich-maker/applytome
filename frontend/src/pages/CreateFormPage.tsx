import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formApi, questionApi } from '../api';
import { ArrowLeft, ChevronRight, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../types';

const SUGGESTED_QUESTIONS: Record<string, { label: string; type: string; placeholder?: string; options?: string }[]> = {
  'girlfriend': [
    { label: 'What is your love language?', type: 'dropdown', options: JSON.stringify(['Words of Affirmation', 'Acts of Service', 'Receiving Gifts', 'Quality Time', 'Physical Touch']) },
    { label: 'Describe your ideal date.', type: 'long_text', placeholder: 'Take me somewhere fun...' },
    { label: 'How do you handle conflict?', type: 'long_text', placeholder: 'I usually...' },
    { label: 'What are your relationship goals?', type: 'short_text', placeholder: 'Looking for something serious / casual / open' },
    { label: 'Rate your humor (1-10)', type: 'rating' },
  ],
  'boyfriend': [
    { label: 'What are your top 3 responsibilities in a relationship?', type: 'long_text' },
    { label: 'How do you communicate when something is wrong?', type: 'long_text' },
    { label: 'What are your short-term goals?', type: 'short_text' },
    { label: 'Are you emotionally available?', type: 'yes_no' },
    { label: 'Rate your commitment level (1-10)', type: 'rating' },
  ],
  'best-friend': [
    { label: 'What is your idea of a perfect weekend?', type: 'long_text' },
    { label: 'What TV shows or movies are you obsessed with?', type: 'short_text' },
    { label: 'Are you down for spontaneous adventures?', type: 'yes_no' },
    { label: 'How do you handle drama?', type: 'long_text' },
    { label: 'Rate your humor (1-10)', type: 'rating' },
  ],
  'roommate': [
    { label: 'What is your cleanliness level?', type: 'dropdown', options: JSON.stringify(['Neat freak', 'Clean but relaxed', 'Somewhat messy', 'Chaos']) },
    { label: 'How do you feel about guests?', type: 'long_text' },
    { label: 'What time do you usually go to bed?', type: 'short_text' },
    { label: 'Do you smoke or drink?', type: 'short_text' },
    { label: 'How do you split bills?', type: 'long_text' },
  ],
  'business-partner': [
    { label: 'What is your biggest professional strength?', type: 'long_text' },
    { label: 'What is your risk tolerance?', type: 'dropdown', options: JSON.stringify(['Conservative', 'Moderate', 'Aggressive', 'YOLO']) },
    { label: 'How many hours per week can you commit?', type: 'short_text' },
    { label: 'What is your vision for this partnership?', type: 'long_text' },
    { label: 'Rate your leadership skills (1-10)', type: 'rating' },
  ],
  'gaming-partner': [
    { label: 'What games do you play?', type: 'short_text', placeholder: 'Valorant, League, Minecraft...' },
    { label: 'What is your rank / skill level?', type: 'short_text' },
    { label: 'What is your availability?', type: 'short_text', placeholder: 'Weeknights, weekends...' },
    { label: 'Are you competitive or casual?', type: 'dropdown', options: JSON.stringify(['Competitive', 'Casual', 'Both', 'Chill only']) },
    { label: 'Do you use voice chat?', type: 'yes_no' },
  ],
  'custom': [
    { label: 'Why should I pick you?', type: 'long_text' },
    { label: 'What makes you unique?', type: 'short_text' },
    { label: 'Rate your enthusiasm (1-10)', type: 'rating' },
  ],
};

export default function CreateFormPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    if (!title || !category) return;
    setLoading(true);
    setError('');
    try {
      const form = await formApi.create({ title, category, description });
      // Add suggested questions
      const questions = SUGGESTED_QUESTIONS[category] || SUGGESTED_QUESTIONS['custom'];
      for (const q of questions) {
        await questionApi.create(form.id, { ...q, required: false });
      }
      navigate(`/form/${form.id}/edit`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create form');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1 text-gray-500 hover:text-gray-700 mb-6 text-sm">
        <ArrowLeft className="w-4 h-4" />
        Back to dashboard
      </button>

      <div className="flex items-center gap-2 mb-6">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
        <div className="h-px w-8 bg-gray-300" />
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
        <div className="h-px w-8 bg-gray-300" />
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
      </div>

      {step === 1 && (
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Choose a category</h1>
          <p className="text-gray-600 mb-6">What kind of application are you creating?</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => { setCategory(cat.value); setStep(2); }}
                className={`p-4 rounded-xl border-2 text-center transition ${category === cat.value ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300'}`}
              >
                <div className="text-2xl mb-1">{cat.emoji}</div>
                <div className="font-semibold text-sm">{cat.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Name your form</h1>
          <p className="text-gray-600 mb-6">Give it a catchy title that describes what you're looking for.</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="e.g., Best Friend Application 2024"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                rows={3}
                placeholder="Hi! I'm looking for someone who..."
              />
            </div>
            <div className="flex items-center gap-2 bg-primary-50 p-3 rounded-lg text-sm text-primary-700">
              <Sparkles className="w-4 h-4" />
              We'll auto-generate suggested questions based on your category.
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Back</button>
              <button
                onClick={() => setStep(3)}
                disabled={!title}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Ready to create?</h1>
          <p className="text-gray-600 mb-6">We'll generate your form with smart questions. You can customize them next.</p>
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
            <div className="text-sm text-gray-500 mb-1">Category</div>
            <div className="font-semibold text-gray-900 capitalize">{category.replace(/-/g, ' ')}</div>
            <div className="text-sm text-gray-500 mt-3 mb-1">Title</div>
            <div className="font-semibold text-gray-900">{title}</div>
            {description && (
              <>
                <div className="text-sm text-gray-500 mt-3 mb-1">Description</div>
                <div className="text-gray-700">{description}</div>
              </>
            )}
          </div>
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Back</button>
            <button
              onClick={handleCreate}
              disabled={loading}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Form'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
