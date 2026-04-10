import { FileText, Clock, Tag } from "lucide-react";

export function Knowledge() {
  const knowledgeNotes = [
    {
      title: 'Binary Search Trees',
      course: 'CS 401',
      date: 'Mar 10, 2026',
      tags: ['algorithms', 'data-structures']
    },
    {
      title: 'SQL Joins & Indexing',
      course: 'CS 352',
      date: 'Mar 09, 2026',
      tags: ['databases', 'sql']
    },
    {
      title: 'Vector Spaces',
      course: 'MATH 301',
      date: 'Mar 08, 2026',
      tags: ['linear-algebra', 'theory']
    },
    {
      title: 'Neural Networks Basics',
      course: 'CS 420',
      date: 'Mar 07, 2026',
      tags: ['ml', 'deep-learning']
    },
    {
      title: 'Documentation Standards',
      course: 'ENG 205',
      date: 'Mar 06, 2026',
      tags: ['writing', 'technical']
    },
    {
      title: 'Dynamic Programming',
      course: 'CS 401',
      date: 'Mar 05, 2026',
      tags: ['algorithms', 'optimization']
    },
  ];

  return (
    <div className="p-8 max-w-full mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="mb-1 font-['Courier_New',monospace] transition-colors" style={{ color: 'var(--theme-text)' }}>
          Knowledge
        </h2>
        <p className="text-sm font-['Courier_New',monospace] transition-colors" style={{ color: 'var(--theme-text-muted)' }}>
          Your knowledge graph and concept connections
        </p>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-2 gap-4">
        {knowledgeNotes.map((note, index) => (
          <div
            key={index}
            className="rounded-lg p-5 transition-all cursor-pointer relative overflow-hidden group"
            style={{ backgroundColor: 'var(--theme-bg-alt)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--theme-border)' }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--theme-border-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--theme-border)'}
          >
            <div
              className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity"
              style={{
                backgroundImage: `radial-gradient(circle, var(--theme-text) 1px, transparent 1px)`,
                backgroundSize: '15px 15px',
              }}
            />

            <div className="relative">
              <div className="flex items-start gap-3 mb-3">
                <FileText className="w-5 h-5 flex-shrink-0 mt-1 transition-colors" style={{ color: 'var(--theme-text-muted)' }} />
                <div className="flex-1 min-w-0">
                  <h3 className="mb-1 font-['Courier_New',monospace] truncate transition-colors" style={{ color: 'var(--theme-text)' }}>
                    {note.title}
                  </h3>
                  <p className="text-sm font-['Courier_New',monospace] transition-colors" style={{ color: 'var(--theme-text-dim)' }}>
                    {note.course}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3 text-xs transition-colors" style={{ color: 'var(--theme-text-dim)' }}>
                <Clock className="w-3 h-3" />
                <span className="font-['Courier_New',monospace]">{note.date}</span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-3 h-3 transition-colors" style={{ color: 'var(--theme-text-dim)' }} />
                {note.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="text-xs px-2 py-0.5 rounded font-['Courier_New',monospace] transition-colors"
                    style={{ backgroundColor: 'var(--theme-bg)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--theme-border)', color: 'var(--theme-text-dim)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Note Button */}
      <button
        className="mt-6 w-full rounded-lg p-4 transition-all font-['Courier_New',monospace]"
        style={{ backgroundColor: 'var(--theme-bg-alt)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--theme-border)', color: 'var(--theme-text-muted)' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--theme-border-hover)';
          e.currentTarget.style.color = 'var(--theme-text)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--theme-border)';
          e.currentTarget.style.color = 'var(--theme-text-muted)';
        }}
      >
        + Add New Knowledge Note
      </button>
    </div>
  );
}
