console.log("mute");

function waitForAddedNode(params) {
    new MutationObserver(function(mutations) {
        const mainVideo = document.querySelector("video.html5-main-video");
        const ytdPlayer = document.getElementById("movie_player");
        if (mainVideo && ytdPlayer) {
            if (!mainVideo.paused) {
                this.disconnect();
                params.nodeAdded(mainVideo);
            }
        }
    }).observe(document, {
        subtree: true,
        childList: true,
    });
}

waitForAddedNode({

    nodeAdded: function(mainVideo) {
        const adShowing = document.getElementById("movie_player");
        const observer = new MutationObserver(function(mutations){
            mainVideo.muted = adShowing.classList.contains("ad") || adShowing.classList.contains("ad-showing") || adShowing.classList.contains("ad-interrupting");
        }) 

        const options = {attributes: true}
        if (adShowing) {
            observer.observe(adShowing, options)
        }
    }
});



