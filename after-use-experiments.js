(() => {
  const records = window.AFTER_USE_EXPERIMENT_REGISTRY || [];
  const list = document.querySelector('[data-aue-records]');
  const filters = document.querySelector('[data-aue-filters]');
  const count = document.querySelector('[data-aue-count]');

  if (!list || !filters || !count) return;

  const escapeHTML = (value) => String(value).replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  })[character]);

  const recordMarkup = (record) => `
    <article class="aue-record" data-aue-type="${escapeHTML(record.type)}">
      <figure class="aue-record-figure">
        <img src="${escapeHTML(record.image)}" alt="${escapeHTML(record.imageAlt)}" loading="lazy" decoding="async">
      </figure>
      <div class="aue-record-body">
        <div class="aue-record-meta">
          <span class="aue-record-id">${escapeHTML(record.id)}</span>
          <span class="aue-record-status">${escapeHTML(record.statusLabel)}</span>
          <span class="aue-record-type">${escapeHTML(record.typeLabel)}</span>
          <span class="aue-record-date">${escapeHTML(record.date)}</span>
        </div>
        <h2>${escapeHTML(record.title)}</h2>
        <p class="aue-question">${escapeHTML(record.question)}</p>
        <dl class="aue-evidence-grid">
          <div><dt>Input</dt><dd>${escapeHTML(record.input)}</dd></div>
          <div><dt>Operation</dt><dd>${escapeHTML(record.operation)}</dd></div>
          <div><dt>Output</dt><dd>${escapeHTML(record.output)}</dd></div>
          <div><dt>Artist judgment</dt><dd>${escapeHTML(record.judgement)}</dd></div>
          <div><dt>Current limit</dt><dd>${escapeHTML(record.limit)}</dd></div>
        </dl>
        <a class="aue-record-link" href="${escapeHTML(record.href)}">${escapeHTML(record.linkLabel)} <span aria-hidden="true">↗</span></a>
      </div>
    </article>
  `;

  list.innerHTML = records.map(recordMarkup).join('');

  const setFilter = (filter) => {
    let visible = 0;
    list.querySelectorAll('[data-aue-type]').forEach((record) => {
      const show = filter === 'all' || record.dataset.aueType === filter;
      record.hidden = !show;
      if (show) visible += 1;
    });
    filters.querySelectorAll('[data-filter]').forEach((button) => {
      const active = button.dataset.filter === filter;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    count.textContent = `${visible} ${visible === 1 ? 'record' : 'records'} shown`;
  };

  filters.addEventListener('click', (event) => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    setFilter(button.dataset.filter);
  });

  setFilter('all');
})();
