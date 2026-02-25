import React from 'react';

function SectionBlock({ block }) {
    const { styles, title, type } = block;

    const renderPreview = () => {
        switch (type) {
            case 'top-stories':
                return (
                    <div className="preview-grid">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="mini-card-preview">
                                <div className="preview-img"></div>
                                <div className="preview-lines">
                                    <div className="line-long"></div>
                                    <div className="line-short"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'breaking-news':
                return (
                    <div className="preview-hero">
                        <div className="hero-badge-preview">BREAKING</div>
                        <div className="line-title"></div>
                        <div className="line-mid"></div>
                    </div>
                );
            default:
                return (
                    <div className="preview-generic">
                        <div className="line-mid"></div>
                        <div className="line-short"></div>
                    </div>
                );
        }
    };

    return (
        <div style={{ ...styles, position: 'relative', overflow: 'hidden' }} className="editor-block-preview">
            <div className="block-label-overlay">
                <span className="label-type">{type ? type.toUpperCase() : 'GENERIC'}</span>
                <span className="label-title">{title}</span>
            </div>

            <div className="content-visual-preview">
                {renderPreview()}
            </div>

            <style>{`
                .editor-block-preview {
                    min-height: 120px;
                    background: var(--secondary) !important;
                    border: 1px solid var(--border) !important;
                    transition: all 0.2s;
                    display: flex;
                    flex-direction: column;
                }
                .block-label-overlay {
                    padding: 0.8rem 1.2rem;
                    border-bottom: 1px solid var(--border);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: rgba(255,255,255,0.02);
                }
                .label-type {
                    font-size: 0.6rem;
                    font-weight: 800;
                    color: var(--accent-gold);
                    letter-spacing: 1px;
                }
                .label-title {
                    font-size: 0.75rem;
                    color: var(--text-dim);
                    font-weight: 500;
                }
                .content-visual-preview {
                    flex: 1;
                    padding: 1.2rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .preview-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 0.8rem;
                }
                .mini-card-preview {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid var(--border);
                    border-radius: 8px;
                    padding: 0.5rem;
                }
                .preview-img {
                    height: 40px;
                    background: rgba(255,255,255,0.05);
                    border-radius: 4px;
                    margin-bottom: 0.5rem;
                }
                .line-long, .line-short, .line-title, .line-mid {
                    height: 6px;
                    background: rgba(255,255,255,0.05);
                    border-radius: 3px;
                    margin-bottom: 4px;
                }
                .line-long { width: 90%; }
                .line-short { width: 40%; }
                .line-title { height: 12px; width: 70%; margin-bottom: 8px; }
                .line-mid { width: 60%; }
                
                .preview-hero {
                    background: linear-gradient(45deg, rgba(66, 133, 244, 0.1), transparent);
                    padding: 1rem;
                    border-radius: 8px;
                    border-left: 3px solid var(--accent-red);
                }
                .hero-badge-preview {
                    font-size: 0.5rem;
                    font-weight: 900;
                    color: var(--accent-red);
                    margin-bottom: 0.5rem;
                }
            `}</style>
        </div >
    );
}

export default SectionBlock;
