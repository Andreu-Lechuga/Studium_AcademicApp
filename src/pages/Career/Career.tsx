import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export function Career() {
  const [selectedSemester, setSelectedSemester] = useState<'current' | 'past'>('current');
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    weeklyLoad: true,
    evaluation: true,
    syllabus: false,
    resources: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const currentSemester = {
    name: '2026-1',
    courses: [
      { 
        name: 'Differential Calculus', 
        code: 'MAT301', 
        credits: 4, 
        color: '#dc2626', 
        professor: 'Dr. Rodriguez',
        department: 'Mathematics',
        schedule: 'Mon/Wed 10:00-11:30',
        room: 'Room 301 / Hybrid',
        weeklyLoad: {
          lectures: 3,
          labs: 2,
          tutorials: 1,
          officeHours: 2,
          selfStudy: 8,
        },
        evaluation: {
          exams: 40,
          labs: 20,
          projects: 30,
          participation: 10,
        },
        syllabus: [
          { week: 1, topic: 'Limits and Continuity' },
          { week: 2, topic: 'Derivatives and Differentiation Rules' },
          { week: 3, topic: 'Applications of Derivatives' },
          { week: 4, topic: 'Integration Techniques' },
        ],
        resources: [
          { type: 'Book', name: 'Calculus - James Stewart' },
          { type: 'Link', name: 'Khan Academy Calculus' },
          { type: 'Platform', name: 'Canvas LMS' },
        ],
        prerequisites: ['MAT201', 'MAT142'],
        status: 'in progress',
      },
      { 
        name: 'General Relativity', 
        code: 'APHY410', 
        credits: 3, 
        color: '#a855f7', 
        professor: 'Prof. Einstein',
        department: 'Applied Physics',
        schedule: 'Tue/Thu 14:00-15:30',
        room: 'Lab 4B / On-campus',
        weeklyLoad: {
          lectures: 3,
          labs: 0,
          tutorials: 1,
          officeHours: 1,
          selfStudy: 6,
        },
        evaluation: {
          exams: 50,
          labs: 0,
          projects: 40,
          participation: 10,
        },
        syllabus: [
          { week: 1, topic: 'Special Relativity Review' },
          { week: 2, topic: 'Tensor Calculus' },
          { week: 3, topic: 'Einstein Field Equations' },
          { week: 4, topic: 'Black Holes and Cosmology' },
        ],
        resources: [
          { type: 'Book', name: 'Gravitation - Misner, Thorne, Wheeler' },
          { type: 'Link', name: 'arXiv Physics Papers' },
        ],
        prerequisites: ['PHYS311', 'MAT221'],
        status: 'in progress',
      },
      { 
        name: 'Computer Networks', 
        code: 'CS425', 
        credits: 3, 
        color: '#3b82f6', 
        professor: 'Dr. Thompson',
        department: 'Computer Science',
        schedule: 'Mon/Wed/Fri 09:00-10:00',
        room: 'Online',
        weeklyLoad: {
          lectures: 3,
          labs: 2,
          tutorials: 0,
          officeHours: 1,
          selfStudy: 5,
        },
        evaluation: {
          exams: 35,
          labs: 25,
          projects: 30,
          participation: 10,
        },
        syllabus: [
          { week: 1, topic: 'Network Architectures and Protocols' },
          { week: 2, topic: 'TCP/IP Stack' },
          { week: 3, topic: 'Routing Algorithms' },
          { week: 4, topic: 'Network Security' },
        ],
        resources: [
          { type: 'Book', name: 'Computer Networks - Tanenbaum' },
          { type: 'Platform', name: 'GitHub Classroom' },
        ],
        prerequisites: ['CS201'],
        status: 'in progress',
      },
      { 
        name: 'Artificial Intelligence', 
        code: 'CS430', 
        credits: 3, 
        color: '#3b82f6', 
        professor: 'Prof. Turing',
        department: 'Computer Science',
        schedule: 'Tue/Thu 10:00-11:30',
        room: 'Room 502',
        weeklyLoad: {
          lectures: 3,
          labs: 2,
          tutorials: 1,
          officeHours: 2,
          selfStudy: 7,
        },
        evaluation: {
          exams: 30,
          labs: 20,
          projects: 40,
          participation: 10,
        },
        syllabus: [
          { week: 1, topic: 'Search Algorithms' },
          { week: 2, topic: 'Knowledge Representation' },
          { week: 3, topic: 'Machine Learning Basics' },
          { week: 4, topic: 'Neural Networks' },
        ],
        resources: [
          { type: 'Book', name: 'AI: A Modern Approach - Russell & Norvig' },
          { type: 'Platform', name: 'Kaggle' },
        ],
        prerequisites: ['CS301', 'STAT301'],
        status: 'in progress',
      },
      { 
        name: 'Operating Systems', 
        code: 'CS440', 
        credits: 3, 
        color: '#3b82f6', 
        professor: 'Dr. Kernighan',
        department: 'Computer Science',
        schedule: 'Mon/Wed 13:00-14:30',
        room: 'Room 401',
        weeklyLoad: {
          lectures: 3,
          labs: 3,
          tutorials: 0,
          officeHours: 1,
          selfStudy: 6,
        },
        evaluation: {
          exams: 40,
          labs: 30,
          projects: 25,
          participation: 5,
        },
        syllabus: [
          { week: 1, topic: 'Process Management' },
          { week: 2, topic: 'Memory Management' },
          { week: 3, topic: 'File Systems' },
          { week: 4, topic: 'Concurrency' },
        ],
        resources: [
          { type: 'Book', name: 'Operating System Concepts - Silberschatz' },
          { type: 'Platform', name: 'Canvas LMS' },
        ],
        prerequisites: ['CS201', 'CS215'],
        status: 'in progress',
      },
      { 
        name: 'Theory of Computation', 
        code: 'CS450', 
        credits: 3, 
        color: '#3b82f6', 
        professor: 'Prof. Gödel',
        department: 'Computer Science',
        schedule: 'Tue/Thu 16:00-17:30',
        room: 'Room 303',
        weeklyLoad: {
          lectures: 3,
          labs: 0,
          tutorials: 2,
          officeHours: 1,
          selfStudy: 7,
        },
        evaluation: {
          exams: 60,
          labs: 0,
          projects: 30,
          participation: 10,
        },
        syllabus: [
          { week: 1, topic: 'Automata Theory' },
          { week: 2, topic: 'Formal Languages' },
          { week: 3, topic: 'Turing Machines' },
          { week: 4, topic: 'Computability and Complexity' },
        ],
        resources: [
          { type: 'Book', name: 'Introduction to the Theory of Computation - Sipser' },
        ],
        prerequisites: ['MAT280', 'CS301'],
        status: 'in progress',
      },
    ]
  };

  const pastSemesters = [
    {
      name: '2024-1',
      courses: [
        { name: 'Calculus I', code: 'MAT141', credits: 4, color: '#dc2626' },
        { name: 'Physics I', code: 'PHYS211', credits: 4, color: '#16a34a' },
        { name: 'Intro to Programming', code: 'CS101', credits: 3, color: '#3b82f6' },
        { name: 'Object-Oriented Programming', code: 'CS102', credits: 3, color: '#3b82f6' },
        { name: 'English I', code: 'ENG100', credits: 3, color: '#6b7280' },
      ]
    },
    {
      name: '2024-2',
      courses: [
        { name: 'Calculus II', code: 'MAT142', credits: 4, color: '#dc2626' },
        { name: 'Physics II', code: 'PHYS212', credits: 4, color: '#16a34a' },
        { name: 'Data Structures', code: 'CS201', credits: 3, color: '#3b82f6' },
        { name: 'Web Development', code: 'CS215', credits: 3, color: '#3b82f6' },
        { name: 'English II', code: 'ENG101', credits: 3, color: '#6b7280' },
      ]
    },
    {
      name: '2025-1',
      courses: [
        { name: 'Linear Algebra', code: 'MAT221', credits: 3, color: '#dc2626' },
        { name: 'Physics III', code: 'PHYS311', credits: 4, color: '#16a34a' },
        { name: 'Algorithms', code: 'CS301', credits: 3, color: '#3b82f6' },
        { name: 'Intro to Data Science', code: 'CS320', credits: 3, color: '#3b82f6' },
        { name: 'Database Systems', code: 'CS352', credits: 3, color: '#3b82f6' },
      ]
    },
    {
      name: '2025-2',
      courses: [
        { name: 'Discrete Mathematics', code: 'MAT280', credits: 3, color: '#dc2626' },
        { name: 'Astrophysics', code: 'APHY350', credits: 3, color: '#a855f7' },
        { name: 'Statistics', code: 'STAT301', credits: 3, color: '#eab308' },
        { name: 'Machine Learning', code: 'CS401', credits: 3, color: '#3b82f6' },
        { name: 'Software Engineering', code: 'CS410', credits: 3, color: '#3b82f6' },
      ]
    },
  ];

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-8 px-4">
        <h2 className="mb-1 font-['Courier_New',monospace] transition-colors" style={{ color: 'var(--theme-text)' }}>
          Your Career
        </h2>
        <p className="text-sm font-['Courier_New',monospace] transition-colors" style={{ color: 'var(--theme-text-muted)' }}>
          Computer Science
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
            onClick={() => setSelectedSemester('past')}
            className="px-6 py-2 rounded-full font-['Courier_New',monospace] text-sm transition-all duration-200"
            style={{
              backgroundColor: selectedSemester === 'past' ? 'var(--theme-bg-hover)' : 'transparent',
              color: selectedSemester === 'past' ? 'var(--theme-text)' : 'var(--theme-text-muted)',
            }}
          >
            Past Semesters
          </button>
          <button
            onClick={() => setSelectedSemester('current')}
            className="px-6 py-2 rounded-full font-['Courier_New',monospace] text-sm transition-all duration-200"
            style={{
              backgroundColor: selectedSemester === 'current' ? 'var(--theme-bg-hover)' : 'transparent',
              color: selectedSemester === 'current' ? 'var(--theme-text)' : 'var(--theme-text-muted)',
            }}
          >
            Current Semester
          </button>
        </div>
      </div>

      {/* Content Area - with max-width and padding only for Current Semester */}
      <div className={selectedSemester === 'current' ? 'max-w-5xl mx-auto px-4' : ''}>
        {/* Information Panel - Only for Past Semesters */}
        {selectedSemester === 'past' && (
          <div className="flex justify-center mb-6">
            <div 
              className="inline-flex gap-8 px-8 py-4 rounded-lg transition-colors"
              style={{
                backgroundColor: 'var(--theme-bg-alt)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'var(--theme-border)',
                opacity: 0.85,
              }}
            >
              <div className="text-center">
                <p className="font-['Courier_New',monospace] text-xs mb-1" style={{ color: 'var(--theme-text-dim)' }}>
                  GPA
                </p>
                <p className="font-['Courier_New',monospace] text-lg" style={{ color: 'var(--theme-text)' }}>
                  3.84
                </p>
              </div>
              <div className="text-center">
                <p className="font-['Courier_New',monospace] text-xs mb-1" style={{ color: 'var(--theme-text-dim)' }}>
                  Credits
                </p>
                <p className="font-['Courier_New',monospace] text-lg" style={{ color: 'var(--theme-text)' }}>
                  68/120
                </p>
              </div>
              <div className="text-center">
                <p className="font-['Courier_New',monospace] text-xs mb-1" style={{ color: 'var(--theme-text-dim)' }}>
                  RAV
                </p>
                <p className="font-['Courier_New',monospace] text-lg" style={{ color: 'var(--theme-text)' }}>
                  4
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div 
          className="border rounded-lg p-6 backdrop-blur-sm mb-6"
          style={{
            backgroundColor: 'var(--theme-bg-alt)',
            borderColor: 'var(--theme-border)',
          }}
        >
          {selectedSemester === 'past' ? (
            /* Kanban Board - Past Semesters */
            <div 
              className="overflow-x-auto scrollbar-hide pb-4"
            >
              <div className="flex gap-8">
                {pastSemesters.map((semester, idx) => (
                  <div key={idx} className="flex flex-col gap-3 w-[240px] flex-shrink-0">
                    {/* Semester Header */}
                    <h3 
                      className="font-['Courier_New',monospace] text-sm mb-2 pb-2 border-b"
                      style={{ 
                        color: 'var(--theme-text)',
                        borderColor: 'var(--theme-border)',
                      }}
                    >
                      {semester.name}
                    </h3>

                    {/* Course Cards */}
                    <div className="space-y-3">
                      {semester.courses.map((course, courseIdx) => (
                        <div
                          key={courseIdx}
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
                ))}
              </div>
            </div>
          ) : (
            /* Current Semester - Two Column Layout */
            <div className="flex gap-6 pb-4">
              {/* Left: Course List */}
              <div className="flex flex-col gap-3 min-w-[200px] max-w-[280px]">
                {/* Semester Header */}
                <h3 
                  className="font-['Courier_New',monospace] text-sm mb-2 pb-2 border-b"
                  style={{ 
                    color: 'var(--theme-text)',
                    borderColor: 'var(--theme-border)',
                  }}
                >
                  {currentSemester.name}
                </h3>

                {/* Course Cards */}
                <div className="space-y-3">
                  {currentSemester.courses.map((course, courseIdx) => (
                    <div
                      key={courseIdx}
                      onClick={() => setSelectedCourse(course)}
                      className="rounded-md p-3 transition-all cursor-pointer"
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

              {/* Right: Course Detail Panel */}
              {selectedCourse && (
                <div 
                  className="flex-1 border rounded-lg p-6 relative overflow-hidden transition-all"
                  style={{
                    backgroundColor: `${selectedCourse.color}08`,
                    borderColor: selectedCourse.color,
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

                  {/* Content */}
                  <div className="relative space-y-6">
                    {/* HEADER - Identity (single column) */}
                    <div>
                      {/* Identity Block */}
                      <div className="space-y-2">
                        <h3 
                          className="font-['Courier_New',monospace] text-lg mb-2"
                          style={{ color: 'var(--theme-text)' }}
                        >
                          {selectedCourse.name}
                        </h3>
                        <div className="space-y-1 text-sm">
                          <p className="font-['Courier_New',monospace]" style={{ color: 'var(--theme-text-muted)' }}>
                            <span style={{ color: 'var(--theme-text-dim)' }}>Professor:</span> {selectedCourse.professor}
                          </p>
                          <p className="font-['Courier_New',monospace]" style={{ color: 'var(--theme-text-muted)' }}>
                            <span style={{ color: 'var(--theme-text-dim)' }}>Department:</span> {selectedCourse.department}
                          </p>
                          <p className="font-['Courier_New',monospace]" style={{ color: 'var(--theme-text-muted)' }}>
                            <span style={{ color: 'var(--theme-text-dim)' }}>Credits:</span> {selectedCourse.credits}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t" style={{ borderColor: `${selectedCourse.color}40` }} />

                    {/* BODY - Weekly Load (expanded by default) */}
                    <div>
                      <button
                        onClick={() => toggleSection('weeklyLoad')}
                        className="flex items-center gap-2 mb-3 w-full text-left"
                      >
                        {expandedSections.weeklyLoad ? (
                          <ChevronDown className="w-4 h-4" style={{ color: 'var(--theme-text)' }} />
                        ) : (
                          <ChevronRight className="w-4 h-4" style={{ color: 'var(--theme-text)' }} />
                        )}
                        <h4 className="font-['Courier_New',monospace] text-sm" style={{ color: 'var(--theme-text)' }}>
                          Weekly Load
                        </h4>
                      </button>
                      {expandedSections.weeklyLoad && (
                        <div className="space-y-4">
                          {/* Stats Grid */}
                          <div className="grid grid-cols-5 gap-3 text-sm">
                            <div className="text-center">
                              <p className="font-['Courier_New',monospace] mb-1" style={{ color: 'var(--theme-text-dim)' }}>Lectures</p>
                              <p className="font-['Courier_New',monospace] text-lg" style={{ color: 'var(--theme-text)' }}>
                                {selectedCourse.weeklyLoad.lectures}h
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="font-['Courier_New',monospace] mb-1" style={{ color: 'var(--theme-text-dim)' }}>Labs</p>
                              <p className="font-['Courier_New',monospace] text-lg" style={{ color: 'var(--theme-text)' }}>
                                {selectedCourse.weeklyLoad.labs}h
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="font-['Courier_New',monospace] mb-1" style={{ color: 'var(--theme-text-dim)' }}>Tutorials</p>
                              <p className="font-['Courier_New',monospace] text-lg" style={{ color: 'var(--theme-text)' }}>
                                {selectedCourse.weeklyLoad.tutorials}h
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="font-['Courier_New',monospace] mb-1" style={{ color: 'var(--theme-text-dim)' }}>Office Hours</p>
                              <p className="font-['Courier_New',monospace] text-lg" style={{ color: 'var(--theme-text)' }}>
                                {selectedCourse.weeklyLoad.officeHours}h
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="font-['Courier_New',monospace] mb-1" style={{ color: 'var(--theme-text-dim)' }}>Self-Study</p>
                              <p className="font-['Courier_New',monospace] text-lg" style={{ color: 'var(--theme-text)' }}>
                                {selectedCourse.weeklyLoad.selfStudy}h
                              </p>
                            </div>
                          </div>

                          {/* Upcoming Classes - Horizontal Cards */}
                          <div className="flex gap-4 items-start">
                            {/* Class 1 */}
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2 text-xs font-['Courier_New',monospace]" style={{ color: 'var(--theme-text-muted)' }}>
                                <span>Monday</span>
                                <span>•</span>
                                <span>10:00am</span>
                              </div>
                              <div
                                className="rounded-lg p-4 min-w-[200px] max-w-[200px] transition-all cursor-pointer relative overflow-hidden group"
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
                                <div
                                  className="absolute inset-0 opacity-5 transition-opacity"
                                  style={{
                                    backgroundImage: `radial-gradient(circle, var(--theme-text) 1px, transparent 1px)`,
                                    backgroundSize: '15px 15px',
                                  }}
                                />
                                <div className="relative">
                                  <h4 
                                    className="font-['Courier_New',monospace] mb-3"
                                    style={{ color: 'var(--theme-text)' }}
                                  >
                                    Class 1
                                  </h4>
                                  <span 
                                    className="inline-block px-3 py-1 rounded text-xs font-['Courier_New',monospace]"
                                    style={{
                                      backgroundColor: `${selectedCourse.color}20`,
                                      color: selectedCourse.color,
                                      border: `1px solid ${selectedCourse.color}`,
                                    }}
                                  >
                                    A011
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Class 2 */}
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2 text-xs font-['Courier_New',monospace]" style={{ color: 'var(--theme-text-muted)' }}>
                                <span>Wednesday</span>
                                <span>•</span>
                                <span>10:00am</span>
                              </div>
                              <div
                                className="rounded-lg p-4 min-w-[200px] max-w-[200px] transition-all cursor-pointer relative overflow-hidden group"
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
                                <div
                                  className="absolute inset-0 opacity-5 transition-opacity"
                                  style={{
                                    backgroundImage: `radial-gradient(circle, var(--theme-text) 1px, transparent 1px)`,
                                    backgroundSize: '15px 15px',
                                  }}
                                />
                                <div className="relative">
                                  <h4 
                                    className="font-['Courier_New',monospace] mb-3"
                                    style={{ color: 'var(--theme-text)' }}
                                  >
                                    Class 2
                                  </h4>
                                  <span 
                                    className="inline-block px-3 py-1 rounded text-xs font-['Courier_New',monospace]"
                                    style={{
                                      backgroundColor: `${selectedCourse.color}20`,
                                      color: selectedCourse.color,
                                      border: `1px solid ${selectedCourse.color}`,
                                    }}
                                  >
                                    B212
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Class 3 - Only for General Relativity and Computer Networks */}
                            {(selectedCourse.code === 'APHY410' || selectedCourse.code === 'CS425') && (
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-xs font-['Courier_New',monospace]" style={{ color: 'var(--theme-text-muted)' }}>
                                  <span>Friday</span>
                                  <span>•</span>
                                  <span>10:00am</span>
                                </div>
                                <div
                                  className="rounded-lg p-4 min-w-[200px] max-w-[200px] transition-all cursor-pointer relative overflow-hidden group"
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
                                  <div
                                    className="absolute inset-0 opacity-5 transition-opacity"
                                    style={{
                                      backgroundImage: `radial-gradient(circle, var(--theme-text) 1px, transparent 1px)`,
                                      backgroundSize: '15px 15px',
                                    }}
                                  />
                                  <div className="relative">
                                    <h4 
                                      className="font-['Courier_New',monospace] mb-3"
                                      style={{ color: 'var(--theme-text)' }}
                                    >
                                      {selectedCourse.code === 'APHY410' ? 'Experimental Lab' : 'Networking Lab'}
                                    </h4>
                                    <span 
                                      className="inline-block px-3 py-1 rounded text-xs font-['Courier_New',monospace]"
                                      style={{
                                        backgroundColor: `${selectedCourse.color}20`,
                                        color: selectedCourse.color,
                                        border: `1px solid ${selectedCourse.color}`,
                                      }}
                                    >
                                      K101
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* BODY - Evaluation Method (expanded by default) */}
                    <div>
                      <button
                        onClick={() => toggleSection('evaluation')}
                        className="flex items-center gap-2 mb-3 w-full text-left"
                      >
                        {expandedSections.evaluation ? (
                          <ChevronDown className="w-4 h-4" style={{ color: 'var(--theme-text)' }} />
                        ) : (
                          <ChevronRight className="w-4 h-4" style={{ color: 'var(--theme-text)' }} />
                        )}
                        <h4 className="font-['Courier_New',monospace] text-sm" style={{ color: 'var(--theme-text)' }}>
                          Evaluation Method
                        </h4>
                      </button>
                      {expandedSections.evaluation && (
                        <div className="grid grid-cols-4 gap-3 text-sm">
                          <div className="text-center">
                            <p className="font-['Courier_New',monospace] mb-1" style={{ color: 'var(--theme-text-dim)' }}>Exams</p>
                            <p className="font-['Courier_New',monospace] text-lg" style={{ color: 'var(--theme-text)' }}>
                              {selectedCourse.evaluation.exams}%
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="font-['Courier_New',monospace] mb-1" style={{ color: 'var(--theme-text-dim)' }}>Labs</p>
                            <p className="font-['Courier_New',monospace] text-lg" style={{ color: 'var(--theme-text)' }}>
                              {selectedCourse.evaluation.labs}%
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="font-['Courier_New',monospace] mb-1" style={{ color: 'var(--theme-text-dim)' }}>Projects</p>
                            <p className="font-['Courier_New',monospace] text-lg" style={{ color: 'var(--theme-text)' }}>
                              {selectedCourse.evaluation.projects}%
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="font-['Courier_New',monospace] mb-1" style={{ color: 'var(--theme-text-dim)' }}>Participation</p>
                            <p className="font-['Courier_New',monospace] text-lg" style={{ color: 'var(--theme-text)' }}>
                              {selectedCourse.evaluation.participation}%
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Divider */}
                    <div className="border-t" style={{ borderColor: `${selectedCourse.color}40` }} />

                    {/* DETAIL TABS - Syllabus and Resources (on demand) */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Syllabus Tab */}
                      <div>
                        <button
                          onClick={() => toggleSection('syllabus')}
                          className="flex items-center gap-2 mb-3 w-full text-left"
                        >
                          {expandedSections.syllabus ? (
                            <ChevronDown className="w-4 h-4" style={{ color: 'var(--theme-text)' }} />
                          ) : (
                            <ChevronRight className="w-4 h-4" style={{ color: 'var(--theme-text)' }} />
                          )}
                          <h4 className="font-['Courier_New',monospace] text-sm" style={{ color: 'var(--theme-text)' }}>
                            Syllabus / ToC
                          </h4>
                        </button>
                        {expandedSections.syllabus && (
                          <div className="space-y-2 text-sm">
                            {selectedCourse.syllabus.map((item: any, idx: number) => (
                              <div key={idx} className="flex gap-2">
                                <span className="font-['Courier_New',monospace]" style={{ color: 'var(--theme-text-dim)' }}>
                                  W{item.week}:
                                </span>
                                <span className="font-['Courier_New',monospace]" style={{ color: 'var(--theme-text-muted)' }}>
                                  {item.topic}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Resources Tab */}
                      <div>
                        <button
                          onClick={() => toggleSection('resources')}
                          className="flex items-center gap-2 mb-3 w-full text-left"
                        >
                          {expandedSections.resources ? (
                            <ChevronDown className="w-4 h-4" style={{ color: 'var(--theme-text)' }} />
                          ) : (
                            <ChevronRight className="w-4 h-4" style={{ color: 'var(--theme-text)' }} />
                          )}
                          <h4 className="font-['Courier_New',monospace] text-sm" style={{ color: 'var(--theme-text)' }}>
                            Resources
                          </h4>
                        </button>
                        {expandedSections.resources && (
                          <div className="space-y-2 text-sm">
                            {selectedCourse.resources.map((item: any, idx: number) => (
                              <div key={idx} className="flex gap-2">
                                <span className="font-['Courier_New',monospace]" style={{ color: 'var(--theme-text-dim)' }}>
                                  {item.type}:
                                </span>
                                <span className="font-['Courier_New',monospace]" style={{ color: 'var(--theme-text-muted)' }}>
                                  {item.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* OPTIONAL EXTRAS - Prerequisites and Status */}
                    {selectedCourse.prerequisites && (
                      <div className="pt-4">
                        <p className="font-['Courier_New',monospace] text-xs" style={{ color: 'var(--theme-text-dim)' }}>
                          Prerequisites: {selectedCourse.prerequisites.join(', ')}
                        </p>
                      </div>
                    )}

                    {/* Top Right Tags */}
                    <div className="absolute top-6 right-6 flex flex-col items-end gap-2">
                      {/* Code Tag */}
                      <span 
                        className="px-3 py-1 rounded text-xs font-['Courier_New',monospace]"
                        style={{
                          backgroundColor: `${selectedCourse.color}20`,
                          color: selectedCourse.color,
                          border: `1px solid ${selectedCourse.color}`,
                        }}
                      >
                        {selectedCourse.code}
                      </span>
                      
                      {/* Status Badge */}
                      <span 
                        className="px-3 py-1 rounded-full text-xs font-['Courier_New',monospace]"
                        style={{
                          backgroundColor: `${selectedCourse.color}20`,
                          color: selectedCourse.color,
                          border: `1px solid ${selectedCourse.color}`,
                        }}
                      >
                        {selectedCourse.status}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Update Progress Button */}
        {selectedSemester === 'past' && (
          <div className="flex justify-center">
            <button
              className="px-6 py-2 rounded-full font-['Courier_New',monospace] text-sm transition-all duration-200"
              style={{
                backgroundColor: 'var(--theme-bg-alt)',
                color: 'var(--theme-text)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'var(--theme-border)',
              }}
            >
              Update Progress
            </button>
          </div>
        )}
      </div>
    </div>
  );
}