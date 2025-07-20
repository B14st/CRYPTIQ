// intel.js — handles intercepted intelligence rendering and helpers

function renderIntel(mission) {
  const existingSection = document.querySelector('.section');
  if (existingSection) existingSection.remove();

  const container = document.createElement('div');
  container.className = 'section';

  const heading = document.createElement('div');
  heading.className = 'section-title';
  heading.textContent = 'INTERCEPTED INTELLIGENCE';
  container.appendChild(heading);

  const intelEntries = Object.entries(mission.intel || {});
  if (intelEntries.length === 0) {
    const emptyNote = document.createElement('div');
    emptyNote.className = 'intel-description';
    emptyNote.textContent = 'No intel available for this difficulty.';
    container.appendChild(emptyNote);
  } else {
    intelEntries.forEach(([key, data]) => {
      const intelItem = document.createElement('div');
      intelItem.className = 'intel-item';
      intelItem.setAttribute('tabindex', '0');

      const title = document.createElement('div');
      title.className = 'intel-title';
      title.textContent = data.title || key.toUpperCase();

      const content = document.createElement('div');
      content.className = 'intel-content';
      content.style.display = 'none';

      renderIntelContent(content, data.content);

      intelItem.onclick = (e) => {
        e.stopPropagation();
        if (typeof modalIsOpen !== 'undefined' && modalIsOpen) return;
        const isVisible = content.style.display === 'block';
        content.style.display = isVisible ? 'none' : 'block';
      };

      intelItem.appendChild(title);
      intelItem.appendChild(content);
      container.appendChild(intelItem);
    });
  }

  document.getElementById('mission-section').appendChild(container);
}

function renderIntelContent(container, content) {
  if (typeof content === 'string') {
    const p = document.createElement('p');
    p.innerHTML = content.replace(/\n/g, '<br>');
    container.appendChild(p);
    return;
  }

  for (let key in content) {
    const value = content[key];

    if (key === 'audio' && typeof value === 'string') {
      container.appendChild(createAudioPlayer(value));
    } else if (key === 'images' && Array.isArray(value)) {
      container.appendChild(createImageGrid(value));
    } else {
      container.appendChild(createStructuredBlock(key, value));
    }
  }
}

function createAudioPlayer(src) {
  const audio = document.createElement('audio');
  audio.controls = true;
  audio.style.marginTop = '10px';
  audio.style.width = '50%';
  audio.style.background = '#111';
  audio.style.border = '1px solid #00ff41';
  audio.style.borderRadius = '4px';

  const source = document.createElement('source');
  source.src = src;
  source.type = 'audio/wav';

  audio.appendChild(source);
  return audio;
}

function createImageGrid(images) {
  const grid = document.createElement('div');
  grid.className = 'intel-image-grid';

  images.forEach(img => {
    const card = document.createElement('div');
    card.className = 'intel-image-card';
    card.onclick = (e) => {
      e.stopPropagation();
      openImageModal(`assets/images/${img.filename}`, img.description, img.metadata);
    };

    const image = document.createElement('img');
    image.src = `assets/images/${img.filename}`;
    image.alt = img.description;
    image.className = 'intel-photo';

    const label = document.createElement('div');
    label.className = 'intel-image-meta';
    label.innerHTML = `<strong>${img.description}</strong>`;

    card.appendChild(image);
    card.appendChild(label);
    grid.appendChild(card);
  });

  return grid;
}

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
