document.addEventListener('DOMContentLoaded', () => {

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.getElementById('nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
    }

    // Scroll animations
    const animatedElements = document.querySelectorAll('[data-animate]');
    let animDelay = 0;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const delay = animDelay;
                animDelay += 80;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '50px 0px 0px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));

    // Fallback: make all hero elements visible after 1s in case observer doesn't fire
    setTimeout(() => {
        document.querySelectorAll('.hero [data-animate]').forEach(el => el.classList.add('visible'));
    }, 800);

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                if (navLinks) navLinks.classList.remove('open');
            }
        });
    });

    // FAQ accordion
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const isActive = item.classList.contains('active');

            document.querySelectorAll('.faq-item.active').forEach(activeItem => {
                activeItem.classList.remove('active');
                activeItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            if (!isActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // Pricing toggle
    const pricingToggle = document.getElementById('pricing-toggle');
    const monthlyLabel = document.getElementById('monthly-label');
    const annualLabel = document.getElementById('annual-label');
    let isAnnual = false;

    if (pricingToggle) {
        pricingToggle.addEventListener('click', () => {
            isAnnual = !isAnnual;
            pricingToggle.classList.toggle('active', isAnnual);
            monthlyLabel.classList.toggle('active', !isAnnual);
            annualLabel.classList.toggle('active', isAnnual);

            document.querySelectorAll('.price[data-monthly]').forEach(price => {
                const monthly = price.dataset.monthly;
                const annual = price.dataset.annual;
                price.textContent = `$${isAnnual ? annual : monthly}`;
            });
        });
    }

    // Counter animation
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                const duration = 2000;
                const start = performance.now();

                function animate(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.round(target * eased);
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    }
                }

                requestAnimationFrame(animate);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

    // Draw connections between canvas nodes
    function drawConnections() {
        const svg = document.getElementById('canvas-connections');
        const canvas = document.getElementById('canvas-main');
        if (!svg || !canvas) return;

        const nodes = {
            vpc: document.getElementById('node-vpc'),
            lb: document.getElementById('node-lb'),
            ec2: document.getElementById('node-ec2'),
            rds: document.getElementById('node-rds')
        };

        if (!nodes.vpc || !nodes.lb || !nodes.ec2 || !nodes.rds) return;

        const canvasRect = canvas.getBoundingClientRect();

        function getCenter(node) {
            const rect = node.getBoundingClientRect();
            return {
                x: rect.left - canvasRect.left + rect.width / 2,
                y: rect.top - canvasRect.top + rect.height / 2
            };
        }

        const centers = {};
        for (const [key, node] of Object.entries(nodes)) {
            centers[key] = getCenter(node);
        }

        const connections = [
            ['vpc', 'lb'],
            ['lb', 'ec2'],
            ['ec2', 'rds'],
            ['vpc', 'rds']
        ];

        svg.innerHTML = '';

        connections.forEach(([from, to]) => {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', centers[from].x);
            line.setAttribute('y1', centers[from].y);
            line.setAttribute('x2', centers[to].x);
            line.setAttribute('y2', centers[to].y);
            line.setAttribute('stroke', '#6366f1');
            line.setAttribute('stroke-width', '1.5');
            line.setAttribute('stroke-dasharray', '6 4');
            line.setAttribute('opacity', '0.3');
            svg.appendChild(line);
        });
    }

    drawConnections();
    window.addEventListener('resize', drawConnections);

    // AI typing effect
    const typingEl = document.getElementById('ai-typing');
    if (typingEl) {
        const fullText = typingEl.textContent;
        typingEl.textContent = '';
        let charIndex = 0;

        function typeChar() {
            if (charIndex < fullText.length) {
                typingEl.textContent += fullText[charIndex];
                charIndex++;
                setTimeout(typeChar, 30 + Math.random() * 40);
            }
        }

        const typingObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setTimeout(typeChar, 500);
                typingObserver.unobserve(typingEl);
            }
        }, { threshold: 0.5 });

        typingObserver.observe(typingEl);
    }
});
