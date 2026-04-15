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
                }, {passive: true});
            });
            
            // Global click handler to remove hover on touch devices
            document.addEventListener('touchstart', (e) => {
                if (!e.target.closest('.card')) {
                    cards.forEach(c => c.classList.remove('is-hovered'));
                }
            }, {passive: true});
         
            // sixth page
            const form = document.getElementById('contactForm');
            
            form.addEventListener('submit', function(event) {
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
    
