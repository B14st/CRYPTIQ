import { launchTool } from '../tools/toolLoader.js';


function appendTerminalLine(text, type) {
  const outputBox = document.getElementById('taskbar-cli-output');
  if (!outputBox) return;

  const line = document.createElement('div');
  line.className = `cli-line ${type}`;
  line.textContent = text;
  outputBox.appendChild(line);
  outputBox.scrollTop = outputBox.scrollHeight;
}

function parseToolCommand(input) {
  const [cmd, ...args] = input.split(' ');
  const argString = args.join(' ').trim();

  // Launch spectrogram tool
  if (cmd === 'spectrogram') {
    if (!argString) {
      displayOutput('Usage: spectrogram [filename]');
      return true;
    }

    launchTool('spectrogram', argString); // `argString` is filename
    displayOutput(`Launching spectrogram for ${argString}...`);
    return true;
  }

  return false;
}


function executeCommand(input) {
   if (parseToolCommand(input)) return '';; 
  const [cmd, ...args] = input.split(' ');
  const argString = args.join(' ').trim();

  

    if (cmd === 'help') {
    return 'Available commands: help, hint, status, clear, search [term], intel [id], spectrogram [file], decrypt [filename]';
    }




  if (cmd === 'status') {
    return `Mission: ${currentMission?.title || 'None'}\nObjective: ${currentMission?.objective || 'Unknown'}`;
  }

  if (cmd === 'hint') {
    if (!currentMission?.hints?.length) return 'No hints available.';
    const hint = currentMission.hints[Math.floor(Math.random() * currentMission.hints.length)];
    return `Hint: ${hint}`;
  }

  if (cmd === 'clear') {
    const output = document.getElementById('taskbar-cli-output');
    if (output) output.innerHTML = '';
    return '';
  }

  if (cmd === 'search') {
    if (!argString) return 'Usage: search [keyword]';
    return searchIntel(argString.toLowerCase());
  }

  if (cmd === 'intel') {
    if (!argString || !currentMission?.intel?.[argString]) return 'Usage: intel [id]';
    return formatIntel(currentMission.intel[argString]);
  }
  
  if (cmd === 'decrypt') {
  if (!argString) return 'Usage: decrypt [filename]';

  const filename = argString.toLowerCase();
  const intelList = window.currentIntel;

  if (!intelList) return '❌ No intel loaded.';

  const match = Object.values(intelList).find(intel =>
    intel.type === 'encrypted_file' &&
    intel.content?.filename?.toLowerCase() === filename
  );

  if (!match) return `❌ Encrypted file '${filename}' not found.`;

  launchTool('decryption', {
    filename: match.content.filename,
    type: match.content.encryption_type,
    data: match.content.data,
    /* displayName: match.title */
  });

  return `Launching decryption tool for ${filename}...`;
}


  return 'Unknown command: ' + cmd;

}



function handleCommand(event) {
  if (event.key === 'Enter') {
    const input = event.target.value.trim();
    const outputBox = document.getElementById('taskbar-cli-output');
    const outputText = executeCommand(input);

    // Prevent rendering input/output if command is 'clear'
    if (input === 'clear') {
      if (outputBox) outputBox.innerHTML = '';
      event.target.value = '';
      return;
    }

    // Append user input line
    const inputLine = document.createElement('div');
    inputLine.className = 'cli-line input';
    inputLine.textContent = `> ${input}`;
    outputBox.appendChild(inputLine);

    // Append output from command
    const responseLine = document.createElement('div');
    responseLine.className = 'cli-line output';
    responseLine.textContent = outputText;
    outputBox.appendChild(responseLine);

    outputBox.scrollTop = outputBox.scrollHeight;
    event.target.value = '';
  }
}




function displayOutput(text) {
  const output = document.getElementById('taskbar-cli-output'); // ✅ updated
  const line = document.createElement('div');
  line.className = 'cli-line output';
  line.textContent = text;
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}




const taskbarInput = document.getElementById('taskbar-cli-input');
if (taskbarInput) {
  taskbarInput.addEventListener('keydown', handleCommand);
}

const toggleButton = document.getElementById('toggle-cli-output');
const cliOutputBox = document.getElementById('taskbar-cli-output');

if (toggleButton && cliOutputBox) {
  toggleButton.addEventListener('click', () => {
    cliOutputBox.classList.toggle('hidden');
    toggleButton.textContent = cliOutputBox.classList.contains('hidden') ? '⏶' : '⏷';
  });
}

// Display "help" command output on load
window.addEventListener('DOMContentLoaded', () => {
  displayOutput(executeCommand('help'));
});

window.addEventListener('keydown', (e) => {
  // If Tab is pressed and not already focused inside an input
  if (e.key === 'Tab' && document.activeElement.id !== 'taskbar-cli-input') {
    e.preventDefault(); // prevent browser from cycling focus
    const input = document.getElementById('taskbar-cli-input');
    input?.focus();
  }
});






