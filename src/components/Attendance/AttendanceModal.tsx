import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Subject, Student, AttendanceRecord } from '../../types';

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: Subject;
  students: Student[];
  onSave: (records: Omit<AttendanceRecord, 'id'>[]) => void;
  existingAttendance: AttendanceRecord[];
  editDate?: string;
}

const AttendanceModal: React.FC<AttendanceModalProps> = ({
  isOpen,
  onClose,
  subject,
  students,
  onSave,
  existingAttendance,
  editDate
}) => {
  const [date, setDate] = useState(editDate || new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState<{ [studentId: string]: 'Present' | 'Absent' }>({});

  useEffect(() => {
    if (editDate) {
      setDate(editDate);
      // Load existing attendance for this date
      const existingForDate = existingAttendance.filter(record => record.date === editDate);
      const attendanceMap: { [studentId: string]: 'Present' | 'Absent' } = {};
      existingForDate.forEach(record => {
        attendanceMap[record.studentId] = record.status;
      });
      setAttendanceData(attendanceMap);
    } else {
      setDate(new Date().toISOString().split('T')[0]);
      setAttendanceData({});
    }
  }, [editDate, existingAttendance, isOpen]);

  const handleStatusChange = (studentId: string, status: 'Present' | 'Absent') => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const records: Omit<AttendanceRecord, 'id'>[] = students.map(student => ({
      subjectCode: subject.code,
      date,
      studentId: student.id,
      studentName: `${student.surname}, ${student.firstName} ${student.middleName ? student.middleName.charAt(0) + '.' : ''}`,
      status: attendanceData[student.id] || 'Absent',
      type: student.status,
      timestamp: new Date().toISOString()
    }));

    onSave(records);
    onClose();
    setAttendanceData({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-amber-900">
            I-record ang Attendance para sa {subject.code}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Petsa *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 
                       focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>

          {students.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Wala pang estudyante sa class list. Pakimanage ang mga estudyante.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-amber-900">Mga Estudyante:</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {students
                  .sort((a, b) => a.surname.localeCompare(b.surname))
                  .map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-3 
                                                 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">
                      {student.surname}, {student.firstName} {student.middleName ? student.middleName.charAt(0) + '.' : ''} ({student.status})
                    </span>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={`status-${student.id}`}
                          value="Present"
                          checked={attendanceData[student.id] === 'Present'}
                          onChange={() => handleStatusChange(student.id, 'Present')}
                          className="mr-2 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-green-600 font-medium">Present</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={`status-${student.id}`}
                          value="Absent"
                          checked={attendanceData[student.id] === 'Absent'}
                          onChange={() => handleStatusChange(student.id, 'Absent')}
                          className="mr-2 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-red-600 font-medium">Absent</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
              disabled={students.length === 0}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-gradient-to-r 
                       from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 
                       hover:to-green-700 transition-all duration-200 shadow-md 
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4 mr-2" />
              I-save ang Attendance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AttendanceModal;