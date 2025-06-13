import React, { useState } from 'react';
import { X, Shield } from 'lucide-react';

interface OfficerAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const OfficerAccessModal: React.FC<OfficerAccessModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code === 'officerc') {
      onSuccess();
      onClose();
      setCode('');
      setError('');
    } else {
      setError('Mali ang code. Subukan muli.');
      setCode('');
    }
  };

  const handleClose = () => {
    onClose();
    setCode('');
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-amber-900 flex items-center">
            <Shield className="w-6 h-6 mr-2" />
            Officer Access
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Ilagay ang Officer Code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 
                       focus:ring-amber-500 focus:border-transparent"
              placeholder="Officer code"
              required
            />
            {error && (
              <p className="text-red-600 text-sm mt-2">{error}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
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
              Access
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OfficerAccessModal;