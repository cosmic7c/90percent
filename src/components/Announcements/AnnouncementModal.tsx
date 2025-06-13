import React, { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { Announcement } from '../../types';

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (announcementData: Omit<Announcement, 'id' | 'timestamp' | 'createdAt'>) => void;
}

const AnnouncementModal: React.FC<AnnouncementModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    subject: '',
    details: ''
  });

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        subject: '',
        details: ''
      });
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject.trim() || !formData.details.trim()) {
      return;
    }

    onSubmit({
      subject: formData.subject.trim(),
      details: formData.details.trim()
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-amber-900">
            Mag-post ng Announcement
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Subject/Pamagat *
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 
                       focus:ring-amber-500 focus:border-transparent"
              placeholder="Ilagay ang pamagat ng announcement"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Mga Detalye *
            </label>
            <textarea
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              rows={5}
              className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 
                       focus:ring-amber-500 focus:border-transparent resize-vertical"
              placeholder="Ilagay ang buong detalye ng announcement"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg 
                       hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center px-4 py-2 bg-gradient-to-r 
                       from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 
                       hover:to-orange-600 transition-all duration-200 shadow-md"
            >
              <Send className="w-4 h-4 mr-2" />
              Post Announcement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnnouncementModal;