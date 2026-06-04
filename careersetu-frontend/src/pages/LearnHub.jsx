import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  BookOpen, Map, Newspaper, Lock, Eye, Download, Crown,
  ChevronRight, Search, Star, Clock, Target, CheckCircle,
  Sparkles, ExternalLink, Gift, Calendar, Video, X, Copy, Check,
  Upload, Camera, ImageIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { roadmaps } from '../data/mockData';
import { studyMaterials } from '../data/mockData';
import './LearnHub.css';

const API = import.meta.env.VITE_API_URL || 'https://careersetu-ai-2.onrender.com/api';
const UPI_ID = 'abhishekpandey29632@oksbi';

// ─── PDF Catalog ────────────────────────────────────────────────────────────
const PDF_CATALOG = [
  {
    key: 'HR_CONTACTS',
    title: 'Company Wise HR Contacts',
    desc: 'Direct HR contacts of 500+ companies. Skip the job portal queue and reach HRs directly.',
    price: 19,
    pages: '45+',
    emoji: '📋',
    tags: ['Job Search', 'Networking'],
    highlight: true,
  },
  {
    key: 'DSA_SHEET',
    title: 'DSA Sheet by Abhishek Pandey',
    desc: 'Curated DSA problems covering Arrays, Trees, Graphs, DP and more. Interview-ready.',
    price: 15,
    pages: '60+',
    emoji: '💻',
    tags: ['DSA', 'Coding'],
    highlight: true,
  },
  {
    key: 'JAVA_INTERVIEW',
    title: 'Java Interview Questions (Freshers)',
    desc: 'Top Java interview questions with detailed answers for freshers.',
    price: 5,
    pages: '30+',
    emoji: '☕',
    tags: ['Java', 'Interview'],
  },
  {
    key: 'SPRINGBOOT_INTERVIEW',
    title: 'Spring Boot Interview Questions (Freshers)',
    desc: 'Most asked Spring Boot interview questions with explanations.',
    price: 5,
    pages: '25+',
    emoji: '🍃',
    tags: ['Spring Boot', 'Interview'],
  },
  {
    key: 'SYSTEM_DESIGN',
    title: 'System Design — 20 Interview Problems',
    desc: '20 real system design problems asked in FAANG interviews with solutions.',
    price: 5,
    pages: '40+',
    emoji: '🏗️',
    tags: ['System Design', 'Senior'],
  },
];

// ─── Resources ────────────────────────────────────────────────────────────────
const blogPosts = [
  { id: 1, title: 'SSC CGL vs Bank PO — Which is Better in 2024?', category: 'Career Advice', date: '15 Nov 2024', readTime: '5 min' },
  { id: 2, title: 'Top 10 Government Exam Preparation Tips', category: 'Study Tips', date: '10 Nov 2024', readTime: '7 min' },
  { id: 3, title: 'How to Crack UPSC in First Attempt', category: 'UPSC', date: '5 Nov 2024', readTime: '10 min' },
];

const youtubeChannels = [
  { name: 'Unacademy', subs: '8.5M', link: 'https://youtube.com/@unacademy' },
  { name: 'Adda247', subs: '5.2M', link: 'https://youtube.com/@adda247' },
  { name: 'Study IQ', subs: '10M', link: 'https://youtube.com/@studyiqeducation' },
];

const freeTools = [
  { name: 'Khan Academy', desc: 'Free courses', link: 'https://khanacademy.org', icon: '🎓' },
  { name: 'Testbook', desc: 'Mock tests', link: 'https://testbook.com', icon: '📝' },
  { name: 'Gradeup', desc: 'Exam prep', link: 'https://byjusexamprep.com', icon: '📚' },
];

const roadmapDetails = {
  'ssc-cgl': {
    phases: [
      { title: 'Foundation (3 months)', topics: ['Quantitative Aptitude basics', 'English Grammar', 'General Awareness basics', 'Reasoning fundamentals'], duration: '3 months' },
      { title: 'Advanced Preparation (3 months)', topics: ['Advanced Maths', 'Vocabulary building', 'Current Affairs', 'Previous year papers'], duration: '3 months' },
      { title: 'Mock Tests & Revision (2 months)', topics: ['Full-length mocks', 'Weak area focus', 'Speed improvement', 'Final revision'], duration: '2 months' },
    ]
  }
};

// ─── Upload screenshot to ImgBB ───────────────────────────────────────────────
async function uploadToImgBB(file) {
  const IMGBB_API_KEY = 'f343929c3b7f09e93809d02fef3478e2'; // free key — replace with yours from imgbb.com
  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  if (!data.success) throw new Error('Image upload failed');
  return data.data.url;
}

