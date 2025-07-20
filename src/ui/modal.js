// modal.js — handles all modal logic

let modalIsOpen = false;

function openImageModal(src, caption = '', metadata = '') {
  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-image');
  const modalCaption = document.getElementById('modal-caption');

  modalImg.src = src;
  modalCaption.innerText = caption;
  modal.style.display = 'flex';

  modalIsOpen = true;
  document.body.classList.add('modal-open');
}

function closeImageModal() {
  const modal = document.getElementById('image-modal');
  modal.style.display = 'none';

  modalIsOpen = false;
  document.body.classList.remove('modal-open');
}

// Close modal on Escape key
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeImageModal();
  }
});

// Hook up modal close button and background click
window.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('modal-close-btn');
  const imageModal = document.getElementById('image-modal');

  if (closeBtn) {
    closeBtn.onclick = closeImageModal;
  }

  if (imageModal) {
    imageModal.addEventListener('click', (e) => {
      if (e.target === imageModal) {
        closeImageModal();
      }
    });
  }
});
