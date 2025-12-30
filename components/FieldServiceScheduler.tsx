'use client';

import { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, CheckCircle, Copy, Printer } from 'lucide-react';
import { storage } from '@/lib/storage';
import { Schedule, AllSchedules } from '@/types/schedule';

export default function FieldServiceScheduler() {
  const [allSchedules, setAllSchedules] = useState<AllSchedules>({});
  const [people, setPeople] = useState<string[]>([
  'Donald Kalenga',
  'Exodus Banda',
  'Haswell Kashitu',
  'Obed Limbo',
  'Cosmas Hantumbu',
  'Madabwitso Mwila',
  'Simon Zulu',
  'Joseph Kayenga',
  'Maybin Mpoppwa',
  'Henry Mwanza',
  'Yotham Banda',
  'John Chikopa',
  'Oliver Kalumba',
  'Justin Shikupilwa',
  'Gonious Machila',
  'Henry Lungu',
  'Zakeyo Phiri',
  'Evans Munsha',
  'Cornelius Phiri',
  'Adson Phiri',
  'C Mulungushi',
  'Isaac Kashitu',
  'Denny Kashitu',
  'Ian Zulu',
  'Joseph Mwaile',
  'Martin Phiri',
  'Tafuna Mapande',
  'Aaron Phiri'
]);

const [topics, setTopics] = useState<string[]>([
  'Mw 6/2017 Delight',
  'Mw 4/2018 Teaching',
  'Mw 4/2018 Toolbox',
  'Mw 2/2017 Wise Use Of Literature',
  'Km 10/2014 Size Opportunities',
  'Km 4/2015 Best Use Of Our Time',
  'Km 6/2012 12 Reasons For Preaching',
  'Mw 2/2018 Using Questions',
  'Mw 12/2017 Contacting Everyone',
  'Mw 9/2018 Starting Conversations',
  'Mw 1/2016 Laying Ground Work',
  'Km 11/2014 Personal Interest',
  'Mw 12/2018 Helping Disposed Ones',
  'Mw 09/2016 Pitfalls Avoid',
  'Km 1/2015 Irate Householder',
  'Km 12/2015 When To Discontinue',
  'Km 10/2015 Reach The Heart',
  'Km 12/2014 Effective Studies',
  'Km 7/2015 Maintain Focus',
  'Km 11/2012 Feelings Of Inadequacy',
  'Km 11/2012 Busy Schedule',
  'Mw 8/2016 Students To Progress',
  'Km 10/2015 Students Study Habits',
  'Km 6/2017 Delight In Preaching'
]);

 
  const [serviceDays] = useState<string[]>(['Tuesday', 'Thursday', 'Saturday', 'Sunday']);
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [newPerson, setNewPerson] = useState<string>('');
  const [newTopic, setNewTopic] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const monthKey = `${currentYear}-${currentMonth}`;
    if (!allSchedules[monthKey]) {
      generateScheduleForMonth(currentYear, currentMonth);
    }
  }, [currentMonth, currentYear, mounted]);

  const loadData = async (): Promise<void> => {
    try {
      const savedPeople = await storage.get('field-service-people');
      const savedTopics = await storage.get('field-service-topics');
      const savedSchedules = await storage.get('field-service-all-schedules');
      
      if (savedPeople?.value) setPeople(JSON.parse(savedPeople.value));
      if (savedTopics?.value) setTopics(JSON.parse(savedTopics.value));
      if (savedSchedules?.value) setAllSchedules(JSON.parse(savedSchedules.value));
    } catch (error) {
      console.log('No saved data found, using defaults');
    }
  };

  const autoSave = async (data: any, key: string): Promise<void> => {
    try {
      await storage.set(key, JSON.stringify(data));
      setSaveStatus('✓ Saved');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (error) {
      console.error('Error saving data:', error);
      setSaveStatus('✗ Error saving');
    }
  };

  const getPreviousMonthKey = (year: number, month: number): string => {
    let prevMonth = month - 1;
    let prevYear = year;
    if (prevMonth < 0) {
      prevMonth = 11;
      prevYear--;
    }
    return `${prevYear}-${prevMonth}`;
  };

  const generateScheduleForMonth = (year: number, month: number): void => {
    const dates: Schedule[] = [];
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthKey = `${year}-${month}`;
    const prevMonthKey = getPreviousMonthKey(year, month);
    
    const prevMonthSchedule = allSchedules[prevMonthKey] || [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayName = daysOfWeek[date.getDay()];
      
      if (serviceDays.includes(dayName)) {
        const index = dates.length;
        const prevAssignment = prevMonthSchedule[index] || {};
        
        dates.push({
          date: `${day}-${date.toLocaleString('default', { month: 'short' })}`,
          fullDate: date.toISOString(),
          conductor: prevAssignment.conductor || '',
          topic: prevAssignment.topic || '',
          prayer: prevAssignment.prayer || ''
        });
      }
    }

    setAllSchedules(prev => {
      const updated = { ...prev, [monthKey]: dates };
      autoSave(updated, 'field-service-all-schedules');
      return updated;
    });
  };

  const updateSchedule = (index: number, field: keyof Schedule, value: string): void => {
    const monthKey = `${currentYear}-${currentMonth}`;
    setAllSchedules(prev => {
      const monthSchedules = [...(prev[monthKey] || [])];
      monthSchedules[index] = { ...monthSchedules[index], [field]: value };
      const updated = { ...prev, [monthKey]: monthSchedules };
      autoSave(updated, 'field-service-all-schedules');
      return updated;
    });
  };

  const copyFromPreviousMonth = (): void => {
    const monthKey = `${currentYear}-${currentMonth}`;
    const prevMonthKey = getPreviousMonthKey(currentYear, currentMonth);
    const prevMonthSchedule = allSchedules[prevMonthKey] || [];
    
    if (prevMonthSchedule.length === 0) {
      alert('No data found in previous month to copy');
      return;
    }

    setAllSchedules(prev => {
      const currentSchedules = [...(prev[monthKey] || [])];
      
      const updated = currentSchedules.map((schedule, index) => {
        const prevAssignment = prevMonthSchedule[index] || {};
        return {
          ...schedule,
          conductor: prevAssignment.conductor || schedule.conductor,
          topic: prevAssignment.topic || schedule.topic,
          prayer: prevAssignment.prayer || schedule.prayer
        };
      });
      
      const newSchedules = { ...prev, [monthKey]: updated };
      autoSave(newSchedules, 'field-service-all-schedules');
      setSaveStatus('✓ Copied from previous month');
      setTimeout(() => setSaveStatus(''), 3000);
      return newSchedules;
    });
  };

  const handlePrint = (): void => {
    window.print();
  };

  const addPerson = (): void => {
    if (newPerson.trim()) {
      const updated = [...people, newPerson.trim()];
      setPeople(updated);
      autoSave(updated, 'field-service-people');
      setNewPerson('');
    }
  };

  const addTopic = (): void => {
    if (newTopic.trim()) {
      const updated = [...topics, newTopic.trim()];
      setTopics(updated);
      autoSave(updated, 'field-service-topics');
      setNewTopic('');
    }
  };

  const removePerson = (index: number): void => {
    const updated = people.filter((_, i) => i !== index);
    setPeople(updated);
    autoSave(updated, 'field-service-people');
  };

  const removeTopic = (index: number): void => {
    const updated = topics.filter((_, i) => i !== index);
    setTopics(updated);
    autoSave(updated, 'field-service-topics');
  };

  const changeMonth = (direction: number): void => {
    let newMonth = currentMonth + direction;
    let newYear = currentYear;
    
    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }
    
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const monthKey = `${currentYear}-${currentMonth}`;
  const currentSchedules = allSchedules[monthKey] || [];

  if (!mounted) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6 no-print">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-800">Field Service Schedule</h1>
            </div>
            <div className="flex items-center gap-3">
              {saveStatus && (
                <span className={`text-sm font-semibold ${saveStatus.includes('✓') ? 'text-green-600' : 'text-red-600'}`}>
                  {saveStatus}
                </span>
              )}
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-semibold">Auto-Save ON</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6 no-print">
            <button
              onClick={() => changeMonth(-1)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              ← Previous
            </button>
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-semibold text-gray-700">
                {monthNames[currentMonth]} {currentYear}
              </h2>
              <button
                onClick={copyFromPreviousMonth}
                className="flex items-center gap-2 bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 transition text-sm"
                title="Copy assignments from previous month"
              >
                <Copy className="w-4 h-4" />
                Copy Previous
              </button>
            </div>
            <button
              onClick={() => changeMonth(1)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Next →
            </button>
          </div>

          <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded no-print">
            <p className="text-sm text-blue-800">
              <strong>💡 Tip:</strong> When you navigate to a new month, assignments are automatically copied from the previous month. Click &quot;Print&quot; to create a notice board version.
            </p>
          </div>

          <div id="printable-schedule">
            <div className="print-header">
              <h1 className="print-title">
                FIELD SERVICE SCHEDULE - KANYAMA CENTRAL
              </h1>
              <div className="print-title-border"></div>
              <h2 className="print-month">
                {monthNames[currentMonth].toUpperCase()} {currentYear}
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th className="print-th">DATE</th>
                    <th className="print-th">CONDUCTOR</th>
                    <th className="print-th">TOPIC/MATERIAL</th>
                    <th className="print-th">PRAYER</th>
                  </tr>
                </thead>
                <tbody>
                  {currentSchedules.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="border-2 border-black p-4 text-center text-gray-500">
                        No service days in this month
                      </td>
                    </tr>
                  ) : (
                    currentSchedules.map((schedule, index) => (
                      <tr key={index} className="schedule-row">
                        <td className="print-td font-bold">{schedule.date}</td>
                        <td className="print-td">
                          <select
                            value={schedule.conductor}
                            onChange={(e) => updateSchedule(index, 'conductor', e.target.value)}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 no-print"
                          >
                            <option value="">Select Conductor</option>
                            {people.map((person, i) => (
                              <option key={i} value={person}>{person}</option>
                            ))}
                          </select>
                          <span className="print-value">
                            {schedule.conductor || '_______________'}
                          </span>
                        </td>
                        <td className="print-td">
                          <select
                            value={schedule.topic}
                            onChange={(e) => updateSchedule(index, 'topic', e.target.value)}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 no-print"
                          >
                            <option value="">Select Topic</option>
                            {topics.map((topic, i) => (
                              <option key={i} value={topic}>{topic}</option>
                            ))}
                          </select>
                          <span className="print-value">
                            {schedule.topic || '_______________'}
                          </span>
                        </td>
                        <td className="print-td">
                          <select
                            value={schedule.prayer}
                            onChange={(e) => updateSchedule(index, 'prayer', e.target.value)}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 no-print"
                          >
                            <option value="">Select Prayer</option>
                            {people.map((person, i) => (
                              <option key={i} value={person}>{person}</option>
                            ))}
                          </select>
                          <span className="print-value">
                            {schedule.prayer || '_______________'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 no-print">
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Manage People</h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newPerson}
                onChange={(e) => setNewPerson(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addPerson()}
                placeholder="Add new person"
                className="flex-1 p-2 border rounded focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={addPerson}
                className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {people.map((person, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span>{person}</span>
                  <button
                    onClick={() => removePerson(index)}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Manage Topics</h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTopic()}
                placeholder="Add new topic"
                className="flex-1 p-2 border rounded focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={addTopic}
                className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {topics.map((topic, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm">{topic}</span>
                  <button
                    onClick={() => removeTopic(index)}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}