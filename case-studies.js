/* Interactive case studies — click a project, get the architecture and the reasoning. */
(function () {
  'use strict';

  /* ---------- diagram generator: nodes + edges -> animated SVG ---------- */
  const NW = 132, NH = 58, GAP_X = 172, VB_W = 900;

  function buildDiagram(nodes, edges, stages) {
    const maxRow = Math.max(...nodes.map(n => n.row));
    const vbH = 90 + (maxRow + 1) * 86;
    const pos = {};
    nodes.forEach(n => {
      pos[n.id] = { x: 40 + n.col * GAP_X, y: 56 + n.row * 86, w: NW, h: NH };
    });

    const nodeSvg = nodes.map(n => {
      const p = pos[n.id];
      const accent = n.accent ? ' dg-node--accent' : '';
      const sub = n.sub ? `<text class="dg-sub" x="${p.x + p.w / 2}" y="${p.y + 38}" text-anchor="middle">${n.sub}</text>` : '';
      return `<g><rect class="dg-node${accent}" x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="10"/>
        <text class="dg-label" x="${p.x + p.w / 2}" y="${n.sub ? p.y + 24 : p.y + 34}" text-anchor="middle">${n.label}</text>${sub}</g>`;
    }).join('');

    const edgeSvg = edges.map(([from, to], i) => {
      const a = pos[from], b = pos[to];
      const x1 = a.x + a.w, y1 = a.y + a.h / 2;
      const x2 = b.x, y2 = b.y + b.h / 2;
      const mx = (x1 + x2) / 2;
      const d = `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
      const dur = (2.2 + (i % 3) * 0.35).toFixed(2);
      const begin = ((i % 4) * 0.45).toFixed(2);
      return `<path class="dg-edge" d="${d}"/>
        <circle class="dg-packet" r="3.5"><animateMotion dur="${dur}s" begin="${begin}s" repeatCount="indefinite" path="${d}"/></circle>
        <circle class="dg-packet" r="2.5" opacity=".5"><animateMotion dur="${dur}s" begin="${(+begin + 0.9).toFixed(2)}s" repeatCount="indefinite" path="${d}"/></circle>`;
    }).join('');

    const stageSvg = (stages || []).map(s =>
      `<text class="dg-stage" x="${40 + s.col * GAP_X + NW / 2}" y="28" text-anchor="middle">${s.label.toUpperCase()}</text>`
    ).join('');

    return `<svg viewBox="0 0 ${VB_W} ${vbH}" role="img" aria-label="Architecture diagram">${stageSvg}${edgeSvg}${nodeSvg}</svg>`;
  }

  /* ---------- the work ---------- */
  const CASES = {
    'kafka-pipeline': {
      eyebrow: 'Data Engineering',
      title: 'Real-Time Streaming Data Pipeline',
      tagline: 'Turning a firehose of manufacturing test events into metrics an operations team can act on before the shift ends.',
      problem: 'Test-station events were arriving far faster than batch reporting could digest them. Yield problems surfaced hours after the units had already moved down the line, which meant every fix was retroactive. The question was not "what happened yesterday" — it was "what is going wrong right now".',
      approach: [
        'Built the ingestion layer on Apache Kafka using producers, consumers, topics, partitions and consumer groups, so throughput scales by adding consumers rather than by rewriting the pipeline.',
        'Wrote Python stream-processing services that aggregate lot, station, pass/fail, yield and defect metrics and land them in PostgreSQL.',
        'Put Redis alongside Postgres to hold low-latency shared state across services, so live reads never wait on the analytical store.',
        'Modelled the analytics layer in PostgreSQL with SQL queries and stored procedures for lot yield, station failure rates and abnormal-test detection.',
        'Exposed the result through REST and WebSocket APIs feeding a React dashboard, containerised with Docker behind NGINX.'
      ],
      decisions: [
        { q: 'Why Kafka consumer groups instead of a simple queue?', a: 'Partitioning by station lets throughput scale horizontally while preserving per-station ordering. A plain queue would have forced a choice between the two.' },
        { q: 'Why Redis when PostgreSQL was already there?', a: 'The dashboard needs sub-second reads of current state; the analytics tables are optimised for aggregation. Splitting hot state from historical state kept both fast.' },
        { q: 'Why WebSockets rather than polling?', a: 'Operators watch this screen continuously. Polling would have meant either stale numbers or hammering the API for data that had not changed.' }
      ],
      outcome: 'Yield, station failure rates and abnormal tests surface as they happen rather than in the next day\'s report, and the ingestion path scales by adding consumers rather than rewriting the pipeline.',
      stack: ['Apache Kafka', 'Python', 'PostgreSQL', 'Redis', 'FastAPI', 'React', 'TypeScript', 'Docker', 'NGINX'],
      diagram: buildDiagram(
        [
          { id: 'src', label: 'Test Stations', sub: 'event producers', col: 0, row: 0 },
          { id: 'kafka', label: 'Kafka', sub: 'topics · partitions', col: 1, row: 0, accent: true },
          { id: 'proc', label: 'Python Consumers', sub: 'consumer group', col: 2, row: 0, accent: true },
          { id: 'pg', label: 'PostgreSQL', sub: 'analytics + procs', col: 3, row: 0 },
          { id: 'redis', label: 'Redis', sub: 'live shared state', col: 3, row: 1 },
          { id: 'api', label: 'REST + WebSocket', sub: 'FastAPI', col: 4, row: 0 }
        ],
        [['src', 'kafka'], ['kafka', 'proc'], ['proc', 'pg'], ['proc', 'redis'], ['pg', 'api'], ['redis', 'api']],
        [{ col: 0, label: 'ingest' }, { col: 1, label: 'stream' }, { col: 2, label: 'process' }, { col: 3, label: 'store' }, { col: 4, label: 'serve' }]
      )
    },

    'mety': {
      eyebrow: 'ASU Capstone · MyEdMaster',
      title: 'METY — Adaptive AI Tutoring System',
      tagline: 'A tutor that works out who you are before it tries to teach you anything.',
      problem: 'Most AI tutoring tools give a fifth grader and a college sophomore the same answer at the same depth in the same tone. And when a student asks about something inherently visual — cell division, a circuit diagram — they get a wall of text. We wanted to fix both.',
      approach: [
        'Built the learner-modelling flow on the FSPR framework (Facts, Strategies, Procedures, Rationales), so a self-assessment at signup maps what a student knows and where they are weak.',
        'Shaped every subsequent response using age, academic level, learning style and those mapped gaps.',
        'Designed an image pipeline querying four sources in parallel with a ThreadPoolExecutor — Wikimedia Commons, Wikipedia, Openverse, and a local ChromaDB vector store indexed with OpenCLIP embeddings.',
        'Added an LLM gating layer that first decides whether a question warrants a visual at all.',
        'Implemented dual LLM support: local Llama 3.2 via Ollama at zero inference cost, or OpenAI by changing one environment variable.',
        'Built comprehension scoring that has students restate what they learned, scores it, and triggers targeted remediation on exactly what was missed.'
      ],
      decisions: [
        { q: 'Why gate the images behind an LLM?', a: 'Attaching a picture to every answer trains students to ignore pictures. The gate means a visual appearing is itself a signal that it is worth looking at.' },
        { q: 'Why query four sources in parallel?', a: 'Sequentially this was several seconds — long enough to break the rhythm of a tutoring conversation. A ThreadPoolExecutor brought it under two seconds at no extra cost.' },
        { q: 'Why support a local model at all?', a: 'Per-token cost is a real constraint for an education product. Running on Llama 3.2 locally makes the whole system free to operate, with OpenAI one environment variable away when quality matters more.' }
      ],
      outcome: '17 features shipped by six engineers in a single semester, presented at ASU\'s Innovation Showcase. Image retrieval returns in under two seconds across four sources, and the system runs at zero inference cost on a local model.',
      stack: ['Django 4.2', 'Python 3.11', 'MySQL 8', 'ChromaDB', 'OpenCLIP', 'Ollama / Llama 3.2', 'OpenAI'],
      diagram: buildDiagram(
        [
          { id: 'student', label: 'Student', sub: 'question + goal', col: 0, row: 1 },
          { id: 'profile', label: 'Learner Profile', sub: 'FSPR assessment', col: 1, row: 1, accent: true },
          { id: 'gate', label: 'LLM Gate', sub: 'visual needed?', col: 2, row: 1, accent: true },
          { id: 'sources', label: '4 Sources', sub: 'parallel · <2s', col: 3, row: 0 },
          { id: 'llm', label: 'Llama 3.2 / GPT', sub: 'adapted answer', col: 3, row: 1 },
          { id: 'score', label: 'Comprehension', sub: 'restate + remediate', col: 4, row: 1 }
        ],
        [['student', 'profile'], ['profile', 'gate'], ['gate', 'sources'], ['gate', 'llm'], ['llm', 'score'], ['sources', 'score']],
        [{ col: 0, label: 'input' }, { col: 1, label: 'model' }, { col: 2, label: 'decide' }, { col: 3, label: 'retrieve' }, { col: 4, label: 'assess' }]
      )
    },

    'clearpath': {
      eyebrow: 'Claude Builder Club Hackathon · ASU',
      title: 'ClearPath — Healthcare AI Governance',
      tagline: 'The laws exist. The rights exist. This is the infrastructure to actually run them.',
      problem: '47 states introduced more than 250 healthcare AI bills and 33 became law. Patients now hold legal rights over every AI system that touches their care during a hospital stay. Nobody had built the system that lets either side exercise those rights.',
      approach: [
        'Built an evidence-based audit engine that detects which AI systems are actually running across hospital departments.',
        'Mapped every finding to the specific law it implicates, and generated an immutable compliance report from it.',
        'Gave compliance officers a live dashboard surfacing AI governance events in real time.',
        'Gave patients a verified transparency report — every AI system that touched their care, explained in plain English, with a day-by-day stay timeline and a personal risk assessment.',
        'Built a formal human-review request flow with a real ticket number, a logged response, and an escalation path if the hospital does not respond within 72 hours.'
      ],
      decisions: [
        { q: 'Why map findings to specific statutes?', a: 'A compliance report that says "risk detected" is noise. One that says "this violates this clause of this state law" is something a compliance officer can act on the same day.' },
        { q: 'Why build the patient side at all?', a: 'A right nobody can exercise is not a right. The hospital-facing dashboard satisfies the regulator; the patient-facing report is what makes the law real.' }
      ],
      outcome: 'A working two-sided platform built in a hackathon weekend: compliance officers get audit evidence mapped to law, patients get a plain-English account of the AI involved in their care and a route to challenge it.',
      stack: ['Python', 'LLM APIs', 'Audit Automation', 'Full-Stack'],
      diagram: buildDiagram(
        [
          { id: 'sys', label: 'Hospital Systems', sub: 'departmental AI', col: 0, row: 1 },
          { id: 'audit', label: 'Audit Engine', sub: 'detect + evidence', col: 1, row: 1, accent: true },
          { id: 'law', label: 'Law Mapping', sub: '33 state statutes', col: 2, row: 1, accent: true },
          { id: 'compliance', label: 'Compliance Report', sub: 'immutable', col: 3, row: 0 },
          { id: 'patient', label: 'Patient Report', sub: 'plain English', col: 3, row: 1 },
          { id: 'review', label: 'Human Review', sub: '72h escalation', col: 4, row: 1 }
        ],
        [['sys', 'audit'], ['audit', 'law'], ['law', 'compliance'], ['law', 'patient'], ['patient', 'review']],
        [{ col: 0, label: 'observe' }, { col: 1, label: 'audit' }, { col: 2, label: 'map' }, { col: 3, label: 'report' }, { col: 4, label: 'act' }]
      )
    },

    'monuments': {
      eyebrow: 'Smart India Hackathon · Winner',
      title: 'Digital Reconstruction of Heritage Monuments',
      tagline: 'Rebuilding what time and damage took, as something you can still walk through.',
      problem: 'Heritage monuments degrade, and some are lost outright. Once the structure is gone, so is the record — there is often nothing left to study, restore from, or show anyone who will never stand in front of it.',
      approach: [
        'Built a machine learning pipeline that reconstructs damaged and partially lost monument structures into digital 3D models.',
        'Trained and evaluated models to infer missing geometry and structural detail from what survives.',
        'Validated reconstructions against reference material so the output is defensible rather than merely plausible.',
        'Delivered explorable 3D reconstructions supporting preservation, documentation and public access.'
      ],
      decisions: [
        { q: 'Why validate against reference material?', a: 'A generative model will happily invent a convincing facade that never existed. For heritage work, a plausible reconstruction that is wrong is worse than an incomplete one.' }
      ],
      outcome: 'Selected as a winning team at the Smart India Hackathon, the national-level hackathon organised by the Government of India.',
      stack: ['Machine Learning', 'Python', '3D Reconstruction', 'Computer Vision'],
      diagram: buildDiagram(
        [
          { id: 'ref', label: 'Reference Imagery', sub: 'surviving structure', col: 0, row: 0 },
          { id: 'model', label: 'ML Model', sub: 'geometry inference', col: 1, row: 0, accent: true },
          { id: 'infer', label: 'Missing Geometry', sub: 'reconstructed', col: 2, row: 0, accent: true },
          { id: 'validate', label: 'Validation', sub: 'vs. reference', col: 3, row: 0 },
          { id: 'out', label: '3D Reconstruction', sub: 'explorable', col: 4, row: 0 }
        ],
        [['ref', 'model'], ['model', 'infer'], ['infer', 'validate'], ['validate', 'out']],
        [{ col: 0, label: 'input' }, { col: 1, label: 'infer' }, { col: 2, label: 'rebuild' }, { col: 3, label: 'verify' }, { col: 4, label: 'deliver' }]
      )
    },

    'defect-detection': {
      eyebrow: 'Machine Learning',
      title: 'Defect Detection & Prediction Platform',
      tagline: 'Catching defective units from high-dimensional sensor data — and being able to say why.',
      problem: 'Semiconductor test data is wide, noisy and badly imbalanced: the defective units that matter most are the rarest ones in the dataset. A model that optimises for raw accuracy learns to predict "fine" every time and looks excellent doing it.',
      approach: [
        'Built reproducible preprocessing and feature-engineering workflows handling missing values, outliers, class imbalance, feature selection and data validation.',
        'Evaluated with precision, recall, F1 and PR-AUC rather than accuracy, because accuracy is meaningless on this class distribution.',
        'Deployed the selected model behind a containerised REST service returning versioned predictions and probability scores.',
        'Attached SHAP-based feature explanations to every prediction, and tracked experiments and model versions in MLflow.'
      ],
      decisions: [
        { q: 'Why PR-AUC instead of ROC-AUC?', a: 'With heavy class imbalance, ROC-AUC flatters a model that barely finds the positive class. Precision-recall keeps the rare, expensive cases in view.' },
        { q: 'Why ship SHAP alongside predictions?', a: 'A process engineer will not act on a bare score. Knowing which sensor pushed a unit over the line is the difference between a flag and a fix.' }
      ],
      outcome: 'An end-to-end pipeline from raw sensor measurements to an explainable, versioned prediction service — with every experiment and model version reproducible through MLflow.',
      stack: ['Python', 'scikit-learn', 'XGBoost', 'MLflow', 'SHAP', 'FastAPI', 'PostgreSQL', 'Docker'],
      diagram: buildDiagram(
        [
          { id: 'sensors', label: 'Sensor Data', sub: 'high-dimensional', col: 0, row: 0 },
          { id: 'prep', label: 'Preprocessing', sub: 'nulls · outliers', col: 1, row: 0 },
          { id: 'feat', label: 'Feature Eng.', sub: 'imbalance handling', col: 2, row: 0, accent: true },
          { id: 'model', label: 'Model', sub: 'XGBoost · PR-AUC', col: 3, row: 0, accent: true },
          { id: 'serve', label: 'REST + SHAP', sub: 'versioned', col: 4, row: 0 }
        ],
        [['sensors', 'prep'], ['prep', 'feat'], ['feat', 'model'], ['model', 'serve']],
        [{ col: 0, label: 'ingest' }, { col: 1, label: 'clean' }, { col: 2, label: 'engineer' }, { col: 3, label: 'train' }, { col: 4, label: 'serve' }]
      )
    }
  };

  /* ---------- modal ---------- */
  let lastFocus = null;
  const overlay = document.createElement('div');
  overlay.className = 'cs-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.hidden = true;
  overlay.innerHTML = '<div class="cs-panel" tabindex="-1"></div>';
  document.body.appendChild(overlay);
  const panel = overlay.querySelector('.cs-panel');

  function render(c) {
    return `
      <button class="cs-close" aria-label="Close case study">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
      <div class="cs-eyebrow">${c.eyebrow}</div>
      <h2 class="cs-title">${c.title}</h2>
      <p class="cs-tagline">${c.tagline}</p>

      <div class="cs-section"><h3>The problem</h3><p>${c.problem}</p></div>

      <div class="cs-section"><h3>How it works</h3>
        <div class="cs-diagram">${c.diagram}</div>
      </div>

      <div class="cs-section"><h3>What I built</h3>
        <ul class="cs-list">${c.approach.map(a => `<li>${a}</li>`).join('')}</ul>
      </div>

      <div class="cs-section"><h3>Decisions worth explaining</h3>
        <div class="cs-decisions">
          ${c.decisions.map(d => `<div class="cs-decision"><div class="cs-decision__q">${d.q}</div><p>${d.a}</p></div>`).join('')}
        </div>
      </div>

      <div class="cs-section"><h3>Outcome</h3><p>${c.outcome}</p></div>

      <div class="cs-section"><h3>Stack</h3>
        <div class="cs-stack">${c.stack.map(t => `<span class="tech-badge">${t}</span>`).join('')}</div>
      </div>`;
  }

  function open(id, push) {
    const c = CASES[id];
    if (!c) return;
    lastFocus = document.activeElement;
    panel.innerHTML = render(c);
    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add('is-open'));
    document.body.classList.add('cs-locked');
    panel.focus();
    panel.querySelector('.cs-close').addEventListener('click', () => close(true));
    if (push !== false && location.hash !== '#case-' + id) history.pushState({ cs: id }, '', '#case-' + id);
  }

  function close(push) {
    overlay.classList.remove('is-open');
    document.body.classList.remove('cs-locked');
    setTimeout(() => { overlay.hidden = true; panel.innerHTML = ''; }, 260);
    if (lastFocus) lastFocus.focus();
    if (push && location.hash.startsWith('#case-')) history.pushState({}, '', location.pathname);
  }

  overlay.addEventListener('click', e => { if (e.target === overlay) close(true); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !overlay.hidden) close(true); });
  window.addEventListener('popstate', () => {
    const m = location.hash.match(/^#case-(.+)$/);
    if (m && CASES[m[1]]) open(m[1], false); else if (!overlay.hidden) close(false);
  });

  /* ---------- wire the cards ---------- */
  document.querySelectorAll('.project-card[data-case]').forEach(card => {
    const id = card.getAttribute('data-case');
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', 'Open case study: ' + (card.querySelector('.project-card__title') || {}).textContent);
    card.addEventListener('click', () => open(id));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(id); }
    });
  });

  /* ---------- skill tags filter the projects ---------- */
  const bar = document.getElementById('projectFilter');
  const cards = [...document.querySelectorAll('.project-card')];
  function applyFilter(tech) {
    const t = tech.toLowerCase();
    let hits = 0;
    cards.forEach(card => {
      const techs = [...card.querySelectorAll('.tech-badge')].map(b => b.textContent.toLowerCase()).join(' ');
      const match = techs.includes(t);
      card.classList.toggle('is-dimmed', !match);
      card.classList.toggle('is-match', match);
      if (match) hits++;
    });
    if (bar) {
      bar.innerHTML = `<span>Showing ${hits} project${hits === 1 ? '' : 's'} using <strong style="color:var(--color-primary)">${tech}</strong></span><button class="filter-bar__clear" type="button">clear filter</button>`;
      bar.classList.add('is-active');
      bar.querySelector('.filter-bar__clear').addEventListener('click', clearFilter);
    }
    document.getElementById('projects').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function clearFilter() {
    cards.forEach(c => c.classList.remove('is-dimmed', 'is-match'));
    if (bar) { bar.classList.remove('is-active'); bar.innerHTML = ''; }
  }
  document.querySelectorAll('.skill-tag').forEach(tag => {
    const label = tag.textContent.trim();
    const known = cards.some(c => [...c.querySelectorAll('.tech-badge')].some(b => b.textContent.toLowerCase().includes(label.toLowerCase())));
    if (!known) return;
    tag.setAttribute('data-filter', label);
    tag.setAttribute('role', 'button');
    tag.setAttribute('tabindex', '0');
    tag.setAttribute('title', 'See projects using ' + label);
    tag.addEventListener('click', () => applyFilter(label));
    tag.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); applyFilter(label); } });
  });

  /* deep link on load */
  const m = location.hash.match(/^#case-(.+)$/);
  if (m && CASES[m[1]]) open(m[1], false);
})();
