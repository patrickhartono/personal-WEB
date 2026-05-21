/* =========================================================================
   p5.js computational sketches — instance mode, one per slide that needs it.
   Each factory returns a p5 instance setup function. Sketches are created
   when their slide becomes active (+/- 1) and destroyed when it leaves.
   ========================================================================= */

const CYAN  = '#5eead4';
const AMBER = '#fbbf24';
const BG    = '#0a0a0f';
const MUTE  = '#3a3a45';

/* Read current sketch background from CSS variables.
   Lets sketches respect dark/light theme. */
function sketchBg() {
  const cs = getComputedStyle(document.documentElement);
  return [
    parseInt(cs.getPropertyValue('--sketch-bg-r')) || 10,
    parseInt(cs.getPropertyValue('--sketch-bg-g')) || 10,
    parseInt(cs.getPropertyValue('--sketch-bg-b')) || 15,
  ];
}

const SKETCHES = {
  /* --------------------------------------------------------------------
     opening — waveform dissolving into a particle field
     -------------------------------------------------------------------- */
  opening(p) {
    let particles = [];
    let t = 0;
    p.setup = () => {
      const c = p.createCanvas(p._userNode.offsetWidth, p._userNode.offsetHeight);
      for (let i = 0; i < 240; i++) {
        particles.push({
          x: p.random(p.width), y: p.height/2 + p.random(-2,2),
          vx: p.random(-0.2,0.6), vy: p.random(-0.4,0.4),
          life: p.random(120,420), max: 540, seed: p.random(1000),
        });
      }
    };
    p.windowResized = () => p.resizeCanvas(p._userNode.offsetWidth, p._userNode.offsetHeight);
    p.draw = () => {
      { const [r,g,b] = sketchBg(); p.background(r, g, b, 28); }
      t += 0.012;
      // waveform line — amber, slowly fading
      const wAlpha = p.map(p.sin(t*0.4), -1, 1, 90, 180);
      p.stroke(251, 191, 36, wAlpha);
      p.strokeWeight(1.4);
      p.noFill();
      p.beginShape();
      for (let x = 0; x <= p.width; x += 6) {
        const n = p.noise(x*0.004, t*0.5);
        const y = p.height/2 + p.sin(x*0.02 + t)*60*n + (n-0.5)*120;
        p.vertex(x, y);
      }
      p.endShape();
      // particles dispersing upward and outward
      p.noStroke();
      for (const pt of particles) {
        pt.x += pt.vx;
        pt.y += pt.vy + p.noise(pt.seed, t*0.4)*0.4 - 0.2;
        pt.life += 1;
        if (pt.life > pt.max || pt.x > p.width + 8 || pt.y < -8 || pt.y > p.height+8) {
          pt.x = p.random(p.width*0.1, p.width*0.6);
          pt.y = p.height/2 + p.random(-1,1);
          pt.life = 0;
          pt.vx = p.random(-0.2, 0.7);
          pt.vy = p.random(-0.6, 0.6);
        }
        const a = p.map(pt.life, 0, pt.max, 200, 0);
        const dx = pt.x / p.width; // shift hue along x
        if (dx < 0.45) p.fill(251, 191, 36, a);
        else           p.fill(94, 234, 212, a*0.85);
        p.circle(pt.x, pt.y, 1.6);
      }
    };
  },

  /* --------------------------------------------------------------------
     sound-as-material — oscillating multi-frequency waveform (amber)
     -------------------------------------------------------------------- */
  soundMaterial(p) {
    let t = 0;
    p.setup = () => p.createCanvas(p._userNode.offsetWidth, p._userNode.offsetHeight);
    p.windowResized = () => p.resizeCanvas(p._userNode.offsetWidth, p._userNode.offsetHeight);
    p.draw = () => {
      { const [r,g,b] = sketchBg(); p.background(r, g, b); }
      t += 0.018;
      p.noFill();
      const layers = 5;
      for (let l = 0; l < layers; l++) {
        const alpha = 220 - l*38;
        p.stroke(251, 191, 36, alpha);
        p.strokeWeight(1 + (layers - l)*0.35);
        p.beginShape();
        const freq = 0.008 + l*0.004;
        const amp  = 60 + l*20;
        const phase = t*(1 + l*0.3);
        for (let x = 0; x <= p.width; x += 4) {
          const y = p.height/2
            + p.sin(x*freq + phase)*amp
            + p.sin(x*freq*2.7 + phase*1.4)*amp*0.4
            + p.noise(x*0.002, t*0.5 + l)*40 - 20;
          p.vertex(x, y);
        }
        p.endShape();
      }
    };
  },

  /* --------------------------------------------------------------------
     image-computed — generative noise field (cyan)
     -------------------------------------------------------------------- */
  noiseField(p) {
    let t = 0;
    p.setup = () => {
      p.createCanvas(p._userNode.offsetWidth, p._userNode.offsetHeight);
      p.noStroke();
    };
    p.windowResized = () => p.resizeCanvas(p._userNode.offsetWidth, p._userNode.offsetHeight);
    p.draw = () => {
      { const [r,g,b] = sketchBg(); p.background(r, g, b, 32); }
      t += 0.006;
      const step = 32;
      for (let x = 0; x < p.width; x += step) {
        for (let y = 0; y < p.height; y += step) {
          const n = p.noise(x*0.003, y*0.003, t);
          const r = n*step*0.9;
          const a = p.map(n, 0, 1, 30, 220);
          if (n > 0.55) p.fill(94, 234, 212, a*0.6);
          else          p.fill(94, 234, 212, a*0.2);
          p.circle(x + step/2, y + step/2, r);
        }
      }
    };
  },

  /* --------------------------------------------------------------------
     ecological — Hutan Plastik — slow noise field, earthy mixed amber
     -------------------------------------------------------------------- */
  ecological(p) {
    let t = 0;
    p.setup = () => {
      p.createCanvas(p._userNode.offsetWidth, p._userNode.offsetHeight);
      p.noStroke();
    };
    p.windowResized = () => p.resizeCanvas(p._userNode.offsetWidth, p._userNode.offsetHeight);
    p.draw = () => {
      { const [r,g,b] = sketchBg(); p.background(r, g, b); }
      t += 0.0028;
      const step = 22;
      for (let y = 0; y < p.height; y += step) {
        for (let x = 0; x < p.width; x += step) {
          const n = p.noise(x*0.0022, y*0.0028, t);
          const a = p.map(n, 0, 1, 0, 140);
          // earthy palette: muted greens/browns + amber spikes
          if (n > 0.7) {
            p.fill(251, 191, 36, a);    // amber spike
          } else if (n > 0.55) {
            p.fill(120, 95, 60, a*0.7); // brown
          } else if (n > 0.35) {
            p.fill(70, 90, 70, a*0.6);  // muted green
          } else {
            p.fill(30, 40, 38, a*0.5);
          }
          p.rect(x, y, step, step);
        }
      }
    };
  },

  /* --------------------------------------------------------------------
     text-drift — characters drifting as compositional units (F2)
     -------------------------------------------------------------------- */
  textDrift(p) {
    const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·:;/—_'.split('');
    let units = [];
    let t = 0;
    p.setup = () => {
      p.createCanvas(p._userNode.offsetWidth, p._userNode.offsetHeight);
      p.textFont('JetBrains Mono, monospace');
      for (let i = 0; i < 60; i++) {
        units.push({
          x: p.random(p.width),
          y: p.random(p.height),
          ch: p.random(glyphs),
          vx: p.random(-0.25, 0.25),
          vy: p.random(-0.15, 0.15),
          size: p.random(14, 36),
          alpha: p.random(40, 200),
          seed: p.random(1000),
        });
      }
    };
    p.windowResized = () => p.resizeCanvas(p._userNode.offsetWidth, p._userNode.offsetHeight);
    p.draw = () => {
      { const [r,g,b] = sketchBg(); p.background(r, g, b, 40); }
      t += 0.008;
      for (const u of units) {
        u.x += u.vx + (p.noise(u.seed, t)-0.5)*0.6;
        u.y += u.vy + (p.noise(u.seed+99, t)-0.5)*0.4;
        if (u.x < -20) u.x = p.width + 20;
        if (u.x > p.width + 20) u.x = -20;
        if (u.y < -20) u.y = p.height + 20;
        if (u.y > p.height + 20) u.y = -20;
        if (p.random() < 0.005) u.ch = p.random(glyphs);
        const isAccent = (u.seed % 7) < 1.5;
        if (isAccent) p.fill(94, 234, 212, u.alpha);
        else          p.fill(232, 232, 236, u.alpha*0.55);
        p.textSize(u.size);
        p.text(u.ch, u.x, u.y);
      }
    };
  },

  /* --------------------------------------------------------------------
     AI — particle system reorganising on attractor logic
     -------------------------------------------------------------------- */
  attractor(p) {
    let particles = [];
    let attractors = [];
    let t = 0;
    p.setup = () => {
      p.createCanvas(p._userNode.offsetWidth, p._userNode.offsetHeight);
      for (let i = 0; i < 380; i++) {
        particles.push({
          x: p.random(p.width), y: p.random(p.height),
          vx: 0, vy: 0,
        });
      }
      for (let i = 0; i < 3; i++) {
        attractors.push({ x: p.random(p.width), y: p.random(p.height), phase: p.random(p.TWO_PI) });
      }
    };
    p.windowResized = () => p.resizeCanvas(p._userNode.offsetWidth, p._userNode.offsetHeight);
    p.draw = () => {
      { const [r,g,b] = sketchBg(); p.background(r, g, b, 22); }
      t += 0.006;
      // attractors slowly drift
      for (const a of attractors) {
        a.x = p.width/2 + p.cos(t*0.5 + a.phase)*p.width*0.32;
        a.y = p.height/2 + p.sin(t*0.7 + a.phase*1.3)*p.height*0.32;
      }
      p.noStroke();
      for (const pt of particles) {
        let fx = 0, fy = 0;
        for (const a of attractors) {
          const dx = a.x - pt.x;
          const dy = a.y - pt.y;
          const d2 = dx*dx + dy*dy + 600;
          const f  = 90 / d2;
          fx += dx*f;
          fy += dy*f;
        }
        pt.vx = pt.vx*0.94 + fx;
        pt.vy = pt.vy*0.94 + fy;
        pt.x += pt.vx;
        pt.y += pt.vy;
        if (pt.x < 0) pt.x += p.width;
        if (pt.x > p.width) pt.x -= p.width;
        if (pt.y < 0) pt.y += p.height;
        if (pt.y > p.height) pt.y -= p.height;
        const speed = p.sqrt(pt.vx*pt.vx + pt.vy*pt.vy);
        const useAmber = speed > 1.2;
        if (useAmber) p.fill(251, 191, 36, 180);
        else          p.fill(94, 234, 212, 160);
        p.circle(pt.x, pt.y, useAmber ? 2.2 : 1.6);
      }
    };
  },

  /* --------------------------------------------------------------------
     quantum — probabilistic dot cloud, multiple overlapping states
     -------------------------------------------------------------------- */
  quantum(p) {
    let t = 0;
    p.setup = () => {
      p.createCanvas(p._userNode.offsetWidth, p._userNode.offsetHeight);
      p.noStroke();
    };
    p.windowResized = () => p.resizeCanvas(p._userNode.offsetWidth, p._userNode.offsetHeight);
    p.draw = () => {
      { const [r,g,b] = sketchBg(); p.background(r, g, b, 30); }
      t += 0.005;
      const cx = p.width/2;
      const cy = p.height/2;
      const baseR = p.min(p.width, p.height)*0.32;
      // three overlapping probability shells
      const shells = [
        { color: [94, 234, 212], phase: 0,     scale: 1.0,  alpha: 90 },
        { color: [251, 191, 36], phase: 1.7,   scale: 0.78, alpha: 80 },
        { color: [232, 232, 236], phase: 3.2,  scale: 1.22, alpha: 50 },
      ];
      for (const s of shells) {
        p.fill(s.color[0], s.color[1], s.color[2], s.alpha);
        for (let i = 0; i < 240; i++) {
          const a = i / 240 * p.TWO_PI;
          const rad = baseR * s.scale * (0.78 + 0.22*p.noise(p.cos(a)*1.2, p.sin(a)*1.2, t + s.phase));
          const wob = p.noise(i*0.03, t*2 + s.phase) * 18;
          const x = cx + p.cos(a + t*0.2 + s.phase)*(rad + wob);
          const y = cy + p.sin(a + t*0.2 + s.phase)*(rad + wob);
          p.circle(x, y, 2.2);
        }
      }
      // probability cloud noise
      for (let i = 0; i < 80; i++) {
        const a = p.random(p.TWO_PI);
        const r = baseR*p.random(0.2, 1.4);
        p.fill(232, 232, 236, 22);
        p.circle(cx + p.cos(a)*r, cy + p.sin(a)*r, 1.4);
      }
    };
  },

  /* --------------------------------------------------------------------
     converging — all motifs into a single calm waveform (closing)
     -------------------------------------------------------------------- */
  converging(p) {
    let t = 0;
    let phase = 0; // 0..1 progression
    p.setup = () => p.createCanvas(p._userNode.offsetWidth, p._userNode.offsetHeight);
    p.windowResized = () => p.resizeCanvas(p._userNode.offsetWidth, p._userNode.offsetHeight);
    p.draw = () => {
      { const [r,g,b] = sketchBg(); p.background(r, g, b, 24); }
      t += 0.008;
      phase = (p.sin(t*0.18) + 1) / 2; // 0..1 oscillation
      // scattered noise (early state) fading
      p.noStroke();
      const scatterAlpha = (1 - phase) * 120;
      for (let i = 0; i < 80; i++) {
        const x = p.random(p.width);
        const y = p.random(p.height);
        p.fill(94, 234, 212, scatterAlpha*0.6);
        p.circle(x, y, 1.4);
      }
      // converging waveform — amber + cyan blend
      p.noFill();
      const yBase = p.height/2;
      // amber wave
      p.stroke(251, 191, 36, 200);
      p.strokeWeight(1.8);
      p.beginShape();
      for (let x = 0; x <= p.width; x += 4) {
        const calmAmp = 30 + phase*20;
        const y = yBase + p.sin(x*0.012 + t*0.9)*calmAmp + p.sin(x*0.04 + t)*calmAmp*0.15;
        p.vertex(x, y);
      }
      p.endShape();
      // cyan companion
      p.stroke(94, 234, 212, 160);
      p.strokeWeight(1.2);
      p.beginShape();
      for (let x = 0; x <= p.width; x += 4) {
        const calmAmp = 26 + phase*16;
        const y = yBase + p.sin(x*0.012 + t*0.9 + 0.6)*calmAmp;
        p.vertex(x, y);
      }
      p.endShape();
    };
  },
};

