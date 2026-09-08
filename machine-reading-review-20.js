(() => {
  const records = window.MACHINE_REVIEW_20 || [];
  const mount = document.querySelector('[data-review-list]');
  if (!mount || !records.length) return;

  const formatValue = (value, precision = 4) => {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return '—';
    }
    if (typeof value === 'number') {
      return value.toFixed(precision).replace(/\.0+$/, '').replace(/(\d)0+$/, '$1');
    }
    return value;
  };

  const create = (tag, props = {}) => {
    const node = document.createElement(tag);
    Object.entries(props).forEach(([key, value]) => {
      if (key === 'className') {
        node.className = value;
      } else if (key === 'text') {
        node.textContent = value;
      } else if (key === 'html') {
        node.innerHTML = value;
      } else {
        node.setAttribute(key, value);
      }
    });
    return node;
  };

  const featureDefs = [
    ['visual_cluster', 'Visual cluster'],
    ['cluster_silhouette', 'Mean silhouette'],
    ['visual_outlier_score', 'Outlier score'],
    ['brightness_mean', 'Brightness mean'],
    ['saturation_mean', 'Saturation mean'],
    ['dark_fraction', 'Dark fraction'],
    ['light_fraction', 'Light fraction'],
    ['edge_density', 'Edge density'],
    ['symmetry_horizontal', 'Symmetry H'],
    ['symmetry_vertical', 'Symmetry V'],
  ];

  const joinArray = (items, fallback = '—') => {
    if (!Array.isArray(items) || !items.length) return fallback;
    return items.join(' / ');
  };

  const makeFeature = ([key, label], value) => {
    const item = create('dl', { className: 'review-feature' });
    item.append(create('dt', { text: label }));
    item.append(create('dd', { text: formatValue(value) }));
    return item;
  };

  const makeRelationBlock = (record) => {
    const holder = create('div', { className: 'review-column' });
    holder.append(create('h2', { text: 'Machine result / relation' }));

    holder.append(create('p', { className: 'note', text: `Selection reason: ${record.selection_reason || '—'}` }));

    const relList = create('ul');
    relList.append(create('li', { text: `Assessment: ${record.assessment || '—'}` }));
    relList.append(create('li', { text: `Preserved: ${record.relation?.preserved || '—'}` }));
    relList.append(create('li', { text: `Altered: ${record.relation?.altered || '—'}` }));
    relList.append(create('li', { text: `Omitted: ${record.relation?.omitted || '—'}` }));
    relList.append(create('li', { text: `Reconstructed: ${record.relation?.reconstructed || '—'}` }));
    holder.append(relList);

    const ocrText = create('p', { html: `<strong>Machine OCR:</strong> ${record.machine?.ocr_text || '—'}` });
    ocrText.style.whiteSpace = 'pre-line';
    ocrText.style.fontFamily = 'var(--mr-mono)';
    ocrText.style.fontSize = '10px';
    ocrText.style.lineHeight = '1.6';
    holder.append(ocrText);

    const machineTags = create('p', {
      className: 'note',
      text: `Machine OCR band: ${record.machine?.ocr_review_band || '—'}; confidence: ${formatValue(record.machine?.ocr_confidence_mean)}; candidate modes: ${joinArray(record.machine?.ocr_candidate_modes)}; place candidates: ${joinArray(record.machine?.ocr_place_candidates)}; measurement candidates: ${joinArray(record.machine?.ocr_measurement_candidates)}`,
    });
    holder.append(machineTags);

    return holder;
  };

  const makeFeatures = (record) => {
    const holder = create('div', { className: 'review-column' });
    holder.append(create('h2', { text: 'Machine visible visual features' }));

    const grid = create('div', { className: 'review-feature-grid' });
    featureDefs.forEach(([key, label]) => {
      grid.append(makeFeature([key, label], record.features?.[key]));
    });
    holder.append(grid);

    return holder;
  };

  const makeAnnotation = () => {
    const optionConfig = {
      judgment: {
        placeholder: 'Select human_judgment',
        values: ['Agree', 'Disagree', 'Uncertain'],
      },
      trigger: {
        placeholder: 'Select human_trigger',
        values: ['Yes', 'No', 'Uncertain'],
      },
    };

    const createSelect = (field, label) => {
      const wrapper = create('div', { className: 'review-select-block' });
      wrapper.append(create('label', {
        className: 'review-annotation-label',
        text: label,
      }));
      const current = optionConfig[field] || { placeholder: `Select ${label}`, values: [] };
      const values = current.values;
      const select = create('select', { className: 'review-select', 'data-field': field });
      const placeholder = create('option', { value: '' });
      placeholder.textContent = current.placeholder;
      placeholder.disabled = true;
      placeholder.selected = true;
      select.append(placeholder);
      values.forEach((value) => {
        const option = create('option', { value });
        option.textContent = value;
        select.append(option);
      });
      wrapper.append(select);
      return wrapper;
    };

    const holder = create('div', { className: 'review-column' });
    holder.append(create('h2', { text: 'Artist Judgement / Annotation' }));
    holder.append(createSelect('judgment', 'human_judgment'));
    holder.append(createSelect('trigger', 'human_trigger'));
    holder.append(create('label', {
      className: 'review-annotation-label',
      text: 'Reason (why this does/does not require a next-system intervention):',
    }));
    holder.append(create('textarea', {
      className: 'review-annotation',
      placeholder: 'One concise reason for your judgment and trigger choice.',
    }));
    return holder;
  };

  records.forEach((record) => {
    const item = create('article', {
      className: 'review-item',
      'data-judgment-state': 'empty',
      'data-record-id': record.id || '',
    });
    const head = create('div', { className: 'review-item-head' });
    head.append(create('span', { text: record.id || '—' }));
    head.append(create('strong', { text: record.visible_record || 'Original record summary unavailable' }));
    head.append(create('span', { text: record.selection_reason || 'Selection reason pending' }));
    item.append(head);

    const body = create('div', { className: 'review-item-body' });

    const ticket = create('figure', { className: 'review-ticket' });
    const image = create('img', { src: record.image, alt: `${record.id} original ticket` });
    ticket.append(image);
    ticket.append(create('small', { text: record.id || 'T-000' }));

    const content = create('div', { className: 'review-content' });
    const visible = create('div', { className: 'review-column' });
    visible.append(create('h2', { text: 'Visible record note' }));
    visible.append(create('p', { text: record.visible_record || '—', className: 'visible-note' }));
    content.append(visible);
    content.append(makeRelationBlock(record));
    content.append(makeFeatures(record));
    content.append(makeAnnotation());

    body.append(ticket);
    body.append(content);
    item.append(body);

    mount.append(item);
  });
})();
