// mission.js — handles mission loading, briefing rendering, and solution checking

let currentMission = null;
let selectedDifficulty = 'mid_core';

function loadMission(missionId) {
  fetch(`missions/${missionId}.json`)
    .then(res => res.json())
    .then(data => {
      currentMission = data;
      return fetch(`missions/${currentMission.intel_file}`);
    })
    .then(res => res.json())
    .then(fullIntel => {
      const ids = currentMission.difficulty_modes[selectedDifficulty]?.intel_ids || [];
      const difficultyIntel = fullIntel[selectedDifficulty] || [];

      const filteredIntel = {};
      difficultyIntel.forEach(entry => {
        if (ids.includes(entry.id)) {
          filteredIntel[entry.id] = entry;
        }
      });

      currentMission.intel = filteredIntel;
      window.currentIntel = filteredIntel; 

      const container = document.getElementById('mission-section');
      container.innerHTML = '';

      const briefTemplate = document.getElementById('mission-brief-template').content.cloneNode(true);
      briefTemplate.querySelector('.section-title').textContent = currentMission.title.toUpperCase();
      briefTemplate.querySelector('.priority').textContent = currentMission.priority;
      briefTemplate.querySelector('.brief-content').textContent = currentMission.brief;
      briefTemplate.querySelector('.objective-content').textContent = currentMission.objective;
      container.appendChild(briefTemplate);

      renderIntel(currentMission);
      
      const solutionTemplate = document.getElementById('solution-area-template').content.cloneNode(true);
      container.appendChild(solutionTemplate);
    })
    .catch(err => {
      console.error('Failed to load mission:', err);
    });
}


function submitSolution() {
  const input = document.getElementById('solution-input').value.toLowerCase().trim();
  const answers = currentMission.acceptedAnswers.map(a => a.toLowerCase());

  if (answers.some(ans => input.includes(ans))) {
    displayFeedback("success", "✓ MISSION COMPLETE:", "Correct location identified.");
    return;
  }

  for (let key in currentMission.partialFeedback) {
    if (input.includes(key)) {
      displayFeedback("warning", "⚠", currentMission.partialFeedback[key]);
      return;
    }
  }

  displayFeedback("error", "✗", "Incorrect. Re-analyze the clues.");
}

function requestHint() {
  const hints = currentMission.hints;
  const hint = hints[Math.floor(Math.random() * hints.length)];
  displayFeedback("warning", "💡", hint);
}
