'use client';

import { useEffect, useState } from 'react';

type DemoKey = 'incident' | 'reconciliation' | 'guardrails';

const projects = [
  {
    id: '01', label: 'AI PLATFORM · MULTI-AGENT SYSTEMS', title: 'AI-SEOS',
    subtitle: 'Governed multi-agent platform for core banking modernization',
    description: 'A LangGraph-based orchestrator that plans and decomposes modernization work across specialist agents, with dependency-aware execution, repository context, and human approval gates.',
    stack: ['Python', 'LangGraph', 'FastAPI', 'pgvector', 'Apache Fineract', 'ERPNext'],
    points: ['Four-tier memory with repository-aware retrieval and change-impact analysis', 'Human plan-approval checkpoints, immutable audit logs, and crash-safe recovery', 'Strangler-fig migration validated through dual-run ledger reconciliation'],
    visual: 'agents'
  },
  {
    id: '02', label: 'BACKEND · AI INFRASTRUCTURE', title: 'Enterprise LLM Gateway',
    subtitle: 'A resilient control plane between applications and model providers',
    description: 'A Spring Boot proxy architecture designed to standardize access to LLM providers while controlling latency, cost, safety, and reliability.',
    stack: ['Java 17', 'Spring Boot 3', 'Redis', 'Resilience4j', 'DeepEval', 'Guardrails AI'],
    points: ['Redis semantic caching and token-bucket rate limiting', 'Circuit-breaker fallback routing and per-request token/cost visibility', 'PII redaction, JSON-schema validation, and offline prompt evaluation'],
    visual: 'gateway'
  },
  {
    id: '03', label: 'REAL-TIME AI · RETRIEVAL', title: 'Speech & Video RAG',
    subtitle: 'Time-aware retrieval across live and recorded media',
    description: 'An event-driven pipeline that ingests media, transcribes speech, indexes timestamped segments, and returns grounded answers linked to relevant moments.',
    stack: ['Python', 'Apache Kafka', 'Whisper', 'Qdrant', 'FastAPI', 'gRPC'],
    points: ['Streaming ingestion and timestamp-aware transcript chunking', 'Vector retrieval over time-indexed audio/video segments', 'Answers linked to source moments through timestamp references'],
    visual: 'rag'
  }
];

const skillGroups = [
  { n: '01', title: 'AI Engineering & LLMOps', desc: 'From retrieval and orchestration to model safety and evaluation.', tags: ['LangGraph', 'MCP', 'RAG', 'vLLM', 'Claude API', 'AWS Bedrock', 'Azure OpenAI', 'Qdrant', 'pgvector', 'Hybrid Search', 'DeepEval', 'Ragas', 'Guardrails AI'] },
  { n: '02', title: 'Backend & Distributed Systems', desc: 'Reliable services, event-driven workflows, and high-throughput APIs.', tags: ['Java 17/21', 'Spring Boot 3', 'Microservices', 'Apache Kafka', 'gRPC / Protobuf', 'Redis', 'Redlock', 'Resilience4j', 'PostgreSQL', 'MySQL', 'MongoDB'] },
  { n: '03', title: 'Cloud, Security & Observability', desc: 'Production operations with measurable reliability and control.', tags: ['AWS', 'Azure', 'Kubernetes', 'Docker', 'Harness CI/CD', 'OpenTelemetry', 'Prometheus', 'Grafana', 'HMAC-SHA256', 'OAuth2 / JWT', 'Rate Limiting'] }
];

