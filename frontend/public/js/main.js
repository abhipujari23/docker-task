// Client-side JavaScript
document.addEventListener('DOMContentLoaded', () => {
    console.log('Premium Frontend Loaded');

    const admissionForm = document.getElementById('admission-form');
    const clearBtn = document.getElementById('clear-btn');
    const confirmationMsg = document.getElementById('confirmation-msg');
    const msgText = document.getElementById('msg-text');
    const statusBadge = document.getElementById('status-badge');
    let isProcessing = false;

    // Function to check backend health
    const checkBackendStatus = async () => {
        const submitBtn = admissionForm ? admissionForm.querySelector('button[type="submit"]') : null;

        try {
            const response = await fetch('/health');
            const data = await response.json();

            if (data.status === 'online') {
                statusBadge.textContent = 'Online';
                statusBadge.classList.remove('status-error');
                statusBadge.classList.add('status-live');
                if (submitBtn && !isProcessing) {
                    submitBtn.disabled = false;
                    submitBtn.title = "";
                }
            } else {
                statusBadge.textContent = 'Offline';
                statusBadge.classList.remove('status-live');
                statusBadge.classList.add('status-error');
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.title = "Backend is offline. Submission disabled.";
                }
            }
        } catch (error) {
            statusBadge.textContent = 'Offline';
            statusBadge.classList.remove('status-live');
            statusBadge.classList.add('status-error');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.title = "Backend is offline. Submission disabled.";
            }
        }
    };

    // Check status every 5 seconds
    setInterval(checkBackendStatus, 5000);
    // Initial check
    checkBackendStatus();

    if (admissionForm) {
        admissionForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('student-name').value;
            const grade = document.getElementById('student-grade').value;

            // Show "Processing..." state
            const submitBtn = admissionForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;

            isProcessing = true;
            submitBtn.textContent = 'Processing...';
            submitBtn.disabled = true;

            try {
                const response = await fetch('/admission', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, grade }),
                });

                const data = await response.json();

                if (response.ok) {
                    // Show confirmation from server
                    confirmationMsg.classList.remove('hidden', 'msg-error');
                    confirmationMsg.classList.add('msg-success');
                    msgText.textContent = data.message || `Successfully added student: ${name}`;
                    admissionForm.reset();
                } else {
                    throw new Error(data.message || 'Submission failed');
                }
            } catch (error) {
                console.error('Submission error:', error);
                confirmationMsg.classList.remove('hidden', 'msg-success');
                confirmationMsg.classList.add('msg-error');
                msgText.textContent = `Error: ${error.message}`;
            } finally {
                isProcessing = false;
                submitBtn.textContent = originalBtnText;

                // Only re-enable if backend is actually online
                const isOnline = statusBadge.classList.contains('status-live');
                submitBtn.disabled = !isOnline;

                // Hide message after 5 seconds
                setTimeout(() => {
                    confirmationMsg.classList.add('hidden');
                }, 5000);
            }
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            admissionForm.reset();
            confirmationMsg.classList.add('hidden');
        });
    }

    // Add subtle intersection observer for cards
    const cards = document.querySelectorAll('.glass-card');
    if (cards.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        cards.forEach(card => observer.observe(card));
    }
});
