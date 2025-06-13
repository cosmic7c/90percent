import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Student } from '../../types';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (studentData: Omit<Student, 'id' | 'createdAt'>) => void;
  student?: Student | null;
}

const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  student
}) => {
  const [formData, setFormData] = useState({
    surname: '',
    firstName: '',
    middleName: '',
    sex: '' as 'Male' | 'Female' | '',
    status: '' as 'Regular' | 'Irregular' | ''
  });

  useEffect(() => {
    if (student) {
      setFormData({
        surname: student.surname,
        firstName: student.firstName,
        middleName: student.middleName || '',
        sex: student.sex,
        status: student.status
      });
    } else {
      setFormData({
        surname: '',
        firstName: '',
        middleName: '',
        sex: '',
        status: ''
      });
    }
  }, [student, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.sex || !formData.status) return;
    
    onSubmit({
      surname: formData.surname,
      firstName: formData.firstName,
      middleName: formData.middleName || undefined,
      sex: formData.sex,
      status: formData.status
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-amber-900">
            {student ? 'I-edit ang Estudyante' : 'Magdagdag ng Bagong Estudyante'}
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
              Apelyido *
            </label>
            <input
              type="text"
              value={formData.surname}
              onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
              className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 
                       focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Pangalan *
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 
                       focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              M.I. (Optional)
            </label>
            <input
              type="text"
              value={formData.middleName}
              onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
              className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 
                       focus:ring-amber-500 focus:border-transparent"
              maxLength={1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Kasarian *
            </label>
            <select
              value={formData.sex}
              onChange={(e) => setFormData({ ...formData, sex: e.target.value as 'Male' | 'Female' })}
              className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 
                       focus:ring-amber-500 focus:border-transparent"
              required
            >
              <option value="">Pumili ng Kasarian</option>
              <option value="Male">Lalaki</option>
              <option value="Female">Babae</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Status ng Estudyante *
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Regular' | 'Irregular' })}
              className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 
                       focus:ring-amber-500 focus:border-transparent"
              required
            >
              <option value="">Pumili ng Status</option>
              <option value="Regular">Regular</option>
              <option value="Irregular">Irregular</option>
            </select>
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
              className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 
                       text-white rounded-lg hover:from-amber-600 hover:to-orange-600 
                       transition-all duration-200 shadow-md"
            >
              {student ? 'I-update ang Estudyante' : 'Idagdag ang Estudyante'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentModal;