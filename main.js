// Remove all existing context menu items and create a new one
chrome.contextMenus.removeAll(function () {
    chrome.contextMenus.create({
        id: 'sendToChatGPT_Text',
        title: 'Explain This Text - ChatGPT',
        contexts: ['selection'], // Only show this menu item when text is selected
    });
    chrome.contextMenus.create({
        id: 'sendToChatGPT_Code',
        title: 'Explain This Code - ChatGPT',
        contexts: ['selection'], // Only show this menu item when text is selected
    });
    chrome.contextMenus.create({
        id: 'sendToChatGPT_Optimize_Code',
        title: 'Optimize This Code - ChatGPT',
        contexts: ['selection'], // Only show this menu item when text is selected
    });
});

// Listen for context menu item clicks
chrome.contextMenus.onClicked.addListener(function (info, tab) {
    // Check if the clicked menu item is 'sendToChatGPT'
    if (info.menuItemId === 'sendToChatGPT_Text') {
        var selectedText = info.selectionText;
        var prefixedText = 'Explain this to me in a shorter and more concise manner: ' + selectedText;
        sendTextToChatGPT(prefixedText);
    }
    // Check if the clicked menu item is 'sendToChatGPT'
    if (info.menuItemId === 'sendToChatGPT_Code') {
        var selectedText = info.selectionText;
        var prefixedText = 'Explain this code to me in a shorter and more concise manner: ' + selectedText;
        sendTextToChatGPT(prefixedText);
    }
    // Check if the clicked menu item is 'sendToChatGPT'
    if (info.menuItemId === 'sendToChatGPT_Optimize_Code') {
        var selectedText = info.selectionText;
        var prefixedText = 'Optimize this code for the best possible runtime performance. Ensure there are no bugs. Ensure all functionality given what you know remains the same. Add comments to the code. With all the instructions given, provide me with the updated code: ' + selectedText;
        sendTextToChatGPT(prefixedText);
    }
});

// Function to send text to the chat.openai.com tab
function sendTextToChatGPT(text) {
    // Check if there's already an open chat.openai.com tab
    chrome.tabs.query({ url: 'https://chat.openai.com/' }, function (tabs) {
        if (tabs.length > 0) {
            // If there's an existing tab, activate it
            chrome.tabs.update(tabs[0].id, { active: true }, function () {
                // Inject the code to send the text to ChatGPT
                chrome.tabs.executeScript(tabs[0].id, {
                    code: `
            var textarea = document.querySelector('textarea');
            textarea.value = ${JSON.stringify(text)};
            textarea.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Enter', 'code': 'Enter', 'which': 13, 'keyCode': 13, 'bubbles': true}));
            `,
                });
            });
        } else {
            // If there's no existing tab, create a new one
            chrome.tabs.create({ url: 'https://chat.openai.com/' }, function (tab) {
                // Wait for 2 seconds for the page to load
                setTimeout(function () {
                    // Inject the code to send the text to ChatGPT
                    chrome.tabs.executeScript(tab.id, {
                        code: `
              var textarea = document.querySelector('textarea');
              textarea.value = ${JSON.stringify(text)};
              textarea.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Enter', 'code': 'Enter', 'which': 13, 'keyCode': 13, 'bubbles': true}));
              `,
                    });
                }, 2000);
            });
        }
    });
}
