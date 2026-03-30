import { useCalendarSettings } from "../../contexts/CalendarContext";
import { useState } from 'react';

export function Calendar() {
  const { showDayNumbers, showSunday, showSaturday, firstHour, lastHour } = useCalendarSettings();
  const [selectedView, setSelectedView] = useState<'weekly' | 'monthly' | 'timeline'>('weekly');
  const currentMonth = 'March 2026';
  const allDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Filter days based on settings
  let days = allDays.filter((day) => {
    if (day === 'Sunday' && !showSunday) return false;
    if (day === 'Saturday' && !showSaturday) return false;
    return true;
  });
  
  const allHours = Array.from({ length: 24 }, (_, i) => i);
  const hours = allHours.filter(h => h >= firstHour && h <= lastHour);

  // Define all-day events structure - FLEXIBLE!
  const allDayEventRows = [
    {
      category: 'Evaluations',
      color: '#dc2626',
      events: [
        { text: 'Midterm', day: 'Friday', color: '#dc2626' }
      ]
    },
    {
      category: 'University Deadlines',
      color: '#1e40af',
      events: [
        { text: 'Registration Closes', startDay: 'Monday', endDay: 'Wednesday', color: '#1e40af' }
      ]
    }
  ];

  const formatHour = (hour: number) => {
    if (hour === 0) return '12am';
    if (hour === 12) return '12pm';
    if (hour < 12) return `${hour}am`;
    return `${hour - 12}pm`;
  };

  // Helper to render an event (single day or multi-day)
  const renderEvent = (event: any, day: string, dayIdx: number) => {
    // Single day event
    if (event.day && event.day === day) {
      return (
        <div
          className="h-full w-full px-2 py-1 text-xs font-['Courier_New',monospace] flex items-center"
          style={{
            backgroundColor: `${event.color}15`,
            border: `1px solid ${event.color}`,
            color: event.color,
          }}
        >
          {event.text}
        </div>
      );
    }
    
    // Multi-day event - only render on start day
    if (event.startDay && event.endDay && day === event.startDay) {
      return (
        <div
          className="h-full w-full px-2 py-1 text-xs font-['Courier_New',monospace] flex items-center"
          style={{
            backgroundColor: `${event.color}15`,
            border: `1px solid ${event.color}`,
            color: event.color,
          }}
        >
          {event.text}
        </div>
      );
    }
    
    return null;
  };
  
  // Helper to check if a day should be rendered or skipped (for multi-day events)
  const shouldRenderCell = (row: any, day: string, dayIdx: number) => {
    for (const event of row.events) {
      if (event.startDay && event.endDay) {
        const startIdx = days.indexOf(event.startDay);
        const endIdx = days.indexOf(event.endDay);
        // Skip cells between start and end (but not the start itself)
        if (dayIdx > startIdx && dayIdx <= endIdx) {
          return false;
        }
      }
    }
    return true;
  };
  
  // Helper to get grid column span for a cell
  const getGridColumnSpan = (row: any, day: string, dayIdx: number) => {
    for (const event of row.events) {
      if (event.startDay && event.endDay && day === event.startDay) {
        const startIdx = days.indexOf(event.startDay);
        const endIdx = days.indexOf(event.endDay);
        const span = endIdx - startIdx + 1;
        return span;
      }
    }
    return 1;
  };

  return (
    <div className="p-8 max-w-full mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="mb-1 font-['Courier_New',monospace] transition-colors" style={{ color: 'var(--theme-text)' }}>
          Calendar
        </h2>
        <p className="text-sm font-['Courier_New',monospace] transition-colors" style={{ color: 'var(--theme-text-muted)' }}>
          {currentMonth}
        </p>
      </div>

      {/* Toggle Selector */}
      <div className="flex justify-center mb-8">
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
            onClick={() => setSelectedView('weekly')}
            className="px-6 py-2 rounded-full font-['Courier_New',monospace] text-sm transition-all duration-200"
            style={{
              backgroundColor: selectedView === 'weekly' ? 'var(--theme-bg-hover)' : 'transparent',
              color: selectedView === 'weekly' ? 'var(--theme-text)' : 'var(--theme-text-muted)',
            }}
          >
            Weekly
          </button>
          <button
            onClick={() => setSelectedView('monthly')}
            className="px-6 py-2 rounded-full font-['Courier_New',monospace] text-sm transition-all duration-200"
            style={{
              backgroundColor: selectedView === 'monthly' ? 'var(--theme-bg-hover)' : 'transparent',
              color: selectedView === 'monthly' ? 'var(--theme-text)' : 'var(--theme-text-muted)',
            }}
          >
            Monthly
          </button>
          <button
            onClick={() => setSelectedView('timeline')}
            className="px-6 py-2 rounded-full font-['Courier_New',monospace] text-sm transition-all duration-200"
            style={{
              backgroundColor: selectedView === 'timeline' ? 'var(--theme-bg-hover)' : 'transparent',
              color: selectedView === 'timeline' ? 'var(--theme-text)' : 'var(--theme-text-muted)',
            }}
          >
            Timeline
          </button>
        </div>
      </div>

      {/* Content Area */}
      {selectedView === 'weekly' ? (
        // Weekly General View - Current Calendar Content
        <div className="flex gap-6">
          {/* Left Side: Weekly Calendar */}
          <div className="flex-1 flex gap-2">
            {/* Time column - outside the table */}
            <div className="flex flex-col">
              {/* Empty space for day headers */}
              <div className="h-[57px]" />
              
              {/* Dynamic empty space for all-day events */}
              {allDayEventRows.map((_, index) => (
                <div key={index} className="min-h-[32px] border-b" style={{ borderColor: 'var(--theme-border)' }}></div>
              ))}
              
              {/* Hour labels */}
              <div>
                {hours.map((hour) => (
                  <div 
                    key={hour}
                    className="h-12 flex items-center justify-end pr-2"
                  >
                    {(hour % 2 === 0) && (
                      <span className="font-['Courier_New',monospace] text-xs" style={{ color: 'var(--theme-text-muted)' }}>
                        {formatHour(hour)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Calendar Table */}
            <div 
              className="border rounded-lg backdrop-blur-sm overflow-hidden flex-1 flex flex-col"
              style={{
                backgroundColor: 'var(--theme-bg-alt)',
                borderColor: 'var(--theme-border)',
              }}
            >
              {/* Days Header */}
              <div className={`grid border-b`} style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))`, borderColor: 'var(--theme-border)' }}>
                {/* Day headers */}
                {days.map((day, idx) => (
                  <div 
                    key={idx}
                    className="p-4 text-center border-l first:border-l-0"
                    style={{ borderColor: 'var(--theme-border)' }}
                  >
                    <p className="font-['Courier_New',monospace] text-sm" style={{ color: 'var(--theme-text)' }}>
                      {day} {showDayNumbers ? 15 + idx : ''}
                    </p>
                  </div>
                ))}
              </div>

              {/* All-Day Events Section */}
              <div>
                {allDayEventRows.map((row, rowIndex) => (
                  <div key={rowIndex} className="grid border-b" style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))`, borderColor: 'var(--theme-border)' }}>
                    {days.map((day, dayIdx) => {
                      // Skip rendering this cell if it's covered by a multi-day event
                      if (!shouldRenderCell(row, day, dayIdx)) {
                        return null;
                      }
                      
                      const event = row.events.find(e => e.day === day || e.startDay === day);
                      const span = getGridColumnSpan(row, day, dayIdx);
                      
                      return (
                        <div 
                          key={dayIdx}
                          className="border-l first:border-l-0 min-h-[32px]"
                          style={{ 
                            borderColor: 'var(--theme-border)',
                            gridColumn: span > 1 ? `span ${span}` : 'auto',
                          }}
                        >
                          {event && renderEvent(event, day, dayIdx)}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div>
                <div className="grid" style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }}>
                  {/* Day columns */}
                  {days.map((day, dayIdx) => (
                    <div key={dayIdx} className="border-r last:border-r-0" style={{ borderColor: 'var(--theme-border)' }}>
                      {hours.map((hour) => (
                        <div 
                          key={hour}
                          className="h-12 border-b relative hover:bg-opacity-50 transition-colors cursor-pointer"
                          style={{ 
                            borderColor: 'var(--theme-border)',
                            borderStyle: 'dotted',
                            borderBottomWidth: '0.5px',
                            backgroundColor: 'transparent',
                          }}
                        >
                          {/* Future events will be positioned here */}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Current Courses */}
          <div className="w-80">
            {/* Category underlines */}
            <div className="mb-1 pb-1 border-b" style={{ borderColor: '#dc2626' }}>
              <span className="font-['Courier_New',monospace] text-xs" style={{ color: '#dc2626' }}>
                Evaluations
              </span>
            </div>
            <div className="mb-4 pb-1 border-b" style={{ borderColor: '#1e40af' }}>
              <span className="font-['Courier_New',monospace] text-xs" style={{ color: '#1e40af' }}>
                University Deadlines
              </span>
            </div>

            <h3 className="mb-4 font-['Courier_New',monospace] transition-colors" style={{ color: 'var(--theme-text)' }}>
              Current Courses
            </h3>

            <div className="space-y-3">
              {[
                { code: 'MAT301', name: 'Differential Calculus', professor: 'Dr. Rodriguez', color: '#dc2626' },
                { code: 'APHY410', name: 'General Relativity', professor: 'Prof. Einstein', color: '#a855f7' },
                { code: 'CS425', name: 'Computer Networks', professor: 'Dr. Thompson', color: '#3b82f6' },
                { code: 'CS430', name: 'Artificial Intelligence', professor: 'Prof. Turing', color: '#3b82f6' },
                { code: 'CS440', name: 'Operating Systems', professor: 'Dr. Kernighan', color: '#3b82f6' },
                { code: 'CS450', name: 'Theory of Computation', professor: 'Prof. Gödel', color: '#3b82f6' },
              ].map((course, index) => (
                <div
                  key={index}
                  className="rounded-lg p-4 transition-all"
                  style={{ 
                    backgroundColor: `${course.color}15`,
                    border: `1px solid ${course.color}`,
                  }}
                >
                  <h4 className="font-['Courier_New',monospace] mb-2 transition-colors" style={{ color: 'var(--theme-text)' }}>
                    {course.name}
                  </h4>
                  <div className="flex items-center gap-2 text-sm transition-colors" style={{ color: 'var(--theme-text-muted)' }}>
                    <span className="font-['Courier_New',monospace]">{course.code}</span>
                    <span className="font-['Courier_New',monospace]">•</span>
                    <span className="font-['Courier_New',monospace]">{course.professor}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : selectedView === 'monthly' ? (
        // Monthly Overview View - Empty Placeholder
        <div 
          className="border rounded-lg p-12 backdrop-blur-sm min-h-[400px] flex items-center justify-center"
          style={{
            backgroundColor: 'transparent',
            borderColor: 'var(--theme-border)',
          }}
        >
          <p className="font-['Courier_New',monospace] text-sm" style={{ color: 'var(--theme-text-muted)' }}>
            Monthly Overview section - Coming soon
          </p>
        </div>
      ) : (
        // Timeline View - Empty Placeholder
        <div 
          className="border rounded-lg p-12 backdrop-blur-sm min-h-[400px] flex items-center justify-center"
          style={{
            backgroundColor: 'transparent',
            borderColor: 'var(--theme-border)',
          }}
        >
          <p className="font-['Courier_New',monospace] text-sm" style={{ color: 'var(--theme-text-muted)' }}>
            Timeline section - Coming soon
          </p>
        </div>
      )}
    </div>
  );
}