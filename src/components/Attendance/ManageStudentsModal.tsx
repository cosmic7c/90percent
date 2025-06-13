import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Subject, Student } from '../../types';

interface ManageStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: Subject;
  allStudents: Student[];
  classListStudents: string[];
  onSave: (studentIds: string[]) => void;
}

const ManageStudentsModal: React.FC<ManageStudentsModalProps> = ({
  isOpen,
  onClose,
  subject,
  allStudents,
  classListStudents,
  onSave
}) => {
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSelectedStudents(new Set(classListStudents));
  }, [classListStudents, isOpen]);

  const handleStudentToggle = (studentId: string) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId);
    } else {
      newSelected.add(studentId);
    }
    setSelectedStudents(newSelected);
  };

  const handleSubmit = () => {
    onSave(Array.from(selectedStudents));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-amber-900">
            I-manage ang mga Estudyante para sa {subject.code}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {allStudents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Wala pang estudyante sa master list.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-amber-900 mb-4">
                Piliin ang mga estudyante para sa class na ito:
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {allStudents
                  .sort((a, b) => a.surname.localeCompare(b.surname))
                  .map((student) => (
                  <label key={student.id} className="flex items-center p-3 bg-gray-50 rounded-lg 
                                                   hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedStudents.has(student.id)}
                      onChange={() => handleStudentToggle(student.id)}
                      className="mr-3 h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">
                        {student.surname}, {student.firstName} {student.middleName ? student.middleName.charAt(0) + '.' : ''}
                      </span>
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-medium rounded-full
                        ${student.status === 'Regular' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {student.status}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                <p className="text-sm text-amber-800">
                  Napili: {selectedStudents.size} sa {allStudents.length} na estudyante
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg 
                       hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-gradient-to-r 
                       from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 
                       hover:to-blue-700 transition-all duration-200 shadow-md"
            >
              <Save className="w-4 h-4 mr-2" />
              I-save ang Class List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageStudentsModal;