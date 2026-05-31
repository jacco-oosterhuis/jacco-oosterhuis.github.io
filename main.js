// Main JavaScript for personal website

// ================================
// Shared Components (Header & Footer)
// ================================

function getHeaderHTML() {
    // Determine which page is active based on current URL
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    const navItems = [
        { href: 'index.html', label: 'Home' },
        { href: 'about.html', label: 'About' },
        { href: 'blog.html', label: 'Blog' },
        { href: 'media.html', label: 'Books & Films' }
    ];

    const navLinksHTML = navItems.map(item => {
        const isActive = currentPage === item.href ||
                        (currentPage === '' && item.href === 'index.html');
        return `<li><a href="${item.href}" class="nav-link${isActive ? ' active' : ''}">${item.label}</a></li>`;
    }).join('\n            ');

    return `
    <nav class="navbar">
        <div class="nav-brand">
            <a href="index.html"><span class="cursor">_</span> jacco<span class="accent">()</span></a>
        </div>
        <ul class="nav-links">
            ${navLinksHTML}
            <li><a href="https://www.linkedin.com/in/jaccooosterhuis" target="_blank" class="nav-link external">LinkedIn <span class="arrow">↗</span></a></li>
            <li><a href="https://findpenguins.com/trackingjacco" target="_blank" class="nav-link external">FindPenguins 🐧</a></li>
            <li><a href="https://signal.me/#eu/1UqXNpeCPD09OfTTiXSm3QoTIIsCrpMrh31p3CzmrLSIS87OgaVGq4cb5gGdtkgd" target="_blank" class="nav-link external">Signal</a></li>
        </ul>
        <div class="light-switch" title="Toggle light/dark mode">
            <div class="switch-plate" role="button" aria-label="Toggle theme">
                <div class="switch-toggle"></div>
            </div>
        </div>
        <button class="nav-toggle" aria-label="Toggle navigation">
            <span></span>
            <span></span>
            <span></span>
        </button>
    </nav>`;
}

function getFooterHTML() {
    return `
    <footer>
        <div class="wittgenstein-quote">
            <p class="quote-text" id="wittgenstein-text"></p>
            <p class="quote-source">— Ludwig Wittgenstein, <em>Philosophische Untersuchungen</em></p>
        </div>
        <div class="footer-main">
            <p>Coffee is an ideological experience | <span id="year"></span></p>
            <p class="footer-joke">What I propose, therefore, is very simple: it is nothing more than to think what we are doing. — Hannah Arendt </p>
        </div>
    </footer>`;
}