const demoCopy: Record<DemoKey, { label: string; title: string; input: string; steps: string[]; result: string; badge: string }> = {
  incident: {
    label: 'Incident triage', title: 'AI-assisted payment incident analysis',
    input: 'Payment API returns intermittent 5xx responses. Recent logs show connection timeouts and repeated retries.',
    steps: ['Collect correlated application logs', 'Classify timeout and retry pattern', 'Trace the affected service boundary', 'Prepare a minimal remediation plan', 'Require engineer approval before PR'],
    result: 'Likely failure domain: downstream connection instability. Suggested next step: inspect connection-pool saturation and timeout configuration; add a bounded retry with backoff only after confirming idempotency.',
    badge: 'Analysis complete · human review required'
  },
  reconciliation: {
    label: 'GST reconciliation', title: 'Document-to-ledger reconciliation workflow',
    input: 'Sample GST statement + transaction export (illustrative inputs)',
    steps: ['Extract tables from PDF / CSV / XLSX', 'Normalize GSTIN, invoice, date, and amount fields', 'Match records across source files', 'Flag missing or mismatched entries', 'Generate an exception summary for review'],
    result: 'Illustrative result: 128 records compared · 119 matched · 6 amount mismatches · 3 missing references. Exceptions are grouped for accountant review; no financial records are changed.',
    badge: 'Reconciliation preview · no live data'
  },
  guardrails: {
    label: 'LLM guardrails', title: 'Policy-aware LLM request lifecycle',
    input: 'User prompt: “Summarize this customer record and return a validated JSON response.”',
    steps: ['Authenticate application and enforce rate limits', 'Detect and redact sensitive fields', 'Route request to an available model provider', 'Validate response against JSON schema', 'Record latency, token usage, and policy outcome'],
    result: 'Illustrative result: request passed authentication · sensitive fields redacted · response schema valid · provider fallback not required. The gateway returns a policy-checked response with usage metadata.',
    badge: 'Policy checks passed · simulated workflow'
  }
};

function ProjectVisual({ kind }: { kind: string }) {
  if (kind === 'agents') return <div className="mock mock-agents"><div className="mock-top"><span>AI-SEOS / ORCHESTRATOR</span><span className="live-pill">● RUN PREVIEW</span></div><div className="agent-flow"><div className="agent-node primary-node"><b>◎</b><strong>Planner</strong><small>Task decomposition</small></div><div className="flow-branches"><i/><i/><i/></div><div className="agent-row"><div className="agent-node"><b>⌘</b><strong>Repository</strong><small>Context agent</small></div><div className="agent-node"><b>⌁</b><strong>Migration</strong><small>Code agent</small></div><div className="agent-node"><b>✓</b><strong>Validator</strong><small>Test agent</small></div></div><div className="approval"><span>Human approval gate</span><strong>Awaiting review <b>→</b></strong></div></div><div className="mock-foot"><span>DEPENDENCY GRAPH</span><span>4 agents · 1 approval checkpoint</span></div></div>;
  if (kind === 'gateway') return <div className="mock mock-gateway"><div className="mock-top"><span>LLM GATEWAY / REQUEST TRACE</span><span className="status-chip">HEALTHY</span></div><div className="gateway-route"><div className="route-box">APP<br/><b>Request</b></div><span>→</span><div className="route-box highlighted">GATEWAY<br/><b>Policy + Routing</b></div><span>→</span><div className="route-providers"><i>Claude</i><i>Bedrock</i><i>Azure AI</i></div></div><div className="gateway-stats"><div><small>SEMANTIC CACHE</small><b>Enabled</b><span className="mini-bar"><i style={{width:'76%'}}/></span></div><div><small>RATE LIMIT</small><b>Token bucket</b><span className="mini-bar"><i style={{width:'58%'}}/></span></div><div><small>OUTPUT CHECK</small><b>Schema valid</b><span className="check-mark">✓</span></div></div><div className="mock-foot"><span>REQUEST CONTROL PLANE</span><span>PII · COST · FALLBACK</span></div></div>;
  return <div className="mock mock-rag"><div className="mock-top"><span>MEDIA RAG / LIVE INDEX</span><span className="live-pill">● STREAMING</span></div><div className="rag-screen"><div className="video-placeholder"><div className="play">▶</div><span>LIVE / RECORDED MEDIA</span><small>00:12:48</small></div><div className="transcript"><small>TRANSCRIPT SEGMENTS</small><p><b>00:12:41</b> “The service retries the request…”</p><p><b>00:12:48</b> “We should verify the ledger state…”</p><p><b>00:13:02</b> “The timeout is configured at…”</p></div></div><div className="rag-answer"><span>GROUNDED ANSWER</span><b>3 relevant moments found</b><small>Answer references timestamps in source media ↗</small></div><div className="mock-foot"><span>KAFKA → WHISPER → QDRANT</span><span>TIME-ANCHORED RETRIEVAL</span></div></div>;
}

