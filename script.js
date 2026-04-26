// --- 0. AUTH ROUTE GUARD ---
window.isAutoSaving = false;
async function checkActiveSession() {
    // Wait a split second for Supabase to initialize
    const { data: { session } } = await supabaseClient.auth.getSession();
    
    // If a session exists and we are on the login/portfolio page, redirect to dashboard
    if (session) {
        window.location.href = 'KRdashboard.html';
    }
}
checkActiveSession();
// --- 1. INITIALIZATION & THEME MEMORY ---
const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

function toggleTheme() {
    const htmlElement = document.documentElement;
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    updateToggleText(newTheme);
}

function updateToggleText(theme) {
    const btn = document.getElementById('themeBtn');
    if (btn) {
        btn.textContent = theme === 'dark' ? "☀️ Lights On 🫦" : "🌙 Lights Off 🫦";
    }
}
updateToggleText(savedTheme);

// --- 2. LIVE CLOCK ---
function updateTime() {
    const clockEl = document.getElementById('clock');
    const dateEl = document.getElementById('date');
    if (!clockEl || !dateEl) return;

    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    dateEl.textContent = now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}
setInterval(updateTime, 1000);
updateTime();

// --- 3. SUPABASE CONFIGURATION ---
const SUPABASE_URL = 'https://pgufntgudhullqzcjgif.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Jsduk49oSdKHvQlWn7VPHQ_-YwqnLik';

let supabaseClient;
try {
    if (typeof supabase !== 'undefined') {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        const checkSession = async () => {
    const { data } = await supabaseClient.auth.getSession();
    
    if (data.session) {
        // 1. Check if the modal is open OR if our "Auto-Save" lock is on
        const calendarLoginModal = document.getElementById('calendar-login-modal');
        const isModalOpen = calendarLoginModal && calendarLoginModal.classList.contains('active');
        
        // 2. If we are in the middle of a calendar save, DO NOT redirect
        if (isModalOpen || window.isAutoSaving === true) {
            console.log("Staying on portfolio: Calendar save in progress.");
            document.documentElement.classList.add('auth-checked');
            return; // Stops the function here so location.replace never runs
        }

        // 3. Otherwise, if it's just a normal visit, go to dashboard
        window.location.replace('KRdashboard.html'); 
    } else {
        document.documentElement.classList.add('auth-checked');
    }
};

        // Run on initial load
        checkSession();

        // Run when hitting the "Back" button
        window.addEventListener('pageshow', (event) => {
            if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
                checkSession();
            }
        });

    } else {
        console.error("Supabase library not found.");
    }
} catch (e) {
    console.error("Supabase failed to initialize:", e);
}

// --- 4. MODAL (POP-UP) LOGIC ---
function openModal(card) {
    const modal = document.getElementById('modal-overlay');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;

    // --- CLEANUP SECTION ---
    // Remove specific theme classes and extra injected elements
    modal.classList.remove('profile-theme');
    const injectedElements = modal.querySelectorAll('.modal-external-text, .weather-wrapper');
    injectedElements.forEach(el => el.remove());
    // -----------------------

    // 1. Extract Data
    const cardId = card.getAttribute('data-id');
    const hiddenName = card.querySelector('.hidden-modal-name')?.innerText;
    const cardName = card.querySelector('h2, h3')?.innerText;
    const displayName = hiddenName || cardName || "Details";
    const role = card.querySelector('.profile-info p')?.innerText || ""; 
    const hiddenContent = card.querySelector('.modal-hidden-content');

    // 2. Build Internal Content
    modalBody.innerHTML = `
        <div class="modal-header">
            <h2 class="modal-display-name">${displayName}</h2>
            ${role ? `<p class="modal-role">${role}</p>` : ""}
        </div>
    `;

    // 3. Handle External Content
    if (hiddenContent) {
        const externalDiv = document.createElement('div');
        externalDiv.className = 'modal-external-text';
        externalDiv.innerHTML = hiddenContent.innerHTML;
        modalBody.after(externalDiv); 
    }

    // 4. Special Logic per Card ID
    if (cardId === "1") {
        // Frame 1: Modal is added to DOM flow
        requestAnimationFrame(() => {
            // Frame 2: Browser has calculated display: flex and sizes
            requestAnimationFrame(() => {
                renderCalendar();
            });
        });
    }
    if (cardId === "2") {
        modal.classList.add('profile-theme');
    }
    if (cardId === "4") {
        const weatherContainer = document.createElement('div');
        weatherContainer.className = 'weather-wrapper';
        // Put weather behind the content
        modal.insertBefore(weatherContainer, modal.firstChild);
        initWeather(weatherContainer);
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        const modal = document.getElementById('modal-overlay');
        if (modal && modal.classList.contains('active')) {
            closeModal(); 
        }
    }
});

