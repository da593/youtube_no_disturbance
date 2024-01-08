let userOptions: Record<string, boolean> = {
    "skip_ad": false,
    "mute_ad": false,
    "block_pause": false,
}
let whitelist: Set<string>;

let video_player_container: HTMLElement | null //attributes change when ad is showing
let mainVideo: HTMLVideoElement  //video always available if movie_player is available
let skipButton: HTMLInputElement | null  //when ad is showing
let confirmButton: HTMLElement | null  //when video is paused


let videoObserver: MutationObserver;



browser.storage.sync.get().then((items) => {
    userOptions["skip_ad"] = items["skip_ad"];
    userOptions["mute_ad"] = items["mute_ad"];
    userOptions["block_pause"] = items["block_pause"];
    whitelist = convertStringToSet(items["whitelist"]);
    resetScript();
})

browser.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        if (key === "whitelist") {
            whitelist = convertStringToSet(newValue);
        } 
        else {
            userOptions[key] = newValue
        }
    }
    if (!userOptions["mute_ad"] && mainVideo ) {
        mainVideo.muted = false;
    }
    teardown()
    resetScript();
});

function convertStringToSet(str: string): Set<string> {
    const listOfSubscriptions = str.split("\n");
    return new Set(listOfSubscriptions);
}

function teardown() {
    if (!userOptions["skip_ad"] && !userOptions["mute_ad"] && !userOptions["block_pause"]) {
        videoObserver.disconnect();
    }
    if(!userOptions["block_pause"]) {
        mainVideo.removeEventListener("pause", handlePause);
    }
    
}



function handlePause() {
    const confirmButton = document.getElementById("confirm-button");
    if (confirmButton) {
        confirmButton.click()
    }
}

function handleAd() {
    if (video_player_container) {
        if (userOptions["skip_ad"] || userOptions["mute_ad"]) {
            const isAd: boolean = video_player_container.classList.contains("ad") 
                                || video_player_container.classList.contains("ad-showing") 
                                || video_player_container.classList.contains("ad-interrupting");
            if (isAd) {
                if (userOptions["mute_ad"]) {
                    mainVideo.muted = true;
                }
                if (userOptions["skip_ad"]) {
                    const channel_info: Element | null | undefined = document.getElementById('channel-info')?.querySelector("#text.style-scope.ytd-channel-name");
                    if (channel_info) {
                        const channel_name: string | null = channel_info.textContent;
                        if (channel_name && !whitelist.has(channel_name)) {
                            const skipButton: HTMLInputElement | null = document.querySelector('button[class*="ytp-ad-skip-button"') as HTMLInputElement;
                            if (skipButton) {
                                skipButton.click();
                            }
                        }
                    }
                }
                
            }
        }
    }
}

function resetScript() {
    if (userOptions["skip_ad"] || userOptions["mute_ad"] || userOptions["block_pause"]) {
        observeForVideoPlayer();
    }
}   

function observeForVideoPlayer() {
    new MutationObserver(function(mutations: MutationRecord[], observer: MutationObserver) {
        video_player_container = document.getElementById("movie_player");
        if (video_player_container) {
            mainVideo = document.querySelector('video[class*="html5-main-video"]') as HTMLVideoElement;
            if (mainVideo) {
                observer.disconnect();
                videoPlaying();
            }
        }
    }).observe(document, {
        subtree: true,
        childList: true,
    });
}

function videoPlaying() {

    videoObserver = new MutationObserver(handleAd);

    if (video_player_container) {
        handleAd();
        if (userOptions["block_pause"]) {
            mainVideo.addEventListener("pause", handlePause)
        }
        const options = {attributes: true};
        videoObserver.observe(video_player_container, options);
    }
}