/* =========================================================================
   Sketch lifecycle manager — instantiate on slidechange, destroy on leave
   ========================================================================= */
(function() {
  const live = new Map(); // node -> p5 instance

  function mount(node) {
    if (live.has(node)) return;
    const kind = node.dataset.sketch;
    const factory = SKETCHES[kind];
    if (!factory) return;
    const inst = new p5(factory, node);
    live.set(node, inst);
  }
  function unmount(node) {
    const inst = live.get(node);
    if (!inst) return;
    inst.remove();
    live.delete(node);
  }

  function refresh() {
    const stage = document.querySelector('deck-stage');
    if (!stage) return;
    const slides = Array.from(stage.children);
    const active = stage.querySelector('section[data-deck-active]') || slides[0];
    const idx = slides.indexOf(active);
    const keep = new Set([slides[idx], slides[idx - 1], slides[idx + 1]].filter(Boolean));
    // unmount sketches not in keep set
    for (const node of [...live.keys()]) {
      const slide = node.closest('section');
      if (!keep.has(slide)) unmount(node);
    }
    // mount sketches in keep set
    keep.forEach(slide => {
      slide.querySelectorAll('[data-sketch]').forEach(mount);
    });
  }

  function initWhenReady() {
    const stage = document.querySelector('deck-stage');
    if (!stage) { setTimeout(initWhenReady, 50); return; }
    stage.addEventListener('slidechange', refresh);
    // initial mount
    setTimeout(refresh, 100);
  }

  // Public: called when theme toggles — destroy every active sketch then
  // remount so the new background colour takes hold immediately.
  window.__remountSketches = () => {
    for (const node of [...live.keys()]) unmount(node);
    refresh();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWhenReady);
  } else {
    initWhenReady();
  }
})();
