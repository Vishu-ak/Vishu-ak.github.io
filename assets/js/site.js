/* vishnu.dev — interactions. No framework, no tracking. */
(() => {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform);

  /* ================= DATA ================= */
  const SYSTEM = [
    { id: "apps", x: 120, y: 110, title: "Customer apps", sub: "React · TS · iOS/Android",
      body: "The customer platform: web plus Android and iOS apps that let owners control and schedule their ice bath from their phone. Built from the ground up in React and TypeScript, and it has helped drive new sales.",
      tags: ["React", "TypeScript", "Android/iOS", "Capacitor"] },
    { id: "api", x: 380, y: 110, title: "Platform API", sub: "Node.js · REST · SQL",
      body: "The backend everything talks to: a Node.js (Express) REST API on a SQL data model for users, devices, sessions and orders.",
      tags: ["Node.js", "Express", "REST APIs", "SQL"] },
    { id: "store", x: 640, y: 60, title: "Online store", sub: "commerce integration",
      body: "Integration with the company's online store, so customers can browse products and check out without leaving the app.",
      tags: ["API integration", "E-commerce"] },
    { id: "partner", x: 640, y: 175, title: "Partner platform", sub: "signed webhooks",
      body: "Integration with an external partner platform: consent-based account linking and signed webhooks so customers can share their usage data. It passed the partner's integration review.",
      tags: ["Webhooks", "JWT", "HMAC signing"] },
    { id: "broker", x: 380, y: 265, title: "Messaging infra", sub: "Oracle Cloud · TLS",
      body: "I replaced a third-party vendor's cloud with the company's own messaging infrastructure on Oracle Cloud, so the company fully owns how its connected products communicate.",
      tags: ["MQTT", "TLS", "Linux", "Oracle Cloud"] },
    { id: "device", x: 380, y: 395, title: "Bath controllers", sub: "fault-tolerant cycles",
      body: "Fault-tolerant automation: cycles run on the controller itself, so every customer's bath keeps working through server and network outages, and monitoring catches silent failures in production.",
      tags: ["Fault tolerance", "Monitoring", "Health checks"] },
    { id: "ops", x: 120, y: 300, title: "Ops tools & website", sub: "procurement · ETL",
      body: "Internal tools: the procurement system operations uses daily for materials and purchase orders (replacing spreadsheets), Python ETL jobs that cut manual reporting by around 40%, and the company website.",
      tags: ["Python", "ETL", "Procurement", "Web"] },
    { id: "cicd", x: 640, y: 330, title: "CI/CD & quality", sub: "GitHub Actions · tests",
      body: "The engineering foundation: CI/CD with GitHub Actions, automated testing, secrets management and encryption, Agile/Scrum delivery and AI-assisted development.",
      tags: ["GitHub Actions", "CI/CD", "Testing", "Secrets"] },
  ];
  const EDGES = [["apps", "api"], ["api", "store"], ["api", "partner"], ["api", "broker"], ["broker", "device"], ["cicd", "api"], ["cicd", "apps"]];

  const PROJECTS = [
    { id: "wfm", title: "WFM Integration Hub", cat: ["integration", "fullstack"], year: "2026",
      blurb: "Syncs approved timecards from a workforce management API to payroll, so every approved hour is paid exactly once.",
      points: ["Field mapping, automatic retries and a dead-letter queue for records that need attention.",
               "Signed webhooks and Google Secret Manager for credentials.",
               "Packaged for Kubernetes (GKE) with health checks and a CI/CD pipeline."],
      tags: ["TypeScript", "Node.js", "Docker", "Kubernetes", "GitHub Actions"],
      link: "https://github.com/Vishu-ak/wfm-integration-hub" },
    { id: "resumeforge", title: "ResumeForge MCP", cat: ["ai", "integration"], year: "2026", badge: "open source",
      blurb: "An open-source tool that lets AI assistants like Claude and ChatGPT tailor resumes to job postings.",
      points: ["Multi-step workflow with a consistent match score and a check that flags unsupported claims.",
               "Automated tests and a CI/CD pipeline that publishes releases to Docker and npm."],
      tags: ["TypeScript", "Node.js", "Vitest", "Docker", "GitHub Actions"],
      link: "https://github.com/Vishu-ak/resumeforge-mcp" },
    { id: "stream", title: "Real-Time Streaming Data Pipeline", cat: ["data"], year: "2026",
      blurb: "Event-driven Python microservices that turn live production-line events into real-time metrics.",
      points: ["Ingestion on Apache Kafka with consumer groups, scaling throughput by adding consumers.",
               "Aggregates yield and defect metrics into PostgreSQL, with Redis for shared state.",
               "Streams live updates to a React dashboard; containerized with Docker."],
      tags: ["Python", "Apache Kafka", "PostgreSQL", "Redis", "React", "Docker"] },
    { id: "mety", title: "METY — Adaptive AI Tutor", cat: ["ai", "fullstack"], year: "2026", badge: "capstone",
      blurb: "An AI tutoring web app that adapts every answer to the student's age, level, learning style and knowledge gaps.",
      points: ["Built with a team of six for MyEdMaster: 17 features in one semester, presented at ASU's Innovation Showcase.",
               "RAG answer pipeline querying four sources in parallel, including a ChromaDB vector store, in under two seconds.",
               "LLM provider switchable with one environment variable: OpenAI, or local Llama 3.2 via Ollama."],
      tags: ["Python", "Django", "MySQL", "RAG", "OpenAI"] },
    { id: "clearpath", title: "ClearPath", cat: ["ai"], year: "2026", badge: "hackathon",
      blurb: "A healthcare AI governance platform built at the Claude Builder Club hackathon at ASU.",
      points: ["An audit engine that finds the AI systems running across hospital departments and maps each one to the regulation it implicates.",
               "Produces immutable compliance reports."],
      tags: ["Python", "LLM APIs"] },
    { id: "defect", title: "Defect Detection & Prediction", cat: ["data", "ai"], year: "2025",
      blurb: "An end-to-end ML pipeline over high-dimensional sensor data, served behind a containerized REST API.",
      points: ["Reproducible preprocessing, feature engineering and class-imbalance handling, evaluated on precision, recall and PR-AUC.",
               "Experiments and model versions tracked in MLflow, with SHAP explanations per prediction."],
      tags: ["Python", "scikit-learn", "XGBoost", "MLflow", "FastAPI", "PostgreSQL", "Docker"] },
    { id: "heritage", title: "Heritage Monument 3D Reconstruction", cat: ["ai"], year: "2023", badge: "winner",
      blurb: "An ML pipeline that reconstructs damaged monuments into 3D models from surviving reference images.",
      points: ["Winning team at the Smart India Hackathon, the national hackathon run by the Government of India."],
      tags: ["Python", "Machine Learning", "Computer Vision"] },
  ];

  const ROLES = {
    morozko: "Founding Software Engineer · Morozko Forge",
    myed: "Capstone · MyEdMaster",
    asu: "Research Assistant · ASU",
    sify: "Data Science Intern · Sify",
  };
  const SKILLS = {
    "React": [["role", "morozko", "Customer platform front end (web, Android/iOS)"], ["project", "stream", "Live metrics dashboard"]],
    "TypeScript": [["role", "morozko", "Customer platform and backend"], ["project", "wfm", "Integration service"], ["project", "resumeforge", "MCP server"]],
    "Node.js": [["role", "morozko", "Express REST API"], ["project", "wfm", "Integration service"], ["project", "resumeforge", "MCP server"]],
    "Python": [["role", "morozko", "ETL jobs that cut manual reporting ~40%"], ["role", "asu", "Airflow data pipelines"], ["role", "myed", "Django tutoring app"], ["project", "stream", "Stream-processing microservices"], ["project", "defect", "ML pipeline"]],
    "SQL": [["role", "morozko", "Platform data model"], ["role", "sify", "SQL Server query tuning"], ["project", "stream", "PostgreSQL analytics layer"]],
    "REST APIs": [["role", "morozko", "Platform API and store/partner integrations"], ["project", "defect", "Containerized REST inference API"]],
    "Webhooks": [["role", "morozko", "Signed partner webhooks"], ["project", "wfm", "Signed payroll webhooks"]],
    "Docker": [["project", "wfm", "Container + Kubernetes manifests"], ["project", "resumeforge", "Docker image releases"], ["project", "stream", "Containerized services"]],
    "Kubernetes": [["project", "wfm", "Packaged for GKE with health checks"]],
    "CI/CD": [["role", "morozko", "GitHub Actions pipelines and automated testing"], ["project", "resumeforge", "Tests + release pipeline to Docker and npm"], ["project", "wfm", "CI pipeline"]],
    "Oracle Cloud": [["role", "morozko", "Company-owned messaging infrastructure"]],
    "Google Cloud": [["role", "sify", "ETL pipelines into BigQuery"], ["project", "wfm", "Secret Manager, GKE"]],
    "Apache Airflow": [["role", "asu", "Orchestrated ETL with retries and failure alerts"]],
    "Apache Kafka": [["project", "stream", "Event ingestion with consumer groups"]],
    "PostgreSQL": [["project", "stream", "Metrics store"], ["project", "defect", "Prediction store"]],
    "Django": [["role", "myed", "METY tutoring app"]],
    "RAG": [["role", "myed", "Answer pipeline over a ChromaDB vector store"]],
    "OpenAI API": [["role", "myed", "LLM provider (switchable with Llama 3.2)"]],
    "Agile/Scrum": [["role", "morozko", "Sprint delivery"], ["role", "myed", "Sprints and code reviews, team of six"]],
  };

  /* ================= THEME ================= */
  const root = document.documentElement;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage unavailable */ } },
  };
  const savedTheme = store.get("theme");
  root.dataset.theme = savedTheme || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  const toggleTheme = () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    store.set("theme", root.dataset.theme);
  };
  $("#theme-toggle").addEventListener("click", toggleTheme);
  $("#kbd-hint").textContent = isMac ? "⌘K" : "Ctrl K";

  /* ================= TOAST ================= */
  const toast = (msg) => {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("is-on");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => t.classList.remove("is-on"), 1800);
  };
  const copyEmail = async () => {
    const email = "vishnukumarak2002@gmail.com";
    try { await navigator.clipboard.writeText(email); toast("Email copied"); }
    catch { location.href = `mailto:${email}`; }
  };
  $("#copy-email").addEventListener("click", copyEmail);

  /* ================= BACKGROUND FIELD ================= */
  (function field() {
    const c = $("#field");
    const ctx = c.getContext("2d");
    let w, h, dpr, pts = [], mouse = { x: -9999, y: -9999 }, running = true;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = c.width = innerWidth * dpr; h = c.height = innerHeight * dpr;
      c.style.width = innerWidth + "px"; c.style.height = innerHeight + "px";
      const n = Math.round(Math.min(90, (innerWidth * innerHeight) / 18000));
      pts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .25 * dpr, vy: (Math.random() - .5) * .25 * dpr }));
    };
    const color = () => getComputedStyle(root).getPropertyValue("--accent").trim() || "#5eead4";
    const hexToRgb = (hex) => { const m = hex.replace("#", ""); const n = parseInt(m.length === 3 ? m.split("").map(x => x + x).join("") : m, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      const [r, g, b] = hexToRgb(color());
      const link = 140 * dpr;
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        const dx = p.x - mouse.x, dy = p.y - mouse.y, dm = Math.hypot(dx, dy);
        if (dm < 160 * dpr) { p.x += dx / dm * 0.6; p.y += dy / dm * 0.6; }
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], bb = pts[j], d = Math.hypot(a.x - bb.x, a.y - bb.y);
          if (d < link) {
            ctx.strokeStyle = `rgba(${r},${g},${b},${(1 - d / link) * 0.22})`;
            ctx.lineWidth = dpr;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(bb.x, bb.y); ctx.stroke();
          }
        }
        ctx.fillStyle = `rgba(${r},${g},${b},.55)`;
        ctx.beginPath(); ctx.arc(pts[i].x, pts[i].y, 1.4 * dpr, 0, Math.PI * 2); ctx.fill();
      }
      if (!reduceMotion) requestAnimationFrame(draw);
    };
    resize(); draw();
    addEventListener("resize", () => { resize(); if (reduceMotion) draw(); });
    addEventListener("pointermove", (e) => { mouse.x = e.clientX * dpr; mouse.y = e.clientY * dpr; }, { passive: true });
    document.addEventListener("visibilitychange", () => {
      const was = running; running = !document.hidden;
      if (running && !was && !reduceMotion) requestAnimationFrame(draw);
    });
  })();

  /* ================= HERO ================= */
  (function typewriter() {
    const el = $(".type-target");
    const words = ["full-stack platforms", "API integrations", "cloud infrastructure", "fault-tolerant automation", "data pipelines"];
    if (reduceMotion) return;
    let wi = 0, ci = words[0].length, deleting = true;
    const tick = () => {
      const word = words[wi];
      ci += deleting ? -1 : 1;
      el.textContent = word.slice(0, ci);
      let delay = deleting ? 35 : 70;
      if (!deleting && ci === word.length) { deleting = true; delay = 1800; }
      else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; delay = 300; }
      setTimeout(tick, delay);
    };
    setTimeout(tick, 2200);
  })();

  const counters = $$(".counter");
  const runCounter = (el) => {
    const to = +el.dataset.to, pre = el.dataset.prefix || "", suf = el.dataset.suffix || "";
    if (reduceMotion) { el.textContent = pre + to + suf; return; }
    const t0 = performance.now(), dur = 1300;
    const step = (t) => {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = pre + Math.round(to * e) + suf;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const orbit = $("#orbit");
  if (orbit && !reduceMotion) {
    addEventListener("pointermove", (e) => {
      const rx = (e.clientY / innerHeight - .5) * -10, ry = (e.clientX / innerWidth - .5) * 12;
      orbit.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    }, { passive: true });
  }

  /* ================= SCROLL: reveal, progress, nav ================= */
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      en.target.classList.add("is-in");
      io.unobserve(en.target);
    }
  }, { threshold: 0.12 });
  $$(".reveal").forEach((el) => io.observe(el));
  const cio = new IntersectionObserver((entries) => {
    for (const en of entries) if (en.isIntersecting) { runCounter(en.target); cio.unobserve(en.target); }
  }, { threshold: 0.6 });
  counters.forEach((c) => cio.observe(c));

  const navLinks = $$(".nav__links a");
  const sections = navLinks.map((a) => $(a.getAttribute("href")));
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    $("#progress-bar").style.width = (max > 0 ? (scrollY / max) * 100 : 0) + "%";
    $("#nav").classList.toggle("is-scrolled", scrollY > 20);
    let current = -1;
    sections.forEach((s, i) => { if (s && s.getBoundingClientRect().top < innerHeight * 0.4) current = i; });
    navLinks.forEach((a, i) => a.classList.toggle("is-active", i === current));
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ================= MAGNETIC + SPOTLIGHT ================= */
  if (!reduceMotion && matchMedia("(pointer: fine)").matches) {
    $$(".magnetic").forEach((b) => {
      b.addEventListener("pointermove", (e) => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px, ${(e.clientY - r.top - r.height / 2) * .25}px)`;
      });
      b.addEventListener("pointerleave", () => { b.style.transform = ""; });
    });
  }
  const spotlight = (card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
      if (!reduceMotion && card.classList.contains("tilt")) {
        const rx = ((e.clientY - r.top) / r.height - .5) * -6, ry = ((e.clientX - r.left) / r.width - .5) * 6;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      }
    });
    card.addEventListener("pointerleave", () => { card.style.transform = ""; });
  };
  $$(".card").forEach(spotlight);

  /* ================= SYSTEM MAP ================= */
  (function systemMap() {
    const svgNS = "http://www.w3.org/2000/svg";
    const gE = $("#edges"), gN = $("#nodes"), gP = $("#packets");
    const W = 168, H = 56;
    const byId = Object.fromEntries(SYSTEM.map((n) => [n.id, n]));
    const edgeEls = EDGES.map(([a, b]) => {
      const p = document.createElementNS(svgNS, "path");
      const A = byId[a], B = byId[b];
      const mx = (A.x + B.x) / 2;
      p.setAttribute("d", `M${A.x},${A.y} C${mx},${A.y} ${mx},${B.y} ${B.x},${B.y}`);
      p.setAttribute("class", "sys-edge");
      p.dataset.a = a; p.dataset.b = b;
      gE.appendChild(p);
      return p;
    });
    const nodeEls = SYSTEM.map((n, i) => {
      const g = document.createElementNS(svgNS, "g");
      g.setAttribute("class", "sys-node");
      g.setAttribute("tabindex", "0");
      g.setAttribute("role", "button");
      g.setAttribute("aria-label", `${n.title}: ${n.sub}`);
      g.setAttribute("transform", `translate(${n.x - W / 2},${n.y - H / 2})`);
      g.innerHTML = `<rect width="${W}" height="${H}" rx="12"${n.id === "ops" ? ' stroke-dasharray="5 4"' : ""}></rect>
        <text x="14" y="24">${n.title}</text><text class="sub" x="14" y="42">${n.sub}</text>`;
      g.addEventListener("click", () => select(i));
      g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(i); } });
      gN.appendChild(g);
      return g;
    });
    let active = 0;
    function select(i) {
      active = (i + SYSTEM.length) % SYSTEM.length;
      const n = SYSTEM[active];
      nodeEls.forEach((el, k) => el.classList.toggle("is-active", k === active));
      edgeEls.forEach((e) => e.classList.toggle("is-hot", e.dataset.a === n.id || e.dataset.b === n.id));
      $("#sys-kicker").textContent = `component · ${n.sub}`;
      $("#sys-title-h").textContent = n.title;
      $("#sys-body").textContent = n.body;
      $("#sys-tags").innerHTML = n.tags.map((t) => `<li>${t}</li>`).join("");
      $("#sys-count").textContent = `${active + 1} / ${SYSTEM.length}`;
    }
    $("#sys-prev").addEventListener("click", () => select(active - 1));
    $("#sys-next").addEventListener("click", () => select(active + 1));
    $("#system").addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { select(active + 1); e.preventDefault(); }
      if (e.key === "ArrowLeft") { select(active - 1); e.preventDefault(); }
    });
    select(0);

    if (reduceMotion) return;
    // data packets travelling along each connection
    const packets = edgeEls.map((path, i) => {
      const dot = document.createElementNS(svgNS, "circle");
      dot.setAttribute("r", "3.2");
      dot.setAttribute("class", "sys-packet");
      gP.appendChild(dot);
      return { path, dot, len: path.getTotalLength(), t: i / edgeEls.length, speed: 0.0028 + (i % 3) * 0.0008, dir: i % 2 ? -1 : 1 };
    });
    let visible = false;
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) requestAnimationFrame(loop); }).observe($("#system"));
    function loop() {
      if (!visible) return;
      for (const p of packets) {
        p.t = (p.t + p.speed + 1) % 1;
        const at = p.dir > 0 ? p.t : 1 - p.t;
        const pt = p.path.getPointAtLength(at * p.len);
        p.dot.setAttribute("cx", pt.x); p.dot.setAttribute("cy", pt.y);
        p.dot.setAttribute("opacity", p.path.classList.contains("is-hot") ? "1" : ".45");
      }
      requestAnimationFrame(loop);
    }
  })();

  /* ================= EXPERIENCE TABS ================= */
  (function tabs() {
    const tabs = $$('[role="tab"]');
    const ind = $(".work__indicator");
    const show = (i, focus) => {
      tabs.forEach((t, k) => {
        const on = k === i;
        t.setAttribute("aria-selected", on);
        t.tabIndex = on ? 0 : -1;
        const panel = $("#" + t.getAttribute("aria-controls"));
        panel.hidden = !on;
        if (on) { panel.classList.remove("is-entering"); void panel.offsetWidth; panel.classList.add("is-entering"); }
      });
      ind.style.transform = `translateY(${tabs[i].offsetTop}px)`;
      ind.style.height = tabs[i].offsetHeight + "px";
      if (focus) tabs[i].focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => show(i));
      t.addEventListener("keydown", (e) => {
        const next = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
        if (next) { e.preventDefault(); show((i + next + tabs.length) % tabs.length, true); }
      });
    });
    show(0);
    addEventListener("resize", () => show(tabs.findIndex((t) => t.getAttribute("aria-selected") === "true")));
  })();

  /* ================= PROJECTS ================= */
  const grid = $("#project-grid");
  grid.innerHTML = PROJECTS.map((p) => `
    <article class="card project tilt" tabindex="0" role="button" data-id="${p.id}" data-cat="${p.cat.join(" ")}" aria-label="${p.title}: open details">
      <div class="project__top"><span>${p.year}</span>${p.badge ? `<span class="badge">${p.badge}</span>` : "<span>↗</span>"}</div>
      <h3>${p.title}</h3>
      <p>${p.blurb}</p>
      <ul class="tags">${p.tags.slice(0, 5).map((t) => `<li>${t}</li>`).join("")}</ul>
    </article>`).join("");
  $$(".project", grid).forEach((card) => {
    spotlight(card);
    const open = () => openProject(card.dataset.id);
    card.addEventListener("click", open);
    card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
  });
  const sheet = $("#project-sheet");
  function openProject(id) {
    const p = PROJECTS.find((x) => x.id === id);
    if (!p) return;
    $("#sheet-kicker").textContent = `// ${p.year}${p.badge ? " · " + p.badge : ""}`;
    $("#sheet-title").textContent = p.title;
    $("#sheet-body").textContent = p.blurb;
    $("#sheet-points").innerHTML = p.points.map((x) => `<li>${x}</li>`).join("");
    $("#sheet-tags").innerHTML = p.tags.map((t) => `<li>${t}</li>`).join("");
    $("#sheet-link").innerHTML = p.link ? `<a href="${p.link}" target="_blank" rel="noopener">View on GitHub ↗</a>` : "";
    if (typeof sheet.showModal === "function") sheet.showModal(); else sheet.setAttribute("open", "");
  }
  $("#sheet-close").addEventListener("click", () => sheet.close());
  sheet.addEventListener("click", (e) => { if (e.target === sheet) sheet.close(); });

  $$(".filter").forEach((f) => f.addEventListener("click", () => {
    $$(".filter").forEach((x) => { x.classList.toggle("is-on", x === f); x.setAttribute("aria-pressed", x === f); });
    const cat = f.dataset.filter;
    $$(".project").forEach((card) => {
      card.classList.remove("is-match");
      card.classList.toggle("is-dim", cat !== "all" && !card.dataset.cat.split(" ").includes(cat));
    });
  }));

  /* ================= STACK EXPLORER ================= */
  (function stackExplorer() {
    const cloud = $("#stack-cloud"), out = $("#stack-evidence");
    cloud.innerHTML = Object.entries(SKILLS).map(([name, ev]) =>
      `<button class="skill" aria-pressed="false" data-skill="${name}">${name}<small>${ev.length}</small></button>`).join("");
    cloud.addEventListener("click", (e) => {
      const btn = e.target.closest(".skill");
      if (!btn) return;
      const on = btn.getAttribute("aria-pressed") !== "true";
      $$(".skill", cloud).forEach((b) => b.setAttribute("aria-pressed", b === btn && on));
      $$(".project").forEach((c) => c.classList.remove("is-match", "is-dim"));
      $$(".filter").forEach((x) => { x.classList.toggle("is-on", x.dataset.filter === "all"); x.setAttribute("aria-pressed", x.dataset.filter === "all"); });
      if (!on) { out.innerHTML = '<p class="muted">Select a skill to see the roles and projects that use it.</p>'; return; }
      const name = btn.dataset.skill, ev = SKILLS[name];
      out.innerHTML = `<h3>${name}</h3><ul class="evidence">${ev.map(([kind, id, what], i) => {
        const label = kind === "role" ? ROLES[id] : PROJECTS.find((p) => p.id === id).title;
        return `<li style="animation-delay:${i * 60}ms"><strong>${label}</strong><span>${what}</span></li>`;
      }).join("")}</ul>`;
      const ids = ev.filter(([k]) => k === "project").map(([, id]) => id);
      $$(".project").forEach((c) => c.classList.toggle("is-match", ids.includes(c.dataset.id)));
    });
  })();

  /* ================= COMMAND PALETTE ================= */
  (function palette() {
    const pal = $("#palette"), input = $("#palette-input"), list = $("#palette-list");
    const go = (sel) => () => $(sel).scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    const open = (url) => () => window.open(url, "_blank", "noopener");
    const commands = [
      { label: "Go to system map", k: "section", run: go("#system") },
      { label: "Go to experience", k: "section", run: go("#work") },
      { label: "Go to projects", k: "section", run: go("#projects") },
      { label: "Go to stack explorer", k: "section", run: go("#stack") },
      { label: "Go to education", k: "section", run: go("#education") },
      { label: "Go to contact", k: "section", run: go("#contact") },
      { label: "Copy email address", k: "action", run: copyEmail },
      { label: "Toggle light / dark theme", k: "action", run: toggleTheme },
      { label: "Open résumé (PDF)", k: "link", run: open("assets/Vishnu_Kumar_Adhilakshmi_Kalidas_Resume.pdf") },
      { label: "Open LinkedIn", k: "link", run: open("https://linkedin.com/in/vishnu-kumar-ak") },
      { label: "Open GitHub", k: "link", run: open("https://github.com/Vishu-ak") },
      ...PROJECTS.map((p) => ({ label: `Project: ${p.title}`, k: "project", run: () => { go("#projects")(); setTimeout(() => openProject(p.id), 350); } })),
    ];
    let filtered = commands, idx = 0, lastFocus = null;
    const render = () => {
      list.innerHTML = filtered.map((c, i) => `<li role="option" aria-selected="${i === idx}" data-i="${i}">${c.label}<span class="k">${c.k}</span></li>`).join("")
        || '<li aria-disabled="true">No matches</li>';
    };
    const show = () => { lastFocus = document.activeElement; pal.hidden = false; input.value = ""; filtered = commands; idx = 0; render(); input.focus(); };
    const hide = () => { pal.hidden = true; if (lastFocus) lastFocus.focus(); };
    const run = (i) => { const c = filtered[i]; if (!c) return; hide(); c.run(); };
    input.addEventListener("input", () => {
      const q = input.value.toLowerCase().trim();
      filtered = commands.filter((c) => { let p = 0; for (const ch of q) { p = c.label.toLowerCase().indexOf(ch, p); if (p < 0) return false; p++; } return true; });
      idx = 0; render();
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { idx = Math.min(idx + 1, filtered.length - 1); render(); e.preventDefault(); }
      if (e.key === "ArrowUp") { idx = Math.max(idx - 1, 0); render(); e.preventDefault(); }
      if (e.key === "Enter") { run(idx); e.preventDefault(); }
      if (e.key === "Escape") hide();
    });
    list.addEventListener("click", (e) => { const li = e.target.closest("li[data-i]"); if (li) run(+li.dataset.i); });
    pal.addEventListener("click", (e) => { if (e.target === pal) hide(); });
    $("#open-palette").addEventListener("click", show);
    addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); pal.hidden ? show() : hide(); }
      else if (e.key === "/" && pal.hidden && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); show(); }
    });
  })();
})();
