import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Calendar from './components/Calendar/Calendar';
import StudentsList from './components/Students/StudentsList';
import StudentModal from './components/Students/StudentModal';
import SubjectGrid from './components/Attendance/SubjectGrid';
import AttendanceDetail from './components/Attendance/AttendanceDetail';
import ScheduleModal from './components/Schedule/ScheduleModal';
import ViewSchedulesModal from './components/Schedule/ViewSchedulesModal';
import AnnouncementModal from './components/Announcements/AnnouncementModal';
import OfficerAccessModal from './components/Auth/OfficerAccessModal';
import { useStudents, useSchedules, useAnnouncements } from './hooks/useFirestore';
import { Student, Subject, Schedule, Announcement } from './types';
import { Calendar as CalendarIcon, BookOpen, Users, Clock, Plus, Trash2 } from 'lucide-react';

// Predefined subjects
const subjects: Subject[] = [
  { code: 'ELF102', name: 'Filipino Elective 2' },
  { code: 'FIL118', name: 'Introduksyon sa Pamamahayag' },
  { code: 'FIL119', name: 'Panulaang Filipino' },
  { code: 'FIL120', name: 'Dulaang Filipino' },
  { code: 'FIL121', name: 'Pagsulat ng Tesis' }
];

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isOfficer, setIsOfficer] = useState(false);
  
  // Modal states
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [viewSchedulesModalOpen, setViewSchedulesModalOpen] = useState(false);
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [officerAccessModalOpen, setOfficerAccessModalOpen] = useState(false);
  
  // Edit states
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [prefilledDate, setPrefilledDate] = useState<string>('');

  // Hooks
  const { students, loading, addStudent, updateStudent, deleteStudent } = useStudents();
  const { schedules, addSchedule, updateSchedule, deleteSchedule } = useSchedules();
  const { announcements, addAnnouncement, deleteAnnouncement } = useAnnouncements();

  const handleStudentSubmit = async (studentData: Omit<Student, 'id' | 'createdAt'>) => {
    if (!isOfficer) return;
    
    if (editingStudent) {
      await updateStudent(editingStudent.id, studentData);
    } else {
      await addStudent(studentData);
    }
    setStudentModalOpen(false);
    setEditingStudent(null);
  };

  const handleScheduleSubmit = async (scheduleData: Omit<Schedule, 'id' | 'timestamp'>) => {
    if (!isOfficer) return;
    
    if (editingSchedule) {
      await updateSchedule(editingSchedule.id, scheduleData);
    } else {
      await addSchedule(scheduleData);
    }
    setScheduleModalOpen(false);
    setEditingSchedule(null);
    setPrefilledDate('');
  };

  const handleAnnouncementSubmit = async (announcementData: Omit<Announcement, 'id' | 'timestamp' | 'createdAt'>) => {
    if (!isOfficer) return;
    await addAnnouncement(announcementData);
  };

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setViewSchedulesModalOpen(true);
  };

  const handleAddSchedule = (date?: string) => {
    if (!isOfficer) return;
    setPrefilledDate(date || '');
    setEditingSchedule(null);
    setScheduleModalOpen(true);
    setViewSchedulesModalOpen(false);
  };

  const handleEditSchedule = (schedule: Schedule) => {
    if (!isOfficer) return;
    setEditingSchedule(schedule);
    setScheduleModalOpen(true);
    setViewSchedulesModalOpen(false);
  };

  const handleOfficerAccess = () => {
    setOfficerAccessModalOpen(true);
  };

  const handleOfficerAccessSuccess = () => {
    setIsOfficer(true);
  };

  const getUpcomingEvents = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    return schedules
      .filter(schedule => new Date(schedule.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  };

  const getRecentEvents = () => {
    const now = new Date();
    const sevenDaysLater = new Date(now);
    sevenDaysLater.setDate(now.getDate() + 7);
    
    return schedules
      .filter(schedule => {
        const eventDate = new Date(schedule.date);
        return eventDate >= now && eventDate <= sevenDaysLater;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'students':
        return (
          <StudentsList
            students={students}
            onAddStudent={() => {
              if (!isOfficer) return;
              setEditingStudent(null);
              setStudentModalOpen(true);
            }}
            onEditStudent={(student) => {
              if (!isOfficer) return;
              setEditingStudent(student);
              setStudentModalOpen(true);
            }}
            onDeleteStudent={(id) => {
              if (!isOfficer) return;
              deleteStudent(id);
            }}
            loading={loading}
            isOfficer={isOfficer}
          />
        );

      case 'attendance':
        if (selectedSubject) {
          return (
            <AttendanceDetail
              subject={selectedSubject}
              students={students}
              onBack={() => setSelectedSubject(null)}
              isOfficer={isOfficer}
            />
          );
        }
        return (
          <SubjectGrid
            subjects={subjects}
            onSubjectClick={setSelectedSubject}
          />
        );

      case 'events':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-amber-900">Upcoming Events</h2>
              {isOfficer && (
                <button
                  onClick={() => handleAddSchedule()}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 
                           text-white rounded-lg hover:from-amber-600 hover:to-orange-600 
                           transition-all duration-200 shadow-md"
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Add Event
                </button>
              )}
            </div>

            {/* Mobile Calendar */}
            <div className="lg:hidden">
              <Calendar
                schedules={schedules}
                onDateClick={handleDateClick}
                onAddSchedule={isOfficer ? handleAddSchedule : undefined}
              />
            </div>

            {/* Events List */}
            <div className="bg-white rounded-xl shadow-md border border-amber-100 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-amber-100">
                <h3 className="text-lg font-semibold text-amber-900">All Upcoming Events</h3>
              </div>
              <div className="p-6">
                {getUpcomingEvents().length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Walang paparating na events o schedules.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {getUpcomingEvents().map((event) => (
                      <div key={event.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 
                                        rounded-lg flex items-center justify-center">
                            <CalendarIcon className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-semibold text-amber-900 mb-1">
                            {event.title}
                          </h4>
                          <p className="text-sm text-amber-700 mb-2">
                            {event.type} • {new Date(event.date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                          {event.details && (
                            <p className="text-gray-600">{event.details}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-8 border border-amber-200">
              <h1 className="text-3xl font-bold text-amber-900 mb-2">
                Welcome to 4EDFIL7C Official Website
              </h1>
              <p className="text-amber-700 text-lg">
                Stay updated with the latest announcements and class information.
              </p>
            </div>

            {/* Post Announcement Button (Officer Only) */}
            {isOfficer && (
              <div className="flex justify-end">
                <button
                  onClick={() => setAnnouncementModalOpen(true)}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 
                           text-white rounded-lg hover:from-green-600 hover:to-green-700 
                           transition-all duration-200 shadow-md"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Post Announcement
                </button>
              </div>
            )}

            {/* Announcements Section */}
            <div className="bg-white rounded-xl shadow-md border border-amber-100 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-amber-100">
                <h3 className="text-lg font-semibold text-amber-900">Mga Announcement</h3>
              </div>
              <div className="p-6">
                {announcements.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Walang announcement pa.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {announcements.map((announcement) => (
                      <div key={announcement.id} className="border border-amber-100 rounded-lg p-4 bg-gradient-to-r from-amber-25 to-orange-25">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-amber-900 mb-2">
                              {announcement.subject}
                            </h4>
                            <p className="text-gray-700 mb-3 whitespace-pre-wrap">
                              {announcement.details}
                            </p>
                            <p className="text-sm text-amber-600">
                              {new Date(announcement.createdAt).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          {isOfficer && (
                            <button
                              onClick={() => deleteAnnouncement(announcement.id)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
                              title="Delete announcement"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-md border border-amber-100 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-amber-100">
                <h3 className="text-lg font-semibold text-amber-900">Pinakabagong Pangyayari (Next 7 Days)</h3>
              </div>
              <div className="p-6">
                {getRecentEvents().length === 0 ? (
                  <p className="text-center text-gray-500 py-4">
                    Walang pinakabagong pangyayari sa susunod na 7 araw.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {getRecentEvents().map((event) => (
                      <div key={event.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-3 h-3 bg-amber-500 rounded-full flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{event.title}</h4>
                          <p className="text-sm text-gray-600">
                            {new Date(event.date).toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric' 
                            })}: {event.details || 'No details'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-25 to-orange-25">
      <Toaster position="top-right" />
      
      {/* Mobile Header */}
      <Header onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onOfficerAccess={handleOfficerAccess}
        />

        {/* Main Content */}
        <main className="flex-1 lg:ml-0 pt-16 lg:pt-0">
          <div className="flex">
            <div className="flex-1 p-6">
              {renderContent()}
            </div>

            {/* Right Sidebar (Desktop only) */}
            <aside className="hidden lg:block w-80 p-6 border-l border-amber-200 bg-gradient-to-b from-amber-25 to-orange-25">
              <Calendar
                schedules={schedules}
                onDateClick={handleDateClick}
                onAddSchedule={isOfficer ? handleAddSchedule : undefined}
                className="mb-6"
              />

              {/* Latest Happenings */}
              <div className="bg-white rounded-xl shadow-md border border-amber-100 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-3 border-b border-amber-100">
                  <h3 className="font-semibold text-amber-900">Latest Happenings</h3>
                </div>
                <div className="p-4">
                  {getRecentEvents().length === 0 ? (
                    <p className="text-center text-gray-500 text-sm py-4">
                      Walang pinakabagong pangyayari.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {getRecentEvents().slice(0, 3).map((event) => (
                        <div key={event.id} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {event.title}
                            </p>
                            <p className="text-xs text-gray-600">
                              {new Date(event.date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>

      {/* Modals */}
      <StudentModal
        isOpen={studentModalOpen}
        onClose={() => {
          setStudentModalOpen(false);
          setEditingStudent(null);
        }}
        onSubmit={handleStudentSubmit}
        student={editingStudent}
      />

      <ScheduleModal
        isOpen={scheduleModalOpen}
        onClose={() => {
          setScheduleModalOpen(false);
          setEditingSchedule(null);
          setPrefilledDate('');
        }}
        onSubmit={handleScheduleSubmit}
        schedule={editingSchedule}
        prefilledDate={prefilledDate}
      />

      <ViewSchedulesModal
        isOpen={viewSchedulesModalOpen}
        onClose={() => setViewSchedulesModalOpen(false)}
        date={selectedDate}
        schedules={schedules}
        onEditSchedule={handleEditSchedule}
        onDeleteSchedule={(id) => {
          if (isOfficer) deleteSchedule(id);
        }}
        onAddSchedule={handleAddSchedule}
        isOfficer={isOfficer}
      />

      <AnnouncementModal
        isOpen={announcementModalOpen}
        onClose={() => setAnnouncementModalOpen(false)}
        onSubmit={handleAnnouncementSubmit}
      />

      <OfficerAccessModal
        isOpen={officerAccessModalOpen}
        onClose={() => setOfficerAccessModalOpen(false)}
        onSuccess={handleOfficerAccessSuccess}
      />
    </div>
  );
}

export default App;