// ─── Modal: UPI Payment ───────────────────────────────────────────────────────
function PurchaseModal({ pdf, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [txnId, setTxnId] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState('');
  const [uploadMode, setUploadMode] = useState('file'); // 'file' | 'url'
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const token = localStorage.getItem('accessToken');

  function copyUPI() {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Sirf image file select karo (JPG, PNG, etc.)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File size 5MB se kam honi chahiye');
      return;
    }
    setError('');
    setScreenshotFile(file);
    setScreenshotPreview(URL.createObjectURL(file));
    setScreenshotUrl(''); // clear manual url
  }

  async function handleUpload() {
    if (!screenshotFile) return;
    setUploading(true);
    setError('');
    try {
      const url = await uploadToImgBB(screenshotFile);
      setScreenshotUrl(url);
      setUploading(false);
    } catch (e) {
      setError('Image upload failed. Manual URL daalo ya dobara try karo.');
      setUploading(false);
    }
  }

  async function submitPayment() {
    if (!txnId.trim()) { setError('UPI Transaction ID daalo'); return; }

    let finalUrl = screenshotUrl.trim();

    // If file selected but not uploaded yet, upload first
    if (screenshotFile && !finalUrl) {
      setUploading(true);
      try {
        finalUrl = await uploadToImgBB(screenshotFile);
        setScreenshotUrl(finalUrl);
        setUploading(false);
      } catch (e) {
        setError('Screenshot upload failed. Manual URL daalo ya dobara try karo.');
        setUploading(false);
        return;
      }
    }

    if (!finalUrl) { setError('Screenshot upload karo ya URL daalo'); return; }

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/premium/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ pdfType: pdf.key, upiTransactionId: txnId, screenshotUrl: finalUrl })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error occurred');
      onSuccess();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="lh-modal-overlay" onClick={onClose}>
      <div className="lh-modal" onClick={e => e.stopPropagation()}>
        <button className="lh-modal-close" onClick={onClose}><X size={18} /></button>

        {step === 1 && (
          <>
            <div className="lh-modal-header">
              <span style={{ fontSize: 32 }}>{pdf.emoji}</span>
              <h3>{pdf.title}</h3>
              <p>{pdf.desc}</p>
            </div>
            <div className="lh-modal-price">
              <Crown size={16} /> ₹{pdf.price} one-time
            </div>
            <ul className="lh-modal-perks">
              <li><CheckCircle size={14} /> View-only access (secure)</li>
              <li><CheckCircle size={14} /> Admin verified within 2–6 hrs</li>
              <li><CheckCircle size={14} /> Lifetime access after approval</li>
            </ul>
            <button className="lh-btn-primary" onClick={() => setStep(2)}>
              Proceed to Pay ₹{pdf.price} →
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="lh-modal-header">
              <h3>Pay ₹{pdf.price} via UPI</h3>
            </div>
            <div className="lh-upi-box">
              <p className="lh-upi-label">UPI ID</p>
              <div className="lh-upi-id">
                <span>{UPI_ID}</span>
                <button onClick={copyUPI} className="lh-copy-btn">
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p style={{ fontSize: 13, color: '#64748b', marginTop: 8 }}>
                GPay, PhonePe, Paytm — sab chalega
              </p>
            </div>
            <div className="lh-steps">
              <div className="lh-step"><span>1</span> UPI ID copy karo aur ₹{pdf.price} pay karo</div>
              <div className="lh-step"><span>2</span> Payment ka screenshot lo</div>
              <div className="lh-step"><span>3</span> Next step pe screenshot directly upload karo</div>
              <div className="lh-step"><span>4</span> TxnID daalo aur submit karo</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="lh-btn-secondary" onClick={() => setStep(1)}>← Back</button>
              <button className="lh-btn-primary" onClick={() => setStep(3)}>Done, Submit Proof →</button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="lh-modal-header">
              <h3>Payment Proof Submit Karo</h3>
              <p>Admin verify karke access de dega (2–6 hrs)</p>
            </div>

            <div className="lh-form-group">
              <label>UPI Transaction ID *</label>
              <input
                type="text"
                placeholder="e.g. 418371923456"
                value={txnId}
                onChange={e => setTxnId(e.target.value)}
                className="lh-input"
              />
            </div>

            {/* Screenshot Upload Section */}
            <div className="lh-form-group">
              <label>Payment Screenshot *</label>

              {/* Toggle: Upload vs URL */}
              <div className="lh-upload-toggle">
                <button
                  className={`lh-toggle-btn ${uploadMode === 'file' ? 'active' : ''}`}
                  onClick={() => setUploadMode('file')}
                >
                  <Camera size={14} /> Direct Upload
                </button>
                <button
                  className={`lh-toggle-btn ${uploadMode === 'url' ? 'active' : ''}`}
                  onClick={() => setUploadMode('url')}
                >
                  <ImageIcon size={14} /> Paste URL
                </button>
              </div>

              {uploadMode === 'file' ? (
                <div className="lh-upload-area">
                  {screenshotPreview ? (
                    <div className="lh-preview-wrap">
                      <img src={screenshotPreview} alt="Screenshot preview" className="lh-preview-img" />
                      <div className="lh-preview-actions">
                        {screenshotUrl ? (
                          <span className="lh-upload-success">✅ Uploaded successfully</span>
                        ) : (
                          <button
                            className="lh-btn-upload"
                            onClick={handleUpload}
                            disabled={uploading}
                          >
                            {uploading ? 'Uploading...' : '⬆️ Upload to server'}
                          </button>
                        )}
                        <button
                          className="lh-btn-change"
                          onClick={() => {
                            setScreenshotFile(null);
                            setScreenshotPreview('');
                            setScreenshotUrl('');
                          }}
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="lh-drop-zone"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera size={28} className="lh-drop-icon" />
                      <p className="lh-drop-text">Screenshot click karo ya gallery se choose karo</p>
                      <p className="lh-drop-sub">JPG, PNG · Max 5MB</p>
                      <button className="lh-btn-choose">
                        📷 Choose / Camera
                      </button>
                    </div>
                  )}
                  {/* Hidden file input — accept="image/*" + capture for mobile camera */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    style={{ display: 'none' }}
                    onChange={handleFileSelect}
                  />
                </div>
              ) : (
                <input
                  type="text"
                  placeholder="https://ibb.co/... ya Google Drive link"
                  value={screenshotUrl}
                  onChange={e => setScreenshotUrl(e.target.value)}
                  className="lh-input"
                />
              )}
            </div>

            {error && <p className="lh-error">{error}</p>}

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="lh-btn-secondary" onClick={() => setStep(2)}>← Back</button>
              <button
                className="lh-btn-primary"
                onClick={submitPayment}
                disabled={loading || uploading}
              >
                {loading ? 'Submitting...' : uploading ? 'Uploading...' : '✅ Submit for Review'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── PDF Viewer Modal ─────────────────────────────────────────────────────────
const PDF_URLS = {
  HR_CONTACTS: '/pdfs/Company_Wise_HR_Contacts.pdf',
  DSA_SHEET: '/pdfs/DSA_Sheet_by_Abhishek_pandey.pdf',
  JAVA_INTERVIEW: '/pdfs/Java_Interview_Questions_Freshers.pdf',
  SPRINGBOOT_INTERVIEW: '/pdfs/SpringBoot_Interview_Questions_Freshers.pdf',
  SYSTEM_DESIGN: '/pdfs/System_Design_Interview_20_Problems.pdf',
};

function PdfViewer({ pdf, onClose }) {
  return (
    <div className="lh-modal-overlay" onClick={onClose}>
      <div className="lh-pdf-viewer" onClick={e => e.stopPropagation()}>
        <div className="lh-pdf-header">
          <span>{pdf.emoji} {pdf.title}</span>
          <button className="lh-modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <iframe
          src={`${PDF_URLS[pdf.key]}#toolbar=0&navpanes=0&scrollbar=1`}
          title={pdf.title}
          className="lh-pdf-frame"
          onContextMenu={e => e.preventDefault()}
        />
        <p className="lh-pdf-notice">🔒 This PDF is view-only. Right-click & download disabled.</p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LearnHub() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'materials');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMaterialType, setSelectedMaterialType] = useState('All');
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [accessMap, setAccessMap] = useState({});
  const [purchaseModal, setPurchaseModal] = useState(null);
  const [viewerPdf, setViewerPdf] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    if (user && token) fetchAccessMap();
  }, [user]);

  async function fetchAccessMap() {
    try {
      const res = await fetch(`${API}/premium/access`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setAccessMap(data.data?.access || {});
    } catch (e) {}
  }

  function switchTab(tab) {
    setActiveTab(tab);
    setSearchParams({ tab });
  }

  function handlePdfClick(pdf) {
    if (!user) { window.location.href = '/login'; return; }
    const status = accessMap[pdf.key] || 'LOCKED';
    if (status === 'APPROVED') {
      setViewerPdf(pdf);
    } else {
      setPurchaseModal(pdf);
    }
  }

  function onPurchaseSuccess() {
    setPurchaseModal(null);
    setSuccessMsg('🎉 Payment submitted! Admin will verify within 2–6 hrs. Tab refresh karo baad mein.');
    fetchAccessMap();
    setTimeout(() => setSuccessMsg(''), 8000);
  }

  const filteredMaterials = studyMaterials?.filter(m => {
    const matchSearch = m.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = selectedMaterialType === 'All' || m.type === selectedMaterialType;
    return matchSearch && matchType;
  }) || [];

  const materialTypes = ['All', ...new Set(studyMaterials?.map(m => m.type) || [])];

  return (
    <div className="learnhub">
      {/* Hero */}
      <div className="lh-hero">
        <h1 className="lh-hero-title">🎯 Strategies</h1>
        <p className="lh-hero-sub">Study Materials · Resources · Roadmaps — sab ek jagah</p>

        {/* Tabs */}
        <div className="lh-tabs">
          {[
            { key: 'materials', icon: <BookOpen size={15} />, label: 'Study Material' },
            { key: 'resources', icon: <Newspaper size={15} />, label: 'Resources' },
            { key: 'roadmaps', icon: <Map size={15} />, label: 'Roadmaps' },
          ].map(t => (
            <button
              key={t.key}
              className={`lh-tab ${activeTab === t.key ? 'lh-tab--active' : ''}`}
              onClick={() => switchTab(t.key)}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Toast */}
      {successMsg && (
        <div className="lh-toast">{successMsg}</div>
      )}

      <div className="lh-content">

        {/* ── STUDY MATERIALS TAB ── */}
        {activeTab === 'materials' && (
          <div>
            <div className="lh-section">
              <div className="lh-section-header">
                <Crown size={20} className="lh-crown" />
                <div>
                  <h2 className="lh-section-title">Premium PDFs</h2>
                  <p className="lh-section-sub">One-time payment · Lifetime view access · Admin verified</p>
                </div>
              </div>

              <div className="lh-pdf-grid">
                {PDF_CATALOG.map(pdf => {
                  const status = accessMap[pdf.key] || 'LOCKED';
                  return (
                    <div key={pdf.key} className={`lh-pdf-card ${pdf.highlight ? 'lh-pdf-card--highlight' : ''}`}>
                      {pdf.highlight && <span className="lh-badge-hot">🔥 Popular</span>}
                      <div className="lh-pdf-emoji">{pdf.emoji}</div>
                      <h3 className="lh-pdf-title">{pdf.title}</h3>
                      <p className="lh-pdf-desc">{pdf.desc}</p>
                      <div className="lh-pdf-meta">
                        <span>📄 {pdf.pages} pages</span>
                        {pdf.tags.map(t => <span key={t} className="lh-tag">{t}</span>)}
                      </div>

                      {status === 'APPROVED' ? (
                        <button className="lh-btn-view" onClick={() => setViewerPdf(pdf)}>
                          <Eye size={15} /> View PDF
                        </button>
                      ) : status === 'PENDING' ? (
                        <button className="lh-btn-pending" disabled>
                          <Clock size={15} /> Under Review
                        </button>
                      ) : (
                        <button className="lh-btn-unlock" onClick={() => handlePdfClick(pdf)}>
                          <Lock size={15} /> Unlock for ₹{pdf.price}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Regular Study Materials */}
            <div className="lh-section" style={{ marginTop: 40 }}>
              <h2 className="lh-section-title">Free Study Materials</h2>
              <div className="lh-filters">
                <div className="lh-search-wrap">
                  <Search size={15} />
                  <input
                    className="lh-search"
                    placeholder="Search materials..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="lh-type-filters">
                  {materialTypes.map(t => (
                    <button
                      key={t}
                      className={`lh-filter-btn ${selectedMaterialType === t ? 'active' : ''}`}
                      onClick={() => setSelectedMaterialType(t)}
                    >{t}</button>
                  ))}
                </div>
              </div>

              {filteredMaterials.length === 0 ? (
                <div className="lh-empty">No materials found.</div>
              ) : (
                <div className="lh-materials-grid">
                  {filteredMaterials.map(m => (
                    <div key={m.id} className="lh-material-card">
                      <div className="lh-material-top">
                        <span className="lh-material-type">{m.type}</span>
                        {m.isPremium && <Crown size={13} className="lh-crown-sm" />}
                      </div>
                      <h4 className="lh-material-title">{m.title}</h4>
                      <p className="lh-material-sub">{m.subject} · {m.pages} pages</p>
                      <div className="lh-material-footer">
                        <span><Star size={12} /> {m.rating}</span>
                        {m.isPremium ? (
                          <button className="lh-btn-sm-lock"><Lock size={12} /> Premium</button>
                        ) : (
                          <button className="lh-btn-sm"><Download size={12} /> Download</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── RESOURCES TAB ── */}
        {activeTab === 'resources' && (
          <div>
            <div className="lh-section">
              <h2 className="lh-section-title">📰 Latest Articles</h2>
              <div className="lh-resource-list">
                {blogPosts.map(post => (
                  <div key={post.id} className="lh-resource-card">
                    <div>
                      <span className="lh-resource-category">{post.category}</span>
                      <h4 className="lh-resource-title">{post.title}</h4>
                      <div className="lh-resource-meta">
                        <Calendar size={12} /> {post.date} &nbsp;·&nbsp; <Clock size={12} /> {post.readTime} read
                      </div>
                    </div>
                    <ChevronRight size={18} className="lh-chevron" />
                  </div>
                ))}
              </div>
            </div>

            <div className="lh-section" style={{ marginTop: 32 }}>
              <h2 className="lh-section-title">📺 Top YouTube Channels</h2>
              <div className="lh-yt-grid">
                {youtubeChannels.map(ch => (
                  <a key={ch.name} href={ch.link} target="_blank" rel="noopener noreferrer" className="lh-yt-card">
                    <Video size={20} />
                    <div>
                      <div className="lh-yt-name">{ch.name}</div>
                      <div className="lh-yt-subs">{ch.subs} subscribers</div>
                    </div>
                    <ExternalLink size={14} className="lh-ext" />
                  </a>
                ))}
              </div>
            </div>

            <div className="lh-section" style={{ marginTop: 32 }}>
              <h2 className="lh-section-title">🛠️ Free Tools & Platforms</h2>
              <div className="lh-tools-grid">
                {freeTools.map(tool => (
                  <a key={tool.name} href={tool.link} target="_blank" rel="noopener noreferrer" className="lh-tool-card">
                    <span className="lh-tool-icon">{tool.icon}</span>
                    <div>
                      <div className="lh-tool-name">{tool.name}</div>
                      <div className="lh-tool-desc">{tool.desc}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── ROADMAPS TAB ── */}
        {activeTab === 'roadmaps' && (
          <div>
            {!selectedRoadmap ? (
              <div className="lh-section">
                <h2 className="lh-section-title">🗺️ Choose Your Roadmap</h2>
                <div className="lh-roadmap-grid">
                  {roadmaps?.map(rm => (
                    <div key={rm.id} className="lh-roadmap-card" onClick={() => setSelectedRoadmap(rm)}>
                      <div className="lh-roadmap-icon">{rm.icon || '📌'}</div>
                      <h4 className="lh-roadmap-title">{rm.title}</h4>
                      <p className="lh-roadmap-desc">{rm.description}</p>
                      <div className="lh-roadmap-meta">
                        <span><Clock size={12} /> {rm.duration}</span>
                      </div>
                      <button className="lh-btn-sm lh-btn-sm--full">
                        View Roadmap <ChevronRight size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="lh-section">
                <button className="lh-back-btn" onClick={() => setSelectedRoadmap(null)}>
                  ← Back to Roadmaps
                </button>
                <h2 className="lh-section-title">{selectedRoadmap.title}</h2>
                <p style={{ color: '#64748b', marginBottom: 24 }}>{selectedRoadmap.description}</p>
                {(roadmapDetails[selectedRoadmap.id]?.phases || []).map((phase, i) => (
                  <div key={i} className="lh-phase">
                    <div className="lh-phase-header">
                      <div className="lh-phase-num">{i + 1}</div>
                      <div>
                        <h4 className="lh-phase-title">{phase.title}</h4>
                        <span className="lh-phase-dur"><Clock size={12} /> {phase.duration}</span>
                      </div>
                    </div>
                    <ul className="lh-phase-topics">
                      {phase.topics.map((t, j) => (
                        <li key={j}><CheckCircle size={13} /> {t}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Modals */}
      {purchaseModal && (
        <PurchaseModal
          pdf={purchaseModal}
          onClose={() => setPurchaseModal(null)}
          onSuccess={onPurchaseSuccess}
        />
      )}
      {viewerPdf && (
        <PdfViewer pdf={viewerPdf} onClose={() => setViewerPdf(null)} />
      )}
    </div>
  );
}
