const options = document.querySelectorAll("input[type=checkbox]");

// Asynchronously retrieve data from storage.sync, then cache it.
const initStorageCache = chrome.storage.sync.get().then((items) => {

  options.forEach(currentValue => {

    const option = document.querySelector("[id="+currentValue.id);
    if (option) {
        option.checked = items[currentValue.id];
    }

    currentValue.addEventListener('change', () => {
        chrome.storage.sync.set({ [currentValue.id] : currentValue.checked });
    })


  })


});




