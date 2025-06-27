import React from "react";
import { useTheme } from "../context/themeContext";

const semesters = [
  {
    id: 1,
    name: "Semester 1",
    subjects: ["Math", "Physics", "English"],
  },
  {
    id: 2,
    name: "Semester 2",
    subjects: ["Calculus", "Chemistry", "Computer"],
  },
  {
    id: 3,
    name: "Semester 3",
    subjects: ["Data Structures", "Electronics", "Communication Skills"],
  },
  {
    id: 4,
    name: "Semester 4",
    subjects: ["Algorithms", "Digital Logic", "Software Engineering"],
  },
];

function SemesterComponent() {
  const { darkMode } = useTheme();
  
  return (
    <div className="min-h-screen p-6">
      <h1
        className={`text-3xl font-bold text-center mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}
      >
        My Semesters
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {semesters.map((semester) => (
          <div
            key={semester.id}
            className={`${
              darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
            } rounded-2xl shadow-lg p-6 hover:scale-[1.02] transition-transform`}
          >
            <h2
              className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}
            >
              {semester.name}
            </h2>
            <ul className="space-y-2">
              {semester.subjects.map((subject, index) => (
                <li
                  key={index}
                  className={`px-4 py-2 rounded-lg shadow-sm ${
                    darkMode
                      ? 'bg-gray-600 text-blue-300'
                      : 'bg-blue-50 text-blue-800'
                  }`}
                >
                  {subject}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SemesterComponent;