export default function Home() {
  const [activeDemo, setActiveDemo] = useState<DemoKey>('incident');
  const [ranDemo, setRanDemo] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const demo = demoCopy[activeDemo];

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const chooseDemo = (key: DemoKey) => { setActiveDemo(key); setRanDemo(false); };

  return <main id="top">
    <div className="announcement"><span className="availability-dot"/> OPEN TO AI ENGINEERING & BACKEND OPPORTUNITIES <span className="announcement-right">GURUGRAM, INDIA · IST</span></div>
    <nav className="nav wrap"><a className="brand" href="#top"><span className="brand-mark">SG</span><span>SARANSH GOSWAMI</span></a><button className="menu-toggle" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle navigation">☰</button><div className={`nav-links ${mobileMenu ? 'nav-open' : ''}`}><a onClick={()=>setMobileMenu(false)} href="#about">About</a><a onClick={()=>setMobileMenu(false)} href="#expertise">Expertise</a><a onClick={()=>setMobileMenu(false)} href="#work">Projects</a><a onClick={()=>setMobileMenu(false)} href="#experience">Experience</a><a onClick={()=>setMobileMenu(false)} href="#lab">Automation lab</a></div><a className="nav-cta" href="mailto:saranshgoswami9@gmail.com">Let’s talk <span>↗</span></a></nav>

    <section className="hero wrap" id="home"><div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line"/> AI PLATFORM ENGINEERING × BACKEND SYSTEMS</div><h1>Engineering the<br/><em>intelligence layer</em><br/>of modern software.</h1><p className="hero-lede">I’m Saransh — an AI and backend engineer building dependable financial platforms, LLM infrastructure, and automation systems that turn complex workflows into production-ready software.</p><div className="hero-actions"><a className="button primary" href="#work">Explore selected work <span>↘</span></a><a className="button secondary" href="/Saransh-Goswami-Resume.pdf" target="_blank" rel="noreferrer">View résumé <span>↗</span></a></div><div className="hero-trust"><span><b>3+</b> years in production engineering</span><span><b>AI + Backend</b> equal focus</span><span><b>Fintech</b> · AI platforms · distributed systems</span></div></div>
      <div className="hero-art" aria-label="Animated architecture illustration"><div className="art-grid"/><div className="art-orbit orbit-a"/><div className="art-orbit orbit-b"/><div className="art-center"><span className="art-spark">✳</span><strong>AI</strong><small>ENGINEERING</small></div><div className="art-chip chip-llm"><span>01</span> LLMs</div><div className="art-chip chip-data"><span>02</span> DATA</div><div className="art-chip chip-api"><span>03</span> APIs</div><div className="art-chip chip-agents"><span>04</span> AGENTS</div><div className="art-caption">SYSTEMS THAT THINK. SERVICES THAT SCALE.</div><div className="floating-dot dot-one"/><div className="floating-dot dot-two"/></div>
    </section>

    <section className="metrics wrap reveal"><div className="metric"><strong>10K<span>+</span></strong><small>Daily transactions supported</small></div><div className="metric"><strong>99.9<span>%</span></strong><small>Payment platform uptime</small></div><div className="metric"><strong>65<span>%</span></strong><small>Reduction in engineering MTTR</small></div><div className="metric"><strong>92<span>%</span></strong><small>Automated PR merge acceptance</small></div></section>

    <section className="section wrap" id="about"><div className="section-label reveal"><span>01</span> / THE ENGINEER</div><div className="about-grid"><div className="about-heading reveal"><p className="overline">ABOUT ME</p><h2>Strong foundations.<br/><em>Intelligent systems.</em></h2><div className="about-stamp">JAVA <span>×</span> AI <span>×</span> SYSTEMS</div></div><div className="about-copy reveal"><p className="lead">I work at the intersection of backend engineering and applied AI — building systems that are useful under real production constraints.</p><p>At Eko India Financial Services, my work has spanned high-throughput payment services, banking integrations, platform security, AI-assisted engineering workflows, and financial automation. I enjoy owning the full engineering loop: understanding the problem, shaping the architecture, implementing the system, and making it observable and reliable in production.</p><p>My approach is pragmatic: use AI where it creates leverage, keep critical workflows explainable, and build backend foundations that remain resilient as systems scale.</p><div className="social-row"><a href="https://www.linkedin.com/in/saransh-goswami" target="_blank" rel="noreferrer">LinkedIn profile ↗</a><a href="mailto:saranshgoswami9@gmail.com">Email Saransh ↗</a></div></div></div></section>

    <section className="section expertise-section" id="expertise"><div className="wrap"><div className="section-label reveal"><span>02</span> / TECHNICAL EXPERTISE</div><div className="section-intro reveal"><div><p className="overline">WHAT I BRING</p><h2>Two disciplines.<br/><em>One engineering mindset.</em></h2></div><p>Architecture, implementation, and operational thinking across the full stack — from distributed services to agentic workflows.</p></div><div className="skill-grid">{skillGroups.map((s,i)=><article className="skill-card reveal" key={s.n}><div className="skill-card-top"><span>{s.n} / 03</span><span className="skill-symbol">{i===0?'✳':i===1?'⌘':'◈'}</span></div><h3>{s.title}</h3><p>{s.desc}</p><div className="tag-list">{s.tags.map(t=><span key={t}>{t}</span>)}</div></article>)}</div></div></section>

    <section className="section wrap" id="work"><div className="section-label reveal"><span>03</span> / SELECTED PROJECTS</div><div className="section-intro work-intro reveal"><div><p className="overline">ENGINEERING IN PRACTICE</p><h2>Systems, not just<br/><em>screenshots.</em></h2></div><p>Three architecture-led projects that show how I think about orchestration, resilience, retrieval, and responsible automation.</p></div><div className="project-stack">{projects.map((p)=><article className="project-card reveal" key={p.id}><div className="project-visual"><ProjectVisual kind={p.visual}/></div><div className="project-info"><div className="project-meta"><span>{p.id} / 03</span><span>{p.label}</span></div><h3>{p.title}</h3><h4>{p.subtitle}</h4><p>{p.description}</p><ul>{p.points.map(point=><li key={point}>{point}</li>)}</ul><div className="project-tags">{p.stack.map(tag=><span key={tag}>{tag}</span>)}</div></div></article>)}</div></section>

    <section className="automation-section" id="lab"><div className="wrap section"><div className="section-label reveal"><span>04</span> / INTERACTIVE AUTOMATION LAB</div><div className="section-intro reveal"><div><p className="overline">TRY A WORKFLOW</p><h2>See the system<br/><em>think through a task.</em></h2></div><p>Explore small, illustrative walkthroughs inspired by the engineering patterns in my work. These are front-end simulations, not connected to production services or customer data.</p></div><div className="lab-shell reveal"><aside className="lab-sidebar"><div className="lab-sidebar-title"><span className="lab-icon">✳</span><div><b>Automation Studio</b><small>INTERACTIVE CONCEPT DEMOS</small></div></div><button className={activeDemo==='incident'?'active':''} onClick={()=>chooseDemo('incident')}><span>⌁</span> Incident triage <b>↗</b></button><button className={activeDemo==='reconciliation'?'active':''} onClick={()=>chooseDemo('reconciliation')}><span>▤</span> GST reconciliation <b>↗</b></button><button className={activeDemo==='guardrails'?'active':''} onClick={()=>chooseDemo('guardrails')}><span>◇</span> LLM guardrails <b>↗</b></button><div className="lab-note"><b>DESIGN PRINCIPLE</b><p>Automate repeatable work. Keep consequential decisions reviewable.</p></div></aside><div className="lab-main"><div className="lab-header"><div><span className="lab-kicker">WORKFLOW PREVIEW / {activeDemo.toUpperCase()}</span><h3>{demo.title}</h3></div><span className="sim-badge">SIMULATED ENVIRONMENT</span></div><div className="lab-input"><label>INPUT / CONTEXT</label><p>{demo.input}</p></div><div className="workflow"><label>WORKFLOW EXECUTION</label><div className="workflow-steps">{demo.steps.map((step,i)=><div className="workflow-step" key={step}><span className="step-number">0{i+1}</span><span>{step}</span><i>{i===demo.steps.length-1?'✓':'→'}</i></div>)}</div></div><button className="run-button" onClick={()=>setRanDemo(true)}>{ranDemo?'Run again':'Run workflow'} <span>↗</span></button>{ranDemo&&<div className="demo-result"><div><span className="result-check">✓</span><b>{demo.badge}</b></div><p>{demo.result}</p></div>}<div className="lab-disclaimer">DEMO ONLY · Illustrative sample flow. No live APIs, customer records, or production systems are connected.</div></div></div></div></section>

    <section className="section experience-section" id="experience"><div className="wrap"><div className="section-label reveal"><span>05</span> / EXPERIENCE</div><div className="section-intro reveal"><div><p className="overline">CAREER JOURNEY</p><h2>From financial rails<br/><em>to AI platforms.</em></h2></div><p>Hands-on ownership across backend services, payment integrations, production reliability, and emerging AI engineering capabilities.</p></div><div className="experience-layout"><div className="experience-summary reveal"><span className="company-mark">eko</span><h3>Eko India Financial Services</h3><p>Fintech · Payments · Banking infrastructure</p><div className="experience-facts"><div><b>33+</b><span>Production PRs shipped in current role</span></div><div><b>8</b><span>New banking features delivered</span></div><div><b>4</b><span>Core repositories owned across delivery</span></div></div></div><div className="timeline"><article className="timeline-item reveal"><div className="timeline-date">NOV 2025 — PRESENT</div><div className="timeline-marker"/><div><div className="role-heading"><h3>Senior Software Engineer</h3><span>AI Platform & Core Payments</span></div><ul><li>Technical ownership across core backend payment systems and AI platform architecture, including production releases, schema migrations, and code quality.</li><li>Built an AI-assisted bug repair pipeline connecting error ingestion, Claude-based diagnosis, MCP tools, and GitHub PR automation; reduced engineering MTTR by 65%.</li><li>Engineered HMAC-SHA256 API security controls, timestamp replay protection, developer-key authentication, and configurable IP blocklisting.</li><li>Built LangGraph financial automation for multi-format OCR extraction and GST reconciliation, reducing CA review cycles by 40%.</li></ul></div></article><article className="timeline-item reveal"><div className="timeline-date">JAN 2023 — OCT 2025</div><div className="timeline-marker"/><div><div className="role-heading"><h3>Software Development Engineer</h3><span>SDE 1</span></div><ul><li>Owned UPI, IMPS, NEFT, and RTGS integration architecture supporting 10,000+ daily transactions at 99.9% uptime.</li><li>Built payment routing, retry, fallback, and rate-limiting flows; reduced payment failures by 30%.</li><li>Engineered idempotent VPA/QR reversal and Redis distributed-lock workflows, reducing settlement errors by 25%.</li><li>Led India–Nepal remittance deployment and delivered BBPS integrations and OCR-based KYC workflows.</li></ul></div></article></div></div></div></section>

    <section className="section education-section"><div className="wrap education-row reveal"><div><div className="section-label"><span>06</span> / EDUCATION</div><h2>Computer Science<br/><em>foundation.</em></h2></div><div className="education-card"><span className="education-icon">⌂</span><div><h3>Bachelor of Technology</h3><p>Computer Science & Engineering · Shoolini University</p><small>2019 — 2023 · Solan, Himachal Pradesh</small></div><b>7.49 / 10</b></div></div></section>

    <section className="contact-section"><div className="wrap contact-wrap reveal"><p className="overline">HAVE A CHALLENGING ENGINEERING PROBLEM?</p><h2>Let’s make complex<br/><em>things work beautifully.</em></h2><p className="contact-lede">Interested in AI platform engineering, backend systems, distributed architecture, or building useful automation? I’d be glad to connect.</p><div className="contact-actions"><a className="button primary" href="mailto:saranshgoswami9@gmail.com">Start a conversation ↗</a><a className="button secondary" href="/Saransh-Goswami-Resume.pdf" target="_blank" rel="noreferrer">Download résumé ↓</a></div><div className="contact-links"><a href="mailto:saranshgoswami9@gmail.com">SARANSHGOSWAMI9@GMAIL.COM</a><a href="https://www.linkedin.com/in/saransh-goswami" target="_blank" rel="noreferrer">LINKEDIN ↗</a><a href="/Saransh-Goswami-Resume.pdf" target="_blank" rel="noreferrer">RÉSUMÉ ↗</a></div></div></section>
    <footer className="footer wrap"><a className="brand" href="#top"><span className="brand-mark">SG</span><span>SARANSH GOSWAMI</span></a><span>BUILT WITH CURIOSITY & ENGINEERING DISCIPLINE</span><a href="#top">BACK TO TOP ↑</a></footer>
  </main>;
}
