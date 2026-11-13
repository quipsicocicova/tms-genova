const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');

function closeMenu() {
  navigation.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Apri menu');
}

toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  navigation.classList.toggle('is-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Chiudi menu' : 'Apri menu');
});

navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    toggle.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.header')) closeMenu();
});
window.matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);
document.querySelector('#year').textContent = new Date().getFullYear();

const contactForm = document.querySelector('#modulo-contatto');
const contactStatus = document.querySelector('#contact-status');
const staticPreview = import.meta.env.VITE_STATIC_PREVIEW === 'true';
if (staticPreview) {
  contactStatus.textContent = 'Anteprima del sito: il modulo non è ancora attivo. Per informazioni chiama lo studio allo 010 375 3411.';
  contactForm.querySelectorAll('input, textarea, button').forEach(field => { field.disabled = true; });
}
contactForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (staticPreview || !contactForm.reportValidity()) return;
  const button = contactForm.querySelector('button[type="submit"]');
  if (button.disabled) return;
  button.disabled = true;
  contactForm.setAttribute('aria-busy', 'true');
  contactStatus.textContent = 'Invio in corso…';
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(contactForm))),
      signal: AbortSignal.timeout(25000),
    });
    const result = await response.json();
    contactStatus.textContent = result.message || 'Invio non riuscito. Chiama lo studio allo 010 375 3411.';
    if (response.ok) contactForm.reset();
  } catch {
    contactStatus.textContent = 'Non è stato possibile confermare l’invio. Chiama lo studio allo 010 375 3411.';
  } finally {
    button.disabled = false;
    contactForm.removeAttribute('aria-busy');
  }
});
