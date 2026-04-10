import { GraduationCap, Mail, BookOpen, TrendingUp, User, Clock, MapPin } from "lucide-react";
import { useCalendarSettings } from "../../contexts/CalendarContext";

export function Home() {
  const { showDayNumbers, showSunday, showSaturday, firstHour, lastHour } = useCalendarSettings();
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
          Home
        </h2>
        <p className="text-sm font-['Courier_New',monospace] transition-colors" style={{ color: 'var(--theme-text-muted)' }}>
          Welcome back, Andrew
        </p>
      </div>

      {/* Student Info Card */}
      <div className="rounded-lg p-6 mb-6 relative overflow-hidden transition-colors" style={{ backgroundColor: 'var(--theme-bg-alt)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--theme-border)' }}>
        {/* Subtle dotted texture on card */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle, var(--theme-text) 1px, transparent 1px)`,
            backgroundSize: '15px 15px',
          }}
        />

        <div className="relative flex items-start gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full flex-shrink-0 flex items-center justify-center transition-colors" style={{ backgroundColor: 'var(--theme-bg)', borderWidth: '2px', borderStyle: 'solid', borderColor: 'var(--theme-border)' }}>
            <User className="w-10 h-10" style={{ color: 'var(--theme-text-muted)' }} />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h3 className="mb-1 font-['Courier_New',monospace] transition-colors" style={{ color: 'var(--theme-text)' }}>
              Andrew Lettuce
            </h3>
            <p className="text-sm mb-4 font-['Courier_New',monospace] transition-colors" style={{ color: 'var(--theme-text-dim)' }}>
              Computer Science & Civil Engineer • Federico Santa Maria Technical College
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 transition-colors" style={{ color: 'var(--theme-text-muted)' }}>
                <Mail className="w-4 h-4" />
                <span className="text-sm font-['Courier_New',monospace]">andrew.lettuce@usm.cl</span>
              </div>
              <div className="flex items-center gap-2 transition-colors" style={{ color: 'var(--theme-text-muted)' }}>
                <GraduationCap className="w-4 h-4" />
                <span className="text-sm font-['Courier_New',monospace]">202073565-9</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {/* GPA Card */}
        <div className="rounded-lg p-5 relative overflow-hidden transition-colors" style={{ backgroundColor: 'var(--theme-bg-alt)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--theme-border)' }}>
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `radial-gradient(circle, var(--theme-text) 1px, transparent 1px)`,
              backgroundSize: '15px 15px',
            }}
          />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 transition-colors" style={{ color: 'var(--theme-text-muted)' }} />
              <span className="text-xs font-['Courier_New',monospace] transition-colors" style={{ color: 'var(--theme-text-muted)' }}>CURRENT GPA</span>
            </div>
            <p className="text-2xl font-['Courier_New',monospace] transition-colors" style={{ color: 'var(--theme-text)' }}>3.87</p>
          </div>
        </div>

        {/* Credits Card */}
        <div className="rounded-lg p-5 relative overflow-hidden transition-colors" style={{ backgroundColor: 'var(--theme-bg-alt)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--theme-border)' }}>
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `radial-gradient(circle, var(--theme-text) 1px, transparent 1px)`,
              backgroundSize: '15px 15px',
            }}
          />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 transition-colors" style={{ color: 'var(--theme-text-muted)' }} />
              <span className="text-xs font-['Courier_New',monospace] transition-colors" style={{ color: 'var(--theme-text-muted)' }}>CREDITS</span>
            </div>
            <p className="text-2xl font-['Courier_New',monospace] transition-colors" style={{ color: 'var(--theme-text)' }}>78/120</p>
          </div>
        </div>

        {/* Courses Card */}
        <div className="rounded-lg p-5 relative overflow-hidden transition-colors" style={{ backgroundColor: 'var(--theme-bg-alt)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--theme-border)' }}>
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `radial-gradient(circle, var(--theme-text) 1px, transparent 1px)`,
              backgroundSize: '15px 15px',
            }}
          />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="w-4 h-4 transition-colors" style={{ color: 'var(--theme-text-muted)' }} />
              <span className="text-xs font-['Courier_New',monospace] transition-colors" style={{ color: 'var(--theme-text-muted)' }}>ACTIVE COURSES</span>
            </div>
            <p className="text-2xl font-['Courier_New',monospace] transition-colors" style={{ color: 'var(--theme-text)' }}>6</p>
          </div>
        </div>
      </div>

      {/* Weekly Calendar View - from Calendar.tsx */}
      <div className="flex gap-6 mb-8">
        {/* Left Side: Weekly Calendar */}
        <div className="flex-1 flex gap-2">
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

          {/* Time column - outside the table on the right */}
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
                  className="h-12 flex items-center justify-start pl-2"
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

      {/* Calendar & Events Section - RECOVERED */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <h3 className="mb-4 font-['Courier_New',monospace] transition-colors" style={{ color: 'var(--theme-text)' }}>
            March 2026
          </h3>
          <div className="rounded-lg p-5 relative overflow-hidden transition-colors" style={{ backgroundColor: 'var(--theme-bg-alt)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--theme-border)' }}>
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `radial-gradient(circle, var(--theme-text) 1px, transparent 1px)`,
                backgroundSize: '15px 15px',
              }}
            />

            <div className="relative">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2 mb-3">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-['Courier_New',monospace] py-2 transition-colors"
                    style={{ color: 'var(--theme-text-muted)' }}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {(() => {
                  const daysInMonth = 31;
                  const firstDayOfMonth = 6;
                  const calendarDays = [];
                  const events = [13, 15, 18, 20];

                  for (let i = 0; i < firstDayOfMonth; i++) {
                    calendarDays.push(null);
                  }

                  for (let i = 1; i <= daysInMonth; i++) {
                    calendarDays.push(i);
                  }

                  return calendarDays.map((day, index) => {
                    const hasEvent = day && events.includes(day);
                    const isToday = day === 13;

                    return (
                      <div
                        key={index}
                        className="aspect-square flex items-center justify-center rounded-md font-['Courier_New',monospace] text-sm transition-all"
                        style={{
                          cursor: day ? 'pointer' : 'default',
                          backgroundColor: isToday ? 'var(--theme-bg)' : (hasEvent && !isToday ? 'rgba(42, 42, 42, 0.5)' : 'transparent'),
                          borderWidth: isToday ? '2px' : '0',
                          borderStyle: 'solid',
                          borderColor: isToday ? 'var(--theme-text-dim)' : 'transparent',
                          color: isToday ? 'var(--theme-text)' : (day ? 'var(--theme-text-muted)' : 'var(--theme-border)')
                        }}
                        onMouseEnter={(e) => {
                          if (day && !isToday) {
                            e.currentTarget.style.backgroundColor = 'var(--theme-bg-hover)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (day && !isToday) {
                            e.currentTarget.style.backgroundColor = hasEvent ? 'rgba(42, 42, 42, 0.5)' : 'transparent';
                          }
                        }}
                      >
                        {day && (
                          <div className="relative">
                            {day}
                            {hasEvent && (
                              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full transition-colors" style={{ backgroundColor: 'var(--theme-text-muted)' }} />
                            )}
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div>
          <h3 className="mb-4 font-['Courier_New',monospace] transition-colors" style={{ color: 'var(--theme-text)' }}>
            Upcoming Events
          </h3>

          <div className="space-y-3">
            {[
              { day: 13, name: 'CS 401 Midterm', time: '10:00', location: 'Room 301' },
              { day: 15, name: 'ML Project Due', time: '23:59', location: 'Online' },
              { day: 18, name: 'Study Group', time: '16:00', location: 'Library' },
              { day: 20, name: 'Database Lab', time: '13:00', location: 'Lab 205' },
            ].map((event, index) => (
              <div
                key={index}
                className="rounded-lg p-4 relative overflow-hidden transition-all"
                style={{ backgroundColor: 'var(--theme-bg-alt)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--theme-border)' }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--theme-border-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--theme-border)'}
              >
                <div
                  className="absolute inset-0 opacity-5"
                  style={{
                    backgroundImage: `radial-gradient(circle, var(--theme-text) 1px, transparent 1px)`,
                    backgroundSize: '15px 15px',
                  }}
                />

                <div className="relative">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0 transition-colors" style={{ backgroundColor: 'var(--theme-bg)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--theme-border)' }}>
                      <span className="text-xs font-['Courier_New',monospace] transition-colors" style={{ color: 'var(--theme-text)' }}>
                        {event.day}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-['Courier_New',monospace] text-sm mb-1 transition-colors" style={{ color: 'var(--theme-text)' }}>
                        {event.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs mb-1 transition-colors" style={{ color: 'var(--theme-text-muted)' }}>
                        <Clock className="w-3 h-3" />
                        <span className="font-['Courier_New',monospace]">{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs transition-colors" style={{ color: 'var(--theme-text-muted)' }}>
                        <MapPin className="w-3 h-3" />
                        <span className="font-['Courier_New',monospace]">{event.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
