import React from 'react';
import { X, BarChart3 } from 'lucide-react';
import { Subject, AttendanceRecord } from '../../types';

interface TotalAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: Subject;
  attendance: AttendanceRecord[];
}

const TotalAttendanceModal: React.FC<TotalAttendanceModalProps> = ({
  isOpen,
  onClose,
  subject,
  attendance
}) => {
  if (!isOpen) return null;

  // Calculate attendance summary
  const attendanceSummary: { [studentId: string]: { present: number; absent: number; studentName: string } } = {};
  
  attendance.forEach(record => {
    if (!attendanceSummary[record.studentId]) {
      attendanceSummary[record.studentId] = {
        present: 0,
        absent: 0,
        studentName: record.studentName
      };
    }
    
    if (record.status === 'Present') {
      attendanceSummary[record.studentId].present++;
    } else {
      attendanceSummary[record.studentId].absent++;
    }
  });

  const sortedSummary = Object.values(attendanceSummary).sort((a, b) => 
    a.studentName.localeCompare(b.studentName)
  );

  const totalRecords = attendance.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-amber-900 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2" />
            Total Attendance para sa {subject.code}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {sortedSummary.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Wala pang naitalang attendance para sa subject na ito.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-amber-50 to-orange-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                        Pangalan ng Estudyante
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-amber-900 uppercase tracking-wider">
                        Present
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-amber-900 uppercase tracking-wider">
                        Absent
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-amber-900 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-amber-900 uppercase tracking-wider">
                        Attendance Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-amber-100">
                    {sortedSummary.map((summary, index) => {
                      const total = summary.present + summary.absent;
                      const attendanceRate = total > 0 ? (summary.present / total * 100).toFixed(1) : '0.0';
                      
                      return (
                        <tr key={index} className="hover:bg-amber-25 transition-colors duration-150">
                          <td className="px-4 py-3 text-sm text-amber-900 font-medium">
                            {summary.studentName}
                          </td>
                          <td className="px-4 py-3 text-sm text-center">
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full 
                                           bg-green-100 text-green-800">
                              {summary.present}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-center">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full
                              ${summary.absent > 0 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-gray-100 text-gray-800'
                              }`}>
                              {summary.absent}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-center font-medium text-amber-900">
                            {total}
                          </td>
                          <td className="px-4 py-3 text-sm text-center">
                            <div className="flex items-center justify-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                  className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                                  style={{ width: `${attendanceRate}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-medium text-amber-900">
                                {attendanceRate}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
                <p className="text-center text-lg font-semibold text-amber-900">
                  Total na Attendance Records para sa Subject: {totalRecords}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TotalAttendanceModal;