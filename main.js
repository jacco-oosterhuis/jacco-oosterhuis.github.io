// Main JavaScript for personal website

document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // ================================
    // Theme Toggle (Light Switch)
    // ================================
    const lightSwitch = document.querySelector('.switch-plate');

    // Load saved theme or default to dark
    function loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.body.setAttribute('data-theme', savedTheme);
        return savedTheme;
    }

    // Toggle theme
    function toggleTheme() {
        const currentTheme = document.body.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // Play a subtle click sound effect (optional fun touch)
        playClickSound();
    }

    // Simple click sound using Web Audio API
    function playClickSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            // Audio not supported, that's fine
        }
    }

    // Initialize theme
    loadTheme();

    // Add click listener to light switch
    if (lightSwitch) {
        lightSwitch.addEventListener('click', toggleTheme);
    }

    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    navToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });

    // Close mobile nav when clicking a link
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
        });
    });

    // Duck-Rabbit interaction (only on home page)
    const duckRabbit = document.getElementById('duckRabbit');
    const animalText = document.getElementById('animal');

    if (duckRabbit && animalText) {
        let isDuck = true;

        function toggleAnimal() {
            isDuck = !isDuck;
            animalText.textContent = isDuck ? 'duck' : 'rabbit';
            duckRabbit.classList.toggle('flipped');
        }

        duckRabbit.addEventListener('click', toggleAnimal);
        animalText.addEventListener('click', toggleAnimal);
    }

    // Rotating tagline text (only on home page)
    const rotatingElement = document.getElementById('rotating-text');

    if (rotatingElement) {
        const rotatingTexts = [
            'penguin tracker',
            'scatter plot philosopher',
            'data wrangler',
            'bug hunter',
            'coffee-to-code converter',
            'NaN debugger',
            'regex enthusiast',
            'p-value skeptic'
        ];

        let currentIndex = 0;

        function rotateText() {
            rotatingElement.style.opacity = '0';

            setTimeout(() => {
                currentIndex = (currentIndex + 1) % rotatingTexts.length;
                rotatingElement.textContent = rotatingTexts[currentIndex];
                rotatingElement.style.opacity = '1';
            }, 300);
        }

        // Rotate text every 3 seconds
        setInterval(rotateText, 3000);

        // Add transition for rotating text
        rotatingElement.style.transition = 'opacity 0.3s ease';
    }

    // Smooth scroll for anchor links (backup for browsers without CSS smooth scroll)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Jupyter Lab cell interaction
    const jupyterCells = document.querySelectorAll('.jupyter-cell');
    let selectedCell = null;

    // Click to select a cell
    jupyterCells.forEach(cell => {
        cell.addEventListener('click', function() {
            // Remove selection from previous cell
            if (selectedCell) {
                selectedCell.classList.remove('selected');
            }
            // Select this cell
            selectedCell = this;
            this.classList.add('selected');
            this.focus();
        });
    });

    // Shift+Enter to "run" a cell
    document.addEventListener('keydown', function(e) {
        if (e.shiftKey && e.key === 'Enter' && selectedCell) {
            e.preventDefault();
            runJupyterCell(selectedCell);
        }
    });

    function runJupyterCell(cell) {
        // Remove any existing gotcha output
        const existingGotcha = cell.querySelector('.gotcha-output');
        if (existingGotcha) {
            existingGotcha.remove();
        }

        // Add visual "running" effect
        const cellContent = cell.querySelector('.cell-content');
        cell.style.opacity = '0.7';

        setTimeout(() => {
            cell.style.opacity = '1';

            // Create the gotcha message
            const gotchaDiv = document.createElement('div');
            gotchaDiv.className = 'gotcha-output';

            const messages = [
                '😏 Haha, gotcha!',
                '🎭 Nice try! This is just a website.',
                '🐧 Did you really think this would run?',
                '📊 Error: Reality not found',
                '🤖 I\'m not a real Jupyter notebook... or am I?',
                '☕ Kernel panic: Coffee required',
                '🧠 RuntimeError: This is all an illusion'
            ];

            gotchaDiv.textContent = messages[Math.floor(Math.random() * messages.length)];
            cellContent.appendChild(gotchaDiv);

            // Remove the message after a few seconds
            setTimeout(() => {
                gotchaDiv.style.opacity = '0';
                gotchaDiv.style.transition = 'opacity 0.5s ease';
                setTimeout(() => gotchaDiv.remove(), 500);
            }, 3000);
        }, 300);
    }

    // Easter egg: Konami code
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', function(e) {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    function activateEasterEgg() {
        document.body.style.transition = 'transform 0.5s ease';
        document.body.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            document.body.style.transform = 'rotate(0deg)';
            alert('🐧 Achievement Unlocked: You found the Konami Code! You are a true nerd.');
        }, 500);
    }

    // Console message for fellow developers
    console.log('%c Welcome, fellow human! 🤖', 'font-size: 20px; color: #7aa2f7;');
    console.log('%c If you\'re reading this, you\'re my kind of person.', 'font-size: 14px; color: #9ece6a;');
    console.log('%c Fun fact: P(you finding this) ≈ 0.01', 'font-size: 12px; color: #bb9af7;');

    // Add scroll-triggered animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe sections for scroll animations
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // ================================
    // Books & Films Accordion
    // ================================
    const books = document.querySelectorAll('.book');
    const films = document.querySelectorAll('.vhs-case, .dvd-case');

    // Book accordion - click to expand/collapse
    books.forEach(book => {
        book.addEventListener('click', function(e) {
            e.stopPropagation();
            const wasExpanded = this.classList.contains('expanded');

            // Close all books
            books.forEach(b => b.classList.remove('expanded'));

            // If it wasn't expanded, expand it
            if (!wasExpanded) {
                this.classList.add('expanded');
            }
        });
    });

    // Film accordion - click to expand/collapse
    films.forEach(film => {
        film.addEventListener('click', function(e) {
            e.stopPropagation();
            const wasExpanded = this.classList.contains('expanded');

            // Close all films
            films.forEach(f => f.classList.remove('expanded'));

            // If it wasn't expanded, expand it
            if (!wasExpanded) {
                this.classList.add('expanded');
            }
        });
    });

    // Close expanded items when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.book') && !e.target.closest('.vhs-case') && !e.target.closest('.dvd-case')) {
            books.forEach(b => b.classList.remove('expanded'));
            films.forEach(f => f.classList.remove('expanded'));
        }
    });

    // ================================
    // Wittgenstein Quotes
    // ================================
    const quoteElement = document.getElementById('wittgenstein-text');

    if (quoteElement) {
        let quotes = [];
        let currentQuoteIndex = -1;

        // Load and parse the Philosophische Untersuchungen
        async function loadQuotes() {
            try {
                const response = await fetch('extra/phil_untersuchungen.txt');
                const text = await response.text();

                // Skip the Vorwort (first few lines until we hit "1.")
                const mainTextStart = text.indexOf('\n1.');
                if (mainTextStart === -1) return;

                const mainText = text.substring(mainTextStart);

                // Extract quotable passages
                // Split by section numbers and extract meaningful sentences
                const sections = mainText.split(/\n\d+\.\s+/);

                sections.forEach(section => {
                    if (!section.trim()) return;

                    // Split into sentences and filter for good quote length
                    const sentences = section
                        .replace(/\n/g, ' ')
                        .replace(/\s+/g, ' ')
                        .split(/(?<=[.!?])\s+/)
                        .map(s => s.trim())
                        .filter(s => {
                            // Good quote: between 40 and 250 characters
                            // Not starting with certain patterns
                            return s.length >= 40 &&
                                   s.length <= 250 &&
                                   !s.startsWith('–') &&
                                   !s.startsWith('(') &&
                                   !s.match(/^[a-z]/) && // Don't start mid-sentence
                                   !s.includes('§') &&
                                   !s.includes('(1)') &&
                                   !s.includes('(2)') &&
                                   s.split(' ').length >= 5; // At least 5 words
                        });

                    quotes.push(...sentences);
                });

                // Remove duplicates
                quotes = [...new Set(quotes)];

                // Shuffle the quotes array
                for (let i = quotes.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [quotes[i], quotes[j]] = [quotes[j], quotes[i]];
                }

                // Display first quote
                if (quotes.length > 0) {
                    displayNextQuote();
                }

            } catch (error) {
                console.log('Could not load Wittgenstein quotes:', error);
                quoteElement.textContent = 'Die Grenzen meiner Sprache bedeuten die Grenzen meiner Welt.';
            }
        }

        function displayNextQuote() {
            if (quotes.length === 0) return;

            // Fade out current quote
            quoteElement.classList.add('fade-out');

            setTimeout(() => {
                // Move to next quote (loop around)
                currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
                quoteElement.textContent = quotes[currentQuoteIndex];

                // Fade in new quote
                quoteElement.classList.remove('fade-out');
            }, 100);
        }

        // Load quotes and start rotation
        loadQuotes();

        // Rotate quote every 60 seconds
        setInterval(displayNextQuote, 60000);
    }
});
