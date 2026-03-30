import { GraduationCap, Mail, User } from "lucide-react";

export function Profile() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="mb-1 font-['Courier_New',monospace] transition-colors" style={{ color: 'var(--theme-text)' }}>
          Your Profile
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
    </div>
  );
}
