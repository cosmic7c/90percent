import React from 'react';
import { X, Edit, Trash2, Plus } from 'lucide-react';
import { Schedule } from '../../types';

interface ViewSchedulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  schedules: Schedule[];
  onEditSchedule: (schedule: Schedule) => void;
  onDeleteSchedule: (scheduleId: string) => void;
  onAddSchedule: (date: string) => void;
  isOfficer: boolean;
}

const ViewSchedulesModal: React.FC<ViewSchedulesModalProps> = ({
  isOpen,
  onClose,
  date,
  schedules,
  onEditSchedule,
  onDeleteSchedule,
  onAddSchedule,
  isOfficer
}) => {
  if (!isOpen) return null;

  const scheduleColors = {
    'deadline': 'bg-red-500',
    'event': 'bg-green-500',
    'meeting': 'bg-white border border-gray-300',
    'quiz-exam': 'bg-blue-500',
    'presentation-day': 'bg-yellow-400'
  };

  const sortedSchedules = schedules
    .filter(schedule => schedule.date === date)
    .sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-amber-900">
            Mga Schedule para sa{' '}
            {new Date(date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {sortedSchedules.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Walang schedule para sa petsang ito.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedSchedules.map((schedule) => (
                <div key={schedule.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div 
                    className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${scheduleColors[schedule.type]}`}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">
                      {schedule.title} ({schedule.type})
                    </h4>
                    {schedule.details && (
                      <p className="text-sm text-gray-600 mt-1">
                        {schedule.details}
                      </p>
                    )}
                  </div>
                  {isOfficer && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditSchedule(schedule)}
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteSchedule(schedule.id)}
                        className="p-1 text-red-600 hover:text-red-800 transition-colors duration-200"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {isOfficer && (
            <button
              onClick={() => onAddSchedule(date)}
              className="w-full mt-4 flex items-center justify-center px-4 py-2 bg-gradient-to-r 
                       from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 
                       hover:to-orange-600 transition-all duration-200 shadow-md"
            >
              <Plus className="w-4 h-4 mr-2" />
              Magdagdag ng Schedule sa Petsang Ito
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewSchedulesModal;