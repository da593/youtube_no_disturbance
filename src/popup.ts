const options = document.querySelectorAll("input[type=checkbox]") as NodeListOf<HTMLInputElement> ;

// Asynchronously retrieve data from storage.sync, then cache it.
chrome.storage.sync.get().then((items) => {
    options.forEach(currentValue => {

        const option: HTMLInputElement | null = document.querySelector("[id="+currentValue.id) as HTMLInputElement;
        if (option) {
            option.checked = items[currentValue.id];
        }

        currentValue.addEventListener('change', () => {
            chrome.storage.sync.set({ [currentValue.id] : currentValue.checked });
        })
        
    })


});