function injectComponents() {
    // Inject header
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        headerPlaceholder.outerHTML = getHeaderHTML();
    }

    // Inject footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        footerPlaceholder.outerHTML = getFooterHTML();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Inject header and footer components first
    injectComponents();

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
                'I don`t believe it man, life is kinda cool sometimes',
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

    // ================================
    // Blog Posts - Load from JSON & MD
    // ================================

    async function loadBlogPosts() {
        const container = document.getElementById('blog-posts-container');
        if (!container) return;

        try {
            const response = await fetch('data/blog.json');
            const posts = await response.json();

            if (posts.length === 0) {
                container.innerHTML = '<p class="section-intro">No posts yet. Stay tuned!</p>';
                return;
            }

            container.innerHTML = ''; // Clear loading spinner
            posts.forEach(post => {
                container.insertAdjacentHTML('beforeend', renderBlogPost(post));
            });

            setupBlogInteraction();
        } catch (error) {
            console.error('Could not load blog posts:', error);
            container.innerHTML = '<p class="section-intro">Error loading posts. Please try again later.</p>';
        }
    }

    function renderBlogPost(post) {
        const tagsHTML = post.tags.map(tag => `<span class="tag">#${tag}</span>`).join('');

        return `
            <article class="blog-card" data-post-id="${post.id}" data-file="${post.file}">
                <span class="blog-date">${post.date}</span>
                <h3>${post.title}</h3>
                <p class="blog-excerpt">${post.excerpt}</p>
                <div class="blog-tags">
                    ${tagsHTML}
                </div>
                <div class="blog-content">
                    <div class="loading-spinner">Loading content...</div>
                </div>
            </article>`;
    }

    function setupBlogInteraction() {
        const cards = document.querySelectorAll('.blog-card');

        cards.forEach(card => {
            card.addEventListener('click', async function() {
                if (this.classList.contains('expanded')) {
                    this.classList.remove('expanded');
                    return;
                }

                // Close other expanded cards
                cards.forEach(c => {
                    if (c !== this) c.classList.remove('expanded');
                });

                this.classList.add('expanded');

                // Load content if not already loaded
                const contentDiv = this.querySelector('.blog-content');
                if (contentDiv.getAttribute('data-loaded') !== 'true') {
                    const fileName = this.getAttribute('data-file');
                    try {
                        const response = await fetch(`posts/${fileName}`);
                        const markdown = await response.text();
                        contentDiv.innerHTML = marked.parse(markdown);
                        contentDiv.setAttribute('data-loaded', 'true');
                    } catch (error) {
                        console.error('Error loading post content:', error);
                        contentDiv.innerHTML = '<p>Error loading content. Please try again.</p>';
                    }
                }
            });
        });
    }

    // Initialize blog loading
    loadBlogPosts();


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
    // Books & Films - Load from JSON
    // ================================

    // Helper: convert rating number to stars
    function ratingToStars(rating) {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    }

    // Helper: get author's last name for spine
    function getLastName(author) {
        const parts = author.split(' ');
        return parts[parts.length - 1];
    }

    // Render a single book
    function renderBook(book, index) {
        return `
            <div class="book" data-book="${index}" style="--book-color: ${book.color}; --book-height: ${book.height}px;">
                <div class="book-spine">
                    <span class="book-title">${book.spineTitle || book.title}</span>
                    <span class="book-author">${getLastName(book.author)}</span>
                </div>
                <div class="book-details">
                    <h3>${book.title}</h3>
                    <p class="book-meta">${book.author} · ${book.year}</p>
                    <p class="book-review">${book.review}</p>
                    <span class="book-rating">${ratingToStars(book.rating)}</span>
                </div>
            </div>`;
    }

    // Render a single film (VHS or DVD)
    function renderFilm(film, index) {
        const spineTitle = film.spineTitle || film.title;

        if (film.format === 'vhs') {
            return `
                <div class="vhs-case" data-film="${index}">
                    <div class="vhs-spine">
                        <span class="vhs-title">${spineTitle}</span>
                        <span class="vhs-year">${film.year}</span>
                    </div>
                    <div class="vhs-front">
                        <div class="vhs-label">
                            <span class="vhs-title-full">${film.title}</span>
                            <span class="vhs-director">${film.director}</span>
                        </div>
                    </div>
                    <div class="film-details">
                        <h3>${film.title}</h3>
                        <p class="film-meta">${film.director} · ${film.year} · ${film.genre}</p>
                        <p class="film-review">${film.review}</p>
                        <span class="film-rating">${ratingToStars(film.rating)}</span>
                    </div>
                </div>`;
        } else {
            return `
                <div class="dvd-case" data-film="${index}">
                    <div class="dvd-spine">
                        <span class="dvd-title">${spineTitle}</span>
                    </div>
                    <div class="dvd-front">
                        <div class="dvd-cover">
                            <span class="dvd-title-full">${film.title}</span>
                            <span class="dvd-tagline">${film.tagline}</span>
                        </div>
                    </div>
                    <div class="film-details">
                        <h3>${film.title}</h3>
                        <p class="film-meta">${film.director} · ${film.year} · ${film.genre}</p>
                        <p class="film-review">${film.review}</p>
                        <span class="film-rating">${ratingToStars(film.rating)}</span>
                    </div>
                </div>`;
        }
    }

    // Setup accordion behavior for books and films
    function setupMediaAccordion() {
        const books = document.querySelectorAll('.book');
        const films = document.querySelectorAll('.vhs-case, .dvd-case');

        books.forEach(book => {
            book.addEventListener('click', function(e) {
                e.stopPropagation();
                const wasExpanded = this.classList.contains('expanded');
                books.forEach(b => b.classList.remove('expanded'));
                if (!wasExpanded) {
                    this.classList.add('expanded');
                }
            });
        });

        films.forEach(film => {
            film.addEventListener('click', function(e) {
                e.stopPropagation();
                const wasExpanded = this.classList.contains('expanded');
                films.forEach(f => f.classList.remove('expanded'));
                if (!wasExpanded) {
                    this.classList.add('expanded');
                }
            });
        });

        document.addEventListener('click', function(e) {
            if (!e.target.closest('.book') && !e.target.closest('.vhs-case') && !e.target.closest('.dvd-case')) {
                books.forEach(b => b.classList.remove('expanded'));
                films.forEach(f => f.classList.remove('expanded'));
            }
        });
    }

    // Load and render books
    async function loadBooks() {
        const container = document.getElementById('bookshelf-container');
        if (!container) return;

        try {
            const response = await fetch('data/books.json');
            const books = await response.json();

            const shelfWood = container.querySelector('.shelf-wood');
            const booksHTML = books.map((book, i) => renderBook(book, i)).join('');

            // Insert books before the shelf wood
            shelfWood.insertAdjacentHTML('beforebegin', booksHTML);
        } catch (error) {
            console.log('Could not load books:', error);
        }
    }

    // Load and render films
    async function loadFilms() {
        const container = document.getElementById('filmshelf-container');
        if (!container) return;

        try {
            const response = await fetch('data/films.json');
            const films = await response.json();

            container.innerHTML = films.map((film, i) => renderFilm(film, i)).join('');
        } catch (error) {
            console.log('Could not load films:', error);
        }
    }

    // Load media and setup accordion
    const bookshelfContainer = document.getElementById('bookshelf-container');
    const filmshelfContainer = document.getElementById('filmshelf-container');

    if (bookshelfContainer || filmshelfContainer) {
        Promise.all([loadBooks(), loadFilms()]).then(() => {
            setupMediaAccordion();
        });
    }

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
