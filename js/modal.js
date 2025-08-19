(function() {
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');
  const closeBtn = modal.querySelector('.close-modal');
  let lastTrigger = null;

  // Open modal from a hidden content block
  function openFrom(selector, trigger) {
    const content = document.querySelector(selector);
    if (!content) {
      console.warn('Missing modal content:', selector);
      return;
    }
    modalBody.innerHTML = content.innerHTML; // inject hidden HTML
    modal.style.display = 'block';
    lastTrigger = trigger || null;
    closeBtn.focus();
    document.body.style.overflow = 'hidden'; // prevent scrolling behind modal
  }

  // Close modal
  function closeModal() {
    modal.style.display = 'none';
    modalBody.innerHTML = '';
    document.body.style.overflow = '';
    if (lastTrigger) lastTrigger.focus();
  }

  // Event delegation for opening modals
  document.addEventListener('click', function(e) {
    const trigger = e.target.closest('[data-modal-target]');
    if (trigger) {
      e.preventDefault();
      openFrom(trigger.getAttribute('data-modal-target'), trigger);
      return;
    }

    // Close modal when clicking overlay or close button
    if (e.target === modal || e.target.closest('.close-modal')) {
      closeModal();
    }
  });

  // Close modal with ESC key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.style.display === 'block') {
      closeModal();
    }
  });
})();
