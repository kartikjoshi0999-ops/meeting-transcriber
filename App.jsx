import React, { useState } from 'react';
import { Upload, Download, Trash2, Search, Plus, Clock, User, FileText, MoreVertical } from 'lucide-react';
import './App.css';

const MeetingTranscriberDashboard = () => {
  const [transcripts, setTranscripts] = useState([
    {
      id: 1,
      title: 'Q1 Planning Meeting',
      date: '2024-01-15',
      duration: '45 min',
      participants: ['John Doe', 'Jane Smith', 'Mike Johnson'],
      status: 'completed',
      text: 'Discussion about quarterly objectives and team alignment...'
    },
    {
      id: 2,
      title: 'Client Presentation',
      date: '2024-01-14',
      duration: '30 min',
      participants: ['Sarah Wilson', 'Client XYZ'],
      status: 'completed',
      text: 'Product demo and feature walkthrough for client feedback...'
    },
    {
      id: 3,
      title: 'Team Standup',
      date: '2024-01-13',
      duration: '15 min',
      participants: ['Team Alpha'],
      status: 'processing',
      text: 'Daily standup discussing blockers and updates...'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTranscript, setSelectedTranscript] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const filteredTranscripts = transcripts.filter(t =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    setTranscripts(transcripts.filter(t => t.id !== id));
  };

  const handleDownload = (transcript) => {
    const element = document.createElement('a');
    const file = new Blob([`${transcript.title}\n\nDate: ${transcript.date}\nDuration: ${transcript.duration}\nParticipants: ${transcript.participants.join(', ')}\n\n${transcript.text}`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${transcript.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleAddTranscript = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newTranscript = {
      id: transcripts.length + 1,
      title: formData.get('title'),
      date: formData.get('date'),
      duration: '0 min',
      participants: formData.get('participants').split(',').map(p => p.trim()),
      status: 'processing',
      text: 'Processing transcript...'
    };
    setTranscripts([newTranscript, ...transcripts]);
    setShowUploadModal(false);
    e.target.reset();
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div>
            <h1>Meeting Transcriber</h1>
            <p>Capture, transcribe, and manage your meeting notes</p>
          </div>
          <button className="btn-primary" onClick={() => setShowUploadModal(true)}>
            <Plus size={20} />
            New Transcript
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Search Bar */}
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search transcripts by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{transcripts.length}</div>
            <div className="stat-label">Total Transcripts</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{transcripts.filter(t => t.status === 'completed').length}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{transcripts.filter(t => t.status === 'processing').length}</div>
            <div className="stat-label">Processing</div>
          </div>
        </div>

        {/* Transcripts List */}
        <section className="transcripts-section">
          <h2>Recent Transcripts</h2>
          
          {filteredTranscripts.length === 0 ? (
            <div className="empty-state">
              <FileText size={48} />
              <p>No transcripts found. Create your first one!</p>
            </div>
          ) : (
            <div className="transcripts-grid">
              {filteredTranscripts.map(transcript => (
                <div
                  key={transcript.id}
                  className="transcript-card"
                  onClick={() => setSelectedTranscript(transcript)}
                >
                  <div className="card-header">
                    <h3>{transcript.title}</h3>
                    <span className={`status-badge status-${transcript.status}`}>
                      {transcript.status}
                    </span>
                  </div>
                  
                  <div className="card-info">
                    <div className="info-item">
                      <Clock size={16} />
                      <span>{transcript.date}</span>
                    </div>
                    <div className="info-item">
                      <span>{transcript.duration}</span>
                    </div>
                  </div>

                  <div className="card-participants">
                    <User size={14} />
                    <span>{transcript.participants.length} participants</span>
                  </div>

                  <div className="card-preview">
                    {transcript.text.substring(0, 100)}...
                  </div>

                  <div className="card-actions">
                    <button onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(transcript);
                    }} className="action-btn" title="Download">
                      <Download size={18} />
                    </button>
                    <button onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(transcript.id);
                    }} className="action-btn delete" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Modal - Transcript Details */}
      {selectedTranscript && (
        <div className="modal-overlay" onClick={() => setSelectedTranscript(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedTranscript.title}</h2>
              <button onClick={() => setSelectedTranscript(null)} className="close-btn">✕</button>
            </div>
            <div className="modal-body">
              <div className="detail-group">
                <label>Date</label>
                <p>{selectedTranscript.date}</p>
              </div>
              <div className="detail-group">
                <label>Duration</label>
                <p>{selectedTranscript.duration}</p>
              </div>
              <div className="detail-group">
                <label>Participants</label>
                <p>{selectedTranscript.participants.join(', ')}</p>
              </div>
              <div className="detail-group">
                <label>Transcript</label>
                <div className="transcript-text">{selectedTranscript.text}</div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => handleDownload(selectedTranscript)} className="btn-primary">
                <Download size={18} />
                Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal - Upload New */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>New Transcript</h2>
              <button onClick={() => setShowUploadModal(false)} className="close-btn">✕</button>
            </div>
            <form onSubmit={handleAddTranscript} className="form">
              <div className="form-group">
                <label>Meeting Title</label>
                <input type="text" name="title" required placeholder="e.g., Q1 Planning Meeting" />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" name="date" required />
              </div>
              <div className="form-group">
                <label>Participants (comma-separated)</label>
                <input type="text" name="participants" required placeholder="John Doe, Jane Smith" />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowUploadModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingTranscriberDashboard;
