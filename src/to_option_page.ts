function navigateToOptions() {
    browser.runtime.openOptionsPage();
}

const toOptions = document.getElementById("options_button") as HTMLButtonElement;
toOptions.addEventListener("click", navigateToOptions);