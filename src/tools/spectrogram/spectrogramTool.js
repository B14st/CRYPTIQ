import { registerTool } from '../toolLoader.js';
import { setupSpectrogramAnalyzer } from './setupSpectrogramAnalyzer.js';
import { createToolWindow } from '../../ui/windowManager.js';

const audioFiles = [
  'intercept_yhf.wav',
  'numbers_station_001.mp3',
  'NUMBERSTATION-NATO.wav',
  'imagetoaudio.wav',
  'morse.wav',
  'strange-signal.wav'
];

const profiles = {
  image: {
    fftSize: 32768,
    height: 1024,
    pixelsPerSecond: 150,
    scale: 'linear'
  },
  morse: {
    fftSize: 8192,
    height: 600,
    pixelsPerSecond: 80,
    scale: 'log'
  },
  full: {
    fftSize: 16384,
    height: 800,
    pixelsPerSecond: 120,
    scale: 'linear'
  }
};

let canvas;

function createUI() {
  const container = document.createElement('div');
  container.className = 'tool spectrogram-tool';

  const heading = document.createElement('h2');
  heading.textContent = 'Spectrogram Tool';
  container.appendChild(heading);

  const profileSelect = document.createElement('select');
  profileSelect.id = 'spectrogram-profile';
  for (const name in profiles) {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name.charAt(0).toUpperCase() + name.slice(1);
    profileSelect.appendChild(option);
  }
  container.appendChild(profileSelect);

  const list = document.createElement('ul');
  list.className = 'audio-file-list';
  audioFiles.forEach(file => {
    const li = document.createElement('li');
    li.textContent = file;
    li.onclick = () => {
      const selectedProfile = document.getElementById('spectrogram-profile').value;
      loadAudioFile(`assets/audio/${file}`, profiles[selectedProfile]);
    };
    list.appendChild(li);
  });
  container.appendChild(list);

  const frame = document.createElement('div');
  frame.className = 'spectrogram-frame';

  canvas = document.createElement('canvas');
  frame.appendChild(canvas);
  container.appendChild(frame);

  return container;
}

function loadAudioFile(url, profile) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  fetch(url)
    .then(res => res.arrayBuffer())
    .then(buf => audioContext.decodeAudioData(buf))
    .then(audioBuffer => {
      setupSpectrogramAnalyzer(audioContext, audioBuffer, canvas, profile);
    })
    .catch(err => console.error('Error loading audio:', err));
}

function openSpectrogramTool(filename) {
  const ui = createUI();
  createToolWindow('Spectrogram', ui);

  if (filename) {
    const selectedProfile = ui.querySelector('#spectrogram-profile')?.value || 'image';
    loadAudioFile(`assets/audio/${filename}`, profiles[selectedProfile]);
  }
}

// ✅ Register tool properly (only once)
registerTool('spectrogram', openSpectrogramTool);

// ✅ Required by toolLoader.launchTool
export function init() {
  openSpectrogramTool();
}