function closeModal() {
    const modal = document.getElementById('modal-overlay');
    if (!modal || !modal.classList.contains('active')) return
    modal.classList.add('closing');
    setTimeout(() => {
        modal.classList.remove('active');
        modal.classList.remove('closing');
        document.body.style.overflow = 'auto';
        const external = modal.querySelector('.modal-external-text');
        const weather = modal.querySelector('.weather-wrapper');
        if (external) external.remove();
        if (weather) weather.remove();
    }, 1000); 
}

function initWeather(container) {
    container.innerHTML = `
        <div class="weather-zone" data-type="leaves"></div>
        <div class="weather-zone" data-type="snow"></div>
        <div class="weather-zone" data-type="rain"></div>
        <div class="weather-zone sunrays-zone"></div>
    `;

    const zones = [
        { type: 'leaves', icons: ['🍃', '🍂'], count: 15, anim: 'leafTumble' },
        { type: 'snow', icons: ['❄', '❅', '❆', '✻'], count: 30, anim: 'snowDrift' },
        { type: 'rain', icons: [''], count: 40, anim: 'rainDrop' }
    ];

    zones.forEach((zone, index) => {
        const zoneElement = container.querySelectorAll('.weather-zone')[index];
        
        for (let i = 0; i < zone.count; i++) {
            const p = document.createElement('div');
            p.className = `particle particle-${zone.type}`;
            
            if (zone.type !== 'rain') {
                p.innerHTML = zone.icons[Math.floor(Math.random() * zone.icons.length)];
            }

            const duration = zone.type === 'rain' ? Math.random() * 0.5 + 0.5 : Math.random() * 3 + 4;
            const delay = Math.random() * -10;
            
            p.style.left = Math.random() * 100 + '%';
            p.style.animation = `${zone.anim} ${duration}s linear infinite`;
            p.style.animationDelay = `${delay}s`;
            p.style.fontSize = zone.type === 'snow' ? (Math.random() * 5 + 5) + 'px' : '18px';
            p.style.opacity = Math.random() * 0.7 + 0.3;

            zoneElement.appendChild(p);
        }
    });
}

// --- 6. DYNAMIC STATUS ROTATOR ---
const statuses = ["Coding late...", "Designing...", "Gaming...", "Drinking Coffee ☕", "Busy..."];
let statusIndex = 0;

function rotateStatus() {
    const statusEl = document.getElementById('current-status');
    if (statusEl) {
        statusIndex = (statusIndex + 1) % statuses.length;
        statusEl.style.opacity = 0;
        setTimeout(() => {
            statusEl.textContent = statuses[statusIndex];
            statusEl.style.opacity = 1;
        }, 500);
    }
}
setInterval(rotateStatus, 5000);

// --- 7. CURSOR FOLLOWER ---
const follower = document.querySelector('.cursor-follower');
document.addEventListener('mousemove', (e) => {
    if (follower) {
        requestAnimationFrame(() => {
            follower.style.left = `${e.clientX}px`;
            follower.style.top = `${e.clientY}px`;
        });
    }
});

// --- 8. SUPABASE FORM & FILE HANDLING ---
let selectedFiles = [];
const contactForm = document.getElementById('contactForm');
const fileInput = document.getElementById('portfolio-file-upload');
const previewContainer = document.getElementById('filePreviewContainer');
const messageArea = document.getElementById('contactMessage');

if (fileInput) {
    fileInput.addEventListener('change', function() {
        const newFiles = Array.from(this.files);
        selectedFiles = [...selectedFiles, ...newFiles];
        renderPreviews();
        this.value = "";
    });
}

function renderPreviews() {
    if (!previewContainer) return;
    previewContainer.innerHTML = "";
    selectedFiles.forEach((file, index) => {
        const pill = document.createElement('div');
        pill.className = 'file-pill';
        pill.innerHTML = `
            <span>${file.name}</span>
            <span class="remove-pill" onclick="removeFile(${index})">&times;</span>
        `;
        previewContainer.appendChild(pill);
    });
}

