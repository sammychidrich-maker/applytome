import { useParams } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function ApplicantSuccess() {
  const { slug } = useParams<{ slug: string }>();
  const shareUrl = slug ? `${window.location.origin}/apply/${slug}` : '';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Application Submitted!</h1>
        <p className="text-gray-600 mb-8">
          Your application has been sent to the creator. Good luck! 🎉
        </p>
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-500 mb-2">Want to create your own form?</p>
          <a href="/" className="inline-flex items-center gap-2 text-primary-600 font-medium hover:underline">
            Get started on ApplyToMe <ArrowRight className="w-4 h-4" />
          </a>
        </div>
        {shareUrl && (
          <button
            onClick={() => {
              navigator.clipboard.writeText(shareUrl);
              alert('Link copied!');
            }}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Copy application link
          </button>
        )}
      </div>
    </div>
  );
}
