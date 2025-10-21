chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed!')
})

export default chrome.runtime.onInstalled.addListener(() => {
    console.log("Background Service Worker - Working!");
})

// Hotkey for opening the side-panel
chrome.commands.onCommand.addListener((command) => {
    if (command === 'open_side_panel'){
        chrome.windows.getCurrent((w) => {
            chrome.sidePanel.open({windowId: w.id!})
            console.log("Command/Ctrl + Shift + O triggered!")
        })
    }
})