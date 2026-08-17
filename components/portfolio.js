'use client';

import { useEffect, useRef, useState } from 'react';

const CHAOS = [
  ['-', 'Bed 2', '-', 'Bed 2', 'Generals', 'Bed 1', 'Bed 1', 'break', 'Bed 2', 'Bed 1', '-', 'Generals'],
  ['Bed 1', 'Bed 1', 'Generals', '-', 'Bed 1', 'break', 'Generals', '-', 'Bed 1', '-', 'Generals', 'Bed 1'],
  ['-', '-', 'Bed 2', 'Bed 1', 'Bed 1', 'Generals', '-', 'Bed 1', '-', 'Bed 2', 'break', 'Bed 1'],
  ['Bed 1', 'Generals', '-', '-', '-', '-', '-', 'Bed 1', 'Generals', 'break', 'Bed 2', 'Bed 2'],
  ['-', '-', '-', 'Bed 1', '-', 'Bed 2', 'Bed 2', '-', 'Bed 1', '-', 'Bed 1', 'break'],
  ['Bed 2', '-', 'Bed 1', '-', '-', 'Bed 1', 'break', 'Bed 2', '-', 'Generals', '-', '-'],
  ['Generals', 'Bed 1', 'Bed 1', 'Generals', 'Bed 2', 'break', 'Bed 1', 'Generals', '-', 'Bed 1', 'Bed 1', '-'],
];

const SOLVED = [
  ['-', 'Bed 2', '-', 'Bed 1', 'Generals', '-', 'Bed 1', 'break', 'Bed 2', 'Bed 1', '-', 'Generals'],
  ['Bed 1', '-', 'Generals', '-', 'Bed 1', 'break', 'Bed 2', '-', 'Bed 1', '-', 'Generals', 'Bed 1'],
  ['-', 'Bed 1', 'Bed 2', '-', 'Bed 1', 'Generals', '-', 'Bed 1', '-', 'Bed 2', 'break', 'Bed 1'],
  ['Bed 1', 'Generals', '-', 'Bed 1', '-', 'Bed 2', '-', 'Bed 1', 'Generals', 'break', 'Bed 1', '-'],
  ['-', 'Bed 1', '-', 'Bed 2', '-', 'Bed 1', 'Generals', '-', 'Bed 1', '-', 'Bed 2', 'break'],
  ['Bed 2', '-', 'Bed 1', 'Generals', '-', 'Bed 1', 'break', 'Bed 2', '-', 'Generals', 'Bed 1', '-'],
  ['Generals', '-', 'Bed 1', '-', 'Bed 2', 'break', 'Bed 1', 'Generals', '-', 'Bed 1', '-', 'Bed 2'],
];

const STAFF = ['Staff 1', 'Staff 2', 'Staff 3', 'Staff 4', 'Staff 5', 'Staff 6', 'Staff 7'];
const HOURS = ['08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'];

const isObservation = (code) => code === 'Bed 1' || code === 'Bed 2' || code === 'Generals';

function countCloseSameObservationRepeats(matrix) {
  return matrix.reduce((total, row) => total + ['Bed 1', 'Bed 2', 'Generals'].reduce((repeats, observation) => {
    let previousHour = -Infinity;
    return repeats + row.reduce((count, cell, hour) => {
      if (cell !== observation) return count;
      const nextCount = count + (hour - previousHour <= 2 ? 1 : 0);
      previousHour = hour;
      return nextCount;
    }, 0);
  }, 0), 0);
}

