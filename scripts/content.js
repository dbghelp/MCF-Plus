function getCompanyName(card) {
    const nameEl = card.querySelector('[data-testid="company-hire-info"]');
    return nameEl ? nameEl.textContent.trim() : null;
}

function setSpamEffect(card, isSpam) {
    if (isSpam) {
        card.style.opacity = '0.5';
    } else {
        card.style.opacity = '';
    }
}

function addSpamButton(card) {
    if (card.querySelector('.mcf-spam-btn')) return;

    card.style.position = 'relative';

    const btn = document.createElement('button');
    btn.textContent = 'Add to spam';
    btn.className = 'mcf-spam-btn';

    const applyButtonEffect = (btn) => {
        btn.style.background = 'linear-gradient(90deg, #ff5858 0%, #f09819 100%)';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '20px';
        btn.style.padding = '8px 10px';
        btn.style.fontWeight = 'bold';
        btn.style.fontSize = '14px';
        btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)';
        btn.style.cursor = 'pointer';
        btn.style.transition = 'background 0.3s, transform 0.2s';
        btn.style.position = 'absolute';
        btn.style.top = '16px';
        btn.style.right = '10px';
        btn.style.zIndex = '10';
    };

    applyButtonEffect(btn);

    btn.onmouseenter = () => {
        btn.style.transform = 'scale(1.07)';
        btn.style.background = 'linear-gradient(90deg, #f09819 0%, #ff5858 100%)';
    };
    btn.onmouseleave = () => {
        btn.style.transform = 'scale(1)';
        btn.style.background = 'linear-gradient(90deg, #ff5858 0%, #f09819 100%)';
    };

    function setButtonState(isSpam) {
        if (isSpam) {
            btn.textContent = 'Remove from spam';
            btn.disabled = false;
            setSpamEffect(card, true);
        } else {
            btn.textContent = 'Add to spam';
            btn.disabled = false;
            setSpamEffect(card, false);
            applyButtonEffect(btn);
        }
    }

    btn.onclick = function (e) {
        e.stopPropagation();
        e.preventDefault();
        const company = getCompanyName(card);
        if (!company) return;
        chrome.storage.local.get({ spamList: [] }, (data) => {
            let spamList = data.spamList;
            if (btn.textContent === 'Add to spam') {
                if (!spamList.includes(company)) {
                    spamList.push(company);
                    chrome.storage.local.set({ spamList }, () => {
                        setButtonState(true);
                        card.dataset.justAdded = "true";
                    });
                }
            } else {
                spamList = spamList.filter(c => c !== company);
                chrome.storage.local.set({ spamList }, () => {
                    setButtonState(false);
                    delete card.dataset.justAdded;
                });
            }
        });
    };

    const company = getCompanyName(card);
    if (!company) return;
    chrome.storage.local.get({ spamList: [] }, (data) => {
        setButtonState(data.spamList.includes(company));
    });


    if (!card.querySelector('.mcf-spam-btn')) card.appendChild(btn);



    chrome.storage.local.get({ showSearchEmployees: false }, (data) => {
        if (data.showSearchEmployees && !card.querySelector('.mcf-search-emp-btn')) {
            const searchBtn = document.createElement('button');
            searchBtn.textContent = 'Search employees';
            searchBtn.className = 'mcf-search-emp-btn';
            applyButtonEffect(searchBtn);
            searchBtn.style.top = '50px';

            searchBtn.onmouseenter = () => {
                searchBtn.style.transform = 'scale(1.07)';
                searchBtn.style.background = 'linear-gradient(90deg, #f09819 0%, #ff5858 100%)';
            };
            searchBtn.onmouseleave = () => {
                searchBtn.style.transform = 'scale(1)';
                searchBtn.style.background = 'linear-gradient(90deg, #ff5858 0%, #f09819 100%)';
            };

            searchBtn.onclick = (e) => {
                e.stopPropagation();
                e.preventDefault();
                const company = getCompanyName(card);
                if (company) {
                    const url = "https://www.google.com/search?q=site:linkedin.com/in+\"" + encodeURIComponent(company) + "\"";
                    window.open(url, '_blank');
                }
            };
            card.appendChild(searchBtn);
        }
    });


}

function processCards() {
    chrome.storage.local.get({ spamList: [], removeRecommended: false }, (data) => {
        const spamList = data.spamList.map(name => name.trim().toLowerCase());
        const removeRecommended = data.removeRecommended;

        if (removeRecommended) {
            document.querySelectorAll('[data-testid^="green-job-card"]').forEach(card => {
                card.remove();
            });
        }

        document.querySelectorAll('[data-testid="job-card"]').forEach(card => {
            const company = getCompanyName(card);
            if (!company) return;
            if (
                company &&
                spamList.includes(company.toLowerCase()) &&
                !card.dataset.justAdded
            ) {
                card.remove();
            } else {
                addSpamButton(card);
            }
        });
    });
}

processCards();
const observer = new MutationObserver(processCards);
observer.observe(document.body, { childList: true, subtree: true });