// first page
// Cursor glow logic
const cursorLight = document.getElementById('cursor-light');
const hoverButton = document.getElementById('hover-btn');

document.addEventListener('mousemove', (e) => {
    cursorLight.style.left = e.clientX + 'px';
    cursorLight.style.top = e.clientY + 'px';
});

hoverButton.addEventListener('mouseenter', () => cursorLight.style.opacity = '1');
hoverButton.addEventListener('mouseleave', () => cursorLight.style.opacity = '0');


// Menu Logic
const menuTrigger = document.getElementById('menu-trigger');
const topMenu = document.getElementById('top-menu');
const closeBtn = document.getElementById('close-btn');
const menuMask = document.getElementById('menu-mask');

const toggleMenu = () => {
    topMenu.classList.toggle('active');
    menuMask.classList.toggle('active');
    // Prevent body scroll when menu is open
    document.body.style.overflow = topMenu.classList.contains('active') ? 'hidden' : 'auto';
};

menuTrigger.addEventListener('click', toggleMenu);
closeBtn.addEventListener('click', toggleMenu);
menuMask.addEventListener('click', toggleMenu);

// Navbar Scroll Effect
const navbar = document.querySelector('#home header');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Accordion Logic
const rowTriggers = document.querySelectorAll('.menu-row-trigger');
rowTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
        const row = trigger.parentElement;
        const content = row.querySelector('.menu-row-content');

        if (content) {
            const isActive = row.classList.contains('active');

            // Close all other rows
            document.querySelectorAll('.menu-row').forEach(r => r.classList.remove('active'));

            // Open this row if it wasn't active
            if (!isActive) {
                row.classList.add('active');
            }
        }
    });
});
// Initialize AOS with a slight offset for mobile
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 800,
        once: true,
        offset: 50
    });

    // second page

    // --- Slider Logic ---
    const slider = document.querySelector('.slider');
    const track = document.querySelector('.slider-track');

    // Clone cards for the infinite loop effect
    const trackContent = Array.from(track.children);
    trackContent.forEach(item => {
        const clone = item.cloneNode(true);
        track.appendChild(clone);
    });

    // Apply Mouse Glow Effect AFTER cloning
    const allCards = document.querySelectorAll('.card-container');
    allCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
            card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
        });
        // The glow will now fade out at its last position.
    });

    let posX = 0;
    let isDown = false;
    let startX;
    let scrollLeft;
    let animationFrameId;

    // Autoplay function
    const play = () => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);

        function loop() {
            posX -= 2; // Adjust speed here
            if (posX <= -track.scrollWidth / 2) {
                posX += track.scrollWidth / 2;
            }
            track.style.transform = `translateX(${posX}px)`;
            animationFrameId = requestAnimationFrame(loop);
        }
        loop();
    };

    // Pause autoplay function
    const pause = () => {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    };

    // Event listeners for dragging
    const startDrag = (e) => {
        isDown = true;
        slider.classList.add('active');
        startX = (e.touches ? e.touches[0].pageX : e.pageX) - slider.offsetLeft;
        scrollLeft = posX;
        pause();
    };

    const endDrag = () => {
        if (!isDown) return;
        isDown = false;
        slider.classList.remove('active');
    };

    const onDrag = (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = (e.touches ? e.touches[0].pageX : e.pageX) - slider.offsetLeft;
        const walk = (x - startX) * 2;
        posX = scrollLeft + walk;

        const halfwayPoint = track.scrollWidth / 2;
        if (posX < -halfwayPoint) {
            posX += halfwayPoint;
            scrollLeft += halfwayPoint;
        }
        if (posX > 0) {
            posX -= halfwayPoint;
            scrollLeft -= halfwayPoint;
        }
        track.style.transform = `translateX(${posX}px)`;
    };

    // --- Event Listeners ---
    slider.addEventListener('mouseenter', pause);
    slider.addEventListener('mouseleave', () => {
        if (!isDown) {
            play();
        }
    });

    slider.addEventListener('mousedown', startDrag);
    window.addEventListener('mouseup', endDrag);
    slider.addEventListener('mousemove', onDrag);

    slider.addEventListener('touchstart', startDrag, { passive: true });
    window.addEventListener('touchend', endDrag);
    slider.addEventListener('touchmove', onDrag);

    // Start the autoplay
    play();

    // third page

    const card = document.getElementById('card');

    // Listen for mouse movement over the card
    card.addEventListener('mousemove', (e) => {
        // Get the position of the card relative to the viewport
        const rect = card.getBoundingClientRect();

        // Calculate the mouse position relative to the card's top-left corner
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Set the CSS custom properties on the card element.
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });

    // fourth page
    // 1. Setup Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.autoDisplay, .project-card').forEach(el => {
        observer.observe(el);
    });

    // 2. Video Play/Pause Logic
    const videoContainers = document.querySelectorAll('.project-vidbox');

    videoContainers.forEach(container => {
        const video = container.querySelector('video');
        const placeholder = container.querySelector('.video-placeholder');

        // Error handling for local video files that don't exist
        video.addEventListener('error', () => {
            video.style.display = 'none';
            if (placeholder) placeholder.style.display = 'flex';
        });

        container.addEventListener("mouseenter", () => {
            if (video.readyState >= 2) { // Only try to play if metadata is loaded
                video.play().catch(e => console.log("Auto-play prevented"));
                if (placeholder) placeholder.style.opacity = '0';
            }
        });

        container.addEventListener("mouseleave", () => {
            video.pause();
            if (placeholder) placeholder.style.opacity = '1';
        });
    });

    // fiveth page

    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        // Use pointer events for better touch support
        card.addEventListener('pointerenter', () => {
            card.classList.add('is-hovered');
        });

        card.addEventListener('pointerleave', () => {
            card.classList.remove('is-hovered');
        });

        // Also support touch to trigger hover state
        card.addEventListener('touchstart', () => {
            cards.forEach(c => c.classList.remove('is-hovered'));
            card.classList.add('is-hovered');
        }, { passive: true });
    });

    // Global click handler to remove hover on touch devices
    document.addEventListener('touchstart', (e) => {
        if (!e.target.closest('.card')) {
            cards.forEach(c => c.classList.remove('is-hovered'));
        }
    }, { passive: true });

    // sixth page
    const form = document.getElementById('contactForm');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Simple validation check
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const needs = document.getElementById('needs').value.trim();

        if (name === '' || email === '' || needs === '') {
            alert('Please fill out all required fields: Name, Email, and How can we help?');
            return;
        }

        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // If validation passes, show a success message
        alert('Thank you for getting in touch! We will respond shortly.');

        // Here you would typically send the data to a server, e.g., using fetch()
        // For this example, we'll just log it to the console and reset the form
        const formData = {
            name,
            email,
            company: document.getElementById('company').value.trim(),
            country: document.getElementById('country').value.trim(),
            needs
        };

        console.log('Form Submitted:', formData);

        form.reset();
    });

    // seven page

    const faqItems = document.querySelectorAll('.faq-item');

    // Set the initial state for the pre-opened item
    const activeItem = document.querySelector('.faq-item.active');
    if (activeItem) {
        const answerContainer = activeItem.querySelector('.faq-answer-container');
        answerContainer.style.maxHeight = answerContainer.scrollHeight + 'px';
    }

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const answerContainer = item.querySelector('.faq-answer-container');

            // Toggle the 'active' class on the clicked item
            item.classList.toggle('active');

            if (item.classList.contains('active')) {
                // If the item is now active, expand it
                answerContainer.style.maxHeight = answerContainer.scrollHeight + 'px';
            } else {
                // If the item is not active, collapse it
                answerContainer.style.maxHeight = '0px';
            }
        });
    });
});

