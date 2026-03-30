export function Explore() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-['Courier_New',monospace] mb-4" style={{ color: 'var(--theme-text)' }}>
          Explore
        </h1>
        <div className="h-[1px] mb-8 w-24" style={{ backgroundColor: 'var(--theme-border)' }} />
        
        <div 
          className="border rounded-lg p-12 text-center"
          style={{
            borderColor: 'var(--theme-border)',
            backgroundColor: 'var(--theme-bg-alt)',
          }}
        >
          <p className="font-['Courier_New',monospace]" style={{ color: 'var(--theme-text-dim)' }}>
            Explore page coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}
