import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, Trash2, Copy, Move, Undo, Redo, Maximize2, Palette, Type, Save } from 'lucide-react';
import SectionBlock from './SectionBlock';
import ToolPanel from './ToolPanel';
import axios from 'axios';

const DEFAULT_BLOCK = {
    id: '',
    title: 'Article Placeholder',
    styles: {
        padding: '1.5rem',
        margin: '1rem',
        backgroundColor: '#1e293b',
        color: '#f1f5f9',
        borderRadius: '12px',
        border: '1px solid #334155',
        width: '100%',
        height: 'auto',
        fontSize: '1rem',
        textAlign: 'left'
    }
};

function BlueprintEditor() {
    const [blocks, setBlocks] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [history, setHistory] = useState([]);
    const [redoStack, setRedoStack] = useState([]);

    // Load initial layout
    useEffect(() => {
        const fetchLayout = async () => {
            try {
                const res = await axios.get('/api/blueprints/active');
                if (res.data && res.data.structure) {
                    setBlocks(res.data.structure);
                } else {
                    // Default initial blocks
                    setBlocks([
                        { ...DEFAULT_BLOCK, id: 'block-1', title: 'Top Story Placeholder' },
                        { ...DEFAULT_BLOCK, id: 'block-2', title: 'Breaking News Placeholder' }
                    ]);
                }
            } catch (err) {
                console.error("Failed to load blueprint", err);
            }
        };
        fetchLayout();
    }, []);

    const saveToHistory = (newBlocks) => {
        setHistory([...history, blocks]);
        setRedoStack([]);
    };

    const undo = () => {
        if (history.length === 0) return;
        const prev = history[history.length - 1];
        setRedoStack([...redoStack, blocks]);
        setBlocks(prev);
        setHistory(history.slice(0, -1));
    };

    const redo = () => {
        if (redoStack.length === 0) return;
        const next = redoStack[redoStack.length - 1];
        setHistory([...history, blocks]);
        setBlocks(next);
        setRedoStack(redoStack.slice(0, -1));
    };

    const addBlock = () => {
        const newBlock = {
            ...DEFAULT_BLOCK,
            id: `block-${Date.now()}`,
            title: `New Article Box ${blocks.length + 1}`
        };
        const newBlocks = [...blocks, newBlock];
        saveToHistory(newBlocks);
        setBlocks(newBlocks);
        setSelectedId(newBlock.id);
    };

    const removeBlock = (id) => {
        const newBlocks = blocks.filter(b => b.id !== id);
        saveToHistory(newBlocks);
        setBlocks(newBlocks);
        if (selectedId === id) setSelectedId(null);
    };

    const duplicateBlock = (id) => {
        const block = blocks.find(b => b.id === id);
        const newBlock = { ...block, id: `block-${Date.now()}` };
        const idx = blocks.findIndex(b => b.id === id);
        const newBlocks = [...blocks];
        newBlocks.splice(idx + 1, 0, newBlock);
        saveToHistory(newBlocks);
        setBlocks(newBlocks);
    };

    const updateBlockStyle = (id, newStyles) => {
        const newBlocks = blocks.map(b =>
            b.id === id ? { ...b, styles: { ...b.styles, ...newStyles } } : b
        );
        setBlocks(newBlocks); // Don't save to history on every tiny style change, maybe on blur?
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(blocks);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        saveToHistory(items);
        setBlocks(items);
    };

    return (
        <div className="editor-container">
            {/* Editor Header / Tools */}
            <style>{styles}</style>
            <header className="editor-toolbar glass">
                <div className="toolbar-left">
                    <button onClick={undo} disabled={history.length === 0} title="Undo">
                        <Undo size={18} />
                    </button>
                    <button onClick={redo} disabled={redoStack.length === 0} title="Redo">
                        <Redo size={18} />
                    </button>
                    <div className="divider"></div>
                    <button onClick={addBlock} className="add-btn">
                        <Plus size={18} /> Add Block
                    </button>
                </div>

                <div className="toolbar-right">
                    <button className="save-btn" onClick={() => axios.post('/api/blueprints', { name: 'Main Layout', structure: blocks })}>
                        <Save size={18} /> Save Draft
                    </button>
                </div>
            </header>

            <div className="editor-workspace">
                {/* Main Canvas */}
                <div className="canvas-area">
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="blocks">
                            {(provided) => (
                                <div
                                    className="blocks-list"
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {blocks.length === 0 && (
                                        <div className="empty-canvas-notice">
                                            <div className="pulse-icon"><Plus size={48} /></div>
                                            <h2>Canvas is Empty</h2>
                                            <p>Click "Add Block" in the toolbar to start designing your layout.</p>
                                        </div>
                                    )}
                                    {blocks.map((block, index) => (
                                        <Draggable key={block.id} draggableId={block.id} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    className={`draggable-wrapper ${selectedId === block.id ? 'selected' : ''} ${snapshot.isDragging ? 'dragging' : ''}`}
                                                    onClick={() => setSelectedId(block.id)}
                                                >
                                                    <div className="drag-handle" {...provided.dragHandleProps}>
                                                        <Move size={14} />
                                                    </div>

                                                    <SectionBlock block={block} />

                                                    <div className="block-actions">
                                                        <button onClick={(e) => { e.stopPropagation(); duplicateBlock(block.id); }}>
                                                            <Copy size={14} />
                                                        </button>
                                                        <button onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }} className="danger">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>

                {/* Right Panel for styling */}
                <aside className="tool-panel-area glass">
                    {selectedId ? (
                        <ToolPanel
                            block={blocks.find(b => b.id === selectedId)}
                            onUpdate={(styles) => updateBlockStyle(selectedId, styles)}
                        />
                    ) : (
                        <div className="no-selection">
                            <p>Select a block to edit styles</p>
                        </div>
                    )}
                </aside>
            </div>

            <style>{`
        .editor-container {
          height: 100%;
          display: flex;
          flex-direction: column;
          background: var(--primary);
        }
        .editor-toolbar {
          height: 65px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.5rem;
          border-bottom: 1px solid var(--border);
          background: var(--bg-glass);
          backdrop-filter: blur(20px);
          z-index: 10;
        }
        .toolbar-left, .toolbar-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .divider {
          width: 1px;
          height: 24px;
          background: var(--border);
          margin: 0 0.5rem;
        }
        .editor-toolbar button {
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border);
          color: var(--text);
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
        }
        .editor-toolbar button:hover:not(:disabled) {
          background: rgba(255,255,255,0.08);
          border-color: var(--border-highlight);
        }
        .editor-toolbar button:disabled {
          opacity: 0.2;
          cursor: not-allowed;
        }
        .editor-toolbar button.add-btn, .editor-toolbar button.save-btn {
          width: auto;
          padding: 0 1.2rem;
          gap: 0.6rem;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.85rem;
          letter-spacing: 0.5px;
        }
        .add-btn { background: rgba(66, 133, 244, 0.1) !important; border: 1px solid var(--accent) !important; color: var(--accent) !important; }
        .add-btn:hover { background: var(--accent) !important; color: white !important; }
        .save-btn { background: var(--accent) !important; border-color: var(--accent) !important; box-shadow: 0 4px 15px var(--accent-glow); }
        .save-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px var(--accent-glow); }

        .editor-workspace {
          flex: 1;
          display: flex;
          overflow: hidden;
        }
        .canvas-area {
          flex: 1;
          overflow-y: auto;
          padding: 3rem;
          background-color: var(--primary);
          background-image: 
            radial-gradient(var(--border) 1px, transparent 1px),
            radial-gradient(var(--border) 1px, transparent 1px);
          background-size: 40px 40px;
          background-position: 0 0, 20px 20px;
        }
        .blocks-list {
          max-width: 900px;
          margin: 0 auto;
          padding-bottom: 20rem;
        }
        .tool-panel-area {
          width: 340px;
          border-left: 1px solid var(--border);
          padding: 0;
          overflow-y: auto;
          background: var(--bg-glass);
        }
        .draggable-wrapper {
          position: relative;
          margin-bottom: 1.5rem;
          border: 2px solid transparent;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 18px;
        }
        .draggable-wrapper.selected {
          border-color: var(--accent);
          box-shadow: 0 0 0 4px var(--accent-glow), 0 20px 40px rgba(0,0,0,0.4);
        }
        .draggable-wrapper:hover .drag-handle, 
        .draggable-wrapper:hover .block-actions {
          opacity: 1;
          transform: translateX(0);
        }
        .drag-handle {
          position: absolute;
          left: -45px;
          top: 0;
          width: 36px;
          height: 36px;
          background: var(--secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-dim);
          cursor: grab;
          border-radius: 10px;
          opacity: 0;
          transform: translateX(10px);
          transition: all 0.2s;
          border: 1px solid var(--border);
        }
        .block-actions {
          position: absolute;
          right: -45px;
          top: 0;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          opacity: 0;
          transform: translateX(-10px);
          transition: all 0.2s;
        }
        .block-actions button {
          width: 36px;
          height: 36px;
          background: var(--secondary);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          border: 1px solid var(--border);
          transition: all 0.2s;
        }
        .block-actions button:hover { color: white; background: var(--border); border-color: var(--accent); }
        .block-actions button.danger:hover { color: var(--accent-red); border-color: var(--accent-red); }
        
        .no-selection {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          text-align: center;
          padding: 2rem;
          gap: 1rem;
        }
        .no-selection p { font-size: 0.9rem; }
      `}</style>
        </div>
    );
}

const styles = `
.empty-canvas-notice {
    height: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--text-dim);
    border: 2px dashed var(--border);
    border-radius: 12px;
    margin: 2rem;
    text-align: center;
}
.empty-canvas-notice h2 { color: white; margin: 1rem 0 0.5rem; }
.pulse-icon {
    color: var(--accent);
    animation: pulse 2s infinite;
}
@keyframes pulse {
    0% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.1); opacity: 1; }
    100% { transform: scale(1); opacity: 0.5; }
}
`;

export default BlueprintEditor;
