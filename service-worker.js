chrome.storage.sync.get().then((items) => {
    const scriptsToRegister = [];
    const scriptsToUnregister = [];
    for (const [key, value] of Object.entries(items)) {
        if (value === true) {
            scriptsToRegister.push(key);
        }
        else {
            scriptsToUnregister.push(key);
        }
    }
    // chrome.scripting.registerContentScripts([{
    //     id: "session-script",
    //     js: ["content.js"],
    //     persistAcrossSessions: false,
    //     matches: ["*://example.com/*"],
    //     runAt: "document_start",
    // }])
    console.log(scriptsToRegister);
    console.log(scriptsToUnregister);
})


chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      console.log(
        `Storage key "${key}" in namespace "${namespace}" changed.`,
        `Old value was "${oldValue}", new value is "${newValue}".`
      );
    }
});

