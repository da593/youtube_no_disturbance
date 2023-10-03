const folder = "scripts/"
const fileExt = ".js";
const scriptOptions = {
    matches: ["https://www.youtube.com/*"],
    runAt: "document_end"
}

chrome.storage.sync.get().then((items) => {
    for ( let [key,value] of Object.entries(items)) {
        if (value === true) {
            chrome.scripting.registerContentScripts(
                [
                    {
                        ...scriptOptions,
                        id: key,
                        js: [folder + key + fileExt]
                    }
                ]
            )
        }
    }
    
})

chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {

      if (newValue === true) {
        chrome.scripting.registerContentScripts(
            [
                {
                    ...scriptOptions,
                    id: key,
                    js: [folder + key + fileExt]
                }
            ]
        )
      }
      
      else if (newValue === false && oldValue === true) {
        try {
            chrome.scripting.unregisterContentScripts({ids: [key]}).then(() => {
                console.log('success')
            })
        } catch(err) {
            console.log("script does not exist")
        }
      }
    }
});
