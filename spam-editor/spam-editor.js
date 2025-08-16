const textarea = document.getElementById('spamList');
const saveBtn = document.getElementById('saveBtn');
const status = document.getElementById('status');

chrome.storage.local.get({ spamList: [] }, (data) => {
    textarea.value = data.spamList.join('\n');
});

saveBtn.onclick = () => {
    const lines = textarea.value.split('\n').map(line => line.trim()).filter(Boolean);
    chrome.storage.local.set({ spamList: lines }, () => {
        status.textContent = 'Saved!';
        setTimeout(() => status.textContent = '', 1000);
    });
};