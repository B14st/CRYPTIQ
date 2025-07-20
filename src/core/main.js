
import '../tools/index.js';





// Sidebar Toggle Logic
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleIcon = document.getElementById('toggle-icon');

    sidebar.classList.toggle('collapsed');
    toggleIcon.textContent = sidebar.classList.contains('collapsed') ? '›' : '‹';
}

// Load saved notes on page load
window.addEventListener('DOMContentLoaded', () => {
    const note = localStorage.getItem('agent_notes');
    if (note) {
        document.getElementById('notepad-area').value = note;
    }
});

// Save notes on input
document.addEventListener('input', (e) => {
    if (e.target.id === 'notepad-area') {
        localStorage.setItem('agent_notes', e.target.value);
    }
});


// Modal Logic

window.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('imageModal');
  if (modal) modal.style.display = 'none'; // just in case
});

function openModal(contentId) {
    const modal = document.getElementById('modal');
    const body = document.getElementById('modal-body');
    body.innerHTML = '';
    const clone = document.getElementById('modal-template').content.cloneNode(true);
    clone.querySelector('.modal-message').textContent = `[Intel for ${contentId} will load here]`;
    body.appendChild(clone);
    modal.style.display = 'block';
}


function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Handle outside click to close modal
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};


// === Load default mission on start ===
document.addEventListener('DOMContentLoaded', () => {
  loadMission('mission001');
  showSection('mission');
});



/* function openRadioTool() {
  fetch('radio.html')
    .then(response => response.text())
    .then(html => {
      const container = document.getElementById('modal-container');
      container.innerHTML = html;

      // Setup after content is injected
      setupRadio(); // custom function to re-bind elements
    });
} */


function showSection(sectionName) {
  const sections = ['mission', 'intel', 'analysis', 'tools', 'reference'];
  sections.forEach(name => {
    const el = document.getElementById(`${name}-section`);
    if (el) el.classList.add('hidden');
  });

  const target = document.getElementById(`${sectionName}-section`);
  if (target) target.classList.remove('hidden');

  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => item.classList.remove('active'));

  const matchingItem = Array.from(navItems).find(item =>
    item.getAttribute('onclick')?.includes(`'${sectionName}'`)
  );
  if (matchingItem) matchingItem.classList.add('active');
}

window.showSection = showSection;





function createStructuredBlock(label, value) {
    const block = document.createElement('div');
    const labelEl = document.createElement('strong');
    labelEl.textContent = `${label}: `;
    block.appendChild(labelEl);

    if (typeof value === 'string') {
        const span = document.createElement('span');
        span.innerHTML = value.replace(/\n/g, '<br>');
        block.appendChild(span);
    } else if (Array.isArray(value)) {
        const ul = document.createElement('ul');
        value.forEach(item => {
            const li = document.createElement('li');
            li.textContent = typeof item === 'string' ? item : JSON.stringify(item);
            ul.appendChild(li);
        });
        block.appendChild(ul);
    } else if (typeof value === 'object') {
        const ul = document.createElement('ul');
        for (let k in value) {
            const li = document.createElement('li');
            li.innerHTML = `<em>${k}</em>: ${value[k]}`;
            ul.appendChild(li);
        }
        block.appendChild(ul);
    }

    return block;
}






