# Install published extension (Firefox only)
The plugin can be installed at: 

# How to install extension locally (Firefox and Chrome)
1. Clone the repo

2. Build a "dist" folder by running the following commands at the project root on a command line:
```
npm install
``` 
```
npm run build
``` 

3. To load the extension for Chrome users, open the [chrome://extensions](chrome://extensions), enable "Developer mode", click the "Load unpacked" button, and select the dist folder generated in step 2 as the extension directory

4. To load the extension for Firefox users, open the [about:debugging](about:debugging) page, click the "This Firefox" option, click the Load Temporary Add-on button, then select any file in the dist folder generated in step 2.

# Features
The below are currently supported for Chrome Browsers.
* Skip (skippable) ads instantly
* Mute ads playing
* Block YouTube's "Continue Watching" popup confirmation