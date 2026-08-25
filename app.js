/**
 * e-RaktKosh Application Logic Engine
 * Manages UI tabs, stock availability search, emergency SOS modal,
 * donation camp booking, donor registration, compatibility guide, admin dashboard,
 * multi-language translations (EN, HI, BN, TA, TE, MR), and theme switching.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    const data = window.eRaktKoshData;

    // --- State Management ---
    let currentTheme = localStorage.getItem('eraktkosh_theme') || 'light';
    let currentLang = localStorage.getItem('eraktkosh_lang') || 'en';
    let registeredDonors = JSON.parse(localStorage.getItem('eraktkosh_donors')) || [];
    let currentFilteredStock = data.bloodBanks;
    let currentSelectedGroup = 'ALL';
    let currentSelectedComponent = 'ALL';

    // --- DOM Elements ---
    const body = document.body;
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const langSelect = document.getElementById('lang-select');

    const navLinks = document.querySelectorAll('.nav-link');
    const tabPanes = document.querySelectorAll('.tab-pane');

    // State & District Dropdowns
    const searchStateSelect = document.getElementById('search-state');
    const searchDistrictSelect = document.getElementById('search-district');
    const campStateSelect = document.getElementById('camp-state');
    const donorRegStateSelect = document.getElementById('donor-reg-state');
    const adminCenterSelect = document.getElementById('admin-center-select');

    // Forms & Inputs
    const stockSearchForm = document.getElementById('stock-search-form');
    const stockResultsGrid = document.getElementById('stock-results-grid');
    const resultsCountEl = document.getElementById('results-count');

    const campsGrid = document.getElementById('camps-grid');
    const campDateInput = document.getElementById('camp-date');
    const campSearchTextInput = document.getElementById('camp-search-text');

    const donorRegisterForm = document.getElementById('donor-register-form');
    const donorPassContainer = document.getElementById('donor-pass-container');

    // Compatibility Elements
    const compatChips = document.getElementById('compat-chips');
    const giveToList = document.getElementById('give-to-list');
    const receiveFromList = document.getElementById('receive-from-list');

    // Admin Dashboard Elements
    const adminStockTbody = document.getElementById('admin-stock-tbody');
    const adminTotalUnitsEl = document.getElementById('admin-total-units');

    // Modals
    const sosModal = document.getElementById('sos-modal');
    const btnOpenSos = document.getElementById('btn-open-sos');
    const sosModalClose = document.getElementById('sos-modal-close');
    const btnCancelSos = document.getElementById('btn-cancel-sos');
    const sosForm = document.getElementById('sos-form');

    const bookingModal = document.getElementById('booking-modal');
    const bookingModalClose = document.getElementById('booking-modal-close');
    const btnCancelBooking = document.getElementById('btn-cancel-booking');
    const bookingForm = document.getElementById('booking-form');

    // Hero buttons
    const heroFindBlood = document.getElementById('hero-find-blood');
    const heroBookCamp = document.getElementById('hero-book-camp');

    // ==========================================
    // 1. Multi-Language i18n Engine
    // ==========================================
    function t(key, fallback = '') {
        if (!data || !data.translations) return fallback || key;
        const langPack = data.translations[currentLang] || data.translations['en'] || {};
        return langPack[key] !== undefined ? langPack[key] : (data.translations['en']?.[key] || fallback || key);
    }

    function applyLanguage(lang, notify = false) {
        if (!data.translations || !data.translations[lang]) {
            lang = 'en';
        }
        currentLang = lang;
        localStorage.setItem('eraktkosh_lang', lang);
        document.documentElement.lang = lang;

        if (langSelect) {
            langSelect.value = lang;
        }

        // 1. Text elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (key) {
                el.textContent = t(key, el.textContent);
            }
        });

        // 2. HTML elements with data-i18n-html
        document.querySelectorAll('[data-i18n-html]').forEach(el => {
            const key = el.getAttribute('data-i18n-html');
            if (key) {
                el.innerHTML = t(key, el.innerHTML);
            }
        });

        // 3. Inputs with data-i18n-placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (key) {
                el.setAttribute('placeholder', t(key, el.getAttribute('placeholder')));
            }
        });

        // Refresh dynamic grids and sections
        renderStockResults(currentFilteredStock, currentSelectedGroup, currentSelectedComponent);
        renderCamps();
        if (adminCenterSelect && adminCenterSelect.value) {
            renderAdminInventory(adminCenterSelect.value);
        }

        if (window.lucide) {
            window.lucide.createIcons();
        }

        if (notify) {
            const langName = data.translations[lang]?.lang_name || lang;
            showToast(`${t('toast_lang_switched', 'Language switched to')} ${langName}`, 'info');
        }
    }

    if (langSelect) {
        langSelect.addEventListener('change', (e) => {
            applyLanguage(e.target.value, true);
        });
    }

    // ==========================================
    // 2. Theme & Navigation Handling
    // ==========================================
    function applyTheme(theme) {
        if (theme === 'dark') {
            body.classList.remove('theme-light');
            body.classList.add('theme-dark');
            themeIcon.setAttribute('data-lucide', 'sun');
        } else {
            body.classList.remove('theme-dark');
            body.classList.add('theme-light');
            themeIcon.setAttribute('data-lucide', 'moon');
        }
        localStorage.setItem('eraktkosh_theme', theme);
        if (window.lucide) window.lucide.createIcons();
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            currentTheme = currentTheme === 'light' ? 'dark' : 'light';
            applyTheme(currentTheme);
        });
    }

    applyTheme(currentTheme);

    function switchTab(tabId) {
        navLinks.forEach(link => {
            if (link.getAttribute('data-tab') === tabId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        let targetPane = null;
        tabPanes.forEach(pane => {
            if (pane.id === `tab-${tabId}`) {
                pane.classList.add('active');
                targetPane = pane;
            } else {
                pane.classList.remove('active');
            }
        });

        if (targetPane) {
            const header = document.querySelector('.main-header');
            const offset = header ? header.offsetHeight + 15 : 80;
            const elementPosition = targetPane.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({
                top: Math.max(0, offsetPosition),
                behavior: 'smooth'
            });
        } else {
            window.scrollTo({ top: 350, behavior: 'smooth' });
        }
    }

    // Attach click listener to all navigation and footer data-tab links
    document.querySelectorAll('[data-tab]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = link.getAttribute('data-tab');
            if (tabId) {
                switchTab(tabId);
            }
        });
    });

    if (heroFindBlood) {
        heroFindBlood.addEventListener('click', () => switchTab('availability'));
    }
    if (heroBookCamp) {
        heroBookCamp.addEventListener('click', () => switchTab('camps'));
    }

    // ==========================================
    // 3. Populate Dropdowns (States & Districts)
    // ==========================================
    function populateStateDropdowns() {
        data.states.forEach(stateObj => {
            const opt1 = document.createElement('option');
            opt1.value = stateObj.name;
            opt1.textContent = stateObj.name;
            searchStateSelect.appendChild(opt1);

            const opt2 = document.createElement('option');
            opt2.value = stateObj.name;
            opt2.textContent = stateObj.name;
            campStateSelect.appendChild(opt2);

            const opt3 = document.createElement('option');
            opt3.value = stateObj.name;
            opt3.textContent = stateObj.name;
            donorRegStateSelect.appendChild(opt3);
        });
    }

    searchStateSelect.addEventListener('change', () => {
        const selectedStateName = searchStateSelect.value;
        searchDistrictSelect.innerHTML = `<option value="">${t('select_district_default', '-- Select District --')}</option>`;

        if (!selectedStateName) {
            searchDistrictSelect.disabled = true;
            return;
        }

        const foundState = data.states.find(s => s.name === selectedStateName);
        if (foundState) {
            foundState.districts.forEach(dist => {
                const opt = document.createElement('option');
                opt.value = dist;
                opt.textContent = dist;
                searchDistrictSelect.appendChild(opt);
            });
            searchDistrictSelect.disabled = false;
        }
    });

    populateStateDropdowns();

    // ==========================================
    // 4. Stock Availability Search Logic
    // ==========================================
    function renderStockResults(filteredCenters, reqGroup = 'ALL', reqComponent = 'ALL') {
        currentFilteredStock = filteredCenters;
        currentSelectedGroup = reqGroup;
        currentSelectedComponent = reqComponent;

        stockResultsGrid.innerHTML = '';
        if (resultsCountEl) {
            resultsCountEl.textContent = filteredCenters.length;
        }

        if (filteredCenters.length === 0) {
            stockResultsGrid.innerHTML = `
                <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <i data-lucide="alert-circle" style="width: 48px; height: 48px; color: var(--primary-red); margin-bottom: 12px;"></i>
                    <h3>${t('no_centers_title', 'No Licensed Blood Centers Found')}</h3>
                    <p style="color: var(--text-muted);">${t('no_centers_desc', 'Try broadening your state, district, or component filters.')}</p>
                </div>
            `;
            if (window.lucide) window.lucide.createIcons();
            return;
        }

        filteredCenters.forEach(center => {
            const card = document.createElement('div');
            card.className = 'stock-card';

            // Calculate total units or specific group/component
            let totalAvailable = 0;
            let tagsHtml = '';

            const groupsToIterate = reqGroup === 'ALL' || reqGroup === 'BOMBAY'
                ? Object.keys(center.inventory)
                : [reqGroup];

            groupsToIterate.forEach(groupKey => {
                const groupInv = center.inventory[groupKey];
                if (!groupInv) return;

                const compToIterate = reqComponent === 'ALL'
                    ? Object.keys(groupInv)
                    : [reqComponent];

                compToIterate.forEach(compKey => {
                    const count = groupInv[compKey] || 0;
                    if (count > 0) {
                        totalAvailable += count;
                        tagsHtml += `<span class="inv-tag"><strong>${groupKey}</strong> ${compKey}: ${count} Units</span>`;
                    }
                });
            });

            let statusBadge = `<span class="badge badge-success">${t('legend_in_stock', 'In Stock')} (${totalAvailable} Units)</span>`;
            if (totalAvailable === 0) {
                statusBadge = `<span class="badge badge-danger">Out of Stock</span>`;
            } else if (totalAvailable < 5) {
                statusBadge = `<span class="badge badge-warning">${t('legend_low_stock', 'Low Stock')} (${totalAvailable} Units)</span>`;
            }

            card.innerHTML = `
                <div class="stock-card-top">
                    <div>
                        <h4>${center.name}</h4>
                        <p><i data-lucide="map-pin"></i> ${center.district}, ${center.state}</p>
                    </div>
                    ${statusBadge}
                </div>
                <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 8px;">
                    <i data-lucide="building"></i> Category: ${center.category} (${center.type})
                </p>
                <div class="inventory-tags">
                    ${tagsHtml || '<span style="font-size: 12px; color: var(--text-muted);">No stock available for requested filter.</span>'}
                </div>
                <div class="stock-card-footer">
                    <span><i data-lucide="phone"></i> ${center.contact}</span>
                    <button class="btn btn-secondary btn-reserve" data-center="${center.name}">
                        <i data-lucide="send"></i> ${t('btn_contact_center', 'Contact Center')}
                    </button>
                </div>
            `;

            stockResultsGrid.appendChild(card);
        });

        // Attach event listener for request buttons
        document.querySelectorAll('.btn-reserve').forEach(btn => {
            btn.addEventListener('click', () => {
                const centerName = btn.getAttribute('data-center');
                openSosModalWithPrefill(centerName);
            });
        });

        if (window.lucide) window.lucide.createIcons();
    }

    stockSearchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedState = searchStateSelect.value;
        const selectedDistrict = searchDistrictSelect.value;
        const selectedGroup = document.getElementById('search-blood-group').value;
        const selectedComponent = document.getElementById('search-component').value;

        let filtered = data.bloodBanks;

        if (selectedState) {
            filtered = filtered.filter(b => b.state === selectedState);
        }
        if (selectedDistrict) {
            filtered = filtered.filter(b => b.district === selectedDistrict);
        }

        renderStockResults(filtered, selectedGroup, selectedComponent);
        showToast(`${t('found_prefix', 'Found')} ${filtered.length} ${t('found_suffix', 'Blood Centers')} (${selectedState || 'All India'}).`, 'success');
    });

    document.getElementById('btn-reset-search').addEventListener('click', () => {
        stockSearchForm.reset();
        searchDistrictSelect.disabled = true;
        renderStockResults(data.bloodBanks);
    });

    // ==========================================
    // 5. Camps Directory & Booking Logic
    // ==========================================
    function renderCamps() {
        const stateFilter = campStateSelect.value;
        const dateFilter = campDateInput.value;
        const textFilter = campSearchTextInput.value.toLowerCase();

        let filteredCamps = data.camps;

        if (stateFilter && stateFilter !== 'ALL') {
            filteredCamps = filteredCamps.filter(c => c.state === stateFilter);
        }
        if (dateFilter) {
            filteredCamps = filteredCamps.filter(c => c.date >= dateFilter);
        }
        if (textFilter) {
            filteredCamps = filteredCamps.filter(c => 
                c.title.toLowerCase().includes(textFilter) ||
                c.organizer.toLowerCase().includes(textFilter) ||
                c.venue.toLowerCase().includes(textFilter)
            );
        }

        campsGrid.innerHTML = '';

        if (filteredCamps.length === 0) {
            campsGrid.innerHTML = `
                <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 30px;">
                    <p style="color: var(--text-muted);">No upcoming voluntary donation camps match your search criteria.</p>
                </div>
            `;
            return;
        }

        filteredCamps.forEach(camp => {
            const card = document.createElement('div');
            card.className = 'camp-card';

            card.innerHTML = `
                <div>
                    <span class="camp-date-badge"><i data-lucide="calendar"></i> ${camp.date} (${camp.time})</span>
                    <h4 style="font-family: var(--font-heading); font-size: 16px; margin-bottom: 6px;">${camp.title}</h4>
                    <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 4px;">
                        <i data-lucide="shield-alert"></i> ${t('camp_organizer_label', 'Organizer:')} <strong>${camp.organizer}</strong>
                    </p>
                    <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px;">
                        <i data-lucide="map-pin"></i> Venue: ${camp.venue}, ${camp.district}, ${camp.state}
                    </p>
                </div>
                <div style="border-top: 1px solid var(--border-color); padding-top: 12px; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 12px; font-weight: 600; color: var(--secondary-green);">
                        <i data-lucide="users"></i> ${camp.bookedSlots} / ${camp.targetUnits} ${t('camp_slots_booked', 'Slots Booked')}
                    </span>
                    <button class="btn btn-primary btn-book-slot" data-id="${camp.id}" data-title="${camp.title}">
                        ${t('btn_book_slot', 'Book Donation Slot')}
                    </button>
                </div>
            `;

            campsGrid.appendChild(card);
        });

        document.querySelectorAll('.btn-book-slot').forEach(btn => {
            btn.addEventListener('click', () => {
                const campId = btn.getAttribute('data-id');
                const campTitle = btn.getAttribute('data-title');
                openBookingModal(campId, campTitle);
            });
        });

        if (window.lucide) window.lucide.createIcons();
    }

    campStateSelect.addEventListener('change', renderCamps);
    campDateInput.addEventListener('change', renderCamps);
    campSearchTextInput.addEventListener('input', renderCamps);

    // ==========================================
    // 6. Donor Registration Workflow
    // ==========================================
    donorRegisterForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('donor-name').value;
        const age = parseInt(document.getElementById('donor-age').value);
        const gender = document.getElementById('donor-gender').value;
        const bloodGroup = document.getElementById('donor-blood-group').value;
        const mobile = document.getElementById('donor-mobile').value;
        const state = document.getElementById('donor-reg-state').value;
        const weight = parseInt(document.getElementById('donor-weight').value);

        if (age < 18 || age > 65) {
            showToast('Donor age must be between 18 and 65 years.', 'error');
            return;
        }
        if (weight < 45) {
            showToast('Minimum weight requirement for blood donation is 45 kg.', 'error');
            return;
        }

        const donorId = `ERK-2026-${Math.floor(10000 + Math.random() * 90000)}`;

        const newDonor = { name, age, gender, bloodGroup, mobile, state, weight, donorId };
        registeredDonors.push(newDonor);
        localStorage.setItem('eraktkosh_donors', JSON.stringify(registeredDonors));

        // Display Pass
        document.getElementById('pass-name').textContent = name;
        document.getElementById('pass-blood-group').textContent = bloodGroup;
        document.getElementById('pass-id').textContent = donorId;
        document.getElementById('pass-mobile').textContent = `+91 ${mobile}`;
        document.getElementById('pass-state').textContent = state;

        donorPassContainer.classList.remove('hidden');
        donorPassContainer.scrollIntoView({ behavior: 'smooth' });

        showToast(`Congratulations ${name}! You are registered as an official voluntary donor.`, 'success');
    });

    // ==========================================
    // 7. Interactive Compatibility Matrix Logic
    // ==========================================
    function updateCompatibility(groupKey) {
        const rules = data.compatibility[groupKey];
        if (!rules) return;

        giveToList.innerHTML = '';
        rules.giveTo.forEach(targetGroup => {
            const span = document.createElement('span');
            span.className = 'badge badge-lg bg-green';
            span.textContent = targetGroup;
            giveToList.appendChild(span);
        });

        receiveFromList.innerHTML = '';
        rules.receiveFrom.forEach(sourceGroup => {
            const span = document.createElement('span');
            span.className = 'badge badge-lg bg-blue';
            span.textContent = sourceGroup;
            receiveFromList.appendChild(span);
        });
    }

    const chipBtns = compatChips.querySelectorAll('.chip');
    chipBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            chipBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const selectedGroup = btn.getAttribute('data-group').split(' ')[0];
            updateCompatibility(selectedGroup);
        });
    });

    updateCompatibility('O-');

    // ==========================================
    // 8. Blood Bank Admin Dashboard
    // ==========================================
    function populateAdminCenterDropdown() {
        adminCenterSelect.innerHTML = '';
        data.bloodBanks.forEach(bb => {
            const opt = document.createElement('option');
            opt.value = bb.id;
            opt.textContent = `${bb.name} (${bb.district})`;
            adminCenterSelect.appendChild(opt);
        });
    }

    function renderAdminInventory(centerId) {
        const center = data.bloodBanks.find(b => b.id === centerId) || data.bloodBanks[0];
        if (!center) return;
        adminStockTbody.innerHTML = '';

        let totalUnits = 0;

        Object.keys(center.inventory).forEach(groupKey => {
            const groupInv = center.inventory[groupKey];
            const wb = groupInv['Whole Blood'] || 0;
            const prbc = groupInv['PRBC'] || 0;
            const sdp = groupInv['SDP'] || groupInv['RDP'] || 0;
            const ffp = groupInv['FFP'] || 0;

            const groupTotal = wb + prbc + sdp + ffp;
            totalUnits += groupTotal;

            let statusBadge = `<span class="badge badge-success">${t('badge_optimal', 'Optimal Inventory')}</span>`;
            if (groupTotal === 0) {
                statusBadge = `<span class="badge badge-danger">Out of Stock</span>`;
            } else if (groupTotal < 6) {
                statusBadge = `<span class="badge badge-warning">${t('badge_action_req', 'Action Required')}</span>`;
            }

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${groupKey}</strong></td>
                <td>${wb} Units</td>
                <td>${prbc} Units</td>
                <td>${sdp} Units</td>
                <td>${ffp} Units</td>
                <td>${statusBadge}</td>
                <td>
                    <button class="btn btn-secondary btn-sm-update" data-group="${groupKey}">
                        ${t('btn_add_unit', '+ Add Unit')}
                    </button>
                </td>
            `;
            adminStockTbody.appendChild(tr);
        });

        if (adminTotalUnitsEl) {
            adminTotalUnitsEl.textContent = `${totalUnits} Units`;
        }

        document.querySelectorAll('.btn-sm-update').forEach(btn => {
            btn.addEventListener('click', () => {
                const group = btn.getAttribute('data-group');
                center.inventory[group]['Whole Blood'] += 5;
                renderAdminInventory(centerId);
                showToast(`Restocked 5 units of ${group} Whole Blood at ${center.name}.`, 'success');
            });
        });
    }

    adminCenterSelect.addEventListener('change', () => {
        renderAdminInventory(adminCenterSelect.value);
    });

    populateAdminCenterDropdown();
    if (data.bloodBanks.length > 0) {
        renderAdminInventory(data.bloodBanks[0].id);
    }

    // ==========================================
    // 9. Emergency SOS & Booking Modals
    // ==========================================
    btnOpenSos.addEventListener('click', () => sosModal.classList.remove('hidden'));
    sosModalClose.addEventListener('click', () => sosModal.classList.add('hidden'));
    btnCancelSos.addEventListener('click', () => sosModal.classList.add('hidden'));

    function openSosModalWithPrefill(hospitalName) {
        document.getElementById('sos-hospital').value = hospitalName;
        sosModal.classList.remove('hidden');
    }

    sosForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const patientName = document.getElementById('sos-patient-name').value;
        const bloodGroup = document.getElementById('sos-blood-group').value;
        const units = document.getElementById('sos-units').value;
        const hospital = document.getElementById('sos-hospital').value;

        sosModal.classList.add('hidden');
        sosForm.reset();

        showToast(`EMERGENCY BROADCAST SENT! Matched ${bloodGroup} requirement for ${patientName} (${units} Units) at ${hospital}. Registered donors notified via SMS.`, 'success');
    });

    function openBookingModal(campId, campTitle) {
        document.getElementById('booking-camp-id').value = campId;
        document.getElementById('booking-camp-title').textContent = campTitle;
        bookingModal.classList.remove('hidden');
    }

    bookingModalClose.addEventListener('click', () => bookingModal.classList.add('hidden'));
    btnCancelBooking.addEventListener('click', () => bookingModal.classList.add('hidden'));

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const donorName = document.getElementById('booking-donor-name').value;
        const timeSlot = document.getElementById('booking-time-slot').value;
        const campId = document.getElementById('booking-camp-id').value;

        const camp = data.camps.find(c => c.id === campId);
        if (camp) camp.bookedSlots += 1;

        bookingModal.classList.add('hidden');
        bookingForm.reset();
        renderCamps();

        showToast(`Appointment confirmed for ${donorName} (${timeSlot}). Digital Pass generated.`, 'success');
    });

    // ==========================================
    // 10. Toast Notification System
    // ==========================================
    function showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i data-lucide="${type === 'success' ? 'check-circle' : 'alert-circle'}"></i>
            <div>
                <strong>${type.toUpperCase()}:</strong> ${message}
            </div>
        `;

        toastContainer.appendChild(toast);
        if (window.lucide) window.lucide.createIcons();

        setTimeout(() => {
            toast.remove();
        }, 5000);
    }

    // ==========================================
    // 11. Initial Application Language Setup
    // ==========================================
    applyLanguage(currentLang, false);
});
