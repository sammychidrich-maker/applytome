import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formApi, responseApi } from '../api';
import { ArrowLeft, Trash2, CheckCircle, XCircle, Eye, Star, Clock, User, Mail } from 'lucide-react';
import { STATUS_OPTIONS } from '../types';
import type { FormType, ResponseType } from '../types';

export default function FormResponses() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormType | null>(null);
  const [responses, setResponses] = useState<ResponseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResponse, setSelectedResponse] = useState<ResponseType | null>(null);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      formApi.get(id),
      responseApi.list(id),
    ])
      .then(([f, r]) => { setForm(f); setResponses(r); })
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleStatusChange = async (responseId: string, status: string) => {
    try {
      await responseApi.updateStatus(responseId, status);
      setResponses(responses.map((r) => r.id === responseId ? { ...r, status } : r));
      if (selectedResponse?.id === responseId) {
        setSelectedResponse({ ...selectedResponse, status });
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (responseId: string) => {
    if (!confirm('Delete this application?')) return;
    try {
      await responseApi.delete(responseId);
      setResponses(responses.filter((r) => r.id !== responseId));
      if (selectedResponse?.id === responseId) setSelectedResponse(null);
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const statusBadge = (status: string) => {
    const opt = STATUS_OPTIONS.find((s) => s.value === status);
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${opt?.color || 'bg-gray-100 text-gray-700'}`}>
        {status === 'accepted' && <CheckCircle className="w-3 h-3" />}
        {status === 'rejected' && <XCircle className="w-3 h-3" />}
        {status === 'viewed' && <Eye className="w-3 h-3" />}
        {status === 'submitted' && <Clock className="w-3 h-3" />}
        {status === 'shortlisted' && <Star className="w-3 h-3" />}
        {opt?.label || status}
      </span>
    );
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!form) return <div className="p-8 text-center">Form not found</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1 text-gray-500 hover:text-gray-700 mb-6 text-sm">
        <ArrowLeft className="w-4 h-4" />
        Back to dashboard
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{form.title}</h1>
          <p className="text-gray-600 mt-1">{responses.length} application{responses.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-3">
          {responses.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
              <User className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No applications yet.</p>
              <p className="text-sm text-gray-500 mt-1">Share your link to get started.</p>
            </div>
          ) : (
            responses.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedResponse(r)}
                className={`w-full text-left bg-white border rounded-xl p-4 transition hover:shadow-md ${selectedResponse?.id === r.id ? 'border-primary-500 ring-1 ring-primary-500' : 'border-gray-200'}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-gray-900">{r.applicantName}</span>
                  {statusBadge(r.status)}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Mail className="w-3 h-3" />
                  {r.applicantEmail}
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  {new Date(r.createdAt).toLocaleDateString()}
                </div>
              </button>
            ))
          )}
        </div>

        <div className="lg:col-span-2">
          {selectedResponse ? (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedResponse.applicantName}</h2>
                  <p className="text-gray-600 text-sm">{selectedResponse.applicantEmail}</p>
                </div>
                <div className="flex items-center gap-2">
                  {statusBadge(selectedResponse.status)}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleStatusChange(selectedResponse.id, opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${selectedResponse.status === opt.value ? opt.color + ' ring-2 ring-offset-1 ring-gray-300' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    {opt.label}
                  </button>
                ))}
                <button
                  onClick={() => handleDelete(selectedResponse.id)}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition ml-auto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {selectedResponse.answers?.map((a) => (
                  <div key={a.id} className="border-t border-gray-100 pt-4">
                    <div className="text-sm font-medium text-gray-500 mb-1">{a.question.label}</div>
                    <div className="text-gray-900">
                      {a.question.type === 'checkbox' ? (
                        <div className="flex flex-wrap gap-2">
                          {a.value.split(',').filter(Boolean).map((v) => (
                            <span key={v} className="bg-gray-100 px-2 py-1 rounded-md text-sm">{v}</span>
                          ))}
                        </div>
                      ) : a.question.type === 'emoji' ? (
                        <span className="text-2xl">
                          {a.value === '1' && '😡'}
                          {a.value === '2' && '😟'}
                          {a.value === '3' && '😐'}
                          {a.value === '4' && '🙂'}
                          {a.value === '5' && '😍'}
                        </span>
                      ) : (
                        a.value
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <Eye className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">Select an application to review details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