window.removeFile = function(index) {
    selectedFiles.splice(index, 1);
    renderPreviews();
};

if (messageArea) {
    messageArea.addEventListener('input', function() {
        this.style.height = 'auto';
        const newHeight = this.scrollHeight;
        this.style.height = newHeight + 'px';
        this.style.overflowY = newHeight > 150 ? 'auto' : 'hidden';
    });
}

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const btn = document.getElementById('submitBtn');
        const nicknameValue = document.getElementById('contactNickname').value;
        const messageValue = document.getElementById('contactMessage').value;
        const alertBox = document.getElementById('success-alert');

        if (!supabaseClient) {
            console.error("Database connection not established.");
            alert("Connection error. Please try again later.");
            return;
        }

        btn.disabled = true;
        btn.textContent = "Sending...";

        try {
            let urls = [];
            for (const file of selectedFiles) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
                const { error: uploadError } = await supabaseClient.storage.from('portfolio_uploads').upload(fileName, file);
                if (uploadError) throw uploadError;
                const { data: urlData } = supabaseClient.storage.from('portfolio_uploads').getPublicUrl(fileName);
                urls.push(urlData.publicUrl);
            }

            const { error: insertError } = await supabaseClient.from('contact_messages').insert([{ 
                nickname: nicknameValue, 
                message: messageValue, 
                file_url: urls.length > 0 ? urls.join(', ') : null 
            }]);

            if (insertError) throw insertError;

            btn.textContent = "Sent! ✨";
            this.reset();
            selectedFiles = [];
            renderPreviews();
            if (alertBox) {
                alertBox.classList.add('show');
                setTimeout(() => alertBox.classList.remove('show'), 3000);
            }
        } catch (error) {
            btn.textContent = "Error! ❌";
            alert("Error: " + error.message);
        } finally {
            setTimeout(() => {
                btn.disabled = false;
                btn.textContent = "Send";
                if (messageArea) messageArea.style.height = 'auto';
            }, 3000);
        }
    });
}

// --- 9. BENTO GRID SORTABLE ---
document.addEventListener('DOMContentLoaded', function() {
    const gridContainer = document.querySelector('.bento-container');
    if (gridContainer) {
        const savedOrder = localStorage.getItem('bento-layout');
        if (savedOrder) {
            const orderArray = savedOrder.split('|');
            orderArray.forEach(id => {
                const card = gridContainer.querySelector(`[data-id="${id}"]`);
                if (card) gridContainer.appendChild(card);
            });
        }

        new Sortable(gridContainer, {
            swap: true, 
            swapClass: 'swap-highlight', 
            animation: 250,
            draggable: '.card', 
            filter: '.filter-bar',
            preventOnFilter: true,
            onEnd: function() {
                const cards = gridContainer.querySelectorAll('.card');
                const order = [];
                cards.forEach(card => order.push(card.getAttribute('data-id')));
                localStorage.setItem('bento-layout', order.join('|'));
            }
        });
    }
});

// --- 10. HARMONY AMBIENCE ---
let harmonyAmbient = null;
function playSeason(season) {
    if (harmonyAmbient) {
        harmonyAmbient.pause();
        harmonyAmbient.currentTime = 0;
    }
    const soundFiles = {
        spring: 'sounds/Green_Despair.mp3',
        summer: 'sounds/Desert_Scream.mp3',
        autumn: 'sounds/Port_Lux.mp3',
        winter: 'sounds/Bloody_Ice.mp3'
    };
    harmonyAmbient = new Audio(soundFiles[season]);
    harmonyAmbient.loop = true;
    harmonyAmbient.volume = 0.5;
    harmonyAmbient.play();
}

// --- 11. NAVIGATION & SCROLL LOGIC ---
const navItems = document.querySelectorAll('.nav-item');
const indicator = document.querySelector('.nav-indicator');
const sections = document.querySelectorAll('section[id]');

function updateNav() {
    let current = "";
    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 60) {
            current = section.getAttribute("id");
        }
    });
    navItems.forEach((item) => {
        item.classList.remove("active");
        if (item.getAttribute("href").includes(current)) {
            item.classList.add("active");
            const { offsetLeft, offsetWidth } = item;
            if(indicator) {
                indicator.style.left = `${offsetLeft}px`;
                indicator.style.width = `${offsetWidth}px`;
            }
        }
    });
}
window.addEventListener("scroll", updateNav);
window.addEventListener("load", updateNav);

