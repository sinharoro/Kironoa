const _supabase = supabase.createClient('https://pgufntgudhullqzcjgif.supabase.co', 'sb_publishable_Jsduk49oSdKHvQlWn7VPHQ_-YwqnLik');

// Store data globally to allow for local searching/filtering
let allMessages = [];

/**
 * Switch between Dashboard and Messages views
 */
function switchView(viewName) {
    const dashboardView = document.getElementById('dashboard-view');
    const messagesView = document.getElementById('messages-view');
    const navDashboard = document.getElementById('nav-dashboard');
    const navMessages = document.getElementById('nav-messages');

    if (viewName === 'dashboard') {
        dashboardView.classList.replace('hidden', 'block');
        messagesView.classList.replace('block', 'hidden');
        // Update Nav Styles
        navDashboard.className = "flex items-center px-6 py-3 bg-emerald-500 text-white transition";
        navMessages.className = "flex items-center px-6 py-3 text-gray-400 hover:bg-slate-800 hover:text-white transition";
    } else {
        dashboardView.classList.replace('block', 'hidden');
        messagesView.classList.replace('hidden', 'block');
        // Update Nav Styles
        navMessages.className = "flex items-center px-6 py-3 bg-emerald-500 text-white transition";
        navDashboard.className = "flex items-center px-6 py-3 text-gray-400 hover:bg-slate-800 hover:text-white transition";
    }
}

/**
 * Search Logic: Filters the global allMessages array
 */
document.getElementById('search-input').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = allMessages.filter(msg => 
        (msg.nickname && msg.nickname.toLowerCase().includes(searchTerm)) || 
        (msg.message && msg.message.toLowerCase().includes(searchTerm))
    );
    renderTable(filtered);
});

/**
 * Updates the Personal Dashboard Stats Cards
 */
function updateDashboardStats(data) {
    const totalMessages = data.length;
    let totalFiles = 0;
    
    data.forEach(msg => {
        if (msg.file_url && !['null', 'NULL', '', 'EMPTY'].includes(msg.file_url)) {
            totalFiles += msg.file_url.split(',').length;
        }
    });

    const latestSender = data.length > 0 ? data[0].nickname : "None";

    document.getElementById('stat-total').innerText = totalMessages;
    document.getElementById('stat-files').innerText = totalFiles;
    document.getElementById('stat-latest').innerText = latestSender || "Anonymous";
}

/**
 * Fetches data from Supabase
 */
async function fetchMessages() {
    const { data, error } = await _supabase
        .from('contact_messages')
        .select('id, nickname, message, file_url')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Fetch Error:", error.message);
        return;
    }

    allMessages = data; // Save to global variable
    updateDashboardStats(data);
    renderTable(data);
}

/**
 * Renders the table rows based on provided data
 */
