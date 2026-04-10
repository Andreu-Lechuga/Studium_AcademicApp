import { useState } from 'react';

export function Planning() {
  const [selectedView, setSelectedView] = useState<'calendar' | 'evaluations' | 'study'>('calendar');

  const currentCourses = [
    { name: 'Differential Calculus', code: 'MAT301', credits: 4, color: '#dc2626', professor: 'Dr. Rodriguez' },
    { name: 'General Relativity', code: 'APHY410', credits: 3, color: '#a855f7', professor: 'Prof. Einstein' },
    { name: 'Computer Networks', code: 'CS425', credits: 3, color: '#3b82f6', professor: 'Dr. Thompson' },
    { name: 'Artificial Intelligence', code: 'CS430', credits: 3, color: '#3b82f6', professor: 'Prof. Turing' },
    { name: 'Operating Systems', code: 'CS440', credits: 3, color: '#3b82f6', professor: 'Dr. Kernighan' },
    { name: 'Theory of Computation', code: 'CS450', credits: 3, color: '#3b82f6', professor: 'Prof. Gödel' },
  ];

  // Generate calendar days for March 2026 (starts on Sunday) + April days to complete grid
  // March 2026: 31 days starting on Sunday
  // Need 35 cells (7x5) = 31 March days + 4 April days
  const marchDays = Array.from({ length: 31 }, (_, i) => ({ day: i + 1, month: 'march' }));
  const aprilDays = Array.from({ length: 4 }, (_, i) => ({ day: i + 1, month: 'april' }));
  const allDays = [...marchDays, ...aprilDays];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="mb-1 font-['Courier_New',monospace] transition-colors" style={{ color: 'var(--theme-text)' }}>
          Academic Planning
        </h2>
        <p className="text-sm font-['Courier_New',monospace] transition-colors" style={{ color: 'var(--theme-text-muted)' }}>
          Welcome back, Alex
        </p>
      </div>

      {/* First Content Placeholder - Two Columns */}
      <div 
        className="border rounded-lg p-6 backdrop-blur-sm mb-6"
        style={{
          backgroundColor: 'transparent',
          borderColor: 'var(--theme-border)',
        }}
      >
        <div className="flex gap-6">
          {/* Left Column - Useful Links (1/4) */}
          <div className="w-1/4">
            <p className="font-['Courier_New',monospace] text-sm" style={{ color: '#d1d5db' }}>
              Coming soon
            </p>
          </div>

          {/* Right Column - Current Courses (3/4) */}
          <div className="w-3/4">
            <h3 className="mb-4 font-['Courier_New',monospace] transition-colors" style={{ color: 'var(--theme-text)' }}>
              Current Courses
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {currentCourses.map((course, idx) => (
                <div
                  key={idx}
                  className="rounded-md p-3 transition-all"
                  style={{
                    backgroundColor: `${course.color}15`,
                    border: `1px solid ${course.color}`,
                  }}
                >
                  <h4 
                    className="font-['Courier_New',monospace] text-xs mb-1"
                    style={{ color: 'var(--theme-text)' }}
                  >
                    {course.name}
                  </h4>
                  <div className="flex items-center justify-between">
                    <span 
                      className="font-['Courier_New',monospace] text-xs"
                      style={{ color: 'var(--theme-text-muted)' }}
                    >
                      {course.code}
                    </span>
                    <span 
                      className="font-['Courier_New',monospace] text-xs"
                      style={{ color: 'var(--theme-text-dim)' }}
                    >
                      {course.credits} cr
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Selector - Left Aligned and Smaller */}
      <div className="mb-6">
        <div 
          className="inline-flex rounded-full p-1 transition-colors"
          style={{ 
            backgroundColor: 'var(--theme-bg-alt)',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'var(--theme-border)',
          }}
        >
          <button
            onClick={() => setSelectedView('calendar')}
            className="px-4 py-1.5 rounded-full font-['Courier_New',monospace] text-xs transition-all duration-200"
            style={{ 
              backgroundColor: selectedView === 'calendar' ? 'var(--theme-bg-hover)' : 'transparent',
              color: selectedView === 'calendar' ? 'var(--theme-text)' : 'var(--theme-text-muted)',
            }}
          >
            Calendar
          </button>
          <button
            onClick={() => setSelectedView('evaluations')}
            className="px-4 py-1.5 rounded-full font-['Courier_New',monospace] text-xs transition-all duration-200"
            style={{ 
              backgroundColor: selectedView === 'evaluations' ? 'var(--theme-bg-hover)' : 'transparent',
              color: selectedView === 'evaluations' ? 'var(--theme-text)' : 'var(--theme-text-muted)',
            }}
          >
            Evaluations
          </button>
          <button
            onClick={() => setSelectedView('study')}
            className="px-4 py-1.5 rounded-full font-['Courier_New',monospace] text-xs transition-all duration-200"
            style={{ 
              backgroundColor: selectedView === 'study' ? 'var(--theme-bg-hover)' : 'transparent',
              color: selectedView === 'study' ? 'var(--theme-text)' : 'var(--theme-text-muted)',
            }}
          >
            Study Planning
          </button>
        </div>
      </div>

      {/* Second Content Placeholder */}
      <div 
        className="border rounded-lg p-6 backdrop-blur-sm"
        style={{
          backgroundColor: '#ffffff',
          borderColor: 'var(--theme-border)',
        }}
      >
        {/* Content Views */}
        <div className="min-h-[400px]">
          {selectedView === 'calendar' && (
            <div 
              className="rounded-lg overflow-hidden"
            >
              <div className="grid grid-cols-7">
                {/* Weekday Headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div 
                    key={day}
                    className="text-center font-['Courier_New',monospace] text-xs font-semibold py-2"
                    style={{ 
                      color: '#6b7280',
                      borderBottom: '1px solid #e5e7eb'
                    }}
                  >
                    {day}
                  </div>
                ))}
                
                {/* Calendar Days */}
                {allDays.map((dayObj, idx) => (
                  <div
                    key={idx}
                    className="relative min-h-[100px]"
                    style={{ 
                      borderRight: (idx % 7 !== 6) ? '1px solid #e5e7eb' : 'none',
                      borderBottom: (idx < 28) ? '1px solid #e5e7eb' : 'none'
                    }}
                  >
                    <span 
                      className="absolute top-2 right-2 font-['Courier_New',monospace] text-xs"
                      style={{ color: dayObj.month === 'april' ? '#d1d5db' : '#374151' }}
                    >
                      {dayObj.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedView === 'evaluations' && (
            <div 
              className="rounded-lg p-6"
            >
              <div className="flex items-center justify-center h-[400px]">
                <p className="font-['Courier_New',monospace] text-sm text-center" style={{ color: '#6b7280' }}>
                  Evaluations view - Coming soon
                  <br />
                  <br />
                  Future Idea: Table view with columns Type, Evaluation, Course, Progress, Days Left and Due Date
                </p>
              </div>
            </div>
          )}

          {selectedView === 'study' && (
            <div 
              className="rounded-lg p-6"
            >
              <div className="flex items-center justify-center h-[400px]">
                <p className="font-['Courier_New',monospace] text-sm text-center" style={{ color: '#6b7280' }}>
                  Study Planning view - Coming soon
                  <br />
                  <br />
                  Future Idea: Grantt view with Courses as channels and days thin columns white-background except weekends with light gray background
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}