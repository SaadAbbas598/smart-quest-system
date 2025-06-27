import React from "react";
import { useTheme } from "../context/themeContext";

const scheduleData = [
  { day: "Monday", time: "10:00", subject: "Data Structures", room: "CS101" },
  { day: "Monday", time: "12:00", subject: "OOP", room: "CS202" },
  { day: "Tuesday", time: "10:00", subject: "Networks", room: "EE303" },
  { day: "Wednesday", time: "14:00", subject: "DBMS", room: "CS104" },
  { day: "Thursday", time: "08:00", subject: "OS", room: "CS102" },
  { day: "Friday", time: "16:00", subject: "AI", room: "CS210" },
];

const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00"
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const Schedule = () => {
  const { darkMode } = useTheme();
  
  return (
    <div className={`p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="overflow-auto">
        <div className="min-w-[700px]">
          {/* Header Row: Time and Days */}
          <div className={`grid grid-cols-6 text-center font-semibold rounded-t-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'}`}>
            <div className={`p-2 border border-gray-300 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>Time</div>
            {days.map((day) => (
              <div key={day} className={`p-2 border border-gray-300 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                {day}
              </div>
            ))}
          </div>

          {/* Time slots and Day-wise content */}
          {timeSlots.map((time) => (
            <div key={time} className="grid grid-cols-6 text-sm">
              <div className={`p-2 border border-gray-300 text-center font-medium ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                {time}
              </div>
              {days.map((day) => {
                const slot = scheduleData.find(
                  (entry) => entry.day === day && entry.time === time
                );
                return (
                  <div
                    key={day + time}
                    className={`p-2 border border-gray-300 text-center h-16 ${slot ? 'font-semibold' : ''} 
                      ${slot ? 'bg-blue-100 text-blue-900' : (darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900')}`}
                  >
                    {slot ? (
                      <>
                        <div>{slot.subject}</div>
                        <div className="text-xs text-gray-600">{slot.room}</div>
                      </>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
