// Asynchronously retrieve data from storage.sync, then cache it.
browser.storage.sync.get().then((items) => {
    const options = document.querySelectorAll("input[type=checkbox]") as NodeListOf<HTMLInputElement>;
    options.forEach(currentValue => {

        const option: HTMLInputElement | null = document.querySelector("[id="+currentValue.id) as HTMLInputElement;
        if (option) {
            option.checked = items[currentValue.id];
        }

        currentValue.addEventListener('change', () => {
            browser.storage.sync.set({ [currentValue.id] : currentValue.checked });
        })
        
    })
});




