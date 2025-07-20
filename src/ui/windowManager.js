

let zIndexCounter = 1000;
const openTools = {};

export function createToolWindow(title, contentElement) {
 // If already open, bring it to front and return
  if (openTools[title]) {
    const existing = openTools[title];
    existing.style.display = 'block';
    existing.style.zIndex = zIndexCounter++;
    return existing;
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'tool-window';
  wrapper.style.position = 'absolute';
  wrapper.style.zIndex = zIndexCounter++;
  

  // === Create the header bar ===
  const header = document.createElement('div');
  header.className = 'tool-header';

  const titleEl = document.createElement('span');
  titleEl.className = 'tool-title';
  titleEl.textContent = title;

// === Create a button group container
const buttonGroup = document.createElement('div');
buttonGroup.style.display = 'flex';
buttonGroup.style.gap = '6px';

const minimizeBtn = document.createElement('button');
minimizeBtn.className = 'tool-minimize';
minimizeBtn.textContent = '–';
minimizeBtn.onclick = () => {
  wrapper.style.display = 'none';
};

const closeBtn = document.createElement('button');
closeBtn.className = 'tool-close';
closeBtn.textContent = '×';
closeBtn.onclick = () => {
  wrapper.remove();
  taskbarBtn.remove();
};

buttonGroup.appendChild(minimizeBtn);
buttonGroup.appendChild(closeBtn);
// Append title and buttons to header
header.appendChild(titleEl);
header.appendChild(buttonGroup);

  wrapper.appendChild(header);
  wrapper.appendChild(contentElement);

      closeBtn.onclick = () => {
    wrapper.remove();
    taskbarBtn.remove();
    delete openTools[title];
  };
    // When minimized, keep it tracked
  minimizeBtn.onclick = () => {
    wrapper.style.display = 'none';
  };

  document.body.appendChild(wrapper);


  // === Center the window relative to the game container ===
  const container = document.querySelector('.main-terminal') || document.body;
  const containerRect = container.getBoundingClientRect();
  const { offsetWidth, offsetHeight } = wrapper;

  wrapper.style.left = `${containerRect.left + (containerRect.width - offsetWidth) / 2}px`;
  wrapper.style.top = `${containerRect.top + (containerRect.height - offsetHeight) / 2}px`;

  // === Make draggable via header ===
  let offsetX, offsetY;
  header.onmousedown = e => {
    offsetX = e.clientX - wrapper.offsetLeft;
    offsetY = e.clientY - wrapper.offsetTop;
    document.onmousemove = e => {
      wrapper.style.left = e.clientX - offsetX + 'px';
      wrapper.style.top = e.clientY - offsetY + 'px';
      wrapper.style.zIndex = zIndexCounter++;
    };
    document.onmouseup = () => {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };

  // === Create taskbar tool button ===
  const taskbar = document.getElementById('taskbar-tool-buttons');
  const taskbarBtn = document.createElement('button');
  taskbarBtn.className = 'taskbar-button';
  taskbarBtn.textContent = title;

  taskbarBtn.onclick = () => {
    const isMinimized = wrapper.style.display === 'none';
    wrapper.style.display = isMinimized ? 'block' : 'none';
    if (isMinimized) wrapper.style.zIndex = zIndexCounter++;
  };
  

  if (taskbar) taskbar.appendChild(taskbarBtn);
  openTools[title] = wrapper;
  return wrapper;
}

// DO NOT export openWindow if not needed
// Or rename/remove it entirely if unused