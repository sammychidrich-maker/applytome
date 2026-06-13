export interface User {
  id: string;
  email: string;
  name: string;
  nickname?: string;
  photoUrl?: string;
  bio?: string;
}

export interface FormType {
  id: string;
  slug: string;
  title: string;
  category: string;
  description?: string;
  creatorId: string;
  isActive: boolean;
  allowsAnonymous: boolean;
  theme: string;
  createdAt: string;
  updatedAt: string;
  questions?: Question[];
  _count?: { responses: number };
}

export interface Question {
  id: string;
  formId: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  order: number;
  options?: string;
  config?: string;
  createdAt: string;
}

export interface ResponseType {
  id: string;
  formId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhotoUrl?: string;
  status: string;
  score?: number;
  createdAt: string;
  updatedAt: string;
  answers?: Answer[];
}

export interface Answer {
  id: string;
  responseId: string;
  questionId: string;
  value: string;
  question: Question;
}

export const QUESTION_TYPES = [
  { value: 'short_text', label: 'Short Text', icon: 'Type' },
  { value: 'long_text', label: 'Long Text', icon: 'AlignLeft' },
  { value: 'multiple_choice', label: 'Multiple Choice', icon: 'Circle' },
  { value: 'checkbox', label: 'Checkboxes', icon: 'Square' },
  { value: 'rating', label: 'Rating Scale', icon: 'Star' },
  { value: 'yes_no', label: 'Yes / No', icon: 'ToggleLeft' },
  { value: 'dropdown', label: 'Dropdown', icon: 'ChevronDown' },
  { value: 'date', label: 'Date Picker', icon: 'Calendar' },
  { value: 'emoji', label: 'Emoji Rating', icon: 'Smile' },
];

export const CATEGORIES = [
  { value: 'girlfriend', label: 'Girlfriend', emoji: '❤️' },
  { value: 'boyfriend', label: 'Boyfriend', emoji: '💙' },
  { value: 'wife', label: 'Wife', emoji: '💍' },
  { value: 'husband', label: 'Husband', emoji: '🤵' },
  { value: 'partner', label: 'Partner', emoji: '🤝' },
  { value: 'best-friend', label: 'Best Friend', emoji: '👯' },
  { value: 'roommate', label: 'Roommate', emoji: '🏠' },
  { value: 'business-partner', label: 'Business Partner', emoji: '💼' },
  { value: 'gaming-partner', label: 'Gaming Partner', emoji: '🎮' },
  { value: 'travel-buddy', label: 'Travel Buddy', emoji: '✈️' },
  { value: 'custom', label: 'Custom', emoji: '✨' },
];

export const STATUS_OPTIONS = [
  { value: 'submitted', label: 'Submitted', color: 'bg-gray-100 text-gray-700' },
  { value: 'viewed', label: 'Viewed', color: 'bg-blue-100 text-blue-700' },
  { value: 'shortlisted', label: 'Shortlisted', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'accepted', label: 'Accepted', color: 'bg-green-100 text-green-700' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-700' },
];
