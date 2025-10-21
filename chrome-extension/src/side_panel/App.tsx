import { useEffect, useState } from 'react';
import { Settings } from 'lucide-react';

type Tool = { id: string; name: string; description: string };

const tools: Tool[] = [
  { id: 'highlight', name: 'Highlight Text', description: 'Mark chosen text on website' },
  { id: 'darkMode', name: 'Dark Mode', description: 'Make the active tab dark' },
  { id: 'tabManager', name: 'Tab Manager', description: "Show open tabs and close inactive ones" },
];

export default function App() {
  const [activeTools, setActiveTools] = useState<Record<string, boolean>>({});
  const [openSettings, setOpenSettings] = useState<string | null>(null);
  const [highlightSettings, setHighlightSettings] = useState({
    color: '#ffff00',
    intensity: 60,
  });

  const toggleTool = (toolId: string) => {
    const isActive = activeTools[toolId] || false;

    if (!isActive) {
      chrome.runtime.sendMessage({ tool: toolId }, (response) =>
        console.log(`${toolId} activated`, response)
      );
    } else {
      chrome.runtime.sendMessage({ tool: `${toolId}-deactivate` }, (response) =>
        console.log(`${toolId} deactivated`, response)
      );
    }

    setActiveTools((prev) => ({ ...prev, [toolId]: !prev[toolId] }));
  };

  const handleOpenSettings = (toolId: string) => {
    setOpenSettings((prev) => (prev === toolId ? null : toolId));
  };

  const handleHighlightChange = (field: 'color' | 'intensity', value: string | number) => {
    setHighlightSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Chrome Extension Toolbox</h1>

      <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
        {tools.map((tool) => {
          const isActive = activeTools[tool.id] || false;
          const isSettingsOpen = openSettings === tool.id;

          return (
            <div
              key={tool.id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '1rem',
                boxShadow: '2px 2px 6px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <h2 style={{ margin: '0 0 0.5rem 0' }}>{tool.name}</h2>
              <p style={{ margin: '0 0 1rem 0', color: '#555' }}>{tool.description}</p>

              {/* Action buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => toggleTool(tool.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: isActive ? '#f56565' : '#48bb78',
                    color: 'white',
                    cursor: 'pointer',
                    transform: 'scale(1)',
                    transition: 'transform 0.3s ease, background-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  {isActive ? 'Deactivate' : 'Activate'}
                </button>

                {/* Settings button */}
                <button
                  onClick={() => handleOpenSettings(tool.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.3rem',
                    transition: 'transform 0.2s ease',
                  }}
                  title="Settings"
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'rotate(30deg)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'rotate(0deg)')}
                >
                  <Settings size={18} />
                </button>
              </div>

              {/* Settings panel */}
              {isSettingsOpen && (
                <div
                  style={{
                    marginTop: '0.75rem',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    background: '#fafafa',
                  }}
                >
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Settings</h3>

                  {tool.id === 'highlight' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label>
                        Color:{' '}
                        <input
                          type="color"
                          value={highlightSettings.color}
                          onChange={(e) =>
                            handleHighlightChange('color', e.target.value)
                          }
                          style={{ cursor: 'pointer' }}
                        />
                      </label>

                      <label>
                        Opacity:{' '}
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={highlightSettings.intensity}
                          onChange={(e) =>
                            handleHighlightChange('intensity', Number(e.target.value))
                          }
                          style={{ width: '100%' }}
                        />
                      </label>

                      <small style={{ color: '#777' }}>
                        Preview opacity: {highlightSettings.intensity}%
                      </small>
                    </div>
                  )}

                  {tool.id !== 'highlight' && (
                    <p style={{ color: '#666' }}>No specific settings for this tool yet.</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
