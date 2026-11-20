const contactForm = document.getElementById('nfa-contact-form');
const errorBanner = document.getElementById('form-error-banner');
const successCard = document.getElementById('contact-success-card');
const confirmationSummary = document.getElementById('confirmation-summary');
const sendEmailCopy = document.getElementById('send-email-copy');

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const school = document.getElementById('contact-school').value.trim();
    const topic = document.getElementById('contact-topic').value;
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !isValidEmail(email) || !message) {
    errorBanner.classList.add('error');
    errorBanner.style.display = 'block';
    return;
    }

    errorBanner.style.display = 'none';

    const targetEmail = topic === 'National Forensic Journal (NFJ)'
    ? 'nfajournal@gmail.com'
    : 'nfatournamentcommittee@gmail.com';

    const subject = encodeURIComponent(`[NFA Contact - ${topic}] From ${name}`);
    const bodyLines = [
    `Name: ${name}`,
    `Email: ${email}`,
    school ? `Institution: ${school}` : null,
    `Department: ${topic}`,
    '',
    'Message:',
    message
    ].filter(Boolean).join('\n');

    sendEmailCopy.href = `mailto:${targetEmail}?subject=${subject}&body=${encodeURIComponent(bodyLines)}`;

    confirmationSummary.textContent = `Thank you, ${name}. Your inquiry regarding "${topic}" has been prepared for ${targetEmail}. You can also launch your default mail client below to send an immediate direct copy.`;

    contactForm.style.display = 'none';
    successCard.classList.add('visible');
});

function resetContactForm() {
    contactForm.reset();
    errorBanner.style.display = 'none';
    successCard.classList.remove('visible');
    contactForm.style.display = 'block';
}