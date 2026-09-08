(function attachReviewPersistence() {
  const STORAGE_KEY = 'invalidatedTickets.hmr20.annotations.v1';
  const mount = document.querySelector('[data-review-list]');
  const exportJsonBtn = document.querySelector('#review-export-json-btn');
  const exportCsvBtn = document.querySelector('#review-export-csv-btn');
  const clearBtn = document.querySelector('#review-clear-btn');
  const feedback = document.querySelector('#review-feedback');
  const filterButtons = Array.from(document.querySelectorAll('.review-filter [data-filter]'));
  const summary = document.querySelector('#review-summary');

  if (!mount || !exportJsonBtn || !exportCsvBtn || !clearBtn || !feedback) return;

  if (typeof localStorage === 'undefined') {
    feedback.textContent = 'Local storage unavailable in this browser context.';
    exportJsonBtn.disabled = true;
    exportCsvBtn.disabled = true;
    clearBtn.disabled = true;
    return;
  }

  const rows = Array.from(mount.querySelectorAll('.review-item'));
  const safe = (value) => (value === undefined || value === null ? '' : String(value));
  const nowIso = () => new Date().toISOString();
  const normalizeFilter = (filter) => (filter === 'filled' ? 'filled' : filter === 'empty' ? 'empty' : 'all');

  const recordById = new Map((window.MACHINE_REVIEW_20 || []).map((record) => [record.id, record]));
  const humanDecisions = Array.isArray(window.MACHINE_REVIEW_HUMAN_DECISIONS) ? window.MACHINE_REVIEW_HUMAN_DECISIONS : [];
  const decisionById = new Map(
    humanDecisions
      .filter((item) => safe(item?.id).trim())
      .map((item) => [safe(item.id).trim(), item]),
  );

  const getActiveFilter = () => {
    const active = document.querySelector('.review-filter button.is-active');
    return active ? normalizeFilter(active.dataset.filter) : 'all';
  };

  const normalizeValue = (value) => safe(value).trim();

  const quoted = (value) => {
    const text = safe(value).replace(/"/g, '""').replace(/\r?\n/g, '\\n');
    return `"${text}"`;
  };

  const mapJudgment = (value) => {
    const raw = safe(value).trim().toLowerCase();
    if (!raw) return 'Unfilled';
    if (raw.includes('agree') || raw.includes('同意')) return 'Agree';
    if (raw.includes('disagree') || raw.includes('不同意')) return 'Disagree';
    if (raw.includes('uncertain') || raw.includes('不确定')) return 'Uncertain';
    return 'Unclear';
  };

  const mapTrigger = (value) => {
    const raw = safe(value).trim().toLowerCase();
    if (!raw) return 'Unfilled';
    if (raw.includes('yes') || raw.includes('是') || raw.includes('需要')) return 'Yes';
    if (raw.includes('no') || raw.includes('否') || raw.includes('不需要')) return 'No';
    if (raw.includes('uncertain') || raw.includes('不确定')) return 'Uncertain';
    return 'Unclear';
  };

  const buildSummary = (decisions) => {
    const judgmentCounts = { Agree: 0, Disagree: 0, Uncertain: 0, Unclear: 0, Unfilled: 0 };
    const triggerCounts = { Yes: 0, No: 0, Uncertain: 0, Unclear: 0, Unfilled: 0 };
    decisions.forEach((decision) => {
      const judgment = mapJudgment(decision.human_judgment);
      const trigger = mapTrigger(decision.human_trigger);
      judgmentCounts[judgment] += 1;
      triggerCounts[trigger] += 1;
    });
    return { judgmentCounts, triggerCounts };
  };

  const formatSummaryLine = (counts) => {
    return Object.entries(counts).map(([label, count]) => `${label}: ${count}`).join(' · ');
  };

  const renderSummary = (rowsPayload) => {
    if (!summary) return;
    const { judgmentCounts, triggerCounts } = buildSummary(rowsPayload);
    const reviewText = `human_judgment → ${formatSummaryLine(judgmentCounts)}; human_trigger → ${formatSummaryLine(triggerCounts)}.`;
    summary.textContent = reviewText;
  };

  const readStore = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return (parsed && typeof parsed === 'object' && parsed.annotations) ? parsed.annotations : {};
    } catch (error) {
      return {};
    }
  };

  const writeStore = (annotations) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        savedAt: nowIso(),
        annotations,
        format: 'human-machine-review-20',
      }),
    );
  };

  const getIdFromCard = (card) => {
    return safe(card.dataset.recordId).trim() || safe(card.querySelector('.review-item-head span')?.textContent).trim();
  };

  const getSelectValue = (card, field) => {
    return normalizeValue(card.querySelector(`select[data-field="${field}"]`)?.value);
  };

  const setSelectValue = (card, field, value) => {
    const select = card.querySelector(`select[data-field="${field}"]`);
    if (!select) return;
    const normalized = normalizeValue(value);
    const hasValue = Array.from(select.options).some((option) => option.value === normalized);
    if (normalized && hasValue) {
      select.value = normalized;
    } else if (!normalized) {
      select.value = '';
    }
  };

  const getAnnotationText = (card) => {
    return normalizeValue(card.querySelector('.review-annotation')?.value);
  };

  const getDecisionFromCard = (card) => {
    const id = getIdFromCard(card);
    const preset = decisionById.get(id) || {};
    const userJudgment = getSelectValue(card, 'judgment');
    const userTrigger = getSelectValue(card, 'trigger');
    const reason = getAnnotationText(card);
    return {
      id,
      human_judgment: normalizeValue(userJudgment) || normalizeValue(preset.judgment),
      human_trigger: normalizeValue(userTrigger) || normalizeValue(preset.trigger),
      human_reason_type: normalizeValue(preset.reason_type),
      human_reason: reason || normalizeValue(preset.reason),
      artist_annotation: reason,
    };
  };

  const isCardFilled = (card) => {
    const isJudgmentSet = Boolean(getSelectValue(card, 'judgment'));
    const isTriggerSet = Boolean(getSelectValue(card, 'trigger'));
    return isJudgmentSet && isTriggerSet;
  };

  const setCardState = (card) => {
    const state = isCardFilled(card) ? 'filled' : 'empty';
    card.dataset.judgmentState = state;
    return state;
  };

  const parseLegacyText = (text) => {
    const payload = {};
    const lines = safe(text).split('\n').map((line) => safe(line).trim()).filter(Boolean);
    for (const line of lines) {
      let match = line.match(/^(Judgment|判定)\s*[:：]\s*(.+)$/i);
      if (match) payload.human_judgment = match[2].trim();

      match = line.match(/^(Trigger|触发)\s*[:：]\s*(.+)$/i);
      if (match) payload.human_trigger = match[2].trim();

      match = line.match(/^(Reason\s*type|问题类型)\s*[:：]\s*(.+)$/i);
      if (match) payload.human_reason_type = match[2].trim();

      match = line.match(/^(Reason|原因)\s*[:：]\s*(.+)$/i);
      if (match) payload.human_reason = match[2].trim();
    }

    if (!payload.human_judgment) {
      const compact = lines.find((line) => /Disagree|disagree|Agree|agree|同意|不同意/.test(line));
      if (compact) {
        const lower = compact.toLowerCase();
        if (lower.includes('disagree') || lower.includes('不同意')) {
          payload.human_judgment = 'Disagree';
        } else {
          payload.human_judgment = 'Agree';
        }
      }
    }

    if (!payload.human_trigger) {
      const compact = lines.find((line) => /Yes|No|Uncertain|yes|no|uncertain|是|否|不确定/.test(line));
      if (compact) {
        if (compact.toLowerCase().includes('yes') || compact.includes('是')) {
          payload.human_trigger = 'Yes';
        } else if (compact.toLowerCase().includes('no') || compact.includes('否')) {
          payload.human_trigger = 'No';
        } else if (compact.toLowerCase().includes('uncertain') || compact.includes('不确定')) {
          payload.human_trigger = 'Uncertain';
        }
      }
    }

    return payload;
  };

  const normalizeSavedEntry = (entry) => {
    if (!entry) return {};
    if (typeof entry === 'string') {
      return parseLegacyText(entry);
    }
    if (typeof entry === 'object') {
      return {
        human_judgment: normalizeValue(entry.human_judgment),
        human_trigger: normalizeValue(entry.human_trigger),
        human_reason_type: normalizeValue(entry.human_reason_type),
        human_reason: normalizeValue(entry.human_reason),
        artist_annotation: normalizeValue(entry.artist_annotation),
      };
    }
    return {};
  };

  const applyFilters = () => {
    const activeFilter = getActiveFilter();
    const progress = { total: rows.length, filled: 0, visible: 0 };
    const payload = [];

    rows.forEach((card) => {
      const state = setCardState(card);
      if (state === 'filled') progress.filled += 1;
      const shown = activeFilter === 'all' || state === activeFilter;
      card.classList.toggle('is-hidden', !shown);
      if (shown) progress.visible += 1;

      payload.push({
        id: getIdFromCard(card),
        ...getDecisionFromCard(card),
      });
    });

    const statusText = `Reviewed: ${progress.filled} / ${progress.total} · Showing ${progress.visible} / ${progress.total}`;
    feedback.textContent = statusText;
    renderSummary(payload);
    exportJsonBtn.disabled = progress.total === 0;
    exportCsvBtn.disabled = progress.total === 0;
  };

  const setFilterState = (button) => {
    if (!button) return;
    filterButtons.forEach((btn) => btn.classList.toggle('is-active', btn === button));
    applyFilters();
  };

  const hydrate = () => {
    const saved = readStore();
    const merged = { ...saved };
    let changed = false;

    rows.forEach((card) => {
      const id = getIdFromCard(card);
      if (!id) return;
      const reasonField = card.querySelector('.review-annotation');
      const prefill = normalizeSavedEntry(saved[id]);
      const preset = decisionById.get(id) || {};

      const judgment = normalizeValue(prefill.human_judgment || preset.judgment);
      const trigger = normalizeValue(prefill.human_trigger || preset.trigger);
      const reason = normalizeValue(
        prefill.artist_annotation || prefill.human_reason || preset.reason,
      );

      setSelectValue(card, 'judgment', judgment);
      setSelectValue(card, 'trigger', trigger);
      if (reasonField) {
        reasonField.value = reason;
      }

      const canonical = {
        human_judgment: judgment,
        human_trigger: trigger,
        human_reason_type: normalizeValue(prefill.human_reason_type || preset.reason_type),
        human_reason: reason,
        artist_annotation: reason,
      };
      if (JSON.stringify(merged[id]) !== JSON.stringify(canonical)) {
        merged[id] = canonical;
        changed = true;
      }
    });

    if (changed) writeStore(merged);
    applyFilters();
  };

  const collectAnnotations = () => {
    const annotations = {};
    rows.forEach((card) => {
      const id = getIdFromCard(card);
      if (!id) return;
      const reasonText = getAnnotationText(card);
      const preset = decisionById.get(id) || {};
      annotations[id] = {
        human_judgment: getSelectValue(card, 'judgment'),
        human_trigger: getSelectValue(card, 'trigger'),
        human_reason: reasonText,
        human_reason_type: normalizeValue(preset.reason_type),
        artist_annotation: reasonText,
      };
    });
    return annotations;
  };

  const collectRowsPayload = () => {
    return rows.map((card) => {
      const id = getIdFromCard(card);
      const record = recordById.get(id) || {};
      const decision = getDecisionFromCard(card);

      return {
        id,
        visible_record: record.visible_record || '',
        selection_reason: record.selection_reason || '',
        machine_assessment: record.assessment || '',
        ocr_text: record.machine?.ocr_text || '',
        ocr_review_band: record.machine?.ocr_review_band || '',
        ocr_confidence_mean: record.machine?.ocr_confidence_mean,
        preserved: record.relation?.preserved || '',
        altered: record.relation?.altered || '',
        omitted: record.relation?.omitted || '',
        reconstructed: record.relation?.reconstructed || '',
        human_judgment: decision.human_judgment,
        human_trigger: decision.human_trigger,
        human_reason_type: decision.human_reason_type,
        human_reason: decision.human_reason,
        artist_annotation: decision.artist_annotation,
      };
    });
  };

  const download = (filename, content, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const exportJson = () => {
    const annotations = collectAnnotations();
    const payload = {
      generatedAt: nowIso(),
      run: 'human-machine-review-20',
      scope: '20 records',
      annotations,
      rows: collectRowsPayload(),
    };
    const content = JSON.stringify(payload, null, 2);
    download(`invalidated-tickets-human-review-${nowIso()}.json`, content, 'application/json;charset=utf-8');
  };

  const exportCsv = () => {
    const header = [
      'id',
      'visible_record',
      'selection_reason',
      'machine_assessment',
      'ocr_text',
      'ocr_review_band',
      'ocr_confidence_mean',
      'preserved',
      'altered',
      'omitted',
      'reconstructed',
      'human_judgment',
      'human_trigger',
      'human_reason_type',
      'human_reason',
      'artist_annotation',
      'status',
    ];
    const body = collectRowsPayload().map((row) => {
      const status = isCardFilled(mount.querySelector(`[data-record-id="${row.id}"]`)) ? 'filled' : 'empty';
      const values = [
        row.id,
        row.visible_record,
        row.selection_reason,
        row.machine_assessment,
        row.ocr_text,
        row.ocr_review_band,
        row.ocr_confidence_mean,
        row.preserved,
        row.altered,
        row.omitted,
        row.reconstructed,
        row.human_judgment,
        row.human_trigger,
        row.human_reason_type,
        row.human_reason,
        row.artist_annotation,
        status,
      ];
      return values.map(quoted).join(',');
    });
    const csv = [header.map(quoted).join(','), ...body].join('\n');
    download(`invalidated-tickets-human-review-${nowIso()}.csv`, csv, 'text/csv;charset=utf-8');
  };

  const clearAll = () => {
    if (!window.confirm('Clear all annotations from all 20 cards? This cannot be undone.')) return;
    rows.forEach((card) => {
      const reasonField = card.querySelector('.review-annotation');
      if (reasonField) reasonField.value = '';
      const judgmentSelect = card.querySelector('select[data-field="judgment"]');
      const triggerSelect = card.querySelector('select[data-field="trigger"]');
      if (judgmentSelect) judgmentSelect.value = '';
      if (triggerSelect) triggerSelect.value = '';
      card.dataset.judgmentState = '';
    });
    writeStore({});
    applyFilters();
    feedback.textContent = 'All annotations cleared.';
  };

  const bind = () => {
    rows.forEach((card) => {
      const reasonField = card.querySelector('.review-annotation');
      const judgmentSelect = card.querySelector('select[data-field="judgment"]');
      const triggerSelect = card.querySelector('select[data-field="trigger"]');

      const persist = () => {
        const annotations = collectAnnotations();
        writeStore(annotations);
        applyFilters();
      };

      if (reasonField) {
        reasonField.addEventListener('input', persist);
      }
      if (judgmentSelect) {
        judgmentSelect.addEventListener('change', persist);
      }
      if (triggerSelect) {
        triggerSelect.addEventListener('change', persist);
      }
    });
  };

  exportJsonBtn.addEventListener('click', exportJson);
  exportCsvBtn.addEventListener('click', exportCsv);
  clearBtn.addEventListener('click', clearAll);
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => setFilterState(button));
  });

  hydrate();
  bind();
})();
