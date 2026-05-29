// Aesthetic Portfolio Client Script for Patil Ganesh Dashboard

document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // HTML5 CANVAS TWINKLING STAR FIELD EFFECT
    // ==========================================
    const addStarfield = () => {
        const canvas = document.createElement("canvas");
        canvas.id = "starfield-canvas";
        canvas.style.position = "fixed";
        canvas.style.top = "0";
        canvas.style.left = "0";
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.zIndex = "-8"; // Place behind card content but above background color
        canvas.style.pointerEvents = "none";
        document.body.appendChild(canvas);

        const ctx = canvas.getContext("2d");
        let stars = [];
        const numStars = 100;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        class Star {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.5;
                this.speed = Math.random() * 0.04 + 0.015;
                this.alpha = Math.random();
                this.alphaSpeed = Math.random() * 0.015 + 0.004;
            }
            update() {
                this.y -= this.speed;
                if (this.y < 0) {
                    this.reset();
                    this.y = canvas.height;
                }
                
                // Twinkle
                this.alpha += this.alphaSpeed;
                if (this.alpha > 1 || this.alpha < 0) {
                    this.alphaSpeed = -this.alphaSpeed;
                }
            }
            draw() {
                ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, Math.min(1, this.alpha))})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < numStars; i++) {
            stars.push(new Star());
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            stars.forEach(star => {
                star.update();
                star.draw();
            });
            requestAnimationFrame(animate);
        };
        animate();
    };
    addStarfield();

    // Dynamic Copyright Year
    const yearSpan = document.getElementById("current-year");
    if (yearSpan) {
        yearSpan.innerText = new Date().getFullYear();
    }

    // Dynamic Digital Clock & Date
    const clockEl = document.getElementById("digital-clock");
    const dateEl = document.getElementById("date-string");
    
    const updateTime = () => {
        const now = new Date();
        
        // Clock HH:MM:SS
        if (clockEl) {
            const hrs = String(now.getHours()).padStart(2, '0');
            const mins = String(now.getMinutes()).padStart(2, '0');
            const secs = String(now.getSeconds()).padStart(2, '0');
            clockEl.innerText = `${hrs}:${mins}:${secs}`;
        }
        
        // Date Month Day, Year
        if (dateEl) {
            const options = { month: 'short', day: 'numeric', year: 'numeric' };
            dateEl.innerText = now.toLocaleDateString('en-US', options).toUpperCase();
        }
    };
    setInterval(updateTime, 1000);
    updateTime(); // Run once initially

    // Mobile Hamburger Menu
    const menuBtn = document.querySelector(".menu-btn");
    const navLinks = document.querySelector(".nav-links");
    if (menuBtn && navLinks) {
        menuBtn.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            const icon = menuBtn.querySelector("i");
            if (icon) {
                icon.classList.toggle("fa-bars-staggered");
                icon.classList.toggle("fa-xmark");
            }
        });
        
        // Close menu on link click
        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
                const icon = menuBtn.querySelector("i");
                if (icon) {
                    icon.classList.add("fa-bars-staggered");
                    icon.classList.remove("fa-xmark");
                }
            });
        });
    }

    // Sticky Nav Link Active State Tracker
    const navLinkItems = document.querySelectorAll(".nav-links a");
    const sections = document.querySelectorAll("section");
    
    const trackActiveLink = () => {
        let currentSec = "";
        sections.forEach(sec => {
            const secTop = sec.offsetTop;
            const secHeight = sec.clientHeight;
            if (window.scrollY >= secTop - 150) {
                currentSec = sec.getAttribute("id");
            }
        });
        
        navLinkItems.forEach(item => {
            item.classList.remove("active");
            if (item.getAttribute("href") === `#${currentSec}`) {
                item.classList.add("active");
            }
        });
    };
    window.addEventListener("scroll", trackActiveLink);

    // Scroll Reveal Animations
    const reveals = document.querySelectorAll(".scroll-reveal");
    const revealOnScroll = () => {
        reveals.forEach(reveal => {
            const windowHeight = window.innerHeight;
            const elementTop = reveal.getBoundingClientRect().top;
            const elementVisible = 100;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add("active");
            }
        });
    };
    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll(); // Trigger once on load

    // Contact Form AJAX Submission
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector("button[type='submit']");
            const btnText = submitBtn.querySelector("span");
            const originalText = btnText.innerText;
            
            // Set Loading state
            submitBtn.disabled = true;
            btnText.innerText = "ESTABLISHING LINK...";
            
            const formData = {
                name: document.getElementById("form-name").value,
                email: document.getElementById("form-email").value,
                message: document.getElementById("form-message").value
            };
            
            try {
                const response = await fetch("/api/contact", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                });
                
                const result = await response.json();
                if (response.ok) {
                    alert("Message sent successfully! 🚀");
                    contactForm.reset();
                } else {
                    alert(`Error received: ${result.message || "Failed to send message."}`);
                }
            } catch (error) {
                console.error("AJAX Error:", error);
                alert("Communications tunnel link error. Please check if Flask app is running.");
            } finally {
                submitBtn.disabled = false;
                btnText.innerText = originalText;
            }
        });
    }
});
