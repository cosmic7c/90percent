import React from 'react';
import { BookOpen } from 'lucide-react';
import { Subject } from '../../types';

interface SubjectGridProps {
  subjects: Subject[];
  onSubjectClick: (subject: Subject) => void;
}

const SubjectGrid: React.FC<SubjectGridProps> = ({ subjects, onSubjectClick }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-amber-900">Attendance Records</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <div
            key={subject.code}
            onClick={() => onSubjectClick(subject)}
            className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 
                     rounded-xl p-6 cursor-pointer hover:shadow-lg hover:from-amber-100 
                     hover:to-orange-100 transition-all duration-300 group"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg 
                            group-hover:from-amber-600 group-hover:to-orange-600 transition-all duration-300">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-bold text-amber-900 mb-2 uppercase tracking-wide">
                {subject.code}
              </h3>
              <p className="text-sm text-amber-700 font-medium leading-relaxed">
                {subject.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectGrid;