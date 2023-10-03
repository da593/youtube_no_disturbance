console.log("skip");
var skipButton = document.querySelector("button.ytp-ad-skip-button");
if (skipButton) {
   console.log(skipButton);
   setTimeout(() => {
      skipButton.click()
   }, 2500)
}


// const ad = document.querySelector("div.ad-showing");
// if (ad) {
//     console.log("ad")
//     const skip_button = document.querySelector("button.ytp-ad-skip-button");
//     if (skip_button) {
//         console.log('skip')
//     }
// }