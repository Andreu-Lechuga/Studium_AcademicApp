import { Outlet, NavLink, useNavigate } from "react-router";
import { Home, StickyNote, CalendarDays, Menu, Moon, Sun, Briefcase, Settings, ClipboardList, LogOut, ChevronLeft, ChevronRight, Network, Compass, Users, UserCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useCalendarSettings } from "../../contexts/CalendarContext";
import { User } from "lucide-react";

export function Layout() {
  const navigate = useNavigate();
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);
  const [currentSpace, setCurrentSpace] = useState<'Personal' | 'Social' | 'Academic'>('Academic');
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  const { showDayNumbers, showSunday, showSaturday, firstHour, lastHour, setShowDayNumbers, setShowSunday, setShowSaturday, setFirstHour, setLastHour } = useCalendarSettings();

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const spaces = ['Personal', 'Social', 'Academic'] as const;
  
  const handlePreviousSpace = () => {
    const currentIndex = spaces.indexOf(currentSpace);
    const previousIndex = currentIndex === 0 ? spaces.length - 1 : currentIndex - 1;
    setCurrentSpace(spaces[previousIndex]);
  };

  const handleNextSpace = () => {
    const currentIndex = spaces.indexOf(currentSpace);
    const nextIndex = currentIndex === spaces.length - 1 ? 0 : currentIndex + 1;
    setCurrentSpace(spaces[nextIndex]);
  };

  const theme = {
    bg: isDark ? '#1a1a1a' : '#efefef',
    bgAlt: isDark ? '#242424' : '#ffffff',
    bgHover: isDark ? '#2a2a2a' : '#f5f5f5',
    text: isDark ? '#f5f5f5' : '#1a1a1a',
    textMuted: isDark ? '#a0a0a0' : '#606060',
    textDim: isDark ? '#606060' : '#909090',
    border: isDark ? '#404040' : '#d0d0d0',
    borderHover: isDark ? '#505050' : '#c0c0c0',
    dotColor: isDark ? '#888' : '#888',
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden transition-colors duration-300"
      style={{
        backgroundColor: theme.bg,
        '--theme-bg': theme.bg,
        '--theme-bg-alt': theme.bgAlt,
        '--theme-bg-hover': theme.bgHover,
        '--theme-text': theme.text,
        '--theme-text-muted': theme.textMuted,
        '--theme-text-dim': theme.textDim,
        '--theme-border': theme.border,
        '--theme-border-hover': theme.borderHover,
      } as React.CSSProperties}
    >
      {/* Dotted paper texture background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, ${theme.dotColor} 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative flex h-screen">
        {/* Sidebar */}
        <aside
          className={`w-64 border-r backdrop-blur-sm p-6 flex flex-col transition-all duration-300 ${isMenuVisible ? 'translate-x-0' : '-translate-x-full absolute z-10'}`}
          style={{
            borderColor: theme.border,
            backgroundColor: `${theme.bg}cc`
          }}
        >
          {/* Logo/Brand */}
          <div className="mb-12">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-['Courier_New',monospace] tracking-wide transition-colors" style={{ color: theme.text }}>
                  ACADEME
                </h1>
              </div>
              
              {/* Profile Picture Button */}
              <button
                onClick={() => navigate('/profile')}
                className="w-10 h-10 rounded-full border transition-all overflow-hidden flex items-center justify-center"
                style={{
                  borderColor: theme.border,
                  backgroundColor: theme.bgAlt,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.text;
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme.border;
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <UserCircle className="w-5 h-5" style={{ color: theme.textMuted }} />
              </button>
            </div>
            <div className="h-[1px] mt-2 w-16 transition-colors" style={{ backgroundColor: theme.border }} />

            {/* Buttons */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setIsMenuVisible(!isMenuVisible)}
                className="p-2 rounded-md transition-colors border"
                style={{
                  backgroundColor: theme.bgAlt,
                  color: theme.textMuted,
                  borderColor: theme.border,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.bgHover;
                  e.currentTarget.style.color = theme.text;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme.bgAlt;
                  e.currentTarget.style.color = theme.textMuted;
                }}
              >
                <Menu className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-md transition-colors border"
                style={{
                  backgroundColor: theme.bgAlt,
                  color: theme.textMuted,
                  borderColor: theme.border,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.bgHover;
                  e.currentTarget.style.color = theme.text;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme.bgAlt;
                  e.currentTarget.style.color = theme.textMuted;
                }}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="p-2 rounded-md transition-colors border"
                style={{
                  backgroundColor: theme.bgAlt,
                  color: theme.textMuted,
                  borderColor: theme.border,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.bgHover;
                  e.currentTarget.style.color = theme.text;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme.bgAlt;
                  e.currentTarget.style.color = theme.textMuted;
                }}
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {/* Always visible main options */}
            <NavLink
              to="/"
              end
              style={({ isActive }) => ({
                backgroundColor: isActive ? theme.bgHover : 'transparent',
                color: isActive ? theme.text : theme.textMuted,
              })}
              className="flex items-center gap-3 px-4 py-2 rounded-md transition-colors group"
              onMouseEnter={(e) => {
                if (!e.currentTarget.getAttribute('aria-current')) {
                  e.currentTarget.style.backgroundColor = theme.bgAlt;
                  e.currentTarget.style.color = theme.text;
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.getAttribute('aria-current')) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = theme.textMuted;
                }
              }}
            >
              <Home className="w-5 h-5" />
              <span className="font-['Courier_New',monospace]">Home</span>
            </NavLink>

            <NavLink
              to="/calendar"
              style={({ isActive }) => ({
                backgroundColor: isActive ? theme.bgHover : 'transparent',
                color: isActive ? theme.text : theme.textMuted,
              })}
              className="flex items-center gap-3 px-4 py-2 rounded-md transition-colors group"
              onMouseEnter={(e) => {
                if (!e.currentTarget.getAttribute('aria-current')) {
                  e.currentTarget.style.backgroundColor = theme.bgAlt;
                  e.currentTarget.style.color = theme.text;
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.getAttribute('aria-current')) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = theme.textMuted;
                }
              }}
            >
              <CalendarDays className="w-5 h-5" />
              <span className="font-['Courier_New',monospace]">Calendar</span>
            </NavLink>

            <NavLink
              to="/knowledge"
              style={({ isActive }) => ({
                backgroundColor: isActive ? theme.bgHover : 'transparent',
                color: isActive ? theme.text : theme.textMuted,
              })}
              className="flex items-center gap-3 px-4 py-2 rounded-md transition-colors group"
              onMouseEnter={(e) => {
                if (!e.currentTarget.getAttribute('aria-current')) {
                  e.currentTarget.style.backgroundColor = theme.bgAlt;
                  e.currentTarget.style.color = theme.text;
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.getAttribute('aria-current')) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = theme.textMuted;
                }
              }}
            >
              <Network className="w-5 h-5" />
              <span className="font-['Courier_New',monospace]">Knowledge</span>
            </NavLink>

            {/* Space Selector */}
            <div className="py-3">
              <div 
                className="flex items-center justify-between px-2 py-2 rounded-md border"
                style={{
                  backgroundColor: `${theme.bgAlt}60`,
                  borderColor: theme.border,
                }}
              >
                <button
                  onClick={handlePreviousSpace}
                  className="p-1 rounded transition-colors"
                  style={{ color: theme.textMuted }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = theme.text;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = theme.textMuted;
                  }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <span 
                  className="font-['Courier_New',monospace] text-sm"
                  style={{ color: theme.text }}
                >
                  {currentSpace}
                </span>
                
                <button
                  onClick={handleNextSpace}
                  className="p-1 rounded transition-colors"
                  style={{ color: theme.textMuted }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = theme.text;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = theme.textMuted;
                  }}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Space-specific navigation items */}
            {currentSpace === 'Academic' && (
              <>
                <NavLink
                  to="/career"
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? theme.bgHover : 'transparent',
                    color: isActive ? theme.text : theme.textMuted,
                  })}
                  className="flex items-center gap-3 px-4 py-2 rounded-md transition-colors group"
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.getAttribute('aria-current')) {
                      e.currentTarget.style.backgroundColor = theme.bgAlt;
                      e.currentTarget.style.color = theme.text;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.currentTarget.getAttribute('aria-current')) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = theme.textMuted;
                    }
                  }}
                >
                  <Briefcase className="w-5 h-5" />
                  <span className="font-['Courier_New',monospace]">Your Career</span>
                </NavLink>

                <NavLink
                  to="/planning"
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? theme.bgHover : 'transparent',
                    color: isActive ? theme.text : theme.textMuted,
                  })}
                  className="flex items-center gap-3 px-4 py-2 rounded-md transition-colors group"
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.getAttribute('aria-current')) {
                      e.currentTarget.style.backgroundColor = theme.bgAlt;
                      e.currentTarget.style.color = theme.text;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.currentTarget.getAttribute('aria-current')) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = theme.textMuted;
                    }
                  }}
                >
                  <ClipboardList className="w-5 h-5" />
                  <span className="font-['Courier_New',monospace]">Planning</span>
                </NavLink>

                <NavLink
                  to="/notes"
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? theme.bgHover : 'transparent',
                    color: isActive ? theme.text : theme.textMuted,
                  })}
                  className="flex items-center gap-3 px-4 py-2 rounded-md transition-colors group"
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.getAttribute('aria-current')) {
                      e.currentTarget.style.backgroundColor = theme.bgAlt;
                      e.currentTarget.style.color = theme.text;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.currentTarget.getAttribute('aria-current')) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = theme.textMuted;
                    }
                  }}
                >
                  <StickyNote className="w-5 h-5" />
                  <span className="font-['Courier_New',monospace]">Notes</span>
                </NavLink>
              </>
            )}

            {currentSpace === 'Personal' && (
              <NavLink
                to="/profile"
                style={({ isActive }) => ({
                  backgroundColor: isActive ? theme.bgHover : 'transparent',
                  color: isActive ? theme.text : theme.textMuted,
                })}
                className="flex items-center gap-3 px-4 py-2 rounded-md transition-colors group"
                onMouseEnter={(e) => {
                  if (!e.currentTarget.getAttribute('aria-current')) {
                    e.currentTarget.style.backgroundColor = theme.bgAlt;
                    e.currentTarget.style.color = theme.text;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.getAttribute('aria-current')) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = theme.textMuted;
                  }
                }}
              >
                <UserCircle className="w-5 h-5" />
                <span className="font-['Courier_New',monospace]">Your Profile</span>
              </NavLink>
            )}

            {currentSpace === 'Social' && (
              <>
                <NavLink
                  to="/explore"
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? theme.bgHover : 'transparent',
                    color: isActive ? theme.text : theme.textMuted,
                  })}
                  className="flex items-center gap-3 px-4 py-2 rounded-md transition-colors group"
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.getAttribute('aria-current')) {
                      e.currentTarget.style.backgroundColor = theme.bgAlt;
                      e.currentTarget.style.color = theme.text;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.currentTarget.getAttribute('aria-current')) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = theme.textMuted;
                    }
                  }}
                >
                  <Compass className="w-5 h-5" />
                  <span className="font-['Courier_New',monospace]">Explore</span>
                </NavLink>

                <NavLink
                  to="/community"
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? theme.bgHover : 'transparent',
                    color: isActive ? theme.text : theme.textMuted,
                  })}
                  className="flex items-center gap-3 px-4 py-2 rounded-md transition-colors group"
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.getAttribute('aria-current')) {
                      e.currentTarget.style.backgroundColor = theme.bgAlt;
                      e.currentTarget.style.color = theme.text;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.currentTarget.getAttribute('aria-current')) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = theme.textMuted;
                    }
                  }}
                >
                  <Users className="w-5 h-5" />
                  <span className="font-['Courier_New',monospace]">Community</span>
                </NavLink>
              </>
            )}
          </nav>

          {/* Footer decoration */}
          <div className="mt-auto pt-6 border-t transition-colors flex items-center justify-between" style={{ borderColor: theme.border }}>
            <p className="text-xs font-['Courier_New',monospace] transition-colors" style={{ color: theme.textDim }}>
              Spring 2026
            </p>
            <button
              className="px-3 py-1.5 rounded-md text-xs font-['Courier_New',monospace] transition-all border relative overflow-hidden"
              style={{
                backgroundColor: `${theme.bgAlt}80`,
                color: theme.textMuted,
                borderColor: theme.border,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDark ? '#fef2f280' : '#fef2f2cc';
                e.currentTarget.style.color = '#dc2626';
                e.currentTarget.style.borderColor = '#fecaca';
                setIsLogoutHovered(true);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = `${theme.bgAlt}80`;
                e.currentTarget.style.color = theme.textMuted;
                e.currentTarget.style.borderColor = theme.border;
                setIsLogoutHovered(false);
              }}
              onClick={() => navigate('/login')}
            >
              {/* Diagonal lines background effect */}
              {isLogoutHovered && (
                <div
                  className="absolute inset-0 opacity-20 transition-opacity"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(-45deg, #f87171 0px, #f87171 1px, transparent 1px, transparent 6px)',
                    backgroundSize: '8px 8px',
                  }}
                />
              )}
              <LogOut className="w-4 h-4 relative z-10" />
            </button>
          </div>
        </aside>
        
        {/* Main content */}
        <main 
          className="flex-1 overflow-y-auto relative transition-all duration-300"
          style={{ paddingLeft: !isMenuVisible ? '55px' : '0' }}
        >
          {/* Floating toggle button when menu is hidden */}
          {!isMenuVisible && (
            <button
              onClick={() => setIsMenuVisible(true)}
              className="fixed top-6 left-6 z-50 p-3 rounded-md transition-colors border"
              style={{
                backgroundColor: theme.bgAlt,
                color: theme.textMuted,
                borderColor: theme.border,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.bgHover;
                e.currentTarget.style.color = theme.text;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.bgAlt;
                e.currentTarget.style.color = theme.textMuted;
              }}
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <Outlet />
        </main>
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setIsSettingsOpen(false)}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div 
            className="border rounded-lg backdrop-blur-sm p-8 max-w-md w-full"
            style={{
              backgroundColor: theme.bgAlt,
              borderColor: theme.border,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-['Courier_New',monospace] mb-6" style={{ color: theme.text }}>
              Settings
            </h2>
            
            {/* Calendar Settings Section */}
            <div className="space-y-6">
              <div>
                <h3 className="font-['Courier_New',monospace] text-sm mb-4" style={{ color: theme.textMuted }}>
                  Calendar Settings
                </h3>
                
                <div className="space-y-4">
                  {/* Show Day Numbers Toggle */}
                  <div className="flex items-center justify-between">
                    <label className="font-['Courier_New',monospace] text-sm" style={{ color: theme.text }}>
                      Show Day Numbers
                    </label>
                    <button
                      onClick={() => setShowDayNumbers(!showDayNumbers)}
                      className="w-12 h-6 rounded-full border transition-colors relative"
                      style={{
                        backgroundColor: showDayNumbers ? theme.text : theme.bgHover,
                        borderColor: theme.border,
                      }}
                    >
                      <div
                        className="w-4 h-4 rounded-full absolute top-1/2 -translate-y-1/2 transition-all"
                        style={{
                          backgroundColor: showDayNumbers ? theme.bgAlt : theme.textMuted,
                          left: showDayNumbers ? 'calc(100% - 1.25rem)' : '0.25rem',
                        }}
                      />
                    </button>
                  </div>

                  {/* Show Sunday Toggle */}
                  <div className="flex items-center justify-between">
                    <label className="font-['Courier_New',monospace] text-sm" style={{ color: theme.text }}>
                      Show Sunday
                    </label>
                    <button
                      onClick={() => setShowSunday(!showSunday)}
                      className="w-12 h-6 rounded-full border transition-colors relative"
                      style={{
                        backgroundColor: showSunday ? theme.text : theme.bgHover,
                        borderColor: theme.border,
                      }}
                    >
                      <div
                        className="w-4 h-4 rounded-full absolute top-1/2 -translate-y-1/2 transition-all"
                        style={{
                          backgroundColor: showSunday ? theme.bgAlt : theme.textMuted,
                          left: showSunday ? 'calc(100% - 1.25rem)' : '0.25rem',
                        }}
                      />
                    </button>
                  </div>

                  {/* Show Saturday Toggle */}
                  <div className="flex items-center justify-between">
                    <label className="font-['Courier_New',monospace] text-sm" style={{ color: theme.text }}>
                      Show Saturday
                    </label>
                    <button
                      onClick={() => setShowSaturday(!showSaturday)}
                      className="w-12 h-6 rounded-full border transition-colors relative"
                      style={{
                        backgroundColor: showSaturday ? theme.text : theme.bgHover,
                        borderColor: theme.border,
                      }}
                    >
                      <div
                        className="w-4 h-4 rounded-full absolute top-1/2 -translate-y-1/2 transition-all"
                        style={{
                          backgroundColor: showSaturday ? theme.bgAlt : theme.textMuted,
                          left: showSaturday ? 'calc(100% - 1.25rem)' : '0.25rem',
                        }}
                      />
                    </button>
                  </div>

                  {/* Hour Range - on same line */}
                  <div className="flex items-center justify-between gap-4">
                    <label className="font-['Courier_New',monospace] text-sm" style={{ color: theme.text }}>
                      Hour Range
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        value={firstHour}
                        onChange={(e) => setFirstHour(Number(e.target.value))}
                        className="font-['Courier_New',monospace] px-2 py-1 rounded-md border text-xs"
                        style={{
                          backgroundColor: theme.bgAlt,
                          borderColor: theme.border,
                          color: theme.text,
                        }}
                      >
                        {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                          <option key={hour} value={hour}>
                            {hour === 0 ? '12am' : hour === 12 ? '12pm' : hour < 12 ? `${hour}am` : `${hour - 12}pm`}
                          </option>
                        ))}
                      </select>
                      <span className="font-['Courier_New',monospace] text-xs" style={{ color: theme.textMuted }}>
                        to
                      </span>
                      <select
                        value={lastHour}
                        onChange={(e) => setLastHour(Number(e.target.value))}
                        className="font-['Courier_New',monospace] px-2 py-1 rounded-md border text-xs"
                        style={{
                          backgroundColor: theme.bgAlt,
                          borderColor: theme.border,
                          color: theme.text,
                        }}
                      >
                        {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                          <option key={hour} value={hour}>
                            {hour === 0 ? '12am' : hour === 12 ? '12pm' : hour < 12 ? `${hour}am` : `${hour - 12}pm`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}