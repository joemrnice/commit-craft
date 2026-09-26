const TYPES = [
  { key: 'feat', label: 'new feature' },
  { key: 'fix', label: 'bug fix' },
  { key: 'refactor', label: 'code change' },
  { key: 'docs', label: 'documentation' },
  { key: 'chore', label: 'maintenance' },
  { key: 'style', label: 'formatting' },
  { key: 'perf', label: 'performance' },
  { key: 'test', label: 'tests' },
];

const elements = {
  typeOptions: document.querySelector('#type-options'),
  scope: document.querySelector('#scope'),
  summary: document.querySelector('#summary'),
  details: document.querySelector('#details'),
  breaking: document.querySelector('#breaking'),
  preview: document.querySelector('#message-preview'),
  summaryCount: document.querySelector('#summary-count'),
  messageLines: document.querySelector('#message-lines'),
  copy: document.querySelector('#copy'),
  reset: document.querySelector('#reset'),
  toast: document.querySelector('#toast'),
};

let selectedType = 'feat';

function renderTypeOptions() {
  elements.typeOptions.innerHTML = TYPES.map((type) => `
    <button class="type-option${type.key === selectedType ? ' active' : ''}" type="button" data-type="${type.key}" aria-pressed="${type.key === selectedType}">
      <strong>${type.key}</strong><small>${type.label}</small>
    </button>
  `).join('');

  elements.typeOptions.querySelectorAll('.type-option').forEach((button) => {
    button.addEventListener('click', () => {
      selectedType = button.dataset.type;
      renderTypeOptions();
      updatePreview();
    });
  });
}

function buildMessage() {
  const scope = elements.scope.value.trim();
  const summary = elements.summary.value.trim() || 'your change goes here';
  const details = elements.details.value.trim();
  const breaking = elements.breaking.checked;
  const header = `${selectedType}${scope ? `(${scope})` : ''}${breaking ? '!' : ''}: ${summary}`;
  let message = header;
  if (details) {
    const bullets = details.split('\n').map((line) => {
      const cleanLine = line.trim();
      return cleanLine ? (cleanLine.startsWith('-') ? cleanLine : `- ${cleanLine}`) : '';
    }).filter(Boolean).join('\n');
    if (bullets) message += `\n\n${bullets}`;
  }
  if (breaking) message += `\n\nBREAKING CHANGE: ${summary}`;
  return message;
}

function updatePreview() {
  const message = buildMessage();
  elements.preview.textContent = message;
  elements.summaryCount.textContent = `${elements.summary.value.length} / 100`;
  elements.messageLines.textContent = `${message.split('\n').length} ${message.split('\n').length === 1 ? 'line' : 'lines'}`;
}

function showToast(text) {
  elements.toast.textContent = text;
  elements.toast.classList.add('show');
  window.setTimeout(() => elements.toast.classList.remove('show'), 2200);
}

function resetForm() {
  selectedType = 'feat';
  elements.scope.value = '';
  elements.summary.value = '';
  elements.details.value = '';
  elements.breaking.checked = false;
  renderTypeOptions();
  updatePreview();
}

elements.typeOptions.addEventListener('click', (event) => {
  if (event.target.closest('.type-option')) return;
});
[elements.scope, elements.summary, elements.details, elements.breaking].forEach((element) => {
  element.addEventListener('input', updatePreview);
  element.addEventListener('change', updatePreview);
});
elements.copy.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(elements.preview.textContent);
    showToast('Message copied to clipboard');
  } catch {
    showToast('Select the message to copy it');
  }
});
elements.reset.addEventListener('click', resetForm);

renderTypeOptions();
updatePreview();
