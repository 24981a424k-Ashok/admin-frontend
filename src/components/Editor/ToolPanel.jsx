import React from 'react';
import { Type, Maximize2, Palette, Layout } from 'lucide-react';

function ToolPanel({ block, onUpdate }) {
    if (!block) return null;

    const handleStyleChange = (key, value) => {
        onUpdate({ [key]: value });
    };

    return (
        <div className="tool-panel">
            <h3>Edit Styles</h3>
            <p className="block-id">ID: {block.id}</p>

            <div className="tool-section">
                <label><Layout size={14} /> Component Type</label>
                <select
                    className="component-select"
                    value={block.type || 'generic'}
                    onChange={(e) => onUpdate({ type: e.target.value })}
                >
                    <option value="generic">Generic Box</option>
                    <option value="top-stories">Top Stories</option>
                    <option value="breaking-news">Breaking News</option>
                    <option value="world">World News</option>
                    <option value="business">Business</option>
                    <option value="technology">Technology</option>
                    <option value="sports">Sports</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="politics">Politics</option>
                    <option value="health">Health</option>
                    <option value="science">Science</option>
                </select>
            </div>

            <div className="tool-section">
                <label><Layout size={14} /> Layout</label>
                <div className="input-row">
                    <div className="input-field">
                        <span>Padding</span>
                        <input
                            type="text"
                            value={block.styles.padding}
                            onChange={(e) => handleStyleChange('padding', e.target.value)}
                        />
                    </div>
                    <div className="input-field">
                        <span>Margin</span>
                        <input
                            type="text"
                            value={block.styles.margin}
                            onChange={(e) => handleStyleChange('margin', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="tool-section">
                <label><Maximize2 size={14} /> Dimensions</label>
                <div className="input-row">
                    <div className="input-field">
                        <span>Width</span>
                        <input
                            type="text"
                            value={block.styles.width}
                            onChange={(e) => handleStyleChange('width', e.target.value)}
                        />
                    </div>
                    <div className="input-field">
                        <span>Height</span>
                        <input
                            type="text"
                            value={block.styles.height}
                            onChange={(e) => handleStyleChange('height', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="tool-section">
                <label><Palette size={14} /> Appearance</label>
                <div className="input-field">
                    <span>Background</span>
                    <div className="color-input-wrapper">
                        <input
                            type="color"
                            value={block.styles.backgroundColor.startsWith('#') ? block.styles.backgroundColor : '#1e293b'}
                            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                        />
                        <input
                            type="text"
                            value={block.styles.backgroundColor}
                            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                        />
                    </div>
                </div>
                <div className="input-field">
                    <span>Border Radius</span>
                    <input
                        type="text"
                        value={block.styles.borderRadius}
                        onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                    />
                </div>
            </div>

            <div className="tool-section">
                <label><Type size={14} /> Typography</label>
                <div className="input-field">
                    <span>Color</span>
                    <input
                        type="color"
                        value={block.styles.color.startsWith('#') ? block.styles.color : '#ffffff'}
                        onChange={(e) => handleStyleChange('color', e.target.value)}
                    />
                </div>
                <div className="input-field">
                    <span>Font Size</span>
                    <input
                        type="text"
                        value={block.styles.fontSize}
                        onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                    />
                </div>
            </div>

            <style>{`
        .tool-panel {
          padding: 1.5rem;
          color: var(--text);
        }
        .tool-panel h3 {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
          font-family: var(--font-display);
          font-weight: 700;
          color: var(--accent-gold);
        }
        .block-id {
          font-size: 0.65rem;
          color: var(--text-muted);
          margin-bottom: 2rem;
          display: block;
          font-family: monospace;
          background: rgba(255,255,255,0.03);
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid var(--border);
        }
        .tool-section {
          margin-bottom: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .tool-section label {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--text-dim);
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          letter-spacing: 0.5px;
        }
        .input-row {
          display: flex;
          gap: 1rem;
        }
        .input-field {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .input-field span {
          font-size: 0.7rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        .input-field input[type="text"] {
          width: 100%;
          padding: 0.6rem 0.8rem;
          font-size: 0.85rem;
          background: rgba(255,255,255,0.02);
          border-radius: 8px;
        }
        .color-input-wrapper {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }
        input[type="color"] {
          width: 44px;
          height: 38px;
          padding: 4px;
          border: 1px solid var(--border);
          background: var(--secondary);
          border-radius: 8px;
          cursor: pointer;
        }
        .component-select {
          width: 100%;
          background: rgba(0,0,0,0.2);
          border: 1px solid var(--border);
          color: var(--text);
          padding: 0.8rem;
          border-radius: 8px;
          font-size: 0.85rem;
          outline: none;
          font-family: var(--font-main);
        }
        .component-select:focus {
          border-color: var(--accent);
          background: rgba(0,0,0,0.3);
        }
      `}</style>
        </div>
    );
}

export default ToolPanel;
