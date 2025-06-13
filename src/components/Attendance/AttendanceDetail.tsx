import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Users, BarChart3, Calendar } from 'lucide-react';
import { Subject, Student, AttendanceRecord } from '../../types';
import { useSubjectClassLists, useAttendance } from '../../hooks/useFirestore';
import AttendanceModal from './AttendanceModal';
import ManageStudentsModal from './ManageStudentsModal';
import TotalAttendanceModal from './TotalAttendanceModal';

interface AttendanceDetailProps {
  subject: Subject;
  students: Student[];
  onBack: () => void;
  isOfficer: boolean;
}

const AttendanceDetail: React.FC<AttendanceDetailProps> = ({
  subject,
  students,
  onBack,
  isOfficer
}) => {
  const { getClassList, saveClassList } = useSubjectClassLists();
  const { attendance, saveAttendance } = useAttendance();
  const [classListStudents, setClassListStudents] = useState<string[]>([]);
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [manageStudentsModalOpen, setManageStudentsModalOpen] = useState(false);
  const [totalAttendanceModalOpen, setTotalAttendanceModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    loadClassList();
  }, [subject.code]);

  const loadClassList = async () => {
    const classList = await getClassList(subject.code);
    setClassListStudents(classList);
  };

  const subjectAttendance = attendance.filter(record => record.subjectCode === subject.code);
  const uniqueDates = [...new Set(subjectAttendance.map(record => record.date))].sort().reverse();

  const getAttendanceForDate = (date: string) => {
    return subjectAttendance.filter(record => record.date === date);
  };

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
  };

  const studentsInClass = students.filter(student => classListStudents.includes(student.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-amber-100 text-amber-600 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-amber-900">
            {subject.code} - {subject.name}
          </h2>
          <p className="text-amber-700">Attendance Management</p>
        </div>
      </div>

      {/* Officer Access Notice */}
      {!isOfficer && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-amber-800 text-sm">
            Para sa mga officer: Mag-login sa Officer Access para makagawa ng mga pagbabago sa attendance.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        {isOfficer && (
          <>
            <button
              onClick={() => setAttendanceModalOpen(true)}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 
                       text-white rounded-lg hover:from-green-600 hover:to-green-700 
                       transition-all duration-200 shadow-md"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Class Attendance
            </button>
            <button
              onClick={() => setManageStudentsModalOpen(true)}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 
                       text-white rounded-lg hover:from-blue-600 hover:to-blue-700 
                       transition-all duration-200 shadow-md"
            >
              <Users className="w-4 h-4 mr-2" />
              Manage Students
            </button>
          </>
        )}
        <button
          onClick={() => setTotalAttendanceModalOpen(true)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 
                   text-white rounded-lg hover:from-purple-600 hover:to-purple-700 
                   transition-all duration-200 shadow-md"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Total Attendance
        </button>
      </div>

      {/* Attendance History */}
      <div className="bg-white rounded-xl shadow-md border border-amber-100 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-amber-100">
          <h3 className="text-lg font-semibold text-amber-900 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Attendance History
          </h3>
        </div>
        
        {uniqueDates.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Wala pang attendance records para sa subject na ito.</p>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {uniqueDates.map((date) => {
                const attendanceForDate = getAttendanceForDate(date);
                const presentCount = attendanceForDate.filter(record => record.status === 'Present').length;
                const absentCount = attendanceForDate.filter(record => record.status === 'Absent').length;
                
                return (
                  <div
                    key={date}
                    onClick={() => handleDateClick(date)}
                    className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 
                             rounded-lg p-4 cursor-pointer hover:shadow-md hover:from-amber-100 
                             hover:to-orange-100 transition-all duration-200"
                  >
                    <div className="text-center">
                      <div className="text-lg font-bold text-amber-900 mb-1">
                        {new Date(date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="text-sm text-amber-700 mb-2">
                        {new Date(date).getFullYear()}
                      </div>
                      <div className="text-xs space-y-1">
                        <div className="text-green-600 font-medium">Present: {presentCount}</div>
                        <div className="text-red-600 font-medium">Absent: {absentCount}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Detailed Attendance for Selected Date */}
      {selectedDate && (
        <div className="bg-white rounded-xl shadow-md border border-amber-100 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-amber-100">
            <h3 className="text-lg font-semibold text-amber-900">
              Attendance para sa {new Date(selectedDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
          </div>
          
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No.
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pangalan ng Estudyante
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getAttendanceForDate(selectedDate)
                    .sort((a, b) => a.studentName.localeCompare(b.studentName))
                    .map((record, index) => (
                    <tr key={record.id}>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {index + 1}.
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                        {record.studentName}
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full
                          ${record.status === 'Present' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                          }`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {isOfficer && (
        <>
          <AttendanceModal
            isOpen={attendanceModalOpen}
            onClose={() => setAttendanceModalOpen(false)}
            subject={subject}
            students={studentsInClass}
            onSave={saveAttendance}
            existingAttendance={subjectAttendance}
          />

          <ManageStudentsModal
            isOpen={manageStudentsModalOpen}
            onClose={() => setManageStudentsModalOpen(false)}
            subject={subject}
            allStudents={students}
            classListStudents={classListStudents}
            onSave={async (studentIds) => {
              await saveClassList(subject.code, studentIds);
              setClassListStudents(studentIds);
            }}
          />
        </>
      )}

      <TotalAttendanceModal
        isOpen={totalAttendanceModalOpen}
        onClose={() => setTotalAttendanceModalOpen(false)}
        subject={subject}
        attendance={subjectAttendance}
      />
    </div>
  );
};

export default AttendanceDetail;