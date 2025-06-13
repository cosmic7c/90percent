import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Schedule } from '../../types';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (scheduleData: Omit<Schedule, 'id' | 'timestamp'>) => void;
  schedule?: Schedule | null;
  prefilledDate?: string;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  schedule,
  prefilledDate
}) => {
  const [formData, setFormData] = useState({
    date: '',
    type: '' as Schedule['type'] | '',
    title: '',
    details: ''
  });

  useEffect(() => {
    if (schedule) {
      setFormData({
        date: schedule.date,
        type: schedule.type,
        title: schedule.title,
        details: schedule.details || ''
      });
    } else {
      setFormData({
        date: prefilledDate || '',
        type: '',
        title: '',
        details: ''
      });
    }
  }, [schedule, prefilledDate, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type) return;

    onSubmit({
      date: formData.date,
      type: formData.type,
      title: formData.title,
      details: formData.details
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-amber-900">
            {schedule ? 'I-edit ang Schedule' : 'Magdagdag ng Schedule'}
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
              Petsa *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 
                       focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Uri ng Schedule *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as Schedule['type'] })}
              className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 
                       focus:ring-amber-500 focus:border-transparent"
              required
            >
              <option value="">Pumili ng Uri</option>
              <option value="deadline">Deadline</option>
              <option value="event">Event</option>
              <option value="presentation-day">Presentation Day</option>
              <option value="meeting">Meeting</option>
              <option value="quiz-exam">Quiz/Exam</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Pamagat *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 
                       focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Mga Detalye
            </label>
            <textarea
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 
                       focus:ring-amber-500 focus:border-transparent resize-vertical"
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
              <Save className="w-4 h-4 mr-2" />
              {schedule ? 'I-update ang Schedule' : 'I-save ang Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleModal;