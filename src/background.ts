const fileName: string = "content_script"
const fileExt: string = ".js"

enum RunAtOptions {
    END = "document_end",
    START = "document_start", 
    IDLE = "document_idle",
}

const scriptOptions = {
    matches: ["https://www.youtube.com/*"],
    runAt: RunAtOptions.END
}

chrome.storage.sync.get().then((items) => {
    for ( let [key, value] of Object.entries(items)) {
        if (value === true) {
            break;
        }
    }
    chrome.scripting.registerContentScripts(
        [
            {
                ...scriptOptions,
                id: fileName,
                js: [fileName + fileExt]
            }
        ]
    )
})



chrome.storage.onChanged.addListener((changes, namespace) => {
    console.log(changes);
    // for (let [key, { oldValue, newValue }] of Object.entries(changes)) {

    //   if (newValue === true) {
    //     chrome.scripting.registerContentScripts(
    //         [
    //             {
    //                 ...scriptOptions,
    //                 id: fileName,
    //                 js: [fileExt]
    //             }
    //         ]
    //     )
    //   }
      
    //   else if (newValue === false && oldValue === true) {
    //     try {
    //         chrome.scripting.unregisterContentScripts({ids: [key]}).then(() => {
    //             console.log('success')
    //         })
    //     } catch(err) {
    //         console.log("script does not exist")
    //     }
    //   }
    // }
});
