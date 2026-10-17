// ——————————————————————————————————————————————————————————
//  🎵 GOLDEN MUSIC — գլխավոր էջի երաժշտությունը
//
//  Արենի պատվերը՝ 5 ոճ, ամեն ոճից 10 մեղեդի = 50 երգ։
//  Մեկը պրծնում է — ինքնաբերաբար անցնում է հաջորդին։
//
//  Ոչ մի ձայնագրություն չկա — ամեն նոտա այստեղ՝ տեղում է ծնվում
//  (Web Audio)։ Ամեն երգ ունի իր համարը, ու այդ համարից միշտ
//  նույն մեղեդին է դուրս գալիս — պատահական աղմուկ չէ։
// ——————————————————————————————————————————————————————————
(function () {
  'use strict';

  var ls = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, String(v)); } catch (e) {} }
  };

  var ggLang = ls.get('gg-lang', 'hy');
  var NAMES = {
    hy: ['Հայկական', 'Դաշնամուր', '8-բիթ', 'Տիեզերական', 'Ռիթմիկ'],
    ru: ['Армянская', 'Пианино', '8-бит', 'Космос', 'Ритм'],
    en: ['Armenian', 'Piano', '8-bit', 'Space', 'Rhythm'],
    pt: ['Arménia', 'Piano', '8-bit', 'Espaço', 'Ritmo'],
    es: ['Armenia', 'Piano', '8 bits', 'Espacio', 'Ritmo'],
    fr: ['Arménie', 'Piano', '8-bit', 'Espace', 'Rythme'],
    de: ['Armenisch', 'Klavier', '8-Bit', 'Weltraum', 'Rhythmus'],
    ja: ['アルメニア', 'ピアノ', '8ビット', 'うちゅう', 'リズム'],
    zh: ['亚美尼亚', '钢琴', '8位', '太空', '节奏'],
    it: ['Armenia', 'Piano', '8-bit', 'Spazio', 'Ritmo'],
    ka: ['სომხური', 'პიანინო', '8-ბიტი', 'კოსმოსი', 'რიტმი'],
    hi: ['आर्मीनिया', 'पियानो', '8-बिट', 'अंतरिक्ष', 'ताल'],
  };
  var MUSIC_T = {
    hy: 'Երաժշտություն', ru: 'Музыка', en: 'Music', pt: 'Música', es: 'Música', fr: 'Musique',
    de: 'Musik', ja: '音楽', zh: '音乐', it: 'Musica', ka: 'მუსიკა', hi: 'संगीत',
  };
  var NM = NAMES[ggLang] || NAMES.hy;
  var MT = MUSIC_T[ggLang] || MUSIC_T.hy;

  // ——— Ոճերը ———————————————————————————————————————————————
  // scale՝ քանի՞ կիսատոն է ամեն աստիճանը արմատից
  var STYLES = [
    { // 🇦🇲 Հայկական — դուդուկի պես, հիջազ լադով
      root: 62, scale: [0, 1, 4, 5, 7, 8, 10], bpm: [62, 78], wave: 'triangle',
      atk: 0.14, rel: 0.5, vib: 5.2, bars: 8, bassOct: -12, drums: false, warm: true
    },
    { // 🎹 Դաշնամուր — մաժոր պենտատոնիկա, միշտ քաղցր է հնչում
      root: 60, scale: [0, 2, 4, 7, 9], bpm: [72, 92], wave: 'triangle',
      atk: 0.006, rel: 1.3, vib: 0, bars: 8, bassOct: -24, drums: false, warm: false
    },
    { // 🕹 8-բիթ — քառակուսի ալիք, արագ ու ուրախ
      root: 72, scale: [0, 2, 4, 5, 7, 9, 11], bpm: [120, 150], wave: 'square',
      atk: 0.004, rel: 0.14, vib: 0, bars: 8, bassOct: -24, drums: true, warm: false
    },
    { // ✨ Տիեզերական — դանդաղ, երազային
      root: 57, scale: [0, 3, 5, 7, 10], bpm: [48, 60], wave: 'sine',
      atk: 0.5, rel: 1.8, vib: 2.4, bars: 8, bassOct: -12, drums: false, warm: true
    },
    { // 🥁 Ռիթմիկ — դորիական, թմբուկներով
      root: 57, scale: [0, 2, 3, 5, 7, 9, 10], bpm: [96, 116], wave: 'sawtooth',
      atk: 0.01, rel: 0.3, vib: 0, bars: 8, bassOct: -12, drums: true, warm: false
    },
  ];
  var PER_STYLE = 10;
  var TOTAL = STYLES.length * PER_STYLE;

  // ——— Փոքրիկ պատահականություն, որ ամեն երգ միշտ նույնը լինի ———
  function rngFrom(seed) {
    var a = (seed * 1973 + 90127) >>> 0;
    return function () {
      a += 0x6D2B79F5; a >>>= 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), 1 | t);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function pick(r, arr) { return arr[Math.floor(r() * arr.length) % arr.length]; }
  function midiHz(m) { return 440 * Math.pow(2, (m - 69) / 12); }

  // ——— Երգը հյուսելը ————————————————————————————————————————
  // Չորս տող ենք սարքում՝ Ա · Ա՛ · Բ · Ա՛՛, ինչպես իսկական երգերում։
  // Կրկնությունն է, որ մեղեդին հիշվող է դարձնում։
  var RHY = [[1, 1, 2], [2, 2], [0.5, 0.5, 1, 2], [1, 0.5, 0.5, 2], [1, 1, 1, 1], [2, 1, 1], [0.5, 0.5, 0.5, 0.5, 2]];
  var PROGS = [[0, 4, 2, 3], [0, 3, 4, 0], [0, 2, 3, 4], [0, 4, 3, 0], [0, 5, 3, 4]];

  function buildTrack(n) {
    var st = STYLES[Math.floor(n / PER_STYLE)];
    var r = rngFrom(n * 7919 + 13);
    var bpm = Math.round(st.bpm[0] + r() * (st.bpm[1] - st.bpm[0]));
    var beat = 60 / bpm;
    var prog = pick(r, PROGS);
    var sc = st.scale, L = sc.length;

    function deg(d) {           // աստիճանից՝ նոտա (օկտավաները ներառյալ)
      var o = Math.floor(d / L), i = ((d % L) + L) % L;
      return st.root + sc[i] + 12 * o;
    }

    // մեկ տող = 4 հարված
    function line(start, chord, endOnRoot) {
      var out = [], rh = pick(r, RHY), t = 0, d = chord;
      for (var i = 0; i < rh.length; i++) {
        var dur = rh[i];
        if (r() < 0.12 && i > 0) { t += dur; continue; }   // փոքրիկ լռություն
        var step = Math.floor(r() * 5) - 2;                // հիմնականում քայլ առ քայլ
        d += step;
        if (d > L + 2) d -= L;
        if (d < -1) d += L;
        if (endOnRoot && i === rh.length - 1) d = chord;
        out.push({ t: start + t * beat, dur: dur * beat, m: deg(d) });
        t += dur;
      }
      return out;
    }

    var notes = [], bass = [], perc = [];
    var barBeats = 4, pos = 0;
    for (var b = 0; b < st.bars; b++) {
      var chord = prog[b % prog.length];
      var isLast = (b % 4) === 3;
      var ln;
      if (b % 4 === 1 && notes.length) {
        // Ա՛ — կրկնում ենք նախորդ տողը, վերջին նոտան՝ ուրիշ
        ln = notes.slice(-lastLen).map(function (x) { return { t: x.t + barBeats * beat, dur: x.dur, m: x.m }; });
        if (ln.length) ln[ln.length - 1].m = deg(chord + 2);
      } else {
        ln = line(pos, chord, isLast);
      }
      var lastLen = ln.length;
      notes = notes.concat(ln);

      // բաս՝ հարվածի վրա
      bass.push({ t: pos, dur: beat * 1.8, m: deg(chord) + st.bassOct });
      if (st.drums || r() < 0.4) bass.push({ t: pos + 2 * beat, dur: beat * 1.4, m: deg(chord) + st.bassOct });

      if (st.drums) {
        for (var k = 0; k < 4; k++) {
          var tt = pos + k * beat;
          if (k === 0 || k === 2) perc.push({ t: tt, k: 'kick' });
          if (k === 1 || k === 3) perc.push({ t: tt, k: 'snare' });
          perc.push({ t: tt + beat * 0.5, k: 'hat' });
        }
      }
      pos += barBeats * beat;
    }

    // ամբողջ ձևը հնչում է երկու անգամ
    var one = pos, all = [];
    function add(arr, kind) {
      for (var i = 0; i < arr.length; i++) {
        all.push({ t: arr[i].t, dur: arr[i].dur, m: arr[i].m, k: kind || arr[i].k });
        all.push({ t: arr[i].t + one, dur: arr[i].dur, m: arr[i].m, k: kind || arr[i].k });
      }
    }
    add(notes, 'lead'); add(bass, 'bass'); add(perc, null);
    all.sort(function (a, b2) { return a.t - b2.t; });
    return { ev: all, len: one * 2 + beat * 2, st: st };
  }

  // ——— Ձայնը ——————————————————————————————————————————————
  var ctx = null, master = null, noise = null, playing = false;
  var idx = Math.max(0, Math.min(TOTAL - 1, parseInt(ls.get('gg-music-at', '0'), 10) || 0));
  var track = null, t0 = 0, cur = 0, timer = 0;

  function makeNoise() {
    var n = ctx.sampleRate * 0.4, buf = ctx.createBuffer(1, n, ctx.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  function voice(e, when) {
    var st = track.st;
    var g = ctx.createGain();
    g.connect(master);
    if (e.k === 'lead' || e.k === 'bass') {
      var hz = midiHz(e.m);
      var o = ctx.createOscillator();
      o.type = e.k === 'bass' ? (st.wave === 'square' ? 'triangle' : 'sine') : st.wave;
      o.frequency.value = hz;
      o.connect(g);
      var o2 = null;
      if (st.warm && e.k === 'lead') {       // երկրորդ ձայնը՝ մի քիչ շեղ, ջերմության համար
        o2 = ctx.createOscillator();
        o2.type = st.wave; o2.frequency.value = hz; o2.detune.value = 7;
        o2.connect(g);
      }
      var lfo = null, lg = null;
      if (st.vib && e.k === 'lead') {
        lfo = ctx.createOscillator(); lg = ctx.createGain();
        lfo.frequency.value = st.vib; lg.gain.value = hz * 0.009;
        lfo.connect(lg); lg.connect(o.frequency);
        lfo.start(when); lfo.stop(when + e.dur + st.rel + 0.1);
      }
      var vol = e.k === 'bass' ? 0.16 : 0.13;
      g.gain.setValueAtTime(0.0001, when);
      g.gain.exponentialRampToValueAtTime(vol, when + Math.max(0.004, st.atk));
      g.gain.exponentialRampToValueAtTime(0.0001, when + e.dur + st.rel);
      o.start(when); o.stop(when + e.dur + st.rel + 0.05);
      if (o2) { o2.start(when); o2.stop(when + e.dur + st.rel + 0.05); }
    } else {
      var s = ctx.createBufferSource();
      s.buffer = noise;
      var f = ctx.createBiquadFilter();
      var dur = 0.12, vol2 = 0.1;
      if (e.k === 'kick') {
        var ko = ctx.createOscillator();
        ko.type = 'sine';
        ko.frequency.setValueAtTime(140, when);
        ko.frequency.exponentialRampToValueAtTime(45, when + 0.11);
        ko.connect(g);
        g.gain.setValueAtTime(0.22, when);
        g.gain.exponentialRampToValueAtTime(0.0001, when + 0.16);
        ko.start(when); ko.stop(when + 0.18);
        return;
      }
      if (e.k === 'snare') { f.type = 'bandpass'; f.frequency.value = 1700; dur = 0.13; vol2 = 0.09; }
      else { f.type = 'highpass'; f.frequency.value = 7200; dur = 0.045; vol2 = 0.05; }
      s.connect(f); f.connect(g);
      g.gain.setValueAtTime(vol2, when);
      g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
      s.start(when); s.stop(when + dur + 0.02);
    }
  }

  function loadTrack(n) {
    idx = ((n % TOTAL) + TOTAL) % TOTAL;
    ls.set('gg-music-at', idx);
    track = buildTrack(idx);
    cur = 0;
    t0 = ctx.currentTime + 0.25;
    label();
  }

  function tick() {
    if (!playing || !track) return;
    if (ls.get('gg-muted', '0') === '1') { master.gain.value = 0; } else { master.gain.value = 0.9; }
    var ahead = ctx.currentTime - t0 + 0.3;
    while (cur < track.ev.length && track.ev[cur].t <= ahead) {
      var e = track.ev[cur++];
      try { voice(e, t0 + e.t); } catch (err) {}
    }
    if (ctx.currentTime - t0 > track.len) loadTrack(idx + 1);
  }

  // ——— Կոճակն ու պիտակը ————————————————————————————————————
  var btn = null, tag = null;
  function label() {
    if (!tag || !playing) return;
    var s = Math.floor(idx / PER_STYLE), n = (idx % PER_STYLE) + 1;
    tag.textContent = '🎵 ' + NM[s] + ' · ' + n + '/' + PER_STYLE;
    tag.style.opacity = '1';
    clearTimeout(tag._t);
    tag._t = setTimeout(function () { tag.style.opacity = '0'; }, 2600);
  }

  function start() {
    if (playing) return;
    try {
      if (!ctx) {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        master = ctx.createGain(); master.gain.value = 0.9;
        var out = ctx.createGain(); out.gain.value = 0.17;
        master.connect(out); out.connect(ctx.destination);
        noise = makeNoise();
      }
      if (ctx.state === 'suspended') ctx.resume();
    } catch (e) { return; }
    playing = true;
    loadTrack(idx);
    clearInterval(timer);
    timer = setInterval(tick, 25);
    paint();
  }

  function stop() {
    playing = false;
    clearInterval(timer);
    try { if (ctx) ctx.suspend(); } catch (e) {}
    if (tag) tag.style.opacity = '0';
    paint();
  }

  function paint() {
    if (!btn) return;
    btn.textContent = playing ? '🎵' : '🎵';
    btn.className = playing ? '' : 'off';
    btn.style.opacity = playing ? '1' : '0.55';
    btn.title = MT + (playing ? ' ✓' : ' ✕');
  }

  function wantOn() { return ls.get('gg-music', 'on') !== 'off'; }

  function mount() {
    var bar = document.getElementById('ggBar');
    btn = document.createElement('button');
    btn.id = 'ggMusicBtn';
    btn.textContent = '🎵';
    btn.title = MT;
    btn.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      if (playing) { ls.set('gg-music', 'off'); stop(); }
      else { ls.set('gg-music', 'on'); start(); }
    });
    if (bar) bar.appendChild(btn);
    else {
      btn.style.cssText = 'position:fixed;top:10px;right:10px;z-index:120;width:38px;height:38px;' +
        'border-radius:12px;border:2px solid rgba(255,255,255,0.4);background:rgba(20,26,34,0.75);' +
        'color:#f5eede;font-size:1rem;padding:0;line-height:1';
      document.body.appendChild(btn);
    }

    tag = document.createElement('div');
    tag.id = 'ggMusicTag';
    tag.style.cssText = 'position:fixed;top:54px;right:10px;z-index:119;opacity:0;transition:opacity 0.4s;' +
      'background:rgba(20,26,34,0.82);border:2px solid rgba(255,209,102,0.5);color:#ffd166;' +
      'padding:4px 10px;border-radius:10px;font-size:0.72rem;pointer-events:none;white-space:nowrap;' +
      'font-family:"Arial Rounded MT Bold","Noto Sans Armenian",Arial,sans-serif';
    document.body.appendChild(tag);
    paint();

    // Արենը խնդրեց՝ ինքը միանա։ Դիտարկիչները ձայնը թույլ չեն տալիս
    // մինչև առաջին հպումը, ուստի հենց առաջին հպմանն է սկսում։
    if (wantOn()) {
      start();
      if (!playing || (ctx && ctx.state !== 'running')) {
        var go = function () {
          document.removeEventListener('pointerdown', go, true);
          document.removeEventListener('touchstart', go, true);
          document.removeEventListener('keydown', go, true);
          if (wantOn()) start();
        };
        document.addEventListener('pointerdown', go, true);
        document.addEventListener('touchstart', go, true);
        document.addEventListener('keydown', go, true);
      }
    }
  }

  // Էջը թաքցնելիս դադար, վերադառնալիս՝ շարունակում ենք
  document.addEventListener('visibilitychange', function () {
    if (!ctx || !playing) return;
    try { if (document.hidden) ctx.suspend(); else ctx.resume(); } catch (e) {}
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(mount, 60); });
  else setTimeout(mount, 60);
})();
