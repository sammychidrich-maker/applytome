import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formApi, questionApi } from '../api';
import { ArrowLeft, Plus, Trash2, GripVertical, Save, Eye, Link as LinkIcon, Check } from 'lucide-react';
import { QUESTION_TYPES } from '../types';
import type { FormType, Question } from '../types';

export default function FormBuilder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormType | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ type: 'short_text', label: '', placeholder: '', required: false, options: '' });
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    if (!id) return;
    formApi.get(id)
      .then((f) => { setForm(f); setQuestions(f.questions || []); })
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAddQuestion = async () => {
    if (!id || !newQuestion.label) return;
    setSaving(true);
    try {
      const q = await questionApi.create(id, newQuestion);
      setQuestions([...questions, q]);
      setNewQuestion({ type: 'short_text', label: '', placeholder: '', required: false, options: '' });
      setShowAdd(false);
    } catch (err) {
      alert('Failed to add question');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!id) return;
    if (!confirm('Delete this question?')) return;
    try {
      await questionApi.delete(id, questionId);
      setQuestions(questions.filter((q) => q.id !== questionId));
    } catch (err) {
      alert('Failed to delete question');
    }
  };

  const handleToggleRequired = async (question: Question) => {
    if (!id) return;
    try {
      await questionApi.update(id, question.id, { required: !question.required });
      setQuestions(questions.map((q) => q.id === question.id ? { ...q, required: !q.required } : q));
    } catch (err) {
      alert('Failed to update question');
    }
  };

  const copyLink = () => {
    if (!form) return;
    const url = `${window.location.origin}/apply/${form.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleActive = async () => {
    if (!form) return;
    try {
      await formApi.update(form.id, { isActive: !form.isActive });
      setForm({ ...form, isActive: !form.isActive });
    } catch (err) {
      alert('Failed to update form');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!form) return <div className="p-8 text-center">Form not found</div>;

  const shareUrl = `${window.location.origin}/apply/${form.slug}`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1 text-gray-500 hover:text-gray-700 mb-6 text-sm">
        <ArrowLeft className="w-4 h-4" />
        Back to dashboard
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{form.title}</h1>
          <p className="text-gray-600 mt-1 capitalize">{form.category.replace(/-/g, ' ')} application</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleActive} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${form.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
            {form.isActive ? 'Active' : 'Inactive'}
          </button>
          <button onClick={copyLink} className="flex items-center gap-1 px-3 py-1.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition">
            {copied ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 flex items-center gap-2 text-sm text-blue-700">
        <Eye className="w-4 h-4" />
        Share this link: <span className="font-mono">{shareUrl}</span>
      </div>

      <div className="space-y-3">
        {questions.map((q) => (
          <div key={q.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-start gap-3">
            <div className="text-gray-400 mt-1">
              <GripVertical className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase text-gray-400 tracking-wider">{q.type.replace(/_/g, ' ')}</span>
                {q.required && <span className="text-xs text-red-600 font-medium">Required</span>}
              </div>
              <div className="font-medium text-gray-900 mt-1">{q.label}</div>
              {q.placeholder && <div className="text-sm text-gray-500 mt-0.5">Placeholder: {q.placeholder}</div>}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => handleToggleRequired(q)} className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100">
                {q.required ? 'Optional' : 'Required'}
              </button>
              <button onClick={() => handleDeleteQuestion(q.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAdd ? (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mt-4">
          <h3 className="font-semibold text-gray-900 mb-4">Add Question</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
              <select
                value={newQuestion.type}
                onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              >
                {QUESTION_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
              <input
                type="text"
                value={newQuestion.label}
                onChange={(e) => setNewQuestion({ ...newQuestion, label: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="What is your favorite color?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder (optional)</label>
              <input
                type="text"
                value={newQuestion.placeholder}
                onChange={(e) => setNewQuestion({ ...newQuestion, placeholder: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="Red, blue, green..."
              />
            </div>
            {(newQuestion.type === 'multiple_choice' || newQuestion.type === 'dropdown' || newQuestion.type === 'checkbox') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Options (comma separated)</label>
                <input
                  type="text"
                  value={newQuestion.options}
                  onChange={(e) => setNewQuestion({ ...newQuestion, options: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="Option 1, Option 2, Option 3"
                />
              </div>
            )}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="required"
                checked={newQuestion.required}
                onChange={(e) => setNewQuestion({ ...newQuestion, required: e.target.checked })}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="required" className="text-sm text-gray-700">Required question</label>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
            <button onClick={handleAddQuestion} disabled={saving || !newQuestion.label} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50">
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Add Question'}
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowAdd(true)} className="mt-4 w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-primary-400 hover:text-primary-600 transition flex items-center justify-center gap-2">
          <Plus className="w-5 h-5" />
          Add Question
        </button>
      )}
    </div>
  );
}
