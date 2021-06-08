chrome.runtime.onInstalled.addListener(() => {
    getInfo(result => {
       if (result == null) saveEmptyInfo();
    })
})