// --- 12. PROJECT SHOWCASE ---
const projectData = {
    'student-pal': {
        title: "<b>Student Pal</b>",
        tag: "Mobile App",
        image: "Student Pal/SPpreview.jpg",
        description: "provides students with a centralized and user-friendly application that helps them keep track of their schedules, tasks, and studies in one place. The system aims to improve organization, time management, and productivity while reducing academic stress. Through this project, Student Pal seeks to contribute a simple yet effective digital solution that supports students in managing their academic responsibilities and staying ahead in their daily school life.",
        tech: ["Visual Studio", ".Net MAUI", "Supabase", "SQLite"]
    }
};

function openProjectShowcase(projectId) {
    const data = projectData[projectId];
    const body = document.getElementById('project-showcase-body');
    const overlay = document.getElementById('project-overlay');
    if (!data || !body || !overlay) return;

    body.innerHTML = `
        <div style="display: flex; gap: 40px; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 300px;">
                <img src="${data.image}" style="width: 100%; border-radius: 20px;">
            </div>
            <div style="flex: 1; min-width: 300px;">
                <span class="tag">${data.tag}</span>
                <h2>${data.title}</h2>
                <p>${data.description}</p>
                <div style="margin-top: 30px;">
                    <h4>Technologies Used:</h4>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        ${data.tech.map(t => `<span class="skill-item">${t}</span>`).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProjectShowcase() {
    const overlay = document.getElementById('project-overlay');
    if(overlay) overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// --- 13. AUTHENTICATION (UPDATED WITH GLASS ALERTS) ---
window.toggleLogin = function() {
    const form = document.getElementById('loginForm');
    if (form) form.classList.toggle('active');
};

const loginBtn = document.getElementById('btnLogin');
if (loginBtn) {
    loginBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        let email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPass').value.trim();

        if (!email.includes('@')) {
            email = email + "@gmail.com";
        }

        loginBtn.innerText = "Connecting...";

        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

        if (error) {
            showLoginAlert('error', 'Login Failed', error.message);
            loginBtn.innerText = "Login";
        } else {
            showLoginAlert('success', 'Access Granted', 'Redirecting to your dashboard...');
            setTimeout(() => { window.location.replace('KRdashboard.html'); }, 2000);
        }
    });
}

function showLoginAlert(type, title, message) {
    const overlay = document.getElementById('login-alert');
    const iconBg = document.getElementById('login-alert-icon-bg');
    const icon = document.getElementById('login-alert-icon');
    
    document.getElementById('login-alert-title').innerText = title;
    document.getElementById('login-alert-message').innerText = message;

    if (type === 'success') {
        iconBg.className = "w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/30 bg-emerald-500/20";
        icon.className = "fa-solid fa-shield-check text-emerald-400 text-3xl";
    } else {
        iconBg.className = "w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-amber-500/30 bg-amber-500/20";
        icon.className = "fa-solid fa-triangle-exclamation text-amber-400 text-3xl";
    }

    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
}

window.closeLoginAlert = function() {
    const alert = document.getElementById('login-alert');
    if(alert) {
        alert.classList.add('hidden');
        alert.classList.remove('flex');
    }
};

// Smooth Scrolling for nav items
document.querySelectorAll('.nav-item').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
    });
});

// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    const timeCard = document.querySelector('.time-card');
    const firstPage = document.querySelector('#home'); // Change this to your first section's ID

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // If the first page is LESS than 10% visible
            if (!entry.isIntersecting) {
                timeCard.classList.add('floating');
            } else {
                timeCard.classList.remove('floating');
            }
        });
    }, {
        threshold: 0.1 // Triggers when only 10% of the first page is left
    });

    observer.observe(firstPage);
});

window.addEventListener('scroll', () => {
    const timeCard = document.querySelector('.time-card');
    
    // Triggers when you scroll past 350 pixels
    if (window.scrollY > 350) {
        timeCard.classList.add('floating');
    } else {
        timeCard.classList.remove('floating');
    }
});

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// --- CALENDAR LOGIC ---

/**
 * Renders the calendar days and header.
 * Uses scoped selection to ensure it targets the version of the calendar 
 * currently visible inside the active modal.
 */
function renderCalendar() {
    // 1. Target the ACTIVE modal specifically to avoid "ghost" hidden templates
    const activeModal = document.querySelector('.modal-overlay.active');
    if (!activeModal) return;

    const daysContainer = activeModal.querySelector('#calendar-days');
    const monthYearLabel = activeModal.querySelector('#calendar-month-year');
    
    if (!daysContainer || !monthYearLabel) {
        console.warn("Calendar elements not found in active modal.");
        return;
    }

    // 2. Clear previous content and force layout
    daysContainer.innerHTML = '';
    daysContainer.style.display = 'grid';

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date();

    // 3. Update Header
    monthYearLabel.innerText = new Intl.DateTimeFormat('en-US', { 
        month: 'long', year: 'numeric' 
    }).format(new Date(currentYear, currentMonth));

    // 4. Add Empty Slots (Days from previous month)
    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'calendar-day empty';
        daysContainer.appendChild(emptyDiv);
    }

    // 5. Add Actual Days
    for (let i = 1; i <= lastDay; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        
        // Highlight current day
        if (i === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
            dayDiv.classList.add('today');
        }
        
        dayDiv.innerText = i;
        dayDiv.onclick = (e) => {
            e.stopPropagation();
            selectDay(dayDiv, i);
        };
        daysContainer.appendChild(dayDiv);
    }
}

function selectDay(dayElement, dayNumber) {
    const activeModal = document.querySelector('.modal-overlay.active');
    if (!activeModal) return;

    
    const days = activeModal.querySelectorAll('.calendar-day');
    const label = activeModal.querySelector('#selected-date-label');
    const input = activeModal.querySelector('#day-notes-input');
    const dateKey = `${currentYear}-${currentMonth + 1}-${dayNumber}`; // Ensure month is 1-12
    
    // THIS IS THE IMPORTANT PART:
    input.dataset.currentDateKey = dateKey; 
    
    // Optional: Clear or load existing text
    input.value = "";

    days.forEach(d => d.classList.remove('selected'));
    dayElement.classList.add('selected');
    
    const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' })
        .format(new Date(currentYear, currentMonth));
    
    if (label) label.innerText = `${monthName} ${dayNumber}, ${currentYear}`;
    if (input) input.focus();
}

/**
 * Navigates between months
 */
function changeMonth(direction) {
    currentMonth += direction;

    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }

    renderCalendar();
}

// 1. Update the check inside saveNote()
async function saveNote() {
    const activeModal = document.querySelector('.modal-overlay.active');
    const input = activeModal ? activeModal.querySelector('#day-notes-input') : document.querySelector('#day-notes-input');
    const saveBtn = document.getElementById('save-note-btn');

    // 1. Validation check
    if (!input || !input.dataset.currentDateKey) {
        console.error("No date selected.");
        return;
    }

    const dateKey = input.dataset.currentDateKey;
    const noteText = input.value.trim();

    // 2. SAFETY CHECK: Attempt to get user, but don't crash if supabase is undefined
    let user = null;
    try {
        if (typeof supabase !== 'undefined' && supabase.auth) {
            const { data, error } = await supabase.auth.getUser();
            if (!error && data) {
                user = data.user;
            }
        }
    } catch (err) {
        console.warn("Supabase Auth not ready, proceeding to login popup.");
    }

    // 3. Trigger Login Popup if no user is found
    if (!user) {
        window.pendingNote = { key: dateKey, text: noteText };
        
        const loginPopup = document.getElementById('calendar-login-modal');
        if (loginPopup) {
            loginPopup.classList.add('active');
        } else {
            alert("Please login to save notes.");
        }
        return; 
    }

    // 4. If logged in, proceed to save
    await performActualSave(dateKey, noteText);
}

// 5. Handler for the "Sign In & Save" button
async function handleCalendarLogin() {
    // 1. SET THE LOCK IMMEDIATELY
    // This stops checkSession from redirecting the moment login succeeds
    window.isAutoSaving = true;

    const emailInput = document.getElementById('cal-email').value.trim();
    const password = document.getElementById('cal-password').value;
    const loginBtn = document.querySelector('#calendar-login-modal .button1');

    // --- SMART EMAIL RULE ---
    let finalEmail = emailInput;
    if (emailInput && !emailInput.includes('@')) {
        finalEmail = emailInput + "@gmail.com";
    }

    if (loginBtn) loginBtn.innerText = "Authenticating...";

    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: finalEmail,
            password: password,
        });

        if (error) {
            // Unlock if login fails so the user can try again or navigate normally
            window.isAutoSaving = false;
            throw error;
        }

        // 2. Success: Hide popup and overlay
        // Even though the modal class "active" is removed here, 
        // the global window.isAutoSaving lock stays TRUE.
        closeCalendarLogin();
        
        // 3. AUTO-SAVE: If a note was waiting, save it now
        if (window.pendingNote) {
            console.log("Auto-saving for:", finalEmail);
            await performActualSave(window.pendingNote.key, window.pendingNote.text);
            window.pendingNote = null; 
        }

        // 4. FINISHED: You can now set this to false if you want them 
        // to be redirected on their next page action/refresh.
        // window.isAutoSaving = false; 

    } catch (error) {
        window.isAutoSaving = false; // Important: Unlock on error
        console.error("Login Error:", error.message);
        alert("Login failed: " + error.message);
    } finally {
        if (loginBtn) loginBtn.innerText = "Sign In & Save";
    }
}

async function performActualSave(dateKey, noteText) {
    const saveBtn = document.getElementById('save-note-btn');
    if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.innerText = "Saving...";
    }

    try {
        // Change: Use supabaseClient instead of supabase
        const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
        
        if (userError || !user) throw new Error("Authentication session lost. Please login again.");
        
        const { error } = await supabaseClient
            .from('calendar_notes')
            .upsert({ 
                date_key: dateKey, 
                note_text: noteText,
                user_id: user.id 
            }, { onConflict: 'user_id,date_key' });

        if (error) throw error;

        // Feedback
        // Inside performActualSave function, replace alert("Note saved!") with:
if (saveBtn) {
    saveBtn.innerText = "Saved!";
    showGlassToast(); // Trigger the glass alert
    
    setTimeout(() => {
        saveBtn.disabled = false;
        saveBtn.innerText = "Save Note";
    }, 2000);
}

        if (typeof renderCalendar === "function") renderCalendar(); 

    } catch (err) {
        console.error("Save Error:", err.message);
        alert("Failed to save: " + err.message);
        if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.innerText = "Try Again";
        }
    }
}

function closeCalendarLogin() {
    // Closes the popup
    const modal = document.getElementById('calendar-login-modal');
    if (modal) modal.classList.remove('active');
    
    // Also closes the overlay/backdrop if you added it
    const overlay = document.getElementById('login-overlay');
    if (overlay) overlay.classList.remove('active');
}

function showGlassToast() {
    const toast = document.getElementById('glass-toast');
    const overlay = document.getElementById('toast-overlay');
    
    if (toast && overlay) {
        toast.classList.add('active');
        overlay.classList.add('active');
        
        // 1. Disable Mouse Scrolling
        document.body.style.overflow = 'hidden';
        
        // 2. Disable Keyboard Keys (Space, Arrows, Esc)
        window.addEventListener('keydown', blockKeys);
    }
}

function blockKeys(e) {
    // List of keys to disable: Space, ArrowUp, ArrowDown, PageUp, PageDown, End, Home, Esc
    const forbiddenKeys = [' ', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'End', 'Home', 'Escape'];
    if (forbiddenKeys.includes(e.key)) {
        e.preventDefault();
        return false;
    }
}

function startGame() {
    // 1. Target using the IDs you defined in your HTML
    const modal = document.getElementById('siModal');
    const iframe = document.getElementById('gameIframe');
    
    // 2. Open the popup
    if (modal) {
        modal.style.display = 'flex';
        // Stop the dashboard background from moving
        document.body.style.overflow = 'hidden';
    }
    
    // 3. Load the game with the correct relative path
    if (iframe) {
        // Based on your folder screenshot: go up one level, then into Space Impact
        iframe.src = "../Space Impact/SI.html"; 
        
        // Wait a tiny bit for the iframe to load, then focus it for controls
        iframe.onload = function() {
            iframe.contentWindow.focus();
        };
    }
}

function closeGame() {
    const modal = document.getElementById('siModal');
    const iframe = document.getElementById('gameIframe');

    // 1. STOP THE GAME (The Kill Switch)
    // We set the source to 'about:blank'. 
    // This is a browser-native empty page that has 0% CPU usage.
    if (iframe) {
        iframe.src = "about:blank"; 
        // Force the iframe to stop any remaining sounds/logic
        iframe.outerHTML = iframe.outerHTML; 
    }

    // 2. HIDE THE UI
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable dashboard scrolling
    }
}