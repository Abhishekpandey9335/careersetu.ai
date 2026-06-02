import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, Clock, Target, CheckCircle, Download, Sparkles, Users } from 'lucide-react';
import { roadmaps } from '../data/mockData';
import './Roadmaps.css';

const roadmapDetails = {
  'ssc-cgl': {
    weeks: [
      { week: 1, title: 'Foundation Week', tasks: ['Complete Number System basics', 'Start Reasoning Puzzles', 'Read Lucent GK Chapter 1-3', 'Attempt 50 aptitude questions'] },
      { week: 2, title: 'Quantitative Aptitude Focus', tasks: ['Percentage & Profit/Loss', 'Time & Work problems', 'Geometry basics', 'Practice 100 Quant MCQs'] },
      { week: 3, title: 'English & Reasoning', tasks: ['Reading Comprehension', 'Error detection practice', 'Syllogisms', 'Coding-Decoding'] },
      { week: 4, title: 'Mock Test & Analysis', tasks: ['Attempt Full Mock Test #1', 'Analyze weak areas', 'Revise previous topics', 'Current Affairs week review'] },
    ]
  }
};

function RoadmapCard({ rm }) {
  const diffColor = { EASY: 'var(--secondary)', MEDIUM: 'var(--yellow)', HARD: 'var(--red)' }[rm.difficulty] || 'var(--primary)';
  return (
    <div className="roadmap-detail-card card">
      <div className="rdc-header">
        <div className="rdc-icon">🗺️</div>
        <div>
          <span className="badge" style={{ background: diffColor + '15', color: diffColor }}>{rm.difficulty}</span>
          {rm.examName && <span className="badge badge-primary" style={{ marginLeft: 6 }}>{rm.examName}</span>}
        </div>
      </div>
      <h3 className="rdc-title">{rm.title}</h3>
      <div className="rdc-meta">
        <span><Clock size={13} /> {rm.durationWeeks} weeks</span>
        <span><Target size={13} /> {rm.successRate}% success rate</span>
        <span><Users size={13} /> 12K+ following</span>
      </div>
      <div className="rdc-progress">
        <div className="progress-bar"><div className="progress-fill" style={{ width: '0%', background: 'var(--primary)' }} /></div>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Not started</span>
      </div>
      <div className="rdc-actions">
        <Link to={`/roadmap/${rm.slug}`} className="btn btn-primary btn-sm">View Roadmap</Link>
        <button className="btn btn-outline btn-sm"><Sparkles size={13} /> Personalize</button>
        <button className="btn btn-ghost btn-sm"><Download size={13} /></button>
      </div>
    </div>
  );
}

function RoadmapDetailView({ slug }) {
  const rm = roadmaps.find(r => r.slug === slug) || roadmaps[0];
  const details = roadmapDetails[slug] || roadmapDetails['ssc-cgl'];
  const [completedTasks, setCompletedTasks] = useState(new Set());

  const toggleTask = (key) => {
    setCompletedTasks(prev => {
      const n = new Set(prev);
      n.has(key) ? n.delete(key) : n.add(key);
      return n;
    });
  };

  return (
    <div className="roadmap-detail-view">
      <div className="rdv-header card">
        <div className="rdv-header-left">
          <div className="rdv-icon">🗺️</div>
          <div>
            <h1 className="rdv-title">{rm.title}</h1>
            <div className="rdv-meta">
              <span><Clock size={14} /> {rm.durationWeeks} weeks</span>
              <span><Target size={14} /> {rm.successRate}% success rate</span>
              <span className={`badge ${rm.difficulty === 'HARD' ? 'badge-red' : rm.difficulty === 'MEDIUM' ? 'badge-yellow' : 'badge-success'}`}>{rm.difficulty}</span>
            </div>
          </div>
        </div>
        <div className="rdv-actions">
          <button className="btn btn-primary"><Sparkles size={14} /> Personalize Plan</button>
          <button className="btn btn-outline"><Download size={14} /> Download PDF</button>
        </div>
      </div>

      <div className="rdv-progress card" style={{ padding: 20, marginTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontWeight: 700 }}>Overall Progress</span>
          <span style={{ color: 'var(--primary)', fontWeight: 700 }}>
            {Math.round(completedTasks.size / (details.weeks.reduce((a, w) => a + w.tasks.length, 0)) * 100)}%
          </span>
        </div>
        <div className="progress-bar" style={{ height: 10 }}>
          <div className="progress-fill" style={{
            width: Math.round(completedTasks.size / (details.weeks.reduce((a, w) => a + w.tasks.length, 0)) * 100) + '%',
            background: 'var(--primary)'
          }} />
        </div>
      </div>

      <div className="rdv-weeks" style={{ marginTop: 20 }}>
        {details.weeks.map(week => (
          <div key={week.week} className="week-card card">
            <div className="week-header">
              <div className="week-num">Week {week.week}</div>
              <h3 className="week-title">{week.title}</h3>
            </div>
            <div className="week-tasks">
              {week.tasks.map(task => {
                const key = `${week.week}-${task}`;
                const done = completedTasks.has(key);
                return (
                  <div key={task} className={`week-task ${done ? 'done' : ''}`} onClick={() => toggleTask(key)}>
                    <div className={`week-task-check ${done ? 'checked' : ''}`}>
                      {done && <CheckCircle size={16} />}
                    </div>
                    <span className="week-task-text">{task}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Roadmaps() {
  const { slug } = useParams();

  if (slug) {
    return (
      <div className="roadmaps-page">
        <div className="page-header-banner">
          <div className="container">
            <div className="breadcrumb">
              <Link to="/">Home</Link> <ChevronRight size={12} />
              <Link to="/roadmaps">Roadmaps</Link> <ChevronRight size={12} />
              <span>{slug}</span>
            </div>
            <h1 className="page-title">Career Roadmap</h1>
          </div>
        </div>
        <div className="container" style={{ padding: '28px 20px' }}>
          <div className="page-with-sidebar">
            <RoadmapDetailView slug={slug} />
            <div>
              <div className="sidebar-widget card-flat">
                <h3 className="sw-title">📋 All Roadmaps</h3>
                {roadmaps.map(r => (
                  <Link key={r.id} to={`/roadmap/${r.slug}`} className="sw-exam-link">
                    <span>🗺️</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{r.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.durationWeeks} weeks</div>
                    </div>
                    <ChevronRight size={14} style={{ marginLeft: 'auto' }} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="roadmaps-page">
      <div className="page-header-banner">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> <ChevronRight size={12} /> <span>Roadmaps</span></div>
          <h1 className="page-title">Career Roadmaps</h1>
          <p className="page-subtitle">Step-by-step preparation guides for government exams, IT jobs, and career goals</p>
          <div className="page-stats"><span>🗺️ 50+ Roadmaps</span><span>👥 2M+ Followers</span><span>✅ Expert-Curated</span></div>
        </div>
      </div>
      <div className="container" style={{ padding: '28px 20px' }}>
        <div className="roadmaps-listing-grid">
          {roadmaps.map(rm => <RoadmapCard key={rm.id} rm={rm} />)}
        </div>
      </div>
    </div>
  );
}
