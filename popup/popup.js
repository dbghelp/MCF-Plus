const toggle = document.getElementById('toggleEnable');
const settingsBtn = document.getElementById('settingsBtn');

chrome.storage.local.get({ mcfEnabled: true }, (data) => {
    toggle.checked = data.mcfEnabled;
});

toggle.onchange = () => {
    chrome.storage.local.set({ mcfEnabled: toggle.checked });
};

settingsBtn.onclick = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('spam-editor/spam-editor.html') });
};

const removeRecommended = document.getElementById('removeRecommended');

chrome.storage.local.get({ removeRecommended: false }, (data) => {
    removeRecommended.checked = data.removeRecommended;
});

removeRecommended.onchange = () => {
    chrome.storage.local.set({ removeRecommended: removeRecommended.checked });
};

const showSearchEmployees = document.getElementById('showSearchEmployees');

chrome.storage.local.get({ showSearchEmployees: false }, (data) => {
    showSearchEmployees.checked = data.showSearchEmployees;
});

showSearchEmployees.onchange = () => {
    chrome.storage.local.set({ showSearchEmployees: showSearchEmployees.checked });
};