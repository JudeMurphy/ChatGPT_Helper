// Create a context menu item called "Log" that appears when text is selected
chrome.contextMenus.create({
    title: 'Log',
    contexts: ['selection'],
    onclick: function (info, tab) {
        console.log(info.selectionText);
    },
});
