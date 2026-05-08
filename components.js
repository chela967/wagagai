/**
 * components.js
 * Wagagai Coffee Farmers SACCO
 *
 * Fetches header.html and footer.html and injects them into every page.
 * Also highlights the active nav link and runs all shared JS (modal, calculator, etc.)
 *
 * Usage: Add ONE script tag at the bottom of each page's <body>:
 *   <script src="components.js"></script>
 *   <script src="script.js"></script>
 */

(async function () {
    /* ── 1. Inject header ──────────────────────────────────────── */
    const headerPlaceholder = document.getElementById('site-header');
    if (headerPlaceholder) {
        try {
            const res  = await fetch('header.html');
            const html = await res.text();
            headerPlaceholder.outerHTML = html;
        } catch (e) {
            console.warn('Could not load header.html', e);
        }
    }

    /* ── 2. Inject footer ──────────────────────────────────────── */
    const footerPlaceholder = document.getElementById('site-footer');
    if (footerPlaceholder) {
        try {
            const res  = await fetch('footer.html');
            const html = await res.text();
            footerPlaceholder.outerHTML = html;
        } catch (e) {
            console.warn('Could not load footer.html', e);
        }
    }

    /* ── 3. Highlight active nav link ─────────────────────────── */
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });

    /* ── 4. Mobile hamburger toggle ───────────────────────────── */
    // Runs after header HTML is injected into the DOM
    const navToggle = document.getElementById('navToggle');
    const mainNav   = document.getElementById('mainNav');
    const navIcon   = document.getElementById('navIcon');

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            const isOpen = mainNav.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', isOpen);
            if (navIcon) {
                navIcon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
            }
        });

        // Close nav when a link is clicked (for mobile)
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                if (navIcon) navIcon.className = 'fas fa-bars';
            });
        });
    }

    /* ── 5. Modal (shared across all pages) ───────────────────── */
    // Wait a tick so footer HTML is fully parsed into the DOM
    setTimeout(() => {
        const modal           = document.getElementById('applicationModal');
        const closeBtn        = document.querySelector('#applicationModal .close');
        const modalAccountSel = document.getElementById('modalAccountType');
        const form            = document.getElementById('applicationForm');

        // Expose openApplicationForm globally so inline onclick attrs work
        window.openApplicationForm = function (loanOrAccountType) {
            if (!modal) return;
            if (modalAccountSel) {
                // Try to match option text; fall back gracefully
                const opts = Array.from(modalAccountSel.options);
                const match = opts.find(o => o.value === loanOrAccountType || o.text === loanOrAccountType);
                if (match) modalAccountSel.value = match.value;
            }
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        };

        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }
        window.addEventListener('click', e => {
            if (e.target === modal) closeModal();
        });
        window.addEventListener('keydown', e => {
            if (e.key === 'Escape') closeModal();
        });

        function closeModal() {
            if (!modal) return;
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }

        if (form) {
            form.addEventListener('submit', () => {
                // FormSubmit handles actual delivery; show UX message
                alert('Thank you for your interest!\nA SACCO representative will contact you within 24 hours.');
            });
        }
    }, 100);

})();