function renderTable(data) {
    const tableBody = document.getElementById('message-body');
    
    if (data.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" class="px-6 py-12 text-center text-gray-400 italic">
                    No matching messages found.
                </td>
            </tr>`;
        return;
    }

    tableBody.innerHTML = data.map(msg => {
        const rawFileLinks = msg.file_url;
        let fileHTML = '';

        if (rawFileLinks && !['NULL', 'EMPTY', 'null', ''].includes(rawFileLinks)) {
            const linksArray = rawFileLinks.split(',');
            fileHTML = linksArray.map((link, index) => {
                const cleanLink = link.trim();
                if (!cleanLink) return '';
                const isFullUrl = cleanLink.startsWith('http');
                const finalUrl = isFullUrl ? cleanLink : `https://pgufntgudhullqzcjgif.supabase.co/storage/v1/object/public/portfolio_uploads/${cleanLink}`;

                return `
                    <a href="${finalUrl}" target="_blank" class="block text-emerald-600 font-medium hover:underline text-xs mb-1 flex items-center gap-1">
                        <i class="fa-solid fa-file-lines"></i> File ${linksArray.length > 1 ? index + 1 : ''}
                    </a>`;
            }).join(''); 
        } else {
            fileHTML = '<span class="text-gray-400 text-xs italic">No file</span>';
        }

        return `
            <tr class="hover:bg-gray-50 transition border-b border-gray-100">
                <td class="px-6 py-4 font-medium text-gray-900">${msg.nickname || 'Anonymous'}</td>
                <td class="px-6 py-4 text-sm text-gray-600">${msg.message}</td>
                <td class="px-6 py-4">${fileHTML}</td>
                <td class="px-6 py-4 text-right">
                    <button onclick="deleteMessage('${msg.id}')" class="text-gray-400 hover:text-red-500 transition-colors">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * Handles deletion
 */
async function deleteMessage(messageId) {
    const confirmed = await askConfirmation();
    if (!confirmed) return;

    // 1. Get file details
    const { data: messageData } = await _supabase
        .from('contact_messages')
        .select('file_url')
        .eq('id', messageId)
        .single();

    if (messageData && messageData.file_url) {
        const filePaths = messageData.file_url.split(',').map(path => {
            const cleanPath = path.trim();
            return cleanPath.startsWith('http') ? cleanPath.split('/portfolio_uploads/').pop() : cleanPath;
        }).filter(path => path && !['NULL', 'EMPTY', 'null'].includes(path));

        if (filePaths.length > 0) {
            await _supabase.storage.from('portfolio_uploads').remove(filePaths);
        }
    }

    // 2. Delete Record
    const { error: dbError } = await _supabase.from('contact_messages').delete().eq('id', messageId);

    if (dbError) {
        showAlert("Error", dbError.message);
    } else {
        showAlert("Deleted", "The message has been removed.");
        fetchMessages(); 
    }
}

/**
 * UI Helpers
 */
function showAlert(title, message) {
    const alertBox = document.getElementById('glass-alert');
    document.getElementById('alert-title').innerText = title;
    document.getElementById('alert-message').innerText = message;
    alertBox.classList.replace('hidden', 'flex');
}

function closeAlert() {
    const alertBox = document.getElementById('glass-alert');
    alertBox.classList.replace('flex', 'hidden');
}

function askConfirmation() {
    return new Promise((resolve) => {
        const modal = document.getElementById('confirm-modal');
        const yesBtn = document.getElementById('confirm-yes');
        const noBtn = document.getElementById('confirm-cancel');
        modal.classList.replace('hidden', 'flex');
        const handleResponse = (choice) => {
            modal.classList.replace('flex', 'hidden');
            resolve(choice);
        };
        yesBtn.onclick = () => handleResponse(true);
        noBtn.onclick = () => handleResponse(false);
    });
}

async function fetchDateNotes() {
    const calendarBody = document.getElementById('calendar-body');
    if (!calendarBody) return;

    try {
        const { data, error } = await _supabase
            .from('calendar_notes') 
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        allNotes = data;
        renderCalendarTable(data);
        updateStats();
    } catch (err) {
        console.error("Calendar Fetch Error:", err.message);
        calendarBody.innerHTML = `<tr><td colspan="4" class="px-6 py-4 text-center text-red-500">Error: ${err.message}</td></tr>`;
    }
}

/**
 * 5. Render Calendar Table
 */
function renderCalendarTable(data) {
    const calendarBody = document.getElementById('calendar-body');
    if (!calendarBody) return;

    if (!data || data.length === 0) {
        calendarBody.innerHTML = `<tr><td colspan="4" class="px-6 py-12 text-center text-gray-400 italic">No notes found.</td></tr>`;
        return;
    }

    calendarBody.innerHTML = data.map(note => `
        <tr class="hover:bg-gray-50 transition border-b border-gray-100">
            <td class="px-6 py-4 font-bold text-emerald-600">${note.date_key}</td>
            <td class="px-6 py-4 text-sm text-gray-700">${note.note_text}</td>
            <td class="px-6 py-4 text-xs text-gray-400">${new Date(note.created_at).toLocaleString()}</td>
            <td class="px-6 py-4 text-right">
                <button onclick="confirmDeleteNote('${note.id}')" class="text-gray-400 hover:text-red-500 transition">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>`).join('');
}

/**
 * 6. Stats Update
 */
async function updateStats() {
    try {
        const { count: msgCount } = await _supabase.from('contact_messages').select('*', { count: 'exact', head: true });
        const { count: noteCount } = await _supabase.from('calendar_notes').select('*', { count: 'exact', head: true });
        
        if (document.getElementById('stat-total')) document.getElementById('stat-total').innerText = msgCount || 0;
        if (document.getElementById('stat-files')) document.getElementById('stat-files').innerText = noteCount || 0;
        
        const { data: latest } = await _supabase.from('contact_messages').select('nickname').order('created_at', { ascending: false }).limit(1).single();
        if (document.getElementById('stat-latest')) document.getElementById('stat-latest').innerText = latest ? latest.nickname : "None";
    } catch (e) { console.log("Stats error ignored"); }
}

/**
 * 7. View Switching
 */
function switchView(viewId) {
    currentView = viewId;
    const views = ['dashboard-view', 'messages-view', 'calendar-view'];
    const navs = { 'dashboard': 'nav-dashboard', 'messages': 'nav-messages', 'calendar': 'nav-calendar' };

    views.forEach(v => {
        const el = document.getElementById(v);
        if (el) el.classList.add('hidden');
    });
    
    const activeView = document.getElementById(`${viewId}-view`);
    if (activeView) activeView.classList.remove('hidden');

    Object.values(navs).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.className = "flex items-center px-6 py-3 text-gray-400 hover:bg-slate-800 hover:text-white transition";
    });

    const activeNav = document.getElementById(navs[viewId]);
    if (activeNav) activeNav.className = "flex items-center px-6 py-3 bg-emerald-500 text-white transition";

    if (viewId === 'calendar') fetchDateNotes();
    if (viewId === 'messages') fetchMessages();
}

async function logout() {
    await _supabase.auth.signOut();
    window.location.href = 'index.html';
}

fetchMessages();

async function handleLogout() {
    await _supabase.auth.signOut(); 
    window.location.href = 'index.html';
}

