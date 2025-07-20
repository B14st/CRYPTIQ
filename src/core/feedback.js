// feedback.js — handles displaying feedback messages in the solution area

function displayFeedback(type, prefix, message) {
  const container = document.getElementById('feedback');
  if (!container) return;

  container.innerHTML = ''; // clear previous content

  const template = document.getElementById('feedback-template');
  if (!template) return;

  const fragment = template.content.cloneNode(true);
  const root = fragment.querySelector('.feedback-line');
  const icon = fragment.querySelector('.prefix');
  const text = fragment.querySelector('.message');

  root.classList.add(type); // success / warning / error
  icon.textContent = prefix;
  text.textContent = message;

  container.appendChild(fragment);
}
