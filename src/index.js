const currencies = [
  { label: '(USD$)', value: 'USD' },
  { label: '(THB฿)',      value: 'THB' },
  { label: '(EUR€)',     value: 'EUR' },
  { label: '(GBP£)',value: 'GBP' },
  { label: '(JPY¥)',         value: 'JPY' },
  { label: '(SGDS$)',    value: 'SGD' },
  { label: '(AUDA$)',    value: 'AUD' },
];

const languages = [
  { label: 'En',  value: 'en' },
  { label: 'Th', value: 'th' },
  { label: 'Jp',   value: 'ja' },
  { label: 'Ch',     value: 'zh' },
  { label: 'Ko',   value: 'ko' },
];

let selectedCurrency = currencies[0];
let selectedLanguage = languages[0];
let openMenu = null;
const timeouts = { currency: null, language: null }; // ✅ เพิ่ม

function renderList(type) {
  const items = type === 'currency' ? currencies : languages;
  const selected = type === 'currency' ? selectedCurrency : selectedLanguage;
  const ul = document.getElementById(`${type}-list`);
  ul.innerHTML = '';

  items.forEach(item => {
    const isActive = item.value === selected.value;
    const li = document.createElement('li');
    li.innerHTML = `
      <button onclick="selectItem('${type}','${item.value}')"
        class="w-full text-left px-4 py-2 text-sm flex items-center justify-between
               ${isActive
                 ? 'text-white bg-white/10'
                 : 'text-gray-400 hover:text-white hover:bg-white/5'}
               transition-colors duration-100">
        ${item.label}
        ${isActive ? `
          <svg class="w-3.5 h-3.5 text-white shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>` : ''}
      </button>`;
    ul.appendChild(li);
  });
}

function selectItem(type, value) {
  const items = type === 'currency' ? currencies : languages;
  const found = items.find(i => i.value === value);

  if (type === 'currency') {
    selectedCurrency = found;
    document.getElementById('currency-label').textContent = found.label;
  } else {
    selectedLanguage = found;
    document.getElementById('language-label').textContent = found.label;
  }

  closeAll();
}

function toggleMenu(type) {
  if (openMenu === type) { closeAll(); return; }
  closeAll();

  // ✅ ยกเลิก timeout ที่ closeAll() เพิ่งตั้งไว้สำหรับเมนูนี้
  clearTimeout(timeouts[type]);

  openMenu = type;
  renderList(type);

  const menu = document.getElementById(`${type}-menu`);
  menu.classList.remove('hidden');
  requestAnimationFrame(() => {
    menu.classList.remove('opacity-0', '-translate-y-1');
    menu.classList.add('opacity-100', 'translate-y-0');
  });

  document.getElementById(`${type}-chevron`).style.transform = 'rotate(180deg)';
}

function closeAll() {
  ['currency', 'language'].forEach(t => {
    const menu = document.getElementById(`${t}-menu`);
    menu.classList.add('opacity-0', '-translate-y-1');
    menu.classList.remove('opacity-100', 'translate-y-0');

    clearTimeout(timeouts[t]); // ✅ clear ก่อนตั้งใหม่
    timeouts[t] = setTimeout(() => menu.classList.add('hidden'), 150);

    document.getElementById(`${t}-chevron`).style.transform = 'rotate(0deg)';
  });
  openMenu = null;
}

document.addEventListener('click', e => {
  if (!['currency-root', 'language-root'].some(id =>
    document.getElementById(id).contains(e.target))) closeAll();
});