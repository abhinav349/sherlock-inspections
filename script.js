document.addEventListener('DOMContentLoaded', () => {

    // Preloader
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.style.overflow = 'auto';
        initAnimations();
    }, 1800);

    // Custom Cursor
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX - 4 + 'px';
        cursor.style.top = mouseY - 4 + 'px';
    });

    function animateFollower() {
        followerX += (mouseX - followerX) * 0.08;
        followerY += (mouseY - followerY) * 0.08;
        follower.style.left = followerX - 18 + 'px';
        follower.style.top = followerY - 18 + 'px';
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    document.querySelectorAll('a, button, .service-card, .price-card, .feature, .testimonial-card').forEach(el => {
        el.addEventListener('mouseenter', () => follower.classList.add('hover'));
        el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
    });

    // Navbar & Mobile Sticky CTA
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    const mobileCta = document.getElementById('mobileCta');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);

        if (mobileCta) {
            if (window.scrollY > 500) {
                mobileCta.classList.add('visible');
            } else {
                mobileCta.classList.remove('visible');
            }
        }
    });

    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => navLinks.classList.remove('active'));
    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const pos = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: pos, behavior: 'smooth' });
            }
        });
    });

    // Hero Particles
    const canvas = document.getElementById('heroParticles');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.fadeSpeed = Math.random() * 0.005 + 0.002;
            this.growing = Math.random() > 0.5;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.growing) {
                this.opacity += this.fadeSpeed;
                if (this.opacity >= 0.6) this.growing = false;
            } else {
                this.opacity -= this.fadeSpeed;
                if (this.opacity <= 0.05) this.growing = true;
            }
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(26, 39, 68, ${this.opacity})`;
            ctx.fill();
        }
    }

    function initParticles() {
        const count = Math.min(80, Math.floor(window.innerWidth / 15));
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(26, 39, 68, ${0.08 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        animationId = requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    // Scroll Reveal Animations
    function initAnimations() {
        const reveals = document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('active');
                    }, index * 80);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

        reveals.forEach(el => observer.observe(el));
    }

    // Counter Animation
    function animateCounters() {
        const stats = document.querySelectorAll('.stat[data-target]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const stat = entry.target;
                    const target = parseInt(stat.dataset.target);
                    const prefix = stat.dataset.prefix || '';
                    const suffix = stat.dataset.suffix || '';
                    const numberEl = stat.querySelector('.stat-number');
                    let current = 0;
                    const increment = target / 60;
                    const duration = 2000;
                    const stepTime = duration / 60;

                    function updateCounter() {
                        current += increment;
                        if (current < target) {
                            numberEl.textContent = prefix + Math.floor(current) + suffix;
                            setTimeout(updateCounter, stepTime);
                        } else {
                            numberEl.textContent = prefix + target + suffix;
                        }
                    }
                    updateCounter();
                    observer.unobserve(stat);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(stat => observer.observe(stat));
    }
    animateCounters();

    // 3D Tilt Effect for cards (desktop only)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouchDevice) {
        document.querySelectorAll('[data-tilt]').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // Form Handling — sends to Formsubmit
    const bookingForm = document.getElementById('bookingForm');
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = bookingForm.querySelector('button[type="submit"]');
        const btnSpan = btn.querySelector('span');
        const originalText = btnSpan.textContent;

        btn.disabled = true;
        btnSpan.textContent = 'Sending...';
        btn.style.opacity = '0.8';

        const formData = new FormData(bookingForm);

        fetch(bookingForm.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        })
        .then(response => {
            if (response.ok) {
                btnSpan.textContent = '✓ Booking Request Sent!';
                btn.style.background = 'linear-gradient(135deg, #48bb78, #38a169)';
                btn.style.boxShadow = '0 4px 20px rgba(72, 187, 120, 0.4)';
                btn.style.opacity = '1';
                bookingForm.reset();
            } else {
                throw new Error('Submission failed');
            }
        })
        .catch(() => {
            btnSpan.textContent = '✗ Error — please try again';
            btn.style.background = 'linear-gradient(135deg, #e53e3e, #c53030)';
            btn.style.boxShadow = '0 4px 20px rgba(229, 62, 62, 0.4)';
            btn.style.opacity = '1';
        })
        .finally(() => {
            setTimeout(() => {
                btnSpan.textContent = originalText;
                btn.style.background = '';
                btn.style.boxShadow = '';
                btn.disabled = false;
            }, 3500);
        });
    });

    // Parallax on mouse move for hero
    const hero = document.getElementById('hero');
    hero.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        const gradient = hero.querySelector('.hero-gradient');
        if (gradient) {
            gradient.style.transform = `translate(${x}px, ${y}px)`;
        }
    });

    // Live Google Reviews (top 3)
    initGoogleReviews();
});

/* ------------------------------------------------------------------
 * Google Places — fetch top reviews live and render testimonials
 * ------------------------------------------------------------------ */
const FALLBACK_GOOGLE_REVIEWS = {
    rating: 5,
    user_ratings_total: 11,
    reviews: [
        {
            author_name: 'Rukhsana',
            rating: 5,
            relative_time_description: 'Google review',
            text: 'Sherlock Home Inspections did a fantastic job. Shivam was thorough, calm, and professional throughout the inspection. His explanations were clear and helpful. The report was detailed and delivered quickly. Would definitely recommend.'
        },
        {
            author_name: 'Vishvesh Aggarwal',
            rating: 5,
            relative_time_description: 'Google review',
            text: 'Shivam did the excellent job. He guided me on all aspects of the house. Highly recommended'
        },
        {
            author_name: 'Rahul Kaira',
            rating: 5,
            relative_time_description: 'Google review',
            text: 'Friendly, knowledgeable and reliable. I would highly recommend Sherlock for your inspections.'
        }
    ]
};

function getReviewConfig() {
    return Object.assign({
        googleMapsApiKey: '',
        placeId: 'ChIJQ2n9SAAhWksRDf0OYUfOFMs',
        mapsUrl: 'https://maps.app.goo.gl/Snmxmp1NYea7dXof6?g_st=ic',
        maxReviews: 3
    }, window.SHERLOCK_CONFIG || {});
}

function loadGoogleMapsPlaces(apiKey) {
    return new Promise((resolve, reject) => {
        if (window.google && window.google.maps && window.google.maps.places) {
            resolve();
            return;
        }

        const existing = document.querySelector('script[data-google-maps-places]');
        if (existing) {
            existing.addEventListener('load', () => resolve());
            existing.addEventListener('error', () => reject(new Error('Google Maps failed to load')));
            return;
        }

        const callbackName = '__sherlockGoogleMapsReady';
        window[callbackName] = () => {
            delete window[callbackName];
            resolve();
        };

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places&callback=${callbackName}`;
        script.async = true;
        script.defer = true;
        script.dataset.googleMapsPlaces = '1';
        script.onerror = () => reject(new Error('Google Maps failed to load'));
        document.head.appendChild(script);
    });
}

function fetchPlaceReviewsLive(placeId) {
    return new Promise((resolve, reject) => {
        try {
            const service = new google.maps.places.PlacesService(document.createElement('div'));
            service.getDetails(
                {
                    placeId,
                    fields: ['name', 'rating', 'user_ratings_total', 'reviews', 'url']
                },
                (place, status) => {
                    if (status !== google.maps.places.PlacesServiceStatus.OK || !place) {
                        reject(new Error(`PlacesService status: ${status}`));
                        return;
                    }
                    resolve(place);
                }
            );
        } catch (err) {
            reject(err);
        }
    });
}

function pickTopReviews(reviews, limit) {
    return (reviews || [])
        .filter(r => r && r.text && String(r.text).trim().length > 0)
        .sort((a, b) => {
            const ratingDiff = (b.rating || 0) - (a.rating || 0);
            if (ratingDiff !== 0) return ratingDiff;
            return String(b.text || '').length - String(a.text || '').length;
        })
        .slice(0, limit);
}

function initialsFromName(name) {
    const parts = String(name || 'G').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return 'G';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function starsFromRating(rating) {
    const full = Math.round(Number(rating) || 0);
    return '★'.repeat(Math.max(0, Math.min(5, full))) + '☆'.repeat(Math.max(0, 5 - full));
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function renderTestimonials(place) {
    const config = getReviewConfig();
    const track = document.getElementById('testimonialsTrack');
    if (!track) return;

    const top = pickTopReviews(place.reviews, config.maxReviews);
    if (!top.length) {
        track.innerHTML = '<p class="testimonials-empty">No Google reviews available yet.</p>';
        return;
    }

    track.innerHTML = top.map(review => {
        const name = review.author_name || 'Google User';
        const relative = review.relative_time_description || 'Google review';
        const text = String(review.text || '').trim();
        const avatar = review.profile_photo_url
            ? `<img class="author-avatar-img" src="${escapeHtml(review.profile_photo_url)}" alt="" width="40" height="40" loading="lazy" referrerpolicy="no-referrer">`
            : `<div class="author-avatar">${escapeHtml(initialsFromName(name))}</div>`;

        return `
            <article class="testimonial-card reveal-up active">
                <div class="stars" aria-label="${escapeHtml(review.rating || 5)} out of 5 stars">${starsFromRating(review.rating)}</div>
                <p>"${escapeHtml(text)}"</p>
                <div class="testimonial-author">
                    ${avatar}
                    <div>
                        <strong>${escapeHtml(name)}</strong>
                        <span>${escapeHtml(relative)}</span>
                    </div>
                </div>
            </article>
        `;
    }).join('');

    // Re-bind hover cursor on new cards
    const follower = document.getElementById('cursorFollower');
    if (follower) {
        track.querySelectorAll('.testimonial-card').forEach(el => {
            el.addEventListener('mouseenter', () => follower.classList.add('hover'));
            el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
        });
    }

    updateGoogleRatingBadge(place, config);
}

function updateGoogleRatingBadge(place, config) {
    const badge = document.getElementById('googleRatingBadge');
    const attribution = document.getElementById('googleAttribution');
    if (!badge) return;

    const rating = Number(place.rating) || 0;
    const count = Number(place.user_ratings_total) || 0;
    const starsEl = document.getElementById('googleRatingStars');
    const valueEl = document.getElementById('googleRatingValue');
    const countEl = document.getElementById('googleRatingCount');
    const linkEl = badge.querySelector('.google-reviews-link');

    if (starsEl) starsEl.textContent = starsFromRating(rating);
    if (valueEl) valueEl.textContent = rating ? rating.toFixed(1) : '';
    if (countEl) {
        countEl.textContent = count
            ? `· ${count} Google review${count === 1 ? '' : 's'}`
            : '· Google reviews';
    }
    if (linkEl) linkEl.href = place.url || config.mapsUrl;

    badge.hidden = false;
    if (attribution) attribution.hidden = false;
}

async function initGoogleReviews() {
    const config = getReviewConfig();
    const track = document.getElementById('testimonialsTrack');
    if (!track) return;

    try {
        if (!config.googleMapsApiKey) {
            throw new Error('Missing Google Maps API key — using fallback reviews');
        }

        await loadGoogleMapsPlaces(config.googleMapsApiKey);
        const place = await fetchPlaceReviewsLive(config.placeId);
        renderTestimonials(place);
    } catch (err) {
        console.warn('[Sherlock] Live Google reviews unavailable:', err.message || err);
        renderTestimonials(FALLBACK_GOOGLE_REVIEWS);
    }
}