const NODES = [
  {
    year: '2019', short: 'Ward floor', kicker: 'Healthcare · where it starts', tint: '#46D6C6',
    title: 'Learning how a ward actually runs',
    body: 'Inpatient mental health, on shift. Observations, handovers, incidents, de-escalation. Long before any of the software, this is where I learned that things usually go wrong because nobody designed the process, not because people are careless.',
  },
  {
    year: '2021', short: 'Senior HCA', kicker: 'Healthcare · process', tint: '#5FCFC0',
    title: 'Senior healthcare assistant',
    body: 'More responsibility for holding the shift together: coordinating staff, keeping allocations workable, spotting risk early and putting it across in a way people could act on. Doing allocations by hand, every single shift, was the thing I kept coming back to.',
  },
  {
    year: '2022', short: 'Security lead', kicker: 'Healthcare · standardisation', tint: '#9BC5A8',
    title: 'Security lead, PICU',
    body: 'I built a standardised training pack so staff got trained the same way regardless of who was on shift, wrote the operational documentation behind it, and delivered the training to over 40 staff, working directly with senior management in a regulated environment.',
  },
  {
    year: '2023', short: 'First code', kicker: 'Software · self-taught', tint: '#D8B472',
    title: 'Teaching myself to build',
    body: 'Codecademy tracks and a lot of evenings: HTML, CSS, JavaScript, then React. The early work was small and rough. Static pages, layout drills, a styling cheatsheet. It is all still further down this page, untouched.',
  },
  {
    year: '2024', short: 'Client work', kicker: 'Software · commercial', tint: '#FFB13C',
    title: 'Building for other people',
    body: 'Two paid websites, start to finish: requirements from a real client, design, build, deployment, domain and DNS, analytics, handover. It is a completely different discipline, because the constraint is someone else’s brand and their deadline rather than my own taste.',
  },
  {
    year: '2025/26', short: 'Product', kicker: 'Software · full-stack product', tint: '#FF5A2C',
    title: 'AllocateIT, end to end',
    body: 'The problem I noticed in 2021 finally met the skills I had by 2024. React frontend, Flask API, an OR-Tools CP-SAT optimisation engine, authentication with MFA, anonymised data handling and cloud deployment. Then real users, real feedback, and a pilot proposal with governance and clinical safety discussions attached.',
  },
];

const CAPABILITIES = [
  ['Frontend', 'Interfaces for people working under time pressure, not showcase pages.', 'The AllocateIT allocation table had to be readable at a glance in the middle of a handover, and editable without anyone reading a manual. Two client sites shipped responsive from 320px up.', 'React · Next.js · TypeScript · JavaScript · Tailwind · HTML/CSS · UI/UX'],
  ['Backend & APIs', 'A separate API that I designed, validated and deployed myself.', 'A Flask REST service on Railway serving a React client on Vercel, with schema validation on every request, sanitised input, restricted CORS and config kept in environment variables.', 'Python · Flask · REST · request validation · API integration'],
  ['Optimisation', 'Turning a messy set of human rules into constraints and a score.', 'A CP-SAT model for observation allocation. Hard constraints for what is allowed, weighted soft constraints for fairness, breaks, skill mix and not giving someone the same job twice in a row, with pruning to keep it quick.', 'Google OR-Tools · CP-SAT · constraint modelling · scoring'],
  ['Security & privacy', 'Treating sensitive data as something to minimise rather than collect.', 'Auth0 with MFA, anonymisation before optimisation and mapping back afterwards, and access control and data minimisation decisions I made deliberately and wrote down so they hold up in a governance conversation.', 'Auth0 · MFA · CORS · sanitisation · anonymisation · access control'],
  ['Ship & operate', 'Getting it from my machine onto a live domain, then keeping it there.', 'Split frontend and backend deployments, custom domains and DNS, environment variables, a Git based workflow, and analytics so I can see what people actually do.', 'Git/GitHub · Vercel · Railway · domains/DNS · GA4 · Clarity · Search Console'],
  ['Product & people', 'Getting requirements out of real conversations, then changing things based on feedback.', 'I’ve gathered requirements from clients and ward staff, put software in front of real users, acted on what came back, written a structured pilot proposal and talked through governance, data protection, evaluation and procurement.', 'requirements gathering · user feedback · stakeholder comms · AI chatbot integration · SEO'],
];

