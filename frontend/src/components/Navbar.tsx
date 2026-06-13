import { Link } from 'react-router-dom';
import { FileText, LogOut, User, LayoutDashboard } from 'lucide-react';
import type { User as UserType } from '../types';

export default function Navbar({ user, logout }: { user: UserType | null; logout: () => void }) {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-primary-600 font-bold text-xl">
              <FileText className="w-6 h-6" />
              <span>ApplyToMe</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/dashboard" className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm font-medium">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link to="/create" className="bg-primary-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-primary-700 transition">
                  Create Form
                </Link>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user.name}</span>
                </div>
                <button onClick={logout} className="text-gray-400 hover:text-gray-600">
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Log in</Link>
                <Link to="/register" className="bg-primary-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-primary-700 transition">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