// ===== AI Orb Canvas Animation =====
(function () {
    const canvases = document.querySelectorAll('.ai-orb__canvas');
    if (canvases.length === 0) return;

    const ctxs = Array.from(canvases).map(c => ({
        ctx: c.getContext('2d'),
        W: c.width,
        H: c.height
    }));

    let t = 0;

    function drawOrb() {
        ctxs.forEach(({ ctx, W, H }) => {
            ctx.clearRect(0, 0, W, H);

            // Base sphere gradient (white highlight top-left like the reference image)
            const baseGrad = ctx.createRadialGradient(W * 0.38, H * 0.3, 2, W / 2, H / 2, W / 2);
            baseGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
            baseGrad.addColorStop(0.2, 'rgba(200, 170, 255, 0.9)');
            baseGrad.addColorStop(0.5, 'rgba(130, 60, 255, 0.85)');
            baseGrad.addColorStop(0.8, 'rgba(60, 10, 160, 0.9)');
            baseGrad.addColorStop(1, 'rgba(20, 0, 80, 1)');

            ctx.beginPath();
            ctx.arc(W / 2, H / 2, W / 2 - 1, 0, Math.PI * 2);
            ctx.fillStyle = baseGrad;
            ctx.fill();

            // Animated colour sweep on top of the sphere
            const hue1 = (260 + Math.sin(t * 0.7) * 30) | 0;
            const hue2 = (200 + Math.cos(t * 0.5) * 40) | 0;
            const sweepGrad = ctx.createLinearGradient(
                W / 2 + Math.cos(t) * W * 0.3,
                H / 2 + Math.sin(t) * H * 0.3,
                W / 2 - Math.cos(t) * W * 0.3,
                H / 2 - Math.sin(t) * H * 0.3
            );
            sweepGrad.addColorStop(0, `hsla(${hue1}, 100%, 70%, 0.35)`);
            sweepGrad.addColorStop(0.5, `hsla(${hue2}, 90%, 55%, 0.2)`);
            sweepGrad.addColorStop(1, `hsla(${hue1 + 60}, 80%, 40%, 0.3)`);

            ctx.beginPath();
            ctx.arc(W / 2, H / 2, W / 2 - 1, 0, Math.PI * 2);
            ctx.fillStyle = sweepGrad;
            ctx.fill();

            // Specular highlight (white glint top-left)
            const specGrad = ctx.createRadialGradient(W * 0.34, H * 0.28, 0, W * 0.38, H * 0.35, W * 0.26);
            specGrad.addColorStop(0, 'rgba(255,255,255,0.75)');
            specGrad.addColorStop(0.5, 'rgba(255,255,255,0.15)');
            specGrad.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.beginPath();
            ctx.arc(W / 2, H / 2, W / 2 - 1, 0, Math.PI * 2);
            ctx.fillStyle = specGrad;
            ctx.fill();
        });

        t += 0.025;
        requestAnimationFrame(drawOrb);
    }
    drawOrb();
})();
// ===== End AI Orb Canvas Animation =====

