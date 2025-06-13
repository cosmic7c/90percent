import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Schedule } from '../../types';

interface CalendarProps {
  schedules: Schedule[];
  onDateClick: (date: string) => void;
  onAddSchedule?: (date?: string) => void;
  className?: string;
}

const Calendar: React.FC<CalendarProps> = ({ 
  schedules, 
  onDateClick, 
  onAddSchedule, 
  className = '' 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const scheduleColors = {
    'deadline': 'bg-red-500',
    'event': 'bg-green-500',
    'meeting': 'bg-white border border-gray-300',
    'quiz-exam': 'bg-blue-500',
    'presentation-day': 'bg-yellow-400'
  };

  const getEventsForDate = (date: string) => {
    return schedules.filter(schedule => schedule.date === date);
  };

  const renderCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const days = [];

    // Empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8" />);
    }

    // Calendar days
    for (let day = 1; day <= totalDays; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const eventsOnDay = getEventsForDate(dateStr);
      const isToday = dateStr === todayStr;

      days.push(
        <div
          key={day}
          onClick={() => onDateClick(dateStr)}
          className={`
            h-8 flex items-center justify-center cursor-pointer text-sm font-medium
            rounded transition-all duration-200 relative
            ${isToday 
              ? 'bg-amber-500 text-white shadow-md' 
              : 'hover:bg-amber-100 text-amber-900'
            }
          `}
        >
          {day}
          {eventsOnDay.length > 0 && (
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-0.5">
              {eventsOnDay.slice(0, 3).map((event, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full ${scheduleColors[event.type] || 'bg-gray-400'}`}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-amber-100 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 rounded-lg hover:bg-amber-50 text-amber-600 transition-colors duration-200"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-semibold text-amber-900">
          {monthNames[currentMonth]} {currentYear}
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 rounded-lg hover:bg-amber-50 text-amber-600 transition-colors duration-200"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-amber-700">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {renderCalendarDays()}
      </div>

      {/* Legend */}
      <div className="border-t border-amber-100 pt-4">
        <h4 className="text-sm font-medium text-amber-900 mb-2">Legend:</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Deadline</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Event</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-white border border-gray-300 rounded-full"></div>
            <span>Meeting</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Quiz/Exam</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <span>Presentation Day</span>
          </div>
        </div>
      </div>

      {/* Quick Add Button (only show if onAddSchedule is provided) */}
      {onAddSchedule && (
        <button
          onClick={() => onAddSchedule()}
          className="w-full mt-4 flex items-center justify-center px-4 py-2 bg-gradient-to-r 
                   from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 
                   hover:to-orange-600 transition-all duration-200 shadow-md"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Schedule
        </button>
      )}
    </div>
  );
};

export default Calendar;