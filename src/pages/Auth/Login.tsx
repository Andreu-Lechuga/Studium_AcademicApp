import { useNavigate } from "react-router";
import { LogIn, UserPlus } from "lucide-react";
import { useState } from "react";

export function Login() {
  const navigate = useNavigate();
  const [isDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  const theme = {
    bg: isDark ? '#1a1a1a' : '#efefef',
    bgAlt: isDark ? '#242424' : '#ffffff',
    bgHover: isDark ? '#2a2a2a' : '#f5f5f5',
    text: isDark ? '#f5f5f5' : '#1a1a1a',
    textMuted: isDark ? '#a0a0a0' : '#606060',
    textDim: isDark ? '#606060' : '#909090',
    border: isDark ? '#404040' : '#d0d0d0',
    dotColor: isDark ? '#888' : '#888',
  };

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden transition-colors duration-300 flex items-center justify-center"
      style={{ backgroundColor: theme.bg }}
    >
      {/* Dotted paper texture background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, ${theme.dotColor} 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />

      {/* Login Form */}
      <div 
        className="rounded-lg p-8 relative overflow-hidden transition-colors w-full max-w-md mx-4"
        style={{ 
          backgroundColor: theme.bgAlt, 
          borderWidth: '1px', 
          borderStyle: 'solid', 
          borderColor: theme.border 
        }}
      >
        {/* Subtle dotted texture on card */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle, ${theme.text} 1px, transparent 1px)`,
            backgroundSize: '15px 15px',
          }}
        />

        <div className="relative">
          {/* App Name */}
          <h1 
            className="font-['Courier_New',monospace] tracking-wide text-center mb-8 text-2xl transition-colors" 
            style={{ color: theme.text }}
          >
            ACADEME
          </h1>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username Field */}
            <div>
              <label 
                className="block text-sm font-['Courier_New',monospace] mb-2 transition-colors" 
                style={{ color: theme.textMuted }}
              >
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-md font-['Courier_New',monospace] border transition-colors"
                style={{
                  backgroundColor: theme.bg,
                  color: theme.text,
                  borderColor: theme.border,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = theme.textMuted;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = theme.border;
                }}
              />
            </div>

            {/* Password Field */}
            <div>
              <label 
                className="block text-sm font-['Courier_New',monospace] mb-2 transition-colors" 
                style={{ color: theme.textMuted }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-md font-['Courier_New',monospace] border transition-colors"
                style={{
                  backgroundColor: theme.bg,
                  color: theme.text,
                  borderColor: theme.border,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = theme.textMuted;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = theme.border;
                }}
              />
            </div>

            {/* Buttons Row */}
            <div className="flex gap-4">
              {/* Sign In Button */}
              <button
                type="button"
                onClick={() => navigate('/signin')}
                className="flex-1 px-6 py-3 rounded-md font-['Courier_New',monospace] transition-all border relative overflow-hidden"
                style={{
                  backgroundColor: theme.bgHover,
                  color: theme.text,
                  borderColor: theme.border,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.bg;
                  e.currentTarget.style.borderColor = theme.textMuted;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme.bgHover;
                  e.currentTarget.style.borderColor = theme.border;
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  <span>Sign In</span>
                </div>
              </button>

              {/* Login Button */}
              <button
                type="submit"
                className="flex-1 px-6 py-3 rounded-md font-['Courier_New',monospace] transition-all border relative overflow-hidden"
                style={{
                  backgroundColor: theme.bgHover,
                  color: theme.text,
                  borderColor: theme.border,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.bg;
                  e.currentTarget.style.borderColor = theme.textMuted;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme.bgHover;
                  e.currentTarget.style.borderColor = theme.border;
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  <LogIn className="w-5 h-5" />
                  <span>Log In</span>
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}