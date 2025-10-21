import { useState } from 'react';

type Tool = { id: string; name: string; description: string };

const tools: Tool[] = [
  { id: 'highlight', name: 'Highlight Text', description: 'Marker valgte tekst på siden' },
  { id: 'darkMode', name: 'Dark Mode', description: 'Gør den aktive side mørk' },
  { id: 'tabManager', name: 'Tab Manager', description: 'Vis åbne faner og luk inaktive' },
];

export default function App() {
  const [activeTools, setActiveTools] = useState<Record<string, boolean>>(() => ({}));

  const toggleTool = (toolId: string) => {
    const isActive = activeTools[toolId] || false;

    if (!isActive) {
      chrome.runtime.sendMessage({ tool: toolId }, (response) =>
        console.log(`${toolId} aktiveret`, response)
      );
    } else {
      chrome.runtime.sendMessage({ tool: `${toolId}-deactivate` }, (response) =>
        console.log(`${toolId} deaktiveret`, response)
      );
    }

    setActiveTools((prev) => ({ ...prev, [toolId]: !prev[toolId] }));
  };

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Chrome Extension Toolbox</h1>
      <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
        {tools.map((tool) => {
          const isActive = activeTools[tool.id] || false;
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
                {isActive ? 'Deaktiver' : 'Aktiver'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
