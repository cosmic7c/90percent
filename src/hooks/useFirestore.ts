import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Student, AttendanceRecord, Schedule, SubjectClassList, Announcement } from '../types';
import toast from 'react-hot-toast';

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const studentsCollection = collection(db, 'students');
    const unsubscribe = onSnapshot(studentsCollection, (snapshot) => {
      const studentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Student[];
      setStudents(studentsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addStudent = async (studentData: Omit<Student, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, 'students'), {
        ...studentData,
        createdAt: new Date().toISOString()
      });
      toast.success('Matagumpay na nadagdag ang estudyante!');
    } catch (error) {
      toast.error('Error sa pagdagdag ng estudyante');
      console.error('Error adding student:', error);
    }
  };

  const updateStudent = async (id: string, studentData: Partial<Student>) => {
    try {
      await updateDoc(doc(db, 'students', id), studentData);
      toast.success('Matagumpay na na-update ang estudyante!');
    } catch (error) {
      toast.error('Error sa pag-update ng estudyante');
      console.error('Error updating student:', error);
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'students', id));
      toast.success('Matagumpay na nabura ang estudyante!');
    } catch (error) {
      toast.error('Error sa pagbura ng estudyante');
      console.error('Error deleting student:', error);
    }
  };

  return { students, loading, addStudent, updateStudent, deleteStudent };
};

export const useAttendance = () => {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    const attendanceCollection = collection(db, 'attendance');
    const unsubscribe = onSnapshot(attendanceCollection, (snapshot) => {
      const attendanceData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AttendanceRecord[];
      setAttendance(attendanceData);
    });

    return () => unsubscribe();
  }, []);

  const saveAttendance = async (records: Omit<AttendanceRecord, 'id'>[]) => {
    try {
      // Delete existing records for the same subject and date
      const q = query(
        collection(db, 'attendance'),
        where('subjectCode', '==', records[0].subjectCode),
        where('date', '==', records[0].date)
      );
      const existingDocs = await getDocs(q);
      
      // Delete existing records
      await Promise.all(existingDocs.docs.map(docToDelete => 
        deleteDoc(doc(db, 'attendance', docToDelete.id))
      ));

      // Add new records
      await Promise.all(records.map(record => 
        addDoc(collection(db, 'attendance'), record)
      ));

      toast.success('Matagumpay na na-save ang attendance!');
    } catch (error) {
      toast.error('Error sa pag-save ng attendance');
      console.error('Error saving attendance:', error);
    }
  };

  return { attendance, saveAttendance };
};

export const useSchedules = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    const schedulesCollection = collection(db, 'schedules');
    const unsubscribe = onSnapshot(schedulesCollection, (snapshot) => {
      const schedulesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Schedule[];
      setSchedules(schedulesData);
    });

    return () => unsubscribe();
  }, []);

  const addSchedule = async (scheduleData: Omit<Schedule, 'id' | 'timestamp'>) => {
    try {
      await addDoc(collection(db, 'schedules'), {
        ...scheduleData,
        timestamp: new Date().toISOString()
      });
      toast.success('Matagumpay na nadagdag ang schedule!');
    } catch (error) {
      toast.error('Error sa pagdagdag ng schedule');
      console.error('Error adding schedule:', error);
    }
  };

  const updateSchedule = async (id: string, scheduleData: Partial<Schedule>) => {
    try {
      await updateDoc(doc(db, 'schedules', id), scheduleData);
      toast.success('Matagumpay na na-update ang schedule!');
    } catch (error) {
      toast.error('Error sa pag-update ng schedule');
      console.error('Error updating schedule:', error);
    }
  };

  const deleteSchedule = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'schedules', id));
      toast.success('Matagumpay na nabura ang schedule!');
    } catch (error) {
      toast.error('Error sa pagbura ng schedule');
      console.error('Error deleting schedule:', error);
    }
  };

  return { schedules, addSchedule, updateSchedule, deleteSchedule };
};

export const useSubjectClassLists = () => {
  const getClassList = async (subjectCode: string): Promise<string[]> => {
    try {
      const docRef = doc(db, 'subject_class_lists', subjectCode);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data().students || [];
      }
      return [];
    } catch (error) {
      console.error('Error getting class list:', error);
      return [];
    }
  };

  const saveClassList = async (subjectCode: string, studentIds: string[]) => {
    try {
      await setDoc(doc(db, 'subject_class_lists', subjectCode), {
        students: studentIds
      });
      toast.success('Matagumpay na na-save ang class list!');
    } catch (error) {
      toast.error('Error sa pag-save ng class list');
      console.error('Error saving class list:', error);
    }
  };

  return { getClassList, saveClassList };
};

export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const announcementsCollection = collection(db, 'announcements');
    const unsubscribe = onSnapshot(announcementsCollection, (snapshot) => {
      const announcementsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Announcement[];
      setAnnouncements(announcementsData.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    });

    return () => unsubscribe();
  }, []);

  const addAnnouncement = async (announcementData: Omit<Announcement, 'id' | 'timestamp' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, 'announcements'), {
        ...announcementData,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString()
      });
      toast.success('Matagumpay na na-post ang announcement!');
    } catch (error) {
      toast.error('Error sa pag-post ng announcement');
      console.error('Error adding announcement:', error);
    }
  };

  const deleteAnnouncement = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'announcements', id));
      toast.success('Matagumpay na nabura ang announcement!');
    } catch (error) {
      toast.error('Error sa pagbura ng announcement');
      console.error('Error deleting announcement:', error);
    }
  };

  return { announcements, addAnnouncement, deleteAnnouncement };
};