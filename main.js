const contextMenuItems = [
    {
        id: 'sendToChatGPT_Text_Friendly',
        title: 'Make This Text More Friendly and Persuasive - ChatGPT',
    },
    {
        id: 'sendToChatGPT_Context',
        title: 'Send This As Context - ChatGPT',
    },
    {
        id: 'sendToChatGPT_Code',
        title: 'Explain This Code - ChatGPT',
    },
    {
        id: 'sendToChatGPT_Optimize_Code',
        title: 'Optimize This Code - ChatGPT',
    },
    {
        id: 'sendToChatGPT_Text',
        title: 'Summarize This Text - ChatGPT',
    },
];

// Remove all existing context menu items and create new ones
chrome.contextMenus.removeAll(() => {
    for (const item of contextMenuItems) {
        chrome.contextMenus.create({
            id: item.id,
            title: item.title,
            contexts: ['selection'], // Only show this menu item when text is selected
        });
    }
});

// Listen for context menu item clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    const selectedText = info.selectionText;
    let prefixedText;

    switch (info.menuItemId) {
        case 'sendToChatGPT_Text_Friendly':
            prefixedText = `Make this text more friendly, yet persuasive: ${selectedText}`;
            break;

        case 'sendToChatGPT_Text':
            prefixedText = `Explain this to me in a shorter and more concise manner: ${selectedText}`;
            break;

        case 'sendToChatGPT_Code':
            prefixedText = `Explain this code to me in a shorter and more concise manner: ${selectedText}`;
            break;

        case 'sendToChatGPT_Optimize_Code':
            prefixedText = `Optimize this code for the best possible runtime performance. Ensure there are no bugs. Ensure all functionality given what you know remains the same. Add comments to the code. With all the instructions given, provide me with the updated code: ${selectedText}`;
            break;

        case 'sendToChatGPT_Context':
            prefixedText = `Take this as context for a follow-up question: ${selectedText}. Please respond to this message with 'Context Acquired - Awaiting Next Message'`;
            break;

        default:
            break;
    }

    if (prefixedText) {
        sendTextToChatGPT(prefixedText);
    }
});

function sendTextToTab(tabId, text) {
    chrome.tabs.executeScript(tabId, {
        code: `
            const textarea = document.querySelector('textarea');
            textarea.value = ${JSON.stringify(text)};
            textarea.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Enter', 'code': 'Enter', 'which': 13, 'keyCode': 13, 'bubbles': true}));
        `,
    });
}

function sendTextToChatGPT(text) {
    chrome.tabs.query({ url: 'https://chat.openai.com/' }, (tabs) => {
        const tab = tabs[0];

        if (tab) {
            chrome.tabs.update(tab.id, { active: true }, () => {
                sendTextToTab(tab.id, text);
            });
        } else {
            chrome.tabs.create({ url: 'https://chat.openai.com/' }, (newTab) => {
                setTimeout(() => {
                    sendTextToTab(newTab.id, text);
                }, 2000);
            });
        }
    });
}
