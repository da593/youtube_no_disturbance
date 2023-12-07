# Product installation (Firefox only)
The product page for Firefox users: [https://addons.mozilla.org/en-US/firefox/addon/youtube-no-disturbance/](https://addons.mozilla.org/en-US/firefox/addon/youtube-no-disturbance/)

# How to install extension locally (Firefox)
1. Clone the repo

2. Build a "dist" folder by running the following commands at the project root on a command line:
```
npm install
``` 
```
npm run build
``` 
3. To load the extension for Firefox users, open the [about:debugging](about:debugging) page, click the "This Firefox" option, click the Load Temporary Add-on button, then select any file in the dist folder generated in step 2.

# Features
The below are currently supported for Firefox  Browsers.
* Skip (skippable) ads instantly
* Mute ads playing
* Block YouTube's "Continue Watching" popup confirmation
* Whitelist Youtube channels from skipping ads