import React, { useEffect } from 'react';
import './BlogModal.css';

const BlogModal = ({ blog, onClose }) => {
  // Close modal on ESC key press
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!blog) return null;

  return (
    <div className="blog-modal-overlay" onClick={onClose}>
      <div className="blog-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="blog-modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        {/* Blog Header with Featured Image */}
        <div className="blog-header">
          <div className="blog-featured-icon">{blog.icon}</div>
          <div className="blog-header-content">
            <div className="blog-meta">
              <span className="blog-category">AfriKreate Learning</span>
              <span className="blog-reading-time">15 min read</span>
            </div>
            <h1 className="blog-main-title">{blog.title}</h1>
            <p className="blog-lead">{blog.subtitle}</p>
          </div>
        </div>

        {/* Modal Content */}
        <div className="blog-article-content">
          {/* Article Sections */}
          {blog.sections.map((section, index) => (
            <section key={index} className="blog-section">
              <h2 className="blog-section-heading">{section.heading}</h2>
              <div className="blog-section-content">
                {section.content.split('\n\n').map((paragraph, pIndex) => {
                  // Check if paragraph is a bullet list
                  if (paragraph.includes('•') || paragraph.includes('**')) {
                    const lines = paragraph.split('\n');
                    return (
                      <div key={pIndex} className="blog-list-container">
                        {lines.map((line, lIndex) => {
                          if (line.startsWith('•')) {
                            return (
                              <div key={lIndex} className="blog-list-item">
                                {line.substring(1).trim()}
                              </div>
                            );
                          } else if (line.startsWith('**') && line.endsWith('**')) {
                            return (
                              <h3 key={lIndex} className="blog-subheading">
                                {line.replace(/\*\*/g, '')}
                              </h3>
                            );
                          } else if (line.trim()) {
                            return (
                              <p key={lIndex} className="blog-paragraph">
                                {line}
                              </p>
                            );
                          }
                          return null;
                        })}
                      </div>
                    );
                  }
                  return (
                    <p key={pIndex} className="blog-paragraph">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </section>
          ))}

          {/* Videos Section */}
          {blog.videos && blog.videos.length > 0 && (
            <section className="blog-videos-section">
              <h2 className="blog-section-heading">Video Resources</h2>
              <div className="blog-videos-grid">
                {blog.videos.map((video, index) => (
                  <div key={index} className="blog-video-card">
                    <div className="blog-video-wrapper">
                      <iframe
                        src={video.embedUrl}
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="blog-video-iframe"
                      ></iframe>
                    </div>
                    <h3 className="blog-video-title">{video.title}</h3>
                    <p className="blog-video-description">{video.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Resources Section */}
          {blog.resources && blog.resources.length > 0 && (
            <section className="blog-resources-section">
              <h2 className="blog-section-heading">Additional Resources</h2>
              <div className="blog-resources-list">
                {blog.resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="blog-resource-card"
                  >
                    <div className="blog-resource-icon">🔗</div>
                    <div className="blog-resource-content">
                      <h3 className="blog-resource-title">{resource.title}</h3>
                      <p className="blog-resource-description">{resource.description}</p>
                    </div>
                    <div className="blog-resource-arrow">→</div>
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogModal;
