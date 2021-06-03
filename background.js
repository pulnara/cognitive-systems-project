chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('got message')
    switch (request.type) {
        case 'buying':
            console.log(request.message);
            break;
        default:
            console.log('unknown request');
            break;
    }
});