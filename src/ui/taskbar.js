// ✅ ALWAYS place imports at the top
import { launchTool } from '../tools/toolLoader.js';

const launcher = document.getElementById('tool-launcher');
const menu = launcher?.querySelector('.tool-menu');

if (launcher && menu) {
  // Toggle menu on click
  launcher.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent outside click from immediately closing it
    menu.classList.toggle('hidden');
  });

  // Handle tool selection
menu.querySelectorAll('.tool-item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.stopPropagation(); // ✅ prevent outside click from firing
    const toolName = item.dataset.tool;
    if (toolName) {
      launchTool(toolName);
      menu.classList.add('hidden'); // ✅ hide menu after launch
    }
  });
});


  // Close if clicking outside
  document.addEventListener('click', () => menu.classList.add('hidden'));
}

// === CLOCK ===
function updateClock() {
  const clock = document.getElementById('taskbar-clock');
  const now = new Date();
  clock.textContent = now.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }) + ' CET';
}
setInterval(updateClock, 1000);
updateClock();
