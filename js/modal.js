(function() {
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');
  const closeBtn = modal.querySelector('.close-modal');
  let lastTrigger = null;

  // Open modal with hidden content
  function openFrom(selector, trigger) {
    const content = document.querySelector(selector);
    if (!content) {
      console.warn('Missing modal content:', selector);
      return;
    }
    modalBody.innerHTML = content.innerHTML;  // Inject hidden HTML
    modal.style.display = 'flex';             // Ensure flex display
    lastTrigger = trigger || null;
    closeBtn.focus();
    document.body.style.overflow = 'hidden';  // Prevent page scrolling
  }

  // Close modal
  function closeModal() {
    modal.style.display = 'none';
    modalBody.innerHTML = '';
    document.body.style.overflow = '';
    if (lastTrigger) lastTrigger.focus();
  }

  // Event delegation for opening and closing modal
  document.addEventListener('click', function(e) {
    const trigger = e.target.closest('[data-modal-target]');
    if (trigger) {
      e.preventDefault();
      openFrom(trigger.getAttribute('data-modal-target'), trigger);
      return;
    }

    if (e.target === modal || e.target.closest('.close-modal')) {
      closeModal();
    }
  });

  // Close modal with ESC key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      closeModal();
    }
  });
})();
