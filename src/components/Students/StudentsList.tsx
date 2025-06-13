import React, { useState } from 'react';
import { Edit, Trash2, Filter, UserPlus } from 'lucide-react';
import { Student, FilterType } from '../../types';

interface StudentsListProps {
  students: Student[];
  onAddStudent: () => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  loading: boolean;
  isOfficer: boolean;
}

const StudentsList: React.FC<StudentsListProps> = ({
  students,
  onAddStudent,
  onEditStudent,
  onDeleteStudent,
  loading,
  isOfficer
}) => {
  const [filters, setFilters] = useState<FilterType>({ sex: 'All', status: 'All' });
  const [showFilters, setShowFilters] = useState(false);

  const filteredStudents = students.filter(student => {
    const matchesSex = filters.sex === 'All' || student.sex === filters.sex;
    const matchesStatus = filters.status === 'All' || student.status === filters.status;
    return matchesSex && matchesStatus;
  }).sort((a, b) => a.surname.localeCompare(b.surname));

  const clearFilters = () => {
    setFilters({ sex: 'All', status: 'All' });
    setShowFilters(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-amber-900">Student List</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 bg-white border border-amber-200 rounded-lg 
                     hover:bg-amber-50 transition-colors duration-200"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
          {isOfficer && (
            <button
              onClick={onAddStudent}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 
                       text-white rounded-lg hover:from-amber-600 hover:to-orange-600 
                       transition-all duration-200 shadow-md"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Student
            </button>
          )}
        </div>
      </div>

      {/* Officer Access Notice */}
      {!isOfficer && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-amber-800 text-sm">
            Para sa mga officer: Mag-login sa Officer Access para makagawa ng mga pagbabago.
          </p>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg border border-amber-200 p-4 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Kasarian
              </label>
              <select
                value={filters.sex}
                onChange={(e) => setFilters({ ...filters, sex: e.target.value as FilterType['sex'] })}
                className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 
                         focus:ring-amber-500 focus:border-transparent"
              >
                <option value="All">Lahat</option>
                <option value="Male">Lalaki</option>
                <option value="Female">Babae</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value as FilterType['status'] })}
                className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 
                         focus:ring-amber-500 focus:border-transparent"
              >
                <option value="All">Lahat</option>
                <option value="Regular">Regular</option>
                <option value="Irregular">Irregular</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-amber-600 hover:text-amber-800 transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow-md border border-amber-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-amber-50 to-orange-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                  No.
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                  Apelyido
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                  Pangalan
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                  M.I.
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-amber-900 uppercase tracking-wider">
                  Kasarian
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                  Status
                </th>
                {isOfficer && (
                  <th className="px-4 py-3 text-center text-xs font-medium text-amber-900 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-amber-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={isOfficer ? 7 : 6} className="px-4 py-8 text-center text-gray-500">
                    Walang estudyanteng tumutugma sa filter.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, index) => (
                  <tr key={student.id} className="hover:bg-amber-25 transition-colors duration-150">
                    <td className="px-4 py-3 text-sm text-amber-900">
                      {index + 1}.
                    </td>
                    <td className="px-4 py-3 text-sm text-amber-900 font-medium">
                      {student.surname}
                    </td>
                    <td className="px-4 py-3 text-sm text-amber-900">
                      {student.firstName}
                    </td>
                    <td className="px-4 py-3 text-sm text-amber-900">
                      {student.middleName ? `${student.middleName.charAt(0)}.` : ''}
                    </td>
                    <td className="px-4 py-3 text-sm text-amber-900 text-center">
                      {student.sex}
                    </td>
                    <td className="px-4 py-3 text-sm text-amber-900">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full
                        ${student.status === 'Regular' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {student.status}
                      </span>
                    </td>
                    {isOfficer && (
                      <td className="px-4 py-3 text-sm text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => onEditStudent(student)}
                            className="p-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteStudent(student.id)}
                            className="p-1 text-red-600 hover:text-red-800 transition-colors duration-200"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentsList;