const { useEffect, useMemo, useState } = React;

const TASKS = [
  {
    id: 1, title: "Responsive Web Page Design", technologies: ["HTML5", "CSS3"],
    bloom: "K2, K3", duration: "7 Hours", submission: "23 September 2026",
    description: "Design and build a polished, responsive web page using semantic HTML and modern CSS. Make sure your layout works beautifully on mobile, tablet, and desktop screens.",
    note: "Submit your source files along with a few screenshots showing the page at different screen sizes."
  },
  {
    id: 2, title: "Interactive JavaScript and ReactJS Application", technologies: ["JavaScript", "ReactJS"],
    bloom: "K3, K4", duration: "9 Hours", submission: "1 October 2026",
    description: "Create an interactive application using JavaScript and ReactJS. Break the interface into reusable components and make every control respond to user input.",
    note: "Include a short explanation of your component structure and the interactive features you implemented."
  },
  {
    id: 3, title: "Database Connectivity", technologies: ["SQL", "JDBC", "Spring Boot"],
    bloom: "K3, K4", teamSize: "3 Members", selfLearning: "5 Hours", teamWork: "4 Hours", submission: "9 October 2026",
    description: "Connect a Spring Boot application to a SQL database through JDBC. Work as a team to implement and demonstrate reliable data operations.",
    note: "Coordinate the database schema and divide the implementation tasks across your three team members."
  },
  {
    id: 4, title: "Full Stack Web Application with Microservices", technologies: ["Spring Boot", "Microservices"],
    bloom: "K6", teamSize: "3 Members", selfLearning: "5 Hours", teamWork: "6 Hours", submission: "To be announced",
    description: "Plan and build a full stack application using a microservices architecture. Focus on clear service boundaries and a cohesive end-to-end experience.",
    note: "The submission date will be announced later. Use the time to plan your services, interfaces, and team responsibilities."
  }
];

const INITIAL_COMPLETED = [false, false, false, false];
const ICONS = {
  book: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 1 4 17.5z"/><path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20M8 7h8M8 10h6"/></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m5 12 4 4L19 6"/></svg>,
  people: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM20 8v6M23 11h-6"/></svg>,
  clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>,
  calendar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></svg>,
  search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4 4"/></svg>,
  arrow: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12h14M13 6l6 6-6 6"/></svg>,
  close: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m6 6 12 12M18 6 6 18"/></svg>,
  sun: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>,
  moon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"/></svg>,
  menu: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
};

function loadSaved(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (error) {
    console.warn(`Could not load ${key} from local storage.`, error);
    return fallback;
  }
}

function TaskCard({ task, completed, onToggle, onView, index }) {
  const metadata = [
    ["Bloom's level", task.bloom, "book"],
    task.duration ? ["Duration", task.duration, "clock"] : ["Team size", task.teamSize, "people"],
    task.selfLearning ? ["Self-learning", task.selfLearning, "clock"] : null,
    task.teamWork ? ["Team work", task.teamWork, "people"] : null,
    ["Submission", task.submission, "calendar"]
  ].filter(Boolean);

  return (
    <article className="task-card" style={{ animationDelay: `${index * 70}ms` }}>
      <div className="task-top">
        <div><div className="task-number">Assignment {String(task.id).padStart(2, "0")}</div><h3>{task.title}</h3></div>
        <span className={`status-chip${completed ? " done" : ""}`}><i className="status-dot" />{completed ? "Completed" : "In progress"}</span>
      </div>
      <div className="tech-list">{task.technologies.map((tech) => <span className="tech-tag" key={tech}>{tech}</span>)}</div>
      <div className="task-meta">
        {metadata.map(([label, value, icon]) => <div className="meta-item" key={label}>{ICONS[icon]}<span>{label}: <strong>{value}</strong></span></div>)}
      </div>
      <div className="task-actions">
        <button className="view-btn" type="button" onClick={() => onView(task)}>View task {ICONS.arrow}</button>
        <label className="completion-label"><input type="checkbox" checked={completed} onChange={() => onToggle(task.id)} />Mark complete</label>
      </div>
    </article>
  );
}

