/* EDIT THIS BLOCK: all page copy, captions, memories, notes and media live here.
   The lessons and jar notes are placeholders; replace them with real memories.
   Urdu works too: text uses dir="auto". Leave dates free of a year to reuse the letter.
   Put replacement photos/videos in assets/, then change the paths below. */
const CONTENT = {
  title: "For Ma'am Atifa Ambreen",
  date: '5 October', teacher: "Ma'am Atifa Ambreen", students: 'Abdul Wahab & Abu Bakar',
  openingNote: 'Some things are better written down.', envelopeNote: 'a little something for you',
  envelopeFor: 'For', openHint: "Tap the seal. This one's for you.", fromLabel: 'With love & respect,',
  envelopeAccessible: "Open the letter for Ma'am Atifa Ambreen", previewSalutation: "Dear Ma'am,",
  topline: 'For our favourite teacher', salutation: "Dear Ma'am Atifa Ambreen,",
  heading: "Happy Teachers' Day, Ma'am", headingLines: ["Happy Teachers' Day,", "Ma'am"], occasion: "Teachers' Day",
  teacherPhoto: 'assets/teacher.jpg',
  teacherAlt: "Ma'am Atifa Ambreen standing on stage in front of an auditorium of students.",
  photoAction: "Straighten Ma'am's photo", photoReset: "Tilt Ma'am's photo again",
  teacherCaption: 'The one who taught us more than books.',
  teacherAside: "Some teachers stay with you, long after the class is over.",
  lessonsLabel: 'a few things we carry with us', lessonsHeading: 'Things you taught us',
  lessons: [
    'To ask questions, even the small ones.',
    'To try again when we get it wrong.',
    'To be kind, even on the difficult days.',
    'To take our work a little more seriously.',
    'To believe we have something to offer.'
  ],
  lessonPostscript: 'And so much that never made it into our notebooks.',
  togetherPhoto: 'assets/together.jpg',
  togetherAlt: "Ma'am Atifa Ambreen with Abdul Wahab and Abu Bakar at an outdoor college event.",
  togetherCaption: 'Us, with our favourite teacher.', photoMargin: 'keeping this one forever.',
  extraPhotos: [
    { src: 'assets/memory-1.jpg', caption: 'From our college days.', alt: "Ma'am Atifa Ambreen and a student holding a certificate at a college event." },
    { src: 'assets/memory-2.jpg', caption: 'A day outside the classroom.', alt: "Ma'am Atifa Ambreen with her two students beside an outdoor display." },
    { src: 'assets/memory-3.jpg', caption: 'A few familiar faces.', alt: 'Teachers and students taking a photo together beside a lake.' }
  ],
  videosHeading: 'A few moments, on film.',
  videosHelp: 'Three little memories to play. Sound is controlled in each video.',
  videoFallback: 'Your browser cannot play this video.', videoDownload: 'Open the video',
  videos: [
    { src: 'assets/video-1.mp4', poster: 'assets/video-1-poster.jpg', caption: 'A moment to keep.' },
    { src: 'assets/video-2.mp4', poster: 'assets/video-2-poster.jpg', caption: 'Another little memory.' },
    { src: 'assets/video-3.mp4', poster: 'assets/video-3-poster.jpg', caption: 'One more for the scrapbook.' }
  ],
  jarHeading: 'A jar of little thank-yous', jarIntro: "We couldn't fit everything in one letter. So we saved a few little notes here.",
  jarLabel: 'little thank-yous', jarHint: 'tap the jar, pick a note', jarAction: 'Pick a new thank-you note',
  jarFirstNote: 'Eight little notes. Each one is for you.', jarFirstCount: 'PICK YOUR FIRST NOTE',
  noteCount: (current, total) => `NOTE ${current} OF ${total}`,
  notes: [
    'Thank you for making it okay to ask one more question.',
    'We still remember the little things you said to encourage us.',
    'Thank you for being patient when we needed a little more time.',
    'You made the difficult days feel a little easier.',
    'Some of our best college memories have you in them.',
    'Thank you for noticing when we were trying.',
    'We hope today makes you smile as much as you made us smile.',
    "If we could choose our teacher again, we'd choose you."
  ],
  messageHeading: 'Our message to you', messageSalutation: "Ma'am,",
  message: "We don't always say it, but we are really grateful for you. Thank you for your patience, for listening, and for caring about how we were doing. You helped us learn, but you also helped us grow a little. We hope you know how much that means to us. This is just a small thank-you from two students who will always remember you with respect and a smile.",
  signoff: 'With love and respect,', signatures: ['Abdul Wahab', 'Abu Bakar'],
  signaturePostscript: 'Always your students.', ending: "Thank you, Ma'am.",
  endingNote: 'For the lessons. And for everything in between.', replay: 'Read it again',
  footer: "Made with love by Abdul Wahab & Abu Bakar · 5 October"
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const svgNS = 'http://www.w3.org/2000/svg';
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
let scrollAnimations = [], openingAnimation, noteAnimation, petalAnimation, noteIndex = -1, isOpen = false;
let animationReady = false;
const make = (tag, className, text) => { const el = document.createElement(tag); if (className) el.className = className; if (text !== undefined) el.textContent = text; return el; };
const svgEl = (tag, attrs = {}) => { const el = document.createElementNS(svgNS, tag); Object.entries(attrs).forEach(([k,v]) => el.setAttribute(k,v)); return el; };

document.title = CONTENT.title;
$$('[data-copy]').forEach(el => { const value = CONTENT[el.dataset.copy]; if (typeof value === 'string') { el.textContent = value; el.dir = 'auto'; } });
$('.letter-preview > span').textContent = CONTENT.previewSalutation;
$('.section-label span').textContent = CONTENT.lessonsLabel;
$('#open-letter').setAttribute('aria-label', CONTENT.envelopeAccessible);
$('#teacher-photo').setAttribute('aria-label', CONTENT.photoAction);
$('#note-jar').setAttribute('aria-label', CONTENT.jarAction);
$('#jar-label').textContent = CONTENT.jarLabel;
$('#note-text').textContent = CONTENT.jarFirstNote;
$('#note-count').textContent = CONTENT.jarFirstCount;
[['teacher', CONTENT.teacherPhoto, CONTENT.teacherAlt], ['together', CONTENT.togetherPhoto, CONTENT.togetherAlt]].forEach(([id, src, alt]) => {
  $(`#${id}-image`).src = src; $(`#${id}-image`).alt = alt;
});

// SVG glyph outlines preserve Caveat's hand lettering, including its imperfect strokes.
// Unsupported scripts (including Urdu) fall back to editable, accessible ordinary text.
function handwriting(text, className = '') {
  const svg = svgEl('svg', { class: `writing-svg ${className}`, 'aria-hidden': 'true', focusable: 'false' });
  const glyphs = typeof HANDWRITING_GLYPHS !== 'undefined' ? HANDWRITING_GLYPHS : {};
  if ([...text].some(c => !glyphs[c])) {
    const fallback = make('span', 'handwritten writing-fallback', text); fallback.dir = 'auto'; return fallback;
  }
  let x = 0;
  for (const c of text) {
    const glyph = glyphs[c];
    if (glyph.d) svg.append(svgEl('path', { d: glyph.d, transform: `translate(${x} 810) scale(1 -1)`, class: 'writing-glyph' }));
    x += glyph.w;
  }
  svg.setAttribute('viewBox', `-15 100 ${x + 35} 910`);
  svg.setAttribute('preserveAspectRatio', 'xMinYMid meet');
  return svg;
}
CONTENT.headingLines.forEach(line => $('#heading-writing').append(handwriting(line, 'writing-line')));
CONTENT.lessons.forEach(text => {
  const li = make('li', 'lesson'); const wrap = make('span', 'lesson-content');
  const copy = make('span', '', text); copy.dir = 'auto';
  const svg = svgEl('svg', { class: 'hand-underline', viewBox: '0 0 500 18', preserveAspectRatio: 'none', 'aria-hidden': 'true' });
  svg.append(svgEl('path', { d: 'M3 11 Q100 4 193 10 T342 8 T496 9' }));
  wrap.append(copy, svg); li.append(wrap); $('#lessons').append(li);
});
CONTENT.extraPhotos.forEach(photo => {
  const figure = make('figure', 'polaroid extra-photo reveal'); const img = make('img');
  Object.assign(img, { src: photo.src, alt: photo.alt, loading: 'lazy', decoding: 'async', width: 750, height: 1000 });
  figure.append(img, make('figcaption', '', photo.caption)); $('#extra-photos').append(figure);
});
CONTENT.videos.forEach((clip, index) => {
  const figure = make('figure', 'video-print'); const video = make('video');
  video.controls = true; video.playsInline = true; video.preload = 'none'; video.poster = clip.poster;
  video.setAttribute('aria-label', `${index + 1}. ${clip.caption}`);
  const source = make('source'); source.dataset.src = clip.src; source.type = 'video/mp4';
  const fallback = make('p', '', CONTENT.videoFallback); const link = make('a', '', CONTENT.videoDownload); link.href = clip.src; fallback.append(' ', link);
  video.append(source, fallback);
  const caption = make('figcaption'); caption.append(make('span', 'video-number', String(index + 1).padStart(2, '0')), make('span', '', clip.caption));
  figure.append(video, caption); $('#videos').append(figure);
  video.addEventListener('play', () => $$('.video-print video').forEach(other => { if (other !== video) other.pause(); }));
});
$('.video-memories').addEventListener('toggle', event => {
  if (event.target.open) {
    $$('.video-print source[data-src]').forEach(source => { source.src = source.dataset.src; delete source.dataset.src; source.parentElement.load(); });
  } else $$('.video-print video').forEach(video => video.pause());
  if (window.ScrollTrigger) ScrollTrigger.refresh();
});
CONTENT.signatures.forEach(name => {
  const signature = make('div', 'signature'); signature.setAttribute('aria-label', name); signature.setAttribute('role', 'img');
  signature.append(handwriting(name));
  const underline = svgEl('svg', { class: 'signature-underline', viewBox: '0 0 300 18', 'aria-hidden': 'true' });
  underline.append(svgEl('path', { d: 'M2 8C90 1 200 14 298 5' })); signature.append(underline); $('#signatures').append(signature);
});
for (let i = 0; i < 18; i++) {
  const bit = make('span', `paper-bit ${i % 3 ? 'petal' : 'scrap'} ${i % 5 === 0 ? 'terracotta' : ''}`);
  bit.style.left = `${5 + ((i * 37) % 89)}%`; $('#paper-bits').append(bit);
}

function canAnimate() { return !motionQuery.matches && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined'; }
function drawWriting(container, delay = 0) {
  if (!canAnimate()) return;
  const timeline = gsap.timeline({ delay });
  container.querySelectorAll('.writing-glyph').forEach((path, index) => {
    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length, fillOpacity: 0, opacity: 1 });
    timeline.to(path, { strokeDashoffset: 0, duration: .25, ease: 'none' }, index * .075)
      .to(path, { fillOpacity: 1, duration: .18 }, index * .075 + .12);
  });
  return timeline;
}
function clearAnimations() {
  scrollAnimations.forEach(animation => { animation.scrollTrigger?.kill(); animation.kill(); }); scrollAnimations = [];
  petalAnimation?.kill(); petalAnimation = undefined;
  if (window.gsap) {
    gsap.set($$('.reveal, .lesson, .signature, .parallax-photo img'), { clearProps: 'opacity,visibility,transform' });
    gsap.set($$('.writing-glyph'), { clearProps: 'strokeDasharray,strokeDashoffset,fillOpacity,opacity' });
    gsap.set($$('.hand-underline path, .signature-underline path'), { clearProps: 'strokeDasharray,strokeDashoffset' });
    gsap.set($$('.paper-bit'), { clearProps: 'all' });
    $$('.paper-bit').forEach((bit, i) => { bit.style.left = `${5 + ((i * 37) % 89)}%`; });
  }
  animationReady = false;
}
function startScrollStory() {
  clearAnimations();
  if (!canAnimate()) return;
  gsap.registerPlugin(ScrollTrigger); animationReady = true;
  scrollAnimations.push(drawWriting($('#heading-writing'), .15));
  $$('.reveal').forEach(el => {
    const rotation = el.classList.contains('teacher-polaroid') ? -4 : el.classList.contains('together-polaroid') ? 2.5 : el.classList.contains('extra-photo') ? (el === $('.extra-photo:nth-child(2)') ? 4 : -3) : 0;
    scrollAnimations.push(gsap.fromTo(el, { autoAlpha: 0, y: 30, rotation: rotation - (el.classList.contains('polaroid') ? 3 : 0) }, { autoAlpha: 1, y: 0, rotation, duration: 1.15, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 91%', once: true } }));
  });
  $$('.lesson').forEach(el => {
    const path = el.querySelector('path'); const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    tl.fromTo(el, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: .8, ease: 'power2.out' })
      .to(path, { strokeDashoffset: 0, duration: 1.05, ease: 'power1.inOut' }, .3);
    scrollAnimations.push(tl);
  });
  scrollAnimations.push(gsap.fromTo($('.parallax-photo img'), { y: -10 }, { y: 10, ease: 'none', scrollTrigger: { trigger: $('.together-polaroid'), start: 'top bottom', end: 'bottom top', scrub: 1 } }));
  $$('.signature').forEach((signature, i) => {
    const paths = signature.querySelectorAll('.writing-glyph'); paths.forEach(path => gsap.set(path, { opacity: 0 }));
    const underline = signature.querySelector('.signature-underline path'); const length = underline.getTotalLength();
    gsap.set(underline, { strokeDasharray: length, strokeDashoffset: length });
    const trigger = ScrollTrigger.create({ trigger: signature, start: 'top 88%', once: true, onEnter: () => {
      const writing = drawWriting(signature, i * .5); if (writing) { writing.to(underline, { strokeDashoffset: 0, duration: .6 }); scrollAnimations.push(writing); }
    } });
    scrollAnimations.push({ scrollTrigger: trigger, kill() { trigger.kill(); } });
  });
  const endingTrigger = ScrollTrigger.create({ trigger: $('.ending'), start: 'top 80%', once: true, onEnter: () => {
    petalAnimation = gsap.timeline();
    $$('.paper-bit').forEach((bit, i) => {
      const start = (i % 6) * .4; const height = $('.ending').offsetHeight;
      petalAnimation.fromTo(bit, { y: -15, x: 0, rotation: i * 31, opacity: 0 }, { y: height + 40, x: (i % 2 ? 1 : -1) * (20 + i * 2), rotation: i * 31 + 190, duration: 5.5 + (i % 4) * .4, ease: 'none' }, start)
        .to(bit, { opacity: .7, duration: .7 }, start).to(bit, { opacity: 0, duration: 1.3 }, start + 4.5);
    });
  } });
  scrollAnimations.push({ scrollTrigger: endingTrigger, kill() { endingTrigger.kill(); } });
  ScrollTrigger.refresh();
}
function finishOpening() {
  $('#opening').hidden = true; $('#letter').hidden = false;
  if (window.gsap) { gsap.set($('#opening'), { clearProps: 'all' }); gsap.set($('#letter'), { clearProps: 'all' }); }
  $('#open-letter').disabled = false; isOpen = true;
  window.scrollTo({ top: 0, behavior: 'instant' });
  $('#letter-title').focus({ preventScroll: true });
  startScrollStory();
}
$('#open-letter').addEventListener('click', () => {
  const button = $('#open-letter'); if (button.disabled) return;
  button.disabled = true; button.setAttribute('aria-expanded', 'true');
  if (!canAnimate()) { finishOpening(); return; }
  $('#letter').hidden = false;
  gsap.set($('#opening'), { position: 'fixed', inset: 0, zIndex: 10 });
  gsap.set($('#letter'), { opacity: 0, y: 75 });
  openingAnimation = gsap.timeline({ onComplete: finishOpening });
  openingAnimation.to($('.seal-crack'), { opacity: 1, duration: .2 })
    .to($('.wax-seal'), { rotation: -14, x: -6, scale: .93, duration: .25 }, .15)
    .to($('.wax-seal'), { y: 18, opacity: 0, duration: .4 }, .4)
    .to($('.envelope-flap'), { rotationX: 175, duration: .8, ease: 'power2.inOut' }, .5)
    .set($('.envelope-flap'), { zIndex: 1 }, 1.15)
    .to($('.letter-preview'), { y: -230, rotation: 3, duration: .95, ease: 'power2.inOut' }, 1.05)
    .to($('#opening'), { opacity: 0, duration: .65 }, 1.85)
    .to($('#letter'), { opacity: 1, y: 0, duration: .95, ease: 'power2.out' }, 1.9);
});

let photoStraight = false;
function settlePhoto(straight) {
  const frame = $('.teacher-polaroid');
  if (canAnimate()) gsap.to(frame, { rotation: straight ? 0 : -4, y: straight ? -4 : 0, duration: .75, ease: 'back.out(1.5)', overwrite: 'auto' });
  else frame.style.transform = `rotate(${straight ? 0 : -4}deg)`;
}
$('#teacher-photo').addEventListener('click', () => {
  photoStraight = !photoStraight; settlePhoto(photoStraight);
  $('#teacher-photo').setAttribute('aria-pressed', String(photoStraight));
  $('#teacher-photo').setAttribute('aria-label', photoStraight ? CONTENT.photoReset : CONTENT.photoAction);
});
$('#teacher-photo').addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') settlePhoto(true); });
$('#teacher-photo').addEventListener('pointerleave', event => { if (event.pointerType === 'mouse' && !photoStraight) settlePhoto(false); });
$('#note-jar').addEventListener('click', () => {
  const button = $('#note-jar'); if (!CONTENT.notes.length || button.disabled) return;
  noteIndex = (noteIndex + 1) % CONTENT.notes.length;
  const updateNote = () => { $('#note-text').textContent = CONTENT.notes[noteIndex]; $('#note-count').textContent = CONTENT.noteCount(noteIndex + 1, CONTENT.notes.length); };
  if (!canAnimate()) { updateNote(); return; }
  button.disabled = true; noteAnimation?.kill();
  noteAnimation = gsap.timeline({ onComplete: () => { button.disabled = false; } });
  noteAnimation.to($('#paper-note'), { opacity: 0, y: 35, scaleY: .35, rotation: -5, duration: .25, ease: 'power1.in' })
    .call(updateNote)
    .set($('#paper-note'), { y: 75, scaleY: .2, rotation: -8, opacity: 1 })
    .to($('.jar-svg'), { rotation: -4, duration: .2, yoyo: true, repeat: 1 }, .2)
    .to($('#paper-note'), { y: 0, scaleY: 1, rotation: 3, duration: .75, ease: 'back.out(1.1)' }, .35);
});
$('#read-again').addEventListener('click', () => {
  openingAnimation?.kill(); noteAnimation?.kill(); clearAnimations();
  $$('.video-print video').forEach(video => video.pause()); $('.video-memories').open = false;
  $('#letter').hidden = true; $('#opening').hidden = false; isOpen = false; noteIndex = -1; photoStraight = false;
  $('#note-text').textContent = CONTENT.jarFirstNote; $('#note-count').textContent = CONTENT.jarFirstCount;
  $('#note-jar').disabled = false; $('#open-letter').disabled = false;
  $('#open-letter').setAttribute('aria-expanded', 'false'); $('#teacher-photo').setAttribute('aria-pressed', 'false');
  $('#teacher-photo').setAttribute('aria-label', CONTENT.photoAction);
  $('.teacher-polaroid').style.removeProperty('transform');
  if (window.gsap) gsap.set($$('.envelope-flap, .wax-seal, .seal-crack, .letter-preview, .paper-note, .jar-svg'), { clearProps: 'all' });
  window.scrollTo({ top: 0, behavior: 'instant' }); $('#open-letter').focus({ preventScroll: true });
});
motionQuery.addEventListener('change', () => {
  if (motionQuery.matches) {
    if (openingAnimation?.isActive()) { openingAnimation.kill(); finishOpening(); }
    noteAnimation?.progress(1); clearAnimations();
  } else if (isOpen && !animationReady) startScrollStory();
});
$$('img').forEach(img => img.addEventListener('load', () => { if (window.ScrollTrigger && isOpen) ScrollTrigger.refresh(); }, { once: true }));
