let userOptions: Record<string, boolean> = {
    "skip_ad": false,
    "mute_ad": false,
    "block_pause": false,
}

let video_player_container: HTMLElement | null //attributes change when ad is showing
let mainVideo: HTMLVideoElement  //always video available if movie_player is available
let skipButton: HTMLInputElement | null  //when ad is showing
let confirmButton: HTMLElement | null  //when video is paused

let videoObserver: MutationObserver;


chrome.storage.sync.get().then((items) => {
    userOptions["skip_ad"] = items["skip_ad"];
    userOptions["mute_ad"] = items["mute_ad"];
    userOptions["block_pause"] = items["block_pause"];
    resetScript();
})

chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        userOptions[key] = newValue
    }
    if (!userOptions["mute_ad"] && mainVideo ) {
        mainVideo.muted = false;
    }
    teardown()
    resetScript();
});

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
        console.log("block pause")
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
                    console.log("mute")
                    mainVideo.muted = true;
                }

                if (userOptions["skip_ad"]) {
                    const skipButton: HTMLInputElement | null = document.querySelector("button.ytp-ad-skip-button") as HTMLInputElement;
                    if (skipButton) {
                        console.log("skip")
                        skipButton.click();
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
            mainVideo = document.querySelector("video.html5-main-video") as HTMLVideoElement;
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