const REPOSITORIES = [
  ['1.Stylingsheet', 'https://github.com/IntropicAC/1.Stylingsheet'],
  ['2.StoreProject', 'https://github.com/IntropicAC/2.StoreProject'],
  ['3.Stock-Trading-Club', 'https://github.com/IntropicAC/3.Stock-Trading-Club'],
  ['Jammming', 'https://github.com/IntropicAC/Jammming'],
  ['multiplequestions', 'https://github.com/IntropicAC/multiplequestions'],
  ['CodingPortfolio', 'https://github.com/IntropicAC/CodingPortfolio'],
];

function Starfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canvas) return undefined;
    const context = canvas.getContext('2d');
    const host = canvas.parentElement;
    let animation;
    let pointer = null;
    let size = { width: 0, height: 0, scale: 1 };
    let velocity = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const stars = Array.from({ length: Math.round((window.innerWidth + window.innerHeight) / 9) }, () => ({ x: 0, y: 0, z: 0.2 + Math.random() * 0.8 }));

    const place = (star) => {
      star.x = Math.random() * size.width;
      star.y = Math.random() * size.height;
    };
    const resize = () => {
      size = { width: host.offsetWidth, height: host.offsetHeight, scale: Math.min(window.devicePixelRatio || 1, 2) };
      canvas.width = size.width * size.scale;
      canvas.height = size.height * size.scale;
      canvas.style.width = `${size.width}px`;
      canvas.style.height = `${size.height}px`;
      context.setTransform(size.scale, 0, 0, size.scale, 0, 0);
      stars.forEach(place);
    };
    const recycle = (star) => {
      star.z = 0.15 + Math.random() * 0.85;
      star.x = Math.random() * size.width;
      star.y = Math.random() * size.height;
    };
    const render = () => {
      context.clearRect(0, 0, size.width, size.height);
      velocity.targetX *= 0.95;
      velocity.targetY *= 0.95;
      velocity.x += (velocity.targetX - velocity.x) * 0.7;
      velocity.y += (velocity.targetY - velocity.y) * 0.7;
      stars.forEach((star) => {
        star.x += velocity.x * star.z + (star.x - size.width / 2) * 0.0004 * star.z;
        star.y += velocity.y * star.z + (star.y - size.height / 2) * 0.0004 * star.z;
        star.z += 0.0004;
        if (star.x < -60 || star.x > size.width + 60 || star.y < -60 || star.y > size.height + 60) recycle(star);
        context.beginPath();
        context.lineCap = 'round';
        context.lineWidth = 3 * star.z;
        context.strokeStyle = `rgba(255,255,255,${0.45 + Math.random() * 0.5})`;
        context.moveTo(star.x, star.y);
        context.lineTo(star.x + (Math.abs(velocity.x) < 0.1 ? 0.5 : velocity.x * 2), star.y + (Math.abs(velocity.y) < 0.1 ? 0.5 : velocity.y * 2));
        context.stroke();
      });
    };
    const tick = () => { render(); animation = requestAnimationFrame(tick); };
    const move = (x, y) => {
      if (pointer) {
        velocity.targetX = velocity.x + (x - pointer.x) / 8;
        velocity.targetY = velocity.y + (y - pointer.y) / 8;
      }
      pointer = { x, y };
    };
    const leave = () => { pointer = null; };
    resize();
    window.addEventListener('resize', resize);
    host.addEventListener('mousemove', (event) => move(event.clientX, event.clientY));
    host.addEventListener('mouseleave', leave);
    host.addEventListener('touchmove', (event) => move(event.touches[0].clientX, event.touches[0].clientY), { passive: true });
    if (reduceMotion) render(); else tick();
    return () => {
      cancelAnimationFrame(animation);
      window.removeEventListener('resize', resize);
      host.removeEventListener('mouseleave', leave);
    };
  }, []);

  return <canvas ref={canvasRef} className="starfield" aria-hidden="true" />;
}

function SectionHeading({ eyebrow, children }) {
  return <><p className="eyebrow" data-reveal>{eyebrow}</p><h2 className="section-title" data-reveal>{children}</h2></>;
}

