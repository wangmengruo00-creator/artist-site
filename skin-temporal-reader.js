(() => {
  const root = document.querySelector('[data-temporal-reader]');
  if (!root) return;

  const takes = {
    a: {
      label: 'Take A / recorded action',
      duration: 22.108,
      video: '../assets/skin-of-writing/08_temporal-study/a-writing-web.mp4',
      poster: '../assets/skin-of-writing/08_temporal-study/a-poster.jpg',
      trace: '../assets/skin-of-writing/08_temporal-study/final-a/01_original.png',
      traceAlt: 'Final trace from Take A',
      motion: [0, 7.86, 10.38, 21.5, 13.43, 13.65, 9.84, 15.5, 15.18, 14.34, 20.82, 13.74, 13.88, 6.99, 11.7, 24.63, 10.79, 12.72, 12.86, 9.87, 12.01, 24.03, 30.04],
      zones: [],
      state: 'Settled continuity',
      detail: 'The hand remains composed while the movement continues. Being settled does not make the writing slow.',
      machine: 'Continuous visible change',
      machineDetail: 'The recording shows a shorter sequence with no instructed interruption between strokes.',
      body: 'The body is settled and therefore able to move decisively.',
      bodyDetail: 'The writer describes this as ding: composure that supports continuity and speed.',
      gap: 'Composure cannot be inferred from speed alone.',
      gapDetail: 'A fast trace is not evidence of carelessness, just as a slow trace is not evidence of attention.',
      note: 'Take A is the baseline: visible motion continues without an externally imposed stop.'
    },
    b: {
      label: 'Take B / recorded action',
      duration: 32.682,
      video: '../assets/skin-of-writing/08_temporal-study/b-writing-web.mp4',
      poster: '../assets/skin-of-writing/08_temporal-study/b-poster.jpg',
      trace: '../assets/skin-of-writing/08_temporal-study/final-b/01_original.png',
      traceAlt: 'Final trace from Take B',
      motion: [0, 20.34, 9.23, 12.77, 31.95, 16.59, 18.08, 9.3, 21.18, 16.19, 6.61, 22.68, 24.97, 25.72, 11.43, 11.39, 12.67, 23.82, 23.65, 23.82, 24.89, 19.66, 15.17, 19.48, 11.92, 27.67, 11.88, 11.92, 9.49, 18.09, 9.26, 15.86, 21.05],
      zones: [[9.5, 10.8], [14, 16.5], [26, 28.5]],
      state: 'Forced interruption',
      detail: 'The instruction inserts stops into the writing sequence. Their bodily meaning is not contained in the final shape.',
      machine: 'Motion falls and resumes',
      machineDetail: 'The recording can locate intervals of reduced visible movement and subsequent restart.',
      body: 'The imposed halt cuts the continuing flow of qi.',
      bodyDetail: 'Continuing afterwards does not feel like breathing through a natural transition; it feels like beginning again.',
      gap: 'Zero motion is not the same as broken qi.',
      gapDetail: 'The system measures an event. The writer supplies its calligraphic and bodily meaning.',
      note: 'Shaded intervals mark approximate low-motion regions observed in Take B. They locate visible stillness; they do not identify qi.'
    },
    c: {
      label: 'Take C / recorded action',
      duration: 41.635,
      video: '../assets/skin-of-writing/08_temporal-study/c-writing-web.mp4',
      poster: '../assets/skin-of-writing/08_temporal-study/c-poster.jpg',
      trace: '../assets/skin-of-writing/08_temporal-study/final-c/01_original.png',
      traceAlt: 'Final trace from Take C',
      motion: [0, 14.2, 25.05, 32.53, 12.55, 15.33, 9.77, 18.56, 14.11, 19.83, 16.1, 17.52, 24.26, 16.12, 10.34, 14.2, 11.22, 12.46, 10.85, 16.81, 14.7, 20.13, 15.66, 10.18, 5.87, 16.1, 13.74, 18.38, 15.43, 17.18, 11.89, 9.39, 15.2, 17.3, 17.8, 16.35, 11.18, 10.32, 12.71, 6.48, 13.29, 15.22],
      zones: [[28, 39.9]],
      state: 'Return after completion',
      detail: 'After the main form is already visible, the brush returns to previously marked regions. The final trace collapses those visits into one dark surface.',
      machine: 'Previously marked regions are revisited',
      machineDetail: 'Video can locate spatial return after completion. Static density alone cannot show whether darkness came from pressure, ink spread, or repeated passage.',
      body: 'Retracing breaks the forward continuity expected in calligraphic writing.',
      bodyDetail: 'For the writer, returning to completed strokes made the character heavy, rigid, and lifeless.',
      gap: 'Detected return is not the same as knowing why return is taboo.',
      gapDetail: 'The system can describe a revisit. The writer supplies its calligraphic consequence and value.',
      note: 'The shaded interval marks the verified return-and-rework period after the main form was already visible. It describes chronology, not calligraphic judgement.'
    }
  };

  const video = root.querySelector('[data-reader-video]');
  const source = video.querySelector('source');
  const trace = root.querySelector('[data-reader-trace]');
  const path = root.querySelector('[data-motion-path]');
  const zones = root.querySelector('[data-interruption-zones]');
  const playhead = root.querySelector('[data-playhead]');
  const chart = root.querySelector('[data-reader-chart]');
  const ticks = root.querySelector('[data-timeline-ticks]');
  let activeTake = 'b';

  const fields = {
    videoLabel: root.querySelector('[data-video-label]'),
    videoTime: root.querySelector('[data-video-time]'),
    duration: root.querySelector('[data-duration-label]'),
    state: root.querySelector('[data-reader-state]'),
    detail: root.querySelector('[data-reader-detail]'),
    machine: root.querySelector('[data-machine-account]'),
    machineDetail: root.querySelector('[data-machine-detail]'),
    body: root.querySelector('[data-body-account]'),
    bodyDetail: root.querySelector('[data-body-detail]'),
    gap: root.querySelector('[data-gap-account]'),
    gapDetail: root.querySelector('[data-gap-detail]'),
    note: root.querySelector('[data-method-note]')
  };

  function timeLabel(seconds) {
    const rounded = Math.max(0, Math.round(seconds));
    return `${String(Math.floor(rounded / 60)).padStart(2, '0')}:${String(rounded % 60).padStart(2, '0')}`;
  }

  function drawSignal(take) {
    const values = take.motion;
    const max = Math.max(...values, 1);
    const points = values.map((value, index) => {
      const x = (index / (values.length - 1)) * 1000;
      const y = 108 - (value / max) * 94;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    });
    path.setAttribute('d', `M ${points.join(' L ')}`);

    zones.replaceChildren();
    take.zones.forEach(([start, end]) => {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', ((start / take.duration) * 1000).toFixed(2));
      rect.setAttribute('width', (((end - start) / take.duration) * 1000).toFixed(2));
      rect.setAttribute('y', '0');
      rect.setAttribute('height', '120');
      zones.append(rect);
    });

    ticks.replaceChildren();
    const tickCount = 4;
    for (let index = 0; index <= tickCount; index += 1) {
      const tick = document.createElement('span');
      const seconds = (take.duration / tickCount) * index;
      tick.style.left = `${(index / tickCount) * 100}%`;
      tick.textContent = `${Math.round(seconds)}s`;
      ticks.append(tick);
    }
  }

  function updatePlayhead() {
    const take = takes[activeTake];
    const ratio = Math.min(1, Math.max(0, video.currentTime / take.duration));
    const x = ratio * 1000;
    playhead.setAttribute('x1', x.toFixed(2));
    playhead.setAttribute('x2', x.toFixed(2));
    fields.videoTime.textContent = `${timeLabel(video.currentTime)} / ${timeLabel(take.duration)}`;
  }

  function selectTake(key) {
    activeTake = key;
    const take = takes[key];
    video.pause();
    source.src = take.video;
    video.poster = take.poster;
    video.load();
    trace.src = take.trace;
    trace.alt = take.traceAlt;
    fields.videoLabel.textContent = take.label;
    fields.videoTime.textContent = `${timeLabel(0)} / ${timeLabel(take.duration)}`;
    fields.duration.textContent = `${take.duration.toFixed(1)} sec`;
    fields.state.textContent = take.state;
    fields.detail.textContent = take.detail;
    fields.machine.textContent = take.machine;
    fields.machineDetail.textContent = take.machineDetail;
    fields.body.textContent = take.body;
    fields.bodyDetail.textContent = take.bodyDetail;
    fields.gap.textContent = take.gap;
    fields.gapDetail.textContent = take.gapDetail;
    fields.note.innerHTML = take.note.replace(/\bqi\b/g, '<em>qi</em>');
    root.querySelectorAll('[data-take]').forEach(button => {
      const active = button.dataset.take === key;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    chart.classList.remove('is-playing');
    drawSignal(take);
    updatePlayhead();
  }

  root.querySelectorAll('[data-take]').forEach(button => {
    button.addEventListener('click', () => selectTake(button.dataset.take));
  });
  video.addEventListener('play', () => chart.classList.add('is-playing'));
  video.addEventListener('pause', () => chart.classList.remove('is-playing'));
  video.addEventListener('ended', () => chart.classList.remove('is-playing'));
  video.addEventListener('timeupdate', updatePlayhead);
  selectTake(activeTake);
})();