function TaskModal({ task, completed, onClose, onToggle }) {
  useEffect(() => {
    function onKeyDown(event) { if (event.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-head">
          <div><div className="task-number">Assignment {String(task.id).padStart(2, "0")}</div><h2 id="modal-title">{task.title}</h2></div>
          <button type="button" className="modal-close" aria-label="Close dialog" onClick={onClose}>{ICONS.close}</button>
        </div>
        <p>{task.description}</p>
        <h3 className="modal-section-title">Technologies</h3>
        <div className="tech-list">{task.technologies.map((tech) => <span className="tech-tag" key={tech}>{tech}</span>)}</div>
        <h3 className="modal-section-title">Task notes</h3>
        <div className="modal-note">{task.note}</div>
        <label className="completion-label modal-done"><input type="checkbox" checked={completed} onChange={() => onToggle(task.id)} />Mark this assignment complete</label>
      </section>
    </div>
  );
}

function App() {
  const [completed, setCompleted] = useState(() => loadSaved("term-work-completed", INITIAL_COMPLETED));
  const [darkMode, setDarkMode] = useState(() => loadSaved("term-work-dark-mode", false));
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedTask, setSelectedTask] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { localStorage.setItem("term-work-completed", JSON.stringify(completed)); }, [completed]);
  useEffect(() => { localStorage.setItem("term-work-dark-mode", JSON.stringify(darkMode)); }, [darkMode]);

  const doneCount = TASKS.reduce((count, task, index) => count + (completed[index] ? 1 : 0), 0);
  const progress = Math.round(doneCount / TASKS.length * 100);
  const visibleTasks = useMemo(() => TASKS.filter((task, index) => {
    const matchesText = `${task.title} ${task.technologies.join(" ")}`.toLowerCase().includes(query.trim().toLowerCase());
    const matchesFilter = filter === "all" || (filter === "completed" ? completed[index] : !completed[index]);
    return matchesText && matchesFilter;
  }), [query, filter, completed]);
  function toggleTask(id) { setCompleted((current) => current.map((value, index) => index === id - 1 ? !value : value)); }

  const nav = [["Home", "#home"], ["Tasks", "#tasks"], ["Team Work", "#team"], ["Guidelines", "#guidelines"], ["Contact", "#contact"]];
  return (
    <div className={`app${darkMode ? " dark" : ""}`}>
      <header className="topbar">
        <a className="brand" href="#home" aria-label="Web Development Portal home"><span className="brand-mark">{ICONS.book}</span><span>WebDev Portal</span></a>
        <nav className={`nav-links${menuOpen ? " open" : ""}`} aria-label="Main navigation">
          {nav.map(([label, href], index) => <a key={href} className={index === 0 ? "active" : ""} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
        </nav>
        <div className="top-actions">
          <button className="icon-btn" type="button" onClick={() => setDarkMode((value) => !value)} aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`} title={`${darkMode ? "Light" : "Dark"} mode`}>{darkMode ? ICONS.sun : ICONS.moon}</button>
          <button className="menu-btn" type="button" aria-label="Toggle navigation menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}>{ICONS.menu}</button>
        </div>
      </header>

      <main className="main">
        <section id="home" className="welcome">
          <div className="welcome-copy">
            <span className="eyebrow"><i className="eyebrow-dot" /> 2026 · Web Development</span>
            <h1>Web Development –<br />Term Work &amp; Team Work Tasks</h1>
            <p>Welcome back! Your learning journey is taking shape. Keep exploring, building, and working together — one task at a time.</p>
          </div>
          <div className="welcome-art" aria-hidden="true"><div className="art-window"><div className="art-dots"><i/><i/><i/></div><div className="art-line"/><div className="art-line"/><div className="art-line"/></div><div className="art-badge">&lt;/&gt;</div></div>
        </section>

        <section aria-labelledby="overview-title">
          <div className="section-heading"><div><h2 id="overview-title">Your learning overview</h2><p>A quick look at your term work progress.</p></div></div>
          <div className="stats">
            <article className="stat-card"><div className="stat-icon">{ICONS.book}</div><div><div className="stat-label">Total assignments</div><div className="stat-value">04 <small>tasks</small></div></div></article>
            <article className="stat-card"><div className="stat-icon green">{ICONS.check}</div><div><div className="stat-label">Completed</div><div className="stat-value">{String(doneCount).padStart(2, "0")} <small>of 04 tasks</small></div></div></article>
            <article className="stat-card"><div className="stat-icon purple">{ICONS.clock}</div><div style={{ flex: 1 }}><div className="stat-label">Overall progress</div><div className="stat-value">{progress}<small>% complete</small></div><div className="progress-track" role="progressbar" aria-label="Overall task completion" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100"><div className="progress-fill" style={{ width: `${progress}%` }} /></div></div></article>
          </div>
        </section>

        <section id="tasks" aria-labelledby="tasks-title">
          <div className="section-heading task-heading">
            <div><h2 id="tasks-title">Term work assignments</h2><p>Explore your tasks and track your progress.</p></div>
            <div className="task-controls">
              <label className="search-box">{ICONS.search}<input aria-label="Search tasks" type="search" placeholder="Search tasks..." value={query} onChange={(event) => setQuery(event.target.value)} /></label>
              <select className="filter-select" aria-label="Filter tasks" value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">All tasks</option><option value="pending">In progress</option><option value="completed">Completed</option></select>
            </div>
          </div>
          <div className="task-grid">
            {visibleTasks.length > 0 ? visibleTasks.map((task, index) => <TaskCard key={task.id} task={task} completed={completed[task.id - 1]} onToggle={toggleTask} onView={setSelectedTask} index={index} />) : <div className="empty-state">No tasks match your search. Try another keyword or filter.</div>}
          </div>
        </section>

        <div className="lower-grid">
          <section className="info-panel" id="team" aria-labelledby="team-title">
            <div className="panel-heading"><h2 id="team-title">Team work</h2><span>Project team · 3 members</span></div>
            <div className="team-list">
              <article className="team-member"><div className="avatar">S1</div><div><div className="member-name">Student 1</div><div className="member-role">Frontend &amp; UI</div></div></article>
              <article className="team-member"><div className="avatar">S2</div><div><div className="member-name">Student 2</div><div className="member-role">Backend &amp; API</div></div></article>
              <article className="team-member"><div className="avatar">S3</div><div><div className="member-name">Student 3</div><div className="member-role">Database &amp; QA</div></div></article>
            </div>
          </section>
          <section className="info-panel" id="guidelines" aria-labelledby="guidelines-title">
            <div className="panel-heading"><h2 id="guidelines-title">A few reminders</h2></div>
            <div className="guideline-list">
              <div className="guideline"><span className="check-icon">{ICONS.check}</span><span>Keep your code readable and use meaningful names.</span></div>
              <div className="guideline"><span className="check-icon">{ICONS.check}</span><span>Test your work on mobile and desktop screens.</span></div>
              <div className="guideline"><span className="check-icon">{ICONS.check}</span><span>Collaborate, communicate, and submit on time.</span></div>
            </div>
          </section>
        </div>
        <footer className="footer" id="contact"><span><strong>WebDev Portal</strong> · Term Work &amp; Self-Learning</span><span>Questions? Contact your course instructor.</span></footer>
      </main>
      {selectedTask && <TaskModal task={selectedTask} completed={completed[selectedTask.id - 1]} onClose={() => setSelectedTask(null)} onToggle={toggleTask} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