function cellClass(code, violation) {
  let type = 'off';
  if (code === 'Bed 1') type = 'bed-one';
  else if (code === 'Bed 2') type = 'bed-two';
  else if (code === 'Generals') type = 'gen';
  else if (code === 'break') type = 'brk';
  else if (code !== '-') type = code.toLowerCase();
  return `allocation-cell ${type}${violation ? ' violation' : ''}`;
}

export default function Portfolio() {
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState(null);
  const [solved, setSolved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [compactHeader, setCompactHeader] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [markerX, setMarkerX] = useState(null);
  const rootRef = useRef(null);
  const solverRef = useRef(null);
  const timelineRef = useRef(null);
  const timelineScrollRef = useRef(null);
  const timelineNodeRefs = useRef([]);
  const activeNode = NODES[active];
  const matrix = solved ? SOLVED : CHAOS;
  const observationCounts = matrix.map((row) => row.filter(isObservation).length);
  const spread = Math.max(...observationCounts) - Math.min(...observationCounts);
  const closeSameObservationRepeats = countCloseSameObservationRepeats(matrix);

  useEffect(() => {
    const onScroll = () => setCompactHeader(window.scrollY > 64);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const syncMarker = () => {
      const timeline = timelineRef.current;
      const dot = timelineNodeRefs.current[active]?.querySelector('.timeline-dot');
      if (!timeline || !dot) return;
      const timelineBox = timeline.getBoundingClientRect();
      const dotBox = dot.getBoundingClientRect();
      setMarkerX(dotBox.left - timelineBox.left + dotBox.width / 2);
    };
    syncMarker();
    const activeButton = timelineNodeRefs.current[active];
    const timelineScroller = timelineScrollRef.current;
    if (window.matchMedia('(max-width: 760px)').matches && activeButton && timelineScroller) {
      timelineScroller.scrollTo({ left: Math.max(0, activeButton.offsetLeft - (timelineScroller.clientWidth - activeButton.offsetWidth) / 2), behavior: 'smooth' });
    }
    window.addEventListener('resize', syncMarker);
    return () => window.removeEventListener('resize', syncMarker);
  }, [active]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const items = root.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = solverRef.current;
    if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const timer = window.setTimeout(() => setSolved(true), 1100);
        observer.disconnect();
        return () => window.clearTimeout(timer);
      }
      return undefined;
    }, { threshold: 0.35 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const copyEmail = async () => {
    try { await navigator.clipboard.writeText('alexccharnock50@hotmail.com'); } catch { /* the confirmation still gives a usable cue */ }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <main ref={rootRef}>
      <header className={`site-header ${compactHeader ? 'site-header--solid' : ''}`}>
        <a href="#top" className="brand" onClick={() => setMenuOpen(false)}><span>AC</span>Alex Charnock</a>
        <button className={`menu-toggle ${menuOpen ? 'is-open' : ''}`} type="button" aria-expanded={menuOpen} aria-controls="primary-navigation" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} onClick={() => setMenuOpen((open) => !open)}><span className="visually-hidden">{menuOpen ? 'Close navigation menu' : 'Open navigation menu'}</span><span className="menu-toggle-lines" aria-hidden="true"><i /><i /><i /></span></button>
        <nav id="primary-navigation" className={`primary-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Primary navigation">
          <a className="wide-nav" href="#crossing" style={{ color: '#FFFFFF' }} onClick={() => setMenuOpen(false)}>Crossing</a>
          <a href="#allocateit" style={{ color: '#FFFFFF' }} onClick={() => setMenuOpen(false)}>AllocateIT</a>
          <a className="wide-nav" href="#clients" style={{ color: '#FFFFFF' }} onClick={() => setMenuOpen(false)}>Clients</a>
          <a className="wide-nav" href="#capability" style={{ color: '#FFFFFF' }} onClick={() => setMenuOpen(false)}>Capability</a>
          <a className="contact-link" href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
        </nav>
      </header>

      <section id="top" className="hero">
        <div className="hero-image" />
        <Starfield />
        <div className="hero-overlay" style={{ background: 'linear-gradient(180deg, rgba(5,6,10,.42) 0%, rgba(5,6,10,.10) 35%, rgba(5,6,10,.58) 80%, #08090C 100%)' }} />
        <div className="hero-content" style={{ paddingBottom: 'clamp(72px, 12vh, 140px)' }}>
          <p className="location">Greater Manchester, UK</p>
          <h1>Alex Charnock</h1>
          <p className="intro">I spent six years working on inpatient mental health wards, which is where I learned how easily a process breaks. Then I taught myself to build software, and now I build the tools that fix those processes: frontend, backend, optimisation engine, deployment, real users.</p>
          <div className="button-row">
            <a className="button button--light" href="#allocateit">AllocateIT case study <span>↓</span></a>
            <a className="button button--outline" href="https://github.com/IntropicAC" target="_blank" rel="noreferrer">GitHub</a>
            <a className="button button--outline" href="Alex-Charnock-CV.pdf" target="_blank" rel="noreferrer">View CV</a>
          </div>
        </div>
      </section>

      <section id="crossing" className="section crossing-section">
        <p className="eyebrow" data-reveal>The crossing</p>
        <h2 className="section-title crossing-title" data-reveal>Two very different worlds, one path.</h2>
        <p className="lead" data-reveal>Healthcare operations on one side, software on the other. They aren&apos;t two separate careers. The second one only exists because of what I saw in the first.</p>
        <p className="timeline-prompt" data-reveal>Tap any of the six points to read it</p>
        <div className="timeline">
          <div className="timeline-scroll" ref={timelineScrollRef}>
            <div className="timeline-track" ref={timelineRef}>
              <div className="timeline-line" />
              <div className="timeline-progress" style={{ width: markerX === null ? `${((active + 0.5) / NODES.length) * 100}%` : `${markerX}px`, backgroundColor: activeNode.tint }} />
              <span className="timeline-marker" style={{ left: markerX === null ? `${((active + 0.5) / NODES.length) * 100}%` : `${markerX}px`, backgroundColor: activeNode.tint, boxShadow: `0 0 0 6px ${activeNode.tint}22, 0 0 20px ${activeNode.tint}b3` }} />
              <div className="timeline-buttons">
                {NODES.map((node, index) => {
                  const selected = index === active;
                  const hot = index === hover && !selected;
                  return <button key={node.year} ref={(element) => { timelineNodeRefs.current[index] = element; }} className={`timeline-button ${selected ? 'is-active' : ''} ${hot ? 'is-hovered' : ''}`} style={{ '--tint': node.tint }} onClick={() => setActive(index)} onMouseEnter={() => setHover(index)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(index)} onBlur={() => setHover(null)} aria-pressed={selected}>
                    <span className="timeline-dot" /><span className="timeline-stem" /><span className="timeline-year">{node.year}</span><span className="timeline-label">{node.short}</span>
                  </button>;
                })}
              </div>
            </div>
          </div>
          <div className="timeline-copy">
            <p className="eyebrow" style={{ color: activeNode.tint }}>{activeNode.kicker}</p>
            <h3>{activeNode.title}</h3>
            <p>{activeNode.body}</p>
          </div>
        </div>
      </section>

      <section id="allocateit" ref={solverRef} className="allocate-section">
        <div className="section">
          <p className="eyebrow" data-reveal>Flagship product · case study</p>
          <h2 className="product-title" data-reveal>AllocateIT</h2>
          <p className="product-intro" data-reveal>A staff observation allocation and optimisation tool for mental health inpatient wards. It helps nurses put together allocations that are fairer, faster and more consistent. The software does the awkward arithmetic and the nurse still makes the decision.</p>
          <div className="button-row product-actions">
            <a className="button button--teal" href="https://www.allocateit.co.uk" target="_blank" rel="noreferrer">allocateit.co.uk</a>
            <a className="button button--outline" href="https://youtu.be/l3bs_asxHqg" target="_blank" rel="noreferrer">Watch the demo</a>
          </div>

          <div className="solver" data-reveal>
            <div className="solver-top"><p>Live sketch · one ward, 7 staff, 08:00–19:00</p><button className={`solver-button ${solved ? 'solver-button--reset' : ''}`} onClick={() => setSolved((current) => !current)}>{solved ? 'Reset to hand-built' : 'Run the solver'}</button></div>
            <div className="solver-content">
              <div className="allocation-wrap"><div className="allocation-grid" style={{ gridTemplateColumns: `78px repeat(${STAFF.length}, minmax(0, 1fr))`, minWidth: '520px' }}>
                <div />
                {STAFF.map((staff) => <span className="staff-name" style={{ justifyContent: 'center', textAlign: 'center' }} key={staff}>{staff}</span>)}
                {HOURS.flatMap((hour, hourIndex) => [
                  <span className="hour" style={{ justifyContent: 'flex-start' }} key={`hour-${hour}`}>{hour}</span>,
                  ...matrix.map((row, staffIndex) => {
                    const code = row[hourIndex];
                    const closeRepeat = isObservation(code) && row.some((other, otherHour) => otherHour !== hourIndex && other === code && Math.abs(otherHour - hourIndex) <= 2);
                    const violates = !solved && closeRepeat;
                    return <span key={`${hourIndex}-${staffIndex}`} className={cellClass(code, violates)}>{code}</span>;
                  }),
                ])}
              </div></div>
              <div className="solver-stats">
                <div><p className="stat-label">Observation load</p>{observationCounts.map((count, index) => <div className="load" key={STAFF[index]}><span>{STAFF[index]}</span><i><b style={{ width: `${count / Math.max(...observationCounts, 1) * 100}%`, backgroundColor: solved ? '#46D6C6' : '#FF5A2C' }} /></i><em>{count}</em></div>)}</div>
                <div className="spread"><p className="stat-label">Observation-load spread</p><strong className={solved ? 'teal' : 'orange'}>{spread === 0 ? 'Even' : `±${spread}`}</strong><p>Difference between the heaviest and lightest observation load across the visible timeframe.</p><div><p className="stat-label">Same-observation close repeats</p><strong className={closeSameObservationRepeats === 0 ? 'teal' : 'orange'}>{closeSameObservationRepeats}</strong><p>Repeated Bed 1, Bed 2, or Generals assignments within two hours.</p></div><p>{solved ? 'Solved: the schedule balances observation demand and spaces repeated observations apart, alongside break timing and locked duties.' : 'Unsolved: the same observation is repeated too soon and observation demand is concentrated on fewer people.'}</p></div>
              </div>
            </div>
            <div className="solver-legend"><span className="legend-bed-one">Bed 1 observation</span><span className="legend-bed-two">Bed 2 observation</span><span className="legend-general">Generals is ward cover</span><span className="legend-break">break is a staff break</span><span>— is unassigned</span></div>
          </div>
          <p className="small-note">This is an anonymised example allocation. A real allocation usually spans 12 hours, can involve up to 10 observation types and 24 staff, and factors many operational constraints alongside workload balance and spacing. The pre-solver view shows how quickly those decisions become harder to manage by hand.</p>

          <div className="three-columns case-study-copy">
            <CopyBlock label="Problem" colour="orange">Observation allocations were written out by hand at the start of every shift. They ate time nurses didn&apos;t have, they changed depending on who was doing them, and the same people quietly ended up with the heaviest observations. I watched that happen for six years before I had the skills to do anything about it.</CopyBlock>
            <CopyBlock label="Thinking" colour="gold">Allocation is really a constraint problem rather than a spreadsheet problem. Some rules can never be broken, like observation requirements, sex matching and skill mix. Others are preferences you trade off against each other: fairness, where breaks land, not giving someone the same job twice in a row. That split became the hard constraints and the scored soft constraints in the CP-SAT model.</CopyBlock>
            <CopyBlock label="The nurse decides" colour="teal">The tool suggests an allocation. The nurse in charge reviews it, edits it and signs it off. It&apos;s an operational support tool I developed independently. It isn&apos;t NHS approved or clinically certified, and I make no claims about clinical outcomes.</CopyBlock>
          </div>

          <div className="build-section" data-reveal><h3>How it&apos;s put together</h3><div className="architecture-grid"><Architecture label="Client" colour="teal">React frontend on Vercel with Auth0 and MFA in front of it. Ward setup, staff list, observation requirements and the editable allocation table all live here.<small>React · JavaScript · Auth0 · Vercel</small></Architecture><Architecture label="API" colour="gold">A Python and Flask REST API on Railway. Every request is schema validated and sanitised, CORS is restricted to known origins, and identifying detail is stripped out before anything reaches the solver. Real names are mapped back on the client afterwards.<small>Python · Flask · REST · Railway · validation · anonymisation</small></Architecture><Architecture label="Solver" colour="orange">Google OR-Tools CP-SAT. Hard constraints decide what is allowed and a weighted score decides what is good. Pruning the search space keeps a full shift inside a response time a nurse will actually wait for.<small>OR-Tools · CP-SAT · scoring · pruning</small></Architecture></div></div>
          <div className="image-copy-grid"><a className="image-link" data-reveal href="https://www.allocateit.co.uk" target="_blank" rel="noreferrer" aria-label="Open AllocateIT website"><div className="image-frame"><img src="images/allocateit-home.png" alt="AllocateIT homepage showing the allocation table" /></div></a><div data-reveal><p className="eyebrow">Real use, and what came next</p><p>Healthcare staff have used it informally and given me honest feedback, and most of the changes I&apos;ve made came straight out of that. From there I wrote a structured pilot proposal and have had discussions covering healthcare and information governance, data protection, clinical safety, implementation, evaluation, procurement and how you&apos;d actually show operational value.</p><p>The thing I didn&apos;t expect: the constraint model was the easy half. Consent, data handling, governance and whether the tool fits into a handover conversation are what decide if it ever gets used.</p></div></div>
        </div>
      </section>

      <section id="clients" className="section bordered"><SectionHeading eyebrow="Paid client work">Someone else&apos;s brand, someone else&apos;s deadline.</SectionHeading><div className="client-list"><Client name="Sam Murgatroyd" label="Client · coaching and author brand" image="images/client-sam.png" imageAlt="Perception 47 Coaching homepage, built for author Sam Murgatroyd" live="https://www.sam-murgatroyd.co.uk/" source="https://github.com/IntropicAC/sam-mugatroyd-website">Sam is a mindset coach and published author, and the site carries both: the Perception 47 Coaching brand, his books on Amazon and a booking flow for free intro calls. I did the design, build, deployment, domain and DNS, analytics and search presence. Most of the work was translation, taking how he describes what he does and turning it into pages people can read and act on. I also built a custom AI chatbot for the site, grounded in his own material and his course, so visitors can ask about his approach and get answers in his voice instead of digging through pages.<small>TypeScript · responsive UI · AI chatbot · SEO · GA4 · DNS</small></Client><Client reverse name="The Leadership Method" label="Client · coaching business" image="images/client-tlm.png" imageAlt="The Leadership Method homepage" live="https://www.theleadershipmethod.co.uk/" source="https://github.com/IntropicAC/TheLeadershipMethod">A consultancy that helps organisations improve performance through stronger leadership and healthier cultures. I gathered the requirements from the owner, worked out a page structure that explains the services and brings in enquiries, then built it, deployed it and handed it over.<small>JavaScript · Vercel · custom domain · content structure</small></Client></div></section>

      <section id="capability" className="section capability-section"><SectionHeading eyebrow="Capability, with evidence">What I can do, and where I&apos;ve had to do it for real.</SectionHeading><div className="capability-grid">{CAPABILITIES.map(([area, claim, evidence, stack]) => <article data-reveal key={area}><p className="eyebrow">{area}</p><h3>{claim}</h3><p>{evidence}</p><small>{stack}</small></article>)}</div></section>

      <section id="archive" className="section archive-section"><div className="archive-heading" data-reveal><p className="eyebrow">Where I started</p><a href="https://github.com/IntropicAC" target="_blank" rel="noreferrer">All repositories ↗</a></div><p className="archive-intro" data-reveal>Back in 2023: static pages, layout practice and a styling cheatsheet I wrote for myself. I&apos;ve left them here on purpose. The gap between these and AllocateIT is the point.</p><div className="archive-grid">{[['images/archive-trading-club.png', 'Stock Trading Club · HTML/CSS'], ['images/archive-tea-cozy.png', 'Tea Cozy · flexbox drill'], ['images/archive-style-guide.png', 'Styling cheatsheet · first design system']].map(([image, caption]) => <figure key={image}><div><img src={image} alt="" /></div><figcaption>{caption}</figcaption></figure>)}</div><div className="repo-links">{REPOSITORIES.map(([name, href]) => <a key={name} href={href} target="_blank" rel="noreferrer">{name}</a>)}</div></section>

      <section id="background" className="section background-section"><div data-reveal><p className="eyebrow">The other six years</p><h2>Inpatient mental health, from 2019.</h2><p>Senior healthcare and security lead responsibilities on inpatient wards, including a psychiatric intensive care unit. Risk management and de-escalation with real pressure attached. I took procedures that everyone was doing slightly differently, standardised them, wrote the documentation and training pack behind them, and delivered that training to over 40 staff. All of it alongside senior management, in a regulated environment, handling sensitive information every shift.</p><p>It&apos;s also where I learned to properly understand a workflow before suggesting you change it, which is honestly the part of software work I&apos;m best at.</p></div><div className="background-list" data-reveal><Info label="Education">BSc Psychology, 2:1, University of Salford</Info><Info label="Self-directed study">Codecademy development tracks, plus CompTIA A+ and Security+ study material (not certified)</Info><Info label="Moving toward">Software development · solutions engineering · AI and automation implementation · health-tech · technical consulting and SaaS implementation</Info></div></section>

      <footer id="contact" className="footer"><div className="footer-image" /><div className="footer-overlay" /><div className="footer-content"><h2>Got a problem at work that nobody has built anything for yet?</h2><div className="button-row"><button className={`button email-button ${copied ? 'email-button--copied' : ''}`} onClick={copyEmail}>{copied ? 'Copied to clipboard' : 'alexccharnock50@hotmail.com'}</button><a className="button button--outline" href="mailto:alexccharnock50@hotmail.com">Open in mail app</a><a className="button button--outline" href="Alex-Charnock-CV.pdf" target="_blank" rel="noreferrer">Download CV</a><a className="button button--outline" href="https://github.com/IntropicAC" target="_blank" rel="noreferrer">GitHub</a></div><div className="footer-bottom"><span>Alex Charnock · Greater Manchester, UK</span><span>Designed and built by me · {new Date().getFullYear()}</span></div></div></footer>
    </main>
  );
}

function CopyBlock({ label, colour, children }) { return <div data-reveal><p className={`eyebrow ${colour}`}>{label}</p><p>{children}</p></div>; }
function Architecture({ label, colour, children }) { return <div><p className={`eyebrow ${colour}`}>{label}</p><p>{children}</p></div>; }
function Info({ label, children }) { return <div><p className="eyebrow">{label}</p><p>{children}</p></div>; }
function Client({ name, label, image, imageAlt, live, source, reverse, children }) { return <article className={`client ${reverse ? 'client--reverse' : ''}`} data-reveal><a className="image-link" href={live} target="_blank" rel="noreferrer" aria-label={`Open ${name} website`}><div className="image-frame"><img src={image} alt={imageAlt} /></div></a><div><p className="eyebrow teal">{label}</p><h3>{name}</h3><p>{children}</p><div className="text-links"><a href={live} target="_blank" rel="noreferrer">Live site ↗</a><a href={source} target="_blank" rel="noreferrer">Source ↗</a></div></div></article>; }
