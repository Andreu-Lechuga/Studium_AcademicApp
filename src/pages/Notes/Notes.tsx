import { useState } from 'react';

export function Notes() {
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<{code: string, name: string, professor: string, color: string} | null>(null);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [showConcepts, setShowConcepts] = useState(true);
  const [selectedView, setSelectedView] = useState<'class-notes' | 'concepts'>('class-notes');

  // Previous class notes data structure
  const previousClassNotes: {[key: string]: {week: number, mondayDate: number, date: string, time: string, topic: string, notes: string, concepts: string[]}[]} = {
    'MAT301': [
      { week: 3, mondayDate: 10, date: 'March 14, 2026', time: '11:05am', topic: 'Integration by Parts', notes: 'Covered advanced integration techniques...', concepts: ['u-substitution', 'LIATE rule', 'definite integrals'] },
      { week: 3, mondayDate: 10, date: 'March 12, 2026', time: '11:05am', topic: 'Definite Integrals', notes: 'Discussed fundamental theorem of calculus...', concepts: ['FTC part I', 'FTC part II', 'area under curve'] },
      { week: 2, mondayDate: 3, date: 'March 7, 2026', time: '11:05am', topic: 'Chain Rule Applications', notes: 'Complex derivatives and optimization...', concepts: ['composite functions', 'implicit differentiation', 'related rates'] },
      { week: 2, mondayDate: 3, date:'March 5, 2026', time: '11:05am', topic: 'Product & Quotient Rules', notes: 'Derivation rules for combined functions...', concepts: ['product rule', 'quotient rule', 'logarithmic diff'] },
      { week: 1, mondayDate: 24, date: 'February 28, 2026', time: '11:05am', topic: 'Limits & Continuity', notes: 'Introduction to differential calculus...', concepts: ['epsilon-delta', 'one-sided limits', 'continuity tests'] },
      { week: 1, mondayDate: 24, date: 'February 26, 2026', time: '11:05am', topic: 'Course Introduction', notes: 'Syllabus review and expectations...', concepts: ['course outline', 'grading policy', 'prerequisites'] },
    ],
    'APHY410': [
      { week: 3, mondayDate: 10, date: 'March 13, 2026', time: '2:15pm', topic: 'Schwarzschild Solution', notes: 'Black hole metrics and event horizons...', concepts: ['event horizon', 'singularity', 'gravitational redshift'] },
      { week: 3, mondayDate: 10, date: 'March 11, 2026', time: '2:15pm', topic: 'Geodesic Equations', notes: 'Particle motion in curved spacetime...', concepts: ['Christoffel symbols', 'proper time', 'null geodesics'] },
      { week: 2, mondayDate: 3, date: 'March 6, 2026', time: '2:15pm', topic: 'Einstein Field Equations', notes: 'Derivation and physical interpretation...', concepts: ['stress-energy tensor', 'Ricci tensor', 'cosmological constant'] },
      { week: 2, mondayDate: 3, date: 'March 4, 2026', time: '2:15pm', topic: 'Riemann Tensor', notes: 'Curvature tensor and its properties...', concepts: ['tidal forces', 'parallel transport', 'Bianchi identities'] },
      { week: 1, mondayDate: 24, date: 'February 27, 2026', time: '2:15pm', topic: 'Tensor Calculus Basics', notes: 'Covariant and contravariant indices...', concepts: ['index notation', 'metric tensor', 'tensor transformation'] },
      { week: 1, mondayDate: 24, date: 'February 25, 2026', time: '2:15pm', topic: 'Special Relativity Review', notes: 'Lorentz transformations and invariants...', concepts: ['time dilation', 'length contraction', 'spacetime interval'] },
    ],
    'CS425': [
      { week: 3, mondayDate: 10, date: 'March 15, 2026', time: '9:30am', topic: 'TCP Congestion Control', notes: 'Flow control algorithms and window sizing...', concepts: ['slow start', 'AIMD', 'fast retransmit'] },
      { week: 3, mondayDate: 10, date: 'March 13, 2026', time: '9:30am', topic: 'UDP vs TCP', notes: 'Transport layer protocols comparison...', concepts: ['reliability', 'ordering', 'connection state'] },
      { week: 2, mondayDate: 3, date: 'March 8, 2026', time: '9:30am', topic: 'IP Routing', notes: 'Routing tables and forwarding algorithms...', concepts: ['RIP', 'OSPF', 'BGP'] },
      { week: 2, mondayDate: 3, date: 'March 6, 2026', time: '9:30am', topic: 'Network Layer', notes: 'IP addressing and subnetting...', concepts: ['CIDR', 'subnet masks', 'NAT'] },
      { week: 1, mondayDate: 27, date: 'March 1, 2026', time: '9:30am', topic: 'OSI Model', notes: 'Seven layers and their functions...', concepts: ['encapsulation', 'PDUs', 'layer protocols'] },
      { week: 1, mondayDate: 27, date: 'February 27, 2026', time: '9:30am', topic: 'Network Fundamentals', notes: 'Bandwidth, latency, and throughput...', concepts: ['delay types', 'packet loss', 'QoS'] },
    ],
    'CS430': [
      { week: 3, mondayDate: 10, date: 'March 14, 2026', time: '10:15am', topic: 'Backpropagation', notes: 'Neural network training algorithms...', concepts: ['gradient descent', 'chain rule', 'weight updates'] },
      { week: 3, mondayDate: 10, date: 'March 12, 2026', time: '10:15am', topic: 'Perceptrons', notes: 'Single layer neural networks...', concepts: ['activation functions', 'linear separability', 'bias term'] },
      { week: 2, mondayDate: 3, date: 'March 7, 2026', time: '10:15am', topic: 'Decision Trees', notes: 'ID3 algorithm and entropy calculations...', concepts: ['information gain', 'gini index', 'pruning'] },
      { week: 2, mondayDate: 3, date: 'March 5, 2026', time: '10:15am', topic: 'Supervised Learning', notes: 'Classification vs regression problems...', concepts: ['training set', 'test set', 'overfitting'] },
      { week: 1, mondayDate: 24, date: 'February 28, 2026', time: '10:15am', topic: 'Search Algorithms', notes: 'A*, BFS, DFS implementations...', concepts: ['heuristics', 'admissibility', 'completeness'] },
      { week: 1, mondayDate: 24, date: 'February 26, 2026', time: '10:15am', topic: 'AI Introduction', notes: 'Historical overview and applications...', concepts: ['Turing test', 'strong AI', 'weak AI'] },
    ],
    'CS440': [
      { week: 3, mondayDate: 10, date: 'March 13, 2026', time: '1:00pm', topic: 'Deadlock Detection', notes: 'Resource allocation graphs and prevention...', concepts: ['RAG', 'wait-for graph', 'banker\'s algorithm'] },
      { week: 3, mondayDate: 10, date: 'March 11, 2026', time: '1:00pm', topic: 'Synchronization', notes: 'Semaphores and mutexes...', concepts: ['critical section', 'race condition', 'mutual exclusion'] },
      { week: 2, mondayDate: 3, date: 'March 6, 2026', time: '1:00pm', topic: 'Page Replacement', notes: 'LRU, FIFO, and optimal algorithms...', concepts: ['page fault', 'working set', 'thrashing'] },
      { week: 2, mondayDate: 3, date: 'March 4, 2026', time: '1:00pm', topic: 'Virtual Memory', notes: 'Paging and segmentation...', concepts: ['TLB', 'page table', 'demand paging'] },
      { week: 1, mondayDate: 24, date: 'February 27, 2026', time: '1:00pm', topic: 'CPU Scheduling', notes: 'Round-robin, SJF, priority scheduling...', concepts: ['preemption', 'turnaround time', 'starvation'] },
      { week: 1, mondayDate: 24, date: 'February 25, 2026', time: '1:00pm', topic: 'Process Management', notes: 'Process states and context switching...', concepts: ['PCB', 'context switch', 'IPC'] },
    ],
    'CS450': [
      { week: 3, mondayDate: 10, date: 'March 14, 2026', time: '4:30pm', topic: 'NP-Completeness', notes: 'Cook-Levin theorem and reductions...', concepts: ['SAT problem', 'polynomial reduction', 'NP-hard'] },
      { week: 3, mondayDate: 10, date: 'March 12, 2026', time: '4:30pm', topic: 'Turing Machines', notes: 'Universal TM and halting problem...', concepts: ['undecidability', 'Church-Turing thesis', 'TM variants'] },
      { week: 2, mondayDate: 3, date: 'March 7, 2026', time: '4:30pm', topic: 'Context-Free Grammars', notes: 'Pushdown automata equivalence...', concepts: ['derivation', 'parse tree', 'ambiguity'] },
      { week: 2, mondayDate: 3, date: 'March 5, 2026', time: '4:30pm', topic: 'Regular Expressions', notes: 'Regex to NFA conversion...', concepts: ['Kleene star', 'concatenation', 'union'] },
      { week: 1, mondayDate: 24, date: 'February 28, 2026', time: '4:30pm', topic: 'DFA and NFA', notes: 'Finite automata theory and equivalence...', concepts: ['determinism', 'subset construction', 'minimization'] },
      { week: 1, mondayDate: 24, date: 'February 26, 2026', time: '4:30pm', topic: 'Formal Languages', notes: 'Chomsky hierarchy introduction...', concepts: ['regular languages', 'CFLs', 'recursively enum'] },
    ],
  };

  // Sample schedule data - courses per day
  const weekSchedule = {
    'Mon': [
      { code: 'MAT301', name: 'Differential Calculus', color: '#dc2626' },
      { code: 'CS425', name: 'Computer Networks', color: '#3b82f6' },
    ],
    'Tue': [
      { code: 'APHY410', name: 'General Relativity', color: '#a855f7' },
      { code: 'CS430', name: 'Artificial Intelligence', color: '#3b82f6' },
    ],
    'Wed': [
      { code: 'MAT301', name: 'Differential Calculus', color: '#dc2626' },
      { code: 'CS440', name: 'Operating Systems', color: '#3b82f6' },
    ],
    'Thu': [
      { code: 'CS425', name: 'Computer Networks', color: '#3b82f6' },
      { code: 'CS450', name: 'Theory of Computation', color: '#3b82f6' },
    ],
    'Fri': [
      { code: 'APHY410', name: 'General Relativity', color: '#a855f7' },
      { code: 'CS430', name: 'Artificial Intelligence', color: '#3b82f6' },
      { code: 'MAT301', name: 'Differential Calculus', color: '#dc2626' },
    ],
  };

  return (
    <div className="p-8 max-w-full mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="mb-1 font-['Courier_New',monospace] transition-colors" style={{ color: 'var(--theme-text)' }}>
          Notes
        </h2>
        <p className="text-sm font-['Courier_New',monospace] transition-colors" style={{ color: 'var(--theme-text-muted)' }}>
          Your study materials and lecture notes
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
            onClick={() => setSelectedView('class-notes')}
            className="px-6 py-2 rounded-full font-['Courier_New',monospace] text-sm transition-all duration-200"
            style={{
              backgroundColor: selectedView === 'class-notes' ? 'var(--theme-bg-hover)' : 'transparent',
              color: selectedView === 'class-notes' ? 'var(--theme-text)' : 'var(--theme-text-muted)',
            }}
          >
            Class Notes
          </button>
          <button
            onClick={() => setSelectedView('concepts')}
            className="px-6 py-2 rounded-full font-['Courier_New',monospace] text-sm transition-all duration-200"
            style={{
              backgroundColor: selectedView === 'concepts' ? 'var(--theme-bg-hover)' : 'transparent',
              color: selectedView === 'concepts' ? 'var(--theme-text)' : 'var(--theme-text-muted)',
            }}
          >
            Concepts
          </button>
        </div>
      </div>

      {/* Class Notes View */}
      {selectedView === 'class-notes' && (
        <>
          {/* Two Column Layout (Current Courses + Empty Placeholder) */}
          <div className="flex gap-6 mb-8">
            {/* Left Side: Current Courses */}
            <div className="w-80">
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
                    onClick={() => setSelectedCourse(course)}
                    className="rounded-lg p-4 transition-all cursor-pointer"
                    style={{ 
                      backgroundColor: `${course.color}15`,
                      border: selectedCourse?.code === course.code ? `1.5px solid ${course.color}` : `1px solid ${course.color}`,
                      opacity: selectedCourse?.code === course.code ? 1 : 0.8,
                    }}
                    onMouseEnter={(e) => {
                      if (selectedCourse?.code !== course.code) {
                        e.currentTarget.style.opacity = '1';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedCourse?.code !== course.code) {
                        e.currentTarget.style.opacity = '0.8';
                      }
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
                ))
}
              </div>
            </div>

            {/* Right Side: Empty Placeholder Container */}
            <div className="flex-1 relative">
              {/* Floating Weekday Selector - Centered on Top */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
                <div 
                  className="inline-flex rounded-md p-1 transition-colors shadow-lg"
                  style={{ 
                    backgroundColor: 'var(--theme-bg-alt)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: 'var(--theme-border)',
                  }}
                >
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
                    <div key={day} className="relative">
                      <button
                        onMouseEnter={() => setHoveredDay(day)}
                        onMouseLeave={() => setHoveredDay(null)}
                        className="px-4 py-2 rounded font-['Courier_New',monospace] text-sm transition-all duration-200"
                        style={{ 
                          backgroundColor: hoveredDay === day ? 'var(--theme-bg-hover)' : 'transparent',
                          color: hoveredDay === day ? 'var(--theme-text)' : 'var(--theme-text-muted)',
                        }}
                      >
                        {day}
                      </button>
                      
                      {/* Floating Course Cards on Hover */}
                      {hoveredDay === day && (
                        <div 
                          className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 min-w-[200px] space-y-2 z-20"
                          style={{ pointerEvents: 'none' }}
                        >
                          {weekSchedule[day as keyof typeof weekSchedule].map((course, idx) => (
                            <div
                              key={idx}
                              className="rounded p-3 shadow-lg transition-all"
                              style={{ 
                                backgroundColor: `${course.color}15`,
                                border: `1px solid ${course.color}`,
                              }}
                            >
                              <p className="font-['Courier_New',monospace] text-xs mb-1" style={{ color: 'var(--theme-text)' }}>
                                {course.name}
                              </p>
                              <p className="font-['Courier_New',monospace] text-xs" style={{ color: 'var(--theme-text-muted)' }}>
                                {course.code}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Empty Container */}
              <div 
                className="border rounded-lg backdrop-blur-sm h-full min-h-[400px] transition-all flex"
                style={{ 
                  backgroundColor: 'var(--theme-bg-alt)',
                  borderColor: selectedCourse ? selectedCourse.color : 'var(--theme-border)',
                }}
              >
                {/* Collapsible Side Menu */}
                {isSideMenuOpen && (
                  <div 
                    className="border-r p-4 transition-all"
                    style={{ 
                      width: '16.666%',
                      borderColor: selectedCourse ? selectedCourse.color : 'var(--theme-border)',
                    }}
                  >
                    {/* Side menu content placeholder */}
                  </div>
                )}

                {/* Main Content Area */}
                <div className="flex-1 p-6 relative overflow-hidden group">
                  {/* Dotted Background */}
                  <div
                    className="absolute inset-0 opacity-5 transition-opacity"
                    style={{
                      backgroundImage: `radial-gradient(circle, var(--theme-text) 1px, transparent 1px)`,
                      backgroundSize: '15px 15px',
                    }}
                  />

                  {/* Content */}
                  <div className="relative">
                    {selectedCourse && (
                      <div className="flex items-center gap-2 mb-4 group/header">
                        {/* Toggle Button */}
                        <button
                          onClick={() => setIsSideMenuOpen(!isSideMenuOpen)}
                          className="rounded transition-all px-1 py-1 opacity-0 group-hover/header:opacity-40"
                          style={{ 
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: 'var(--theme-text-muted)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = '0.8';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = '0.4';
                          }}
                        >
                          <div className="flex flex-col gap-[3px] w-4">
                            <div className="h-[1px] w-full" style={{ backgroundColor: 'currentColor' }} />
                            <div className="h-[1px] w-full" style={{ backgroundColor: 'currentColor' }} />
                            <div className="h-[1px] w-full" style={{ backgroundColor: 'currentColor' }} />
                          </div>
                        </button>

                        {/* Course Title */}
                        <h3 className="font-['Courier_New',monospace] transition-colors" style={{ color: 'var(--theme-text)' }}>
                          {selectedCourse.name}
                        </h3>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Previous Class Notes Section */}
          {selectedCourse && previousClassNotes[selectedCourse.code] && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-['Courier_New',monospace] transition-colors" style={{ color: 'var(--theme-text)' }}>
                  Previous Class Notes: {selectedCourse.name}
                </h3>
                <button
                  className="px-3 py-1.5 rounded text-xs font-['Courier_New',monospace] transition-all"
                  style={{
                    backgroundColor: 'var(--theme-bg-alt)',
                    color: 'var(--theme-text-muted)',
                    border: '1px solid var(--theme-border)',
                    opacity: 0.6,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '0.6';
                  }}
                  onClick={() => setShowConcepts(!showConcepts)}
                >
                  {showConcepts ? 'Hide Concepts' : 'Show Concepts'}
                </button>
              </div>

              {/* Horizontal Carousel */}
              <div className="overflow-x-auto scrollbar-hide pb-4">
                <div className="flex gap-4 items-start">
                  {/* Group notes by week in reverse order (newest first) */}
                  {(() => {
                    const totalClasses = previousClassNotes[selectedCourse.code].length;
                    return [...new Set(previousClassNotes[selectedCourse.code].map(note => note.week))]
                      .sort((a, b) => b - a) // Sort weeks in descending order (newest first)
                      .map((weekNum) => {
                        const weekNotes = previousClassNotes[selectedCourse.code]
                          .filter(note => note.week === weekNum)
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Newest first within week
                        
                        return (
                          <div key={weekNum} className="flex items-stretch gap-4">
                            {/* Week Separator Card */}
                            <div 
                              className="flex-shrink-0 min-w-[100px] rounded-lg p-4 flex flex-col items-center justify-center transition-all gap-1"
                              style={{
                                backgroundColor: 'transparent',
                                border: '1px dashed var(--theme-border)',
                              }}
                            >
                              <span 
                                className="font-['Courier_New',monospace] font-bold text-sm"
                                style={{ color: 'var(--theme-text)' }}
                              >
                                Week {weekNum}
                              </span>
                              <span 
                                className="font-['Courier_New',monospace] text-xs"
                                style={{ color: 'var(--theme-text-muted)' }}
                              >
                                Monday {weekNotes[0].mondayDate}
                              </span>
                            </div>

                            {/* Class Note Cards for this week */}
                            {weekNotes.map((note, idx) => {
                              // Calculate class number: newest = total, oldest = 1
                              const noteIndex = previousClassNotes[selectedCourse.code]
                                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                .findIndex(n => n.date === note.date);
                              const classNumber = totalClasses - noteIndex;
                              
                              return (
                                <div key={idx} className="flex flex-col gap-2 min-w-[280px] max-w-[280px]">
                                  {/* Date and Time - Outside and Above Card */}
                                  <div className="flex items-center gap-2 text-xs font-['Courier_New',monospace]" style={{ color: 'var(--theme-text-muted)' }}>
                                    <span>{note.date}</span>
                                    <span>•</span>
                                    <span>{note.time}</span>
                                  </div>

                                  {/* Colored Card */}
                                  <div
                                    className="rounded-lg p-4 transition-all cursor-pointer relative overflow-hidden group"
                                    style={{
                                      backgroundColor: `${selectedCourse.color}08`,
                                      border: `1px solid ${selectedCourse.color}`,
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor = `${selectedCourse.color}15`;
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor = `${selectedCourse.color}08`;
                                    }}
                                  >
                                    {/* Dotted Background */}
                                    <div
                                      className="absolute inset-0 opacity-5 transition-opacity"
                                      style={{
                                        backgroundImage: `radial-gradient(circle, var(--theme-text) 1px, transparent 1px)`,
                                        backgroundSize: '15px 15px',
                                      }}
                                    />

                                    <div className="relative">
                                      <h4 
                                        className="font-['Courier_New',monospace]"
                                        style={{ color: 'var(--theme-text)' }}
                                      >
                                        Class {classNumber}
                                      </h4>
                                    </div>
                                  </div>

                                  {/* Concept Tags - Below Card */}
                                  {showConcepts && (
                                    <div className="flex flex-wrap gap-1.5 w-full">
                                      {note.concepts.map((concept, conceptIdx) => (
                                        <span
                                          key={conceptIdx}
                                          className="inline-block px-2 py-1 rounded text-xs font-['Courier_New',monospace] transition-all relative overflow-hidden"
                                          style={{
                                            backgroundColor: 'transparent',
                                            color: 'var(--theme-text-muted)',
                                            border: `1px dotted ${selectedCourse.color}60`,
                                          }}
                                        >
                                          {/* Dotted Background */}
                                          <div
                                            className="absolute inset-0 opacity-5"
                                            style={{
                                              backgroundImage: `radial-gradient(circle, var(--theme-text) 1px, transparent 1px)`,
                                              backgroundSize: '15px 15px',
                                            }}
                                          />
                                          <span className="relative">{concept}</span>
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        );
                      });
                  })()}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Concepts View */}
      {selectedView === 'concepts' && (
        <div 
          className="border rounded-lg backdrop-blur-sm p-12 min-h-[500px] flex items-center justify-center transition-all"
          style={{ 
            backgroundColor: 'var(--theme-bg-alt)',
            borderColor: 'var(--theme-border)',
          }}
        >
          <div className="text-center">
            <p className="font-['Courier_New',monospace] text-lg transition-colors" style={{ color: 'var(--theme-text-muted)' }}>
              Concepts section coming soon...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