// ===== Chatbot Widget Logic =====
(function () {
    const toggle = document.getElementById('chatbot-toggle');
    const window_ = document.getElementById('chatbot-window');
    const openIcon = document.getElementById('chatbot-open-icon');
    const closeIcon = document.getElementById('chatbot-close-icon');
    const messages = document.getElementById('chatbot-messages');
    const input = document.getElementById('chatbot-input');
    const sendBtn = document.getElementById('chatbot-send');
    const chips = document.querySelectorAll('.suggestion-chip');
    const tooltip = document.getElementById('chatbot-tooltip');

    let isOpen = false;
    let tooltipTypingTimer;
    const tooltipFullText = "I'M EMOTION AI ASSISTANT. CLICK TO<br>INTERACT WITH ME.";
    const tooltipWords = tooltipFullText.split(' ');

    toggle.addEventListener('mouseenter', () => {
        if (isOpen) return; // Hide tooltip if chat is open
        clearTimeout(tooltipTypingTimer);
        tooltip.innerHTML = '';
        let currentWordIndex = 0;

        function typeWord() {
            if (currentWordIndex < tooltipWords.length) {
                tooltip.innerHTML += (currentWordIndex > 0 ? ' ' : '') + tooltipWords[currentWordIndex];
                currentWordIndex++;
                tooltipTypingTimer = setTimeout(typeWord, 120); // 120ms per word
            }
        }

        typeWord();
    });

    toggle.addEventListener('mouseleave', () => {
        clearTimeout(tooltipTypingTimer);
    });

    // Knowledge base about Harsh
    const KB = [
        {
            keys: ['skill', 'tech', 'stack', 'language', 'know', 'expertise', 'technology'],
            reply: 'Harsh is skilled in:\n\n• <b>Frontend:</b> React.js, Next.js, HTML/CSS, Tailwind\n• <b>Backend:</b> Node.js, Express.js, Python\n• <b>Database:</b> MongoDB, MySQL\n• <b>AI/ML:</b> CrewAI, LangChain, Groq, OpenAI\n• <b>Tools:</b> Git, Docker, Vercel, Cloudinary'
        },
        {
            keys: ['project', 'work', 'build', 'portfolio', 'mockmate', 'made'],
            reply: 'Harsh has built some great projects:\n\n• <b>MockMate</b> – AI-driven mock data generator for NoSQL\n• <b>Podcast AI Pipeline</b> – Multi-agent AI podcast creator\n• <b>Portfolio Website</b> – The very site you\'re on!\n\nCheck the Projects section for live demos!'
        },
        {
            keys: ['contact', 'email', 'hire', 'reach', 'touch', 'message', 'talk'],
            reply: 'You can contact Harsh through the <b>Contact Form</b> on this page. Just scroll down to the "Talk to Sales" section and fill in your details — he typically responds within 24 hours!'
        },
        {
            keys: ['resume', 'cv', 'download', 'experience'],
            reply: 'You can view and download Harsh\'s resume here:\n\n<a href="https://drive.google.com/file/d/1rNNbxBWxi5PAiLo3LDK1PugITMDsMHNd/view?usp=sharing" target="_blank" style="color:#c4a8ff">Open Resume</a>'
        },
        {
            keys: ['achievements', 'education', 'study', 'college', 'background', 'story'],
            reply: 'Head to the <b>ACHIEVEMENTS</b> section on this page to see Harsh\'s educational background and career timeline!'
        },
        {
            keys: ['certification', 'certificate', 'course', 'achievements'],
            reply: 'Check out the <b>Certification</b> section of this portfolio to see all the courses and certifications Harsh has completed!'
        },
        {
            keys: ['who', 'harsh', 'about', 'introduce', 'tell me'],
            reply: 'Harsh Kumar is a passionate Full-Stack & AI developer who builds modern, scalable, and AI-powered web applications with exceptional user experiences.\n\nHe specializes in combining cutting-edge AI tools with clean, performant web apps.'
        },
        {
            keys: ['hi', 'hello', 'hey', 'greet', 'sup', 'hiya'],
            reply: 'Hi there! Great to see you exploring Harsh\'s portfolio. What would you like to know? You can ask about his skills, projects, or how to get in touch!'
        },
    ];

    function getBotReply(text) {
        const lower = text.toLowerCase();
        for (const item of KB) {
            if (item.keys.some(k => lower.includes(k))) return item.reply;
        }
        return "I'm not sure about that, but feel free to reach out via the contact form and Harsh will get back to you personally!";
    }

    function addMsg(html, role) {
        const div = document.createElement('div');
        div.className = `chat-msg ${role}`;
        const p = document.createElement('p');
        p.innerHTML = html;
        div.appendChild(p);
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
        return div;
    }

    function showTyping() {
        const div = document.createElement('div');
        div.className = 'chat-msg bot typing-indicator';
        div.innerHTML = '<p><span></span><span></span><span></span></p>';
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
        return div;
    }

    function handleSend(query) {
        const text = (query || input.value).trim();
        if (!text) return;
        input.value = '';

        addMsg(text, 'user');

        const typing = showTyping();
        setTimeout(() => {
            typing.remove();
            addMsg(getBotReply(text), 'bot');
        }, 900 + Math.random() * 400);
    }

    toggle.addEventListener('click', () => {
        isOpen = !isOpen;
        window_.classList.toggle('chatbot-hidden', !isOpen);
        toggle.classList.toggle('chat-open', isOpen);
        openIcon.style.display = isOpen ? 'none' : 'block';
        closeIcon.style.display = isOpen ? 'block' : 'none';
        if (isOpen) setTimeout(() => input.focus(), 300);
    });

    sendBtn.addEventListener('click', () => handleSend());
    input.addEventListener('keydown', e => { if (e.key === 'Enter') handleSend(); });

    chips.forEach(chip => {
        chip.addEventListener('click', () => handleSend(chip.dataset.query));
    });
})();
// ===== End Chatbot Widget Logic =====
