// Loan Products Data
const loanProducts = [
    {
        name: "Quick Loan",
        maxAmount: "500,000",
        period: "1 month",
        interest: "5% flat rate",
        processing: "24 hours",
        repayment: "Monthly",
        category: "individual",
        icon: "fa-bolt",
        image: "images/quickk.webp"
    },
    {
        name: "Ordinary Loan",
        maxAmount: "4,000,000",
        period: "3 months",
        interest: "3% per month (declining balance)",
        repayment: "Weekly",
        category: "individual",
        icon: "fa-chart-line",
        image: "images/sacco6 (9).jpeg"
    },
    {
        name: "Salary Loan",
        maxAmount: "5,000,000",
        period: "6 months",
        interest: "3% flat rate",
        repayment: "Monthly",
        category: "individual",
        icon: "fa-wallet",
        image: "images/sacco6 (1).jpeg"
    },
    {
        name: "Agriculture Loan",
        maxAmount: "7,000,000",
        period: "6 months + 1 month grace",
        interest: "3% flat rate",
        repayment: "Monthly",
        category: "individual",
        icon: "fa-tractor",
        image: "images/matooke.jpg"
    },
    {
        name: "Business Loan",
        maxAmount: "6,000,000",
        period: "1-6 months",
        interest: "3% flat rate",
        repayment: "Weekly",
        category: "business",
        icon: "fa-store",
        image: "images/sacco6 (3).jpeg"
    },
    {
        name: "Waga Boda Loan",
        maxAmount: "4,000,000",
        period: "6 months",
        interest: "3% flat rate",
        repayment: "Weekly",
        category: "individual",
        icon: "fa-motorcycle",
        image: "images/sacco6 (8).jpeg"
    },
    {
        name: "Mugaga Loan",
        maxAmount: "10,000,000",
        period: "9 months",
        interest: "3% per month",
        repayment: "Monthly",
        category: "individual",
        icon: "fa-chart-simple",
        image: "images/sacco6 (6).jpeg"
    },
    {
        name: "VSLA Group Loan",
        maxAmount: "15,000,000",
        period: "9 months",
        interest: "3% declining balance",
        repayment: "Weekly",
        category: "group",
        icon: "fa-handshake",
        image: "images/sacco6 (7).jpeg"
    }
];

// Load products into grid
function loadProducts(filter = 'all') {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    const filtered = filter === 'all' ? loanProducts : loanProducts.filter(p => p.category === filter);
    
    grid.innerHTML = filtered.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image || 'images/sacco6 (8).jpeg'}" alt="${product.name}">
            </div>
            <div class="product-header">
                <i class="fas ${product.icon}"></i>
                <h3>${product.name}</h3>
                <div class="product-amount">Up to UGX ${product.maxAmount}</div>
            </div>
            <div class="product-body">
                <ul>
                    <li><i class="fas fa-calendar"></i> Period: ${product.period}</li>
                    <li><i class="fas fa-percent"></i> Interest: ${product.interest}</li>
                    <li><i class="fas fa-clock"></i> Repayment: ${product.repayment}</li>
                    ${product.processing ? `<li><i class="fas fa-hourglass-half"></i> Processing: ${product.processing}</li>` : ''}
                </ul>
                <button class="btn btn-outline" style="width:100%" onclick="openApplicationForm('${product.name}')">Apply Now</button>
            </div>
        </div>
    `).join('');
}

// Filter functionality
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        loadProducts(btn.dataset.filter);
    });
});

// Loan Calculator
function calculateLoan() {
    const amount = parseFloat(document.getElementById('loanAmount')?.value) || 0;
    const loanType = document.getElementById('loanType')?.value;
    let period = parseFloat(document.getElementById('loanPeriod')?.value) || 1;
    
    let interestRate = 0;
    let totalInterest = 0;
    let totalRepayment = 0;
    let monthlyPayment = 0;
    
    switch(loanType) {
        case 'quick':
            interestRate = 0.05;
            totalInterest = amount * interestRate;
            totalRepayment = amount + totalInterest;
            monthlyPayment = totalRepayment / period;
            break;
        case 'ordinary':
            // Declining balance calculation
            interestRate = 0.03;
            monthlyPayment = (amount * interestRate * Math.pow(1 + interestRate, period)) / (Math.pow(1 + interestRate, period) - 1);
            totalRepayment = monthlyPayment * period;
            totalInterest = totalRepayment - amount;
            break;
        default:
            // Flat rate for others
            interestRate = 0.03;
            totalInterest = amount * interestRate * period;
            totalRepayment = amount + totalInterest;
            monthlyPayment = totalRepayment / period;
    }
    
    const resultDiv = document.getElementById('calculatorResult');
    if (resultDiv) {
        resultDiv.innerHTML = `
            <h4>Loan Summary</h4>
            <div class="result-amount">UGX ${amount.toLocaleString()}</div>
            <p>Interest: UGX ${totalInterest.toLocaleString()}</p>
            <p>Total Repayment: UGX ${totalRepayment.toLocaleString()}</p>
            <p>${loanType === 'ordinary' ? 'Monthly' : 'Estimated Monthly'}: UGX ${monthlyPayment.toLocaleString()}</p>
            <small>*Does not include savings (3%) and shares (5%) requirements</small>
        `;
    }
}

// Add event listeners for calculator
if (document.getElementById('loanAmount')) {
    document.getElementById('loanAmount').addEventListener('input', calculateLoan);
    document.getElementById('loanType').addEventListener('change', calculateLoan);
    document.getElementById('loanPeriod').addEventListener('input', calculateLoan);
    calculateLoan();
}

// Modal functionality
const modal = document.getElementById('applicationModal');
const modalAccountType = document.getElementById('modalAccountType');

function openApplicationForm(loanType) {
    if (modal) {
        if (modalAccountType) {
            modalAccountType.value = loanType;
        }
        modal.style.display = 'block';
    }
}

// Close modal
document.querySelector('.close')?.addEventListener('click', () => {
    if (modal) modal.style.display = 'none';
});

window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// Form submission (using FormSubmit)
const form = document.getElementById('applicationForm');
if (form) {
    form.addEventListener('submit', (e) => {
        // FormSubmit handles the actual submission
        // Just show a thank you message
        alert('Thank you for your interest! A SACCO representative will contact you within 24 hours.');
    });
}

// Mobile menu toggle for small screens
const nav = document.querySelector('nav ul');
if (nav && window.innerWidth < 768) {
    // Simple mobile menu - you can enhance this
    const menuBtn = document.createElement('button');
    menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    menuBtn.style.background = 'none';
    menuBtn.style.border = 'none';
    menuBtn.style.fontSize = '1.5rem';
    menuBtn.style.cursor = 'pointer';
    document.querySelector('header .container')?.prepend(menuBtn);
    
    let menuOpen = false;
    menuBtn.addEventListener('click', () => {
        nav.style.display = menuOpen ? 'none' : 'flex';
        menuOpen = !menuOpen;
    });
}

// Initialize
loadProducts();

// Contact Form Handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        try {
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, message })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Success message
                alert('Thank you! Your message has been sent successfully. We will get back to you soon.');
                contactForm.reset();
            } else {
                alert('Error: ' + (data.error || 'Failed to send message. Please try again.'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error sending message. Please try again or contact us directly.');
        } finally {
            // Reset button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// Service Worker for offline access (PWA)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(() => {
        console.log('Service Worker registered for offline access');
    });
}