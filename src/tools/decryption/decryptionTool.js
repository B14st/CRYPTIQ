import { registerTool } from '../toolLoader.js';
import { createToolWindow } from '../../ui/windowManager.js';
import CaesarModule from './caesar.js';
import VigenereModule from './vigenere.js';
import Base64Module from './base64.js';

// Optional icon if you're using it in your taskbar system
const ICON = '🔐';

function createUI({ filename, type, data, displayName }) {
  const container = document.createElement('div');
  container.className = 'tool decryption-tool';

  const terminalOutput = document.createElement('div');
  terminalOutput.className = 'terminal-output';
  terminalOutput.style.cssText = 'height: 200px; overflow-y: auto; background: black; color: #0f0; font-family: monospace; padding: 10px;';
  
  const inputField = document.createElement('input');
  inputField.className = 'terminal-input';
  inputField.type = 'text';
  inputField.placeholder = 'Enter command...';
  inputField.style.cssText = 'width: 100%; padding: 5px; font-family: monospace; background: black; color: #0f0; border: none; border-top: 1px solid #333;';
  
  container.appendChild(terminalOutput);
  container.appendChild(inputField);

  const print = (text) => {
    const line = document.createElement('div');
    line.textContent = text;
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  };

  const onSuccess = (plaintext) => {
    try {
      navigator.clipboard.writeText(plaintext);
      print("Message copied to clipboard.");
    } catch {
      print("Message: " + plaintext);
    }
  };

  const moduleMap = {
    caesar: CaesarModule,
    vigenere: VigenereModule,
    base64: Base64Module
  };

  let module;
  if (moduleMap[type]) {
    module = moduleMap[type]({
      encryptedText: data,
      print,
      onSuccess
    });
  } else {
    print(`❌ Unsupported encryption type: ${type}`);
  }

  inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const input = inputField.value.trim();
      if (input && module?.handleInput) {
        print(`> ${input}`);
        module.handleInput(input);
        inputField.value = '';
      }
    }
  });

  print(`> Decryption Tool – ${displayName || filename}`);
  print(`> Type a command to begin.`);

  return container;
}

function openDecryptionTool(arg) {
  const ui = createUI(arg);
  createToolWindow(`Decryption – ${arg.displayName || arg.filename}`, ui);
}

// ✅ Correct registration
registerTool('decryption', openDecryptionTool);

export function init() {
  openDecryptionTool({
    filename: 'demo.txt',
    type: 'caesar',
    data: 'Wklv lv d whvw phvvdjh',
    displayName: 'Example'
  });
}
