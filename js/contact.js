const contactForm = document.getElementById('nfa-contact-form');
const errorBanner = document.getElementById('form-error-banner');
const successCard = document.getElementById('contact-success-card');
const confirmationSummary = document.getElementById('confirmation-summary');
const sendEmailCopy = document.getElementById('send-email-copy');

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Web3Forms keys (from web3forms.com). These are safe to be public.
const WEB3FORMS_KEYS = {
    tournament: '622b9984-b0bb-4c13-8137-66b2294967ee',   // sends to nfastandin@gmail.com
    journal: 'PASTE_JOURNAL_KEY_HERE'                      // not used yet
};
const DEFAULT_ERROR_TEXT = errorBanner.textContent.trim();

contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const school = document.getElementById('contact-school').value.trim();
    const topic = document.getElementById('contact-topic').value;
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !isValidEmail(email) || !message) {
    errorBanner.textContent = DEFAULT_ERROR_TEXT;
    errorBanner.classList.add('error');
    errorBanner.style.display = 'block';
    return;
    }

    errorBanner.style.display = 'none';

    const isJournal = topic === 'National Forensic Journal (NFJ)';
    const targetEmail = isJournal ? 'nfajournal@gmail.com' : 'nfatournamentcommittee@gmail.com';

    // If there is no journal key yet, NFJ messages go to the main inbox.
    const hasJournalKey = !WEB3FORMS_KEYS.journal.startsWith('PASTE');
    const accessKey = (isJournal && hasJournalKey) ? WEB3FORMS_KEYS.journal : WEB3FORMS_KEYS.tournament;

    const subjectText = `[NFA Contact - ${topic}] From ${name}`;
    const bodyLines = [
    `Name: ${name}`,
    `Email: ${email}`,
    school ? `Institution: ${school}` : null,
    `Department: ${topic}`,
    '',
    'Message:',
    message
    ].filter(Boolean).join('\n');

    // Backup link in case sending fails
    const mailtoLink = `mailto:${targetEmail}?subject=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(bodyLines)}`;
    document.getElementById('mailto-fallback').href = mailtoLink;

    const submitButton = contactForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    try {
    const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
        access_key: accessKey,
        subject: subjectText,
        from_name: 'NFA Website Contact Form',
        name: name,
        email: email,
        institution: school || 'Not provided',
        topic: topic,
        message: message
        })
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.message || 'Send failed');

    confirmationSummary.textContent = `Thank you, ${name}. Your message about "${topic}" was sent. We will reply to ${email}.`;
    sendEmailCopy.style.display = 'none';   // already sent, so hide the "send a copy" button
    contactForm.style.display = 'none';
    successCard.classList.add('visible');
    } catch (err) {
    console.error('Contact form error:', err);
    errorBanner.textContent = 'Sorry, your message could not be sent right now. Please use the "Open in Email Client" button below to email us directly.';
    errorBanner.style.display = 'block';
    } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Submit Message';
    }
});

function resetContactForm() {
    contactForm.reset();
    errorBanner.style.display = 'none';
    successCard.classList.remove('visible');
    contactForm.style.display = 'block';
}