import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formApi } from '../api';
import { FileText, Plus, ChevronRight, Users, Activity } from 'lucide-react';
import type { FormType } from '../types';

export default function Dashboard() {
  const [forms, setForms] = useState<FormType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    formApi.list()
      .then(setForms)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Forms</h1>
          <p className="text-gray-600 mt-1">Manage your application forms and review applicants.</p>
        </div>
        <Link to="/create" className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition">
          <Plus className="w-4 h-4" />
          Create Form
        </Link>
      </div>

      {forms.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No forms yet</h3>
          <p className="text-gray-600 mb-4">Create your first application form to start receiving applications.</p>
          <Link to="/create" className="inline-flex items-center gap-2 text-primary-600 font-medium hover:underline">
            <Plus className="w-4 h-4" />
            Create your first form
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {forms.map((form) => (
            <div key={form.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${form.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{form.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mt-0.5">
                    <span className="capitalize">{form.category.replace(/-/g, ' ')}</span>
                    <span>•</span>
                    <span className={`${form.isActive ? 'text-green-600' : 'text-gray-400'}`}>{form.isActive ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{form._count?.responses || 0} applicants</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">applytome.com/apply/{form.slug}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Link to={`/form/${form.id}/responses`} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition" title="View Responses">
                    <Activity className="w-4 h-4" />
                  </Link>
                  <Link to={`/form/${form.id}/edit`} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition" title="Edit Form">
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
