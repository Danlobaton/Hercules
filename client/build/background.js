chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('index.html', {
        id: "mainwin",
        innerBounds: {
            width: 700,
            height: 600
        }
    });
});