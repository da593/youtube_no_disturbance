import { EditorView } from '@codemirror/view';
import { basicSetup } from 'codemirror';

const fixedHeightEditor = EditorView.theme({
  "&": {height: "70vh"},
  ".cm-scroller": {overflow: "auto"}
})
const myTheme = EditorView.theme({
  "&": {
    color: "white",
    backgroundColor: "#000000"
  },

  "&.cm-focused .cm-cursor": {
    borderLeftColor: "#ffffff"
  },
  "&.cm-focused .cm-selectionBackground, ::selection": {
    backgroundColor: "#074"
  },
  ".cm-gutters": {
    backgroundColor: "#2f2f3b",
    color: "#ffffff",
    border: "none"
  }
}, {dark: true})
const targetElement = document.querySelector('#editor')!;

const view = new EditorView({
  extensions: [
    basicSetup,
    fixedHeightEditor,
    myTheme,
  ],
  parent: targetElement,
})


// Asynchronously retrieve data from storage.sync.
let savedState: string;
browser.storage.sync.get().then((items) => {
  const initialString: string = items["whitelist"];
  if (initialString !== "") {
    const addTransaction = view.state.update({changes: {from: 0, insert: initialString}});
    view.dispatch(addTransaction);
    savedState = initialString;
  }
});

const REDIRECT_URL = browser.identity.getRedirectURL();
const CLIENT_ID =  "707569202998-ckcpmub25468a0pto5gnevb8eg44ufr7.apps.googleusercontent.com";
const SCOPES  = ["https://www.googleapis.com/auth/youtube.readonly"];
const AUTH_URL =
`https://accounts.google.com/o/oauth2/v2/auth\
?client_id=${CLIENT_ID}\
&response_type=token\
&redirect_uri=${encodeURIComponent(REDIRECT_URL)}\
&scope=${encodeURIComponent(SCOPES.join(' '))}`;

function convertStringToSet(str: string): Set<string> {
  const listOfSubscriptions = str.split("\n").filter(e => e);
  return new Set(listOfSubscriptions);
}

function convertSetToString(set: Set<string>): string {
  if (set.size > 0) {
    return Array.from(set).join("\n");
  }
  else {
    return "";
  }
}

function applyChanges() {
  const str: string = view.state.doc.toString();
  const set = convertStringToSet(str);
  const strNoDupes: string =  convertSetToString(set);
  browser.storage.sync.set({ "whitelist" : strNoDupes });
  const addTransaction = view.state.update({changes: {from: 0, to: view.state.doc.length, insert: strNoDupes}});
  view.dispatch(addTransaction);
  savedState = strNoDupes;
}

function revertChanges() {
  const addTransaction = view.state.update({changes: {from: 0, to: view.state.doc.length, insert: savedState}});
  view.dispatch(addTransaction);
}

function addChanges(changes: Array<string>) {
  const editorState: string = view.state.doc.toString();
  let strChanges: string = changes.join("\n");
  if (editorState.length > 0) {
    strChanges = editorState + "\n" + strChanges;
  }
  const addTransaction = view.state.update({changes: {from: 0, to: view.state.doc.length, insert: strChanges}});
  view.dispatch(addTransaction);
  displaySuccessStatus(true);
}

function extractAccessToken(redirectUri: string) {
  let m = redirectUri.match(/[#?](.*)/);
  if (!m || m.length < 1)
    return null;
  let params = new URLSearchParams(m[1].split("#")[0]);
  return params.get("access_token");
}



function authorize(): Promise<string> {
  return browser.identity.launchWebAuthFlow({
    interactive: true,
    url: AUTH_URL
  });
}

function validate(redirectURL: string) {
  const accessToken = extractAccessToken(redirectURL);
  if (!accessToken) {
    throw "Authorization failure";
  }
  const VALIDATION_BASE_URL="https://www.googleapis.com/oauth2/v3/tokeninfo";
  const validationURL = `${VALIDATION_BASE_URL}?access_token=${accessToken}`;
  const validationRequest = new Request(validationURL, {
    method: "GET"
  });

  function checkResponse(response: Response, access_token: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (response.status != 200) {
        reject("Token validation error");
      }
      response.json().then((json) => {
        if (json.aud && (json.aud === CLIENT_ID)) {
          resolve(access_token);
        } else {
          reject("Token validation error");
        }
      });
    });
  }

  return fetch(validationRequest)
  .then((response: Response) => checkResponse(response, accessToken));
}

function getAccessToken() {
  return authorize().then(validate);
}

function getUserInfo(accessToken: string, channel_id: string): Promise<Array<any>> {
  const requestURL: string = "https://youtube.googleapis.com/youtube/v3/subscriptions?part=snippet&channelId=" + channel_id;
  const requestHeaders: Headers = new Headers();
  requestHeaders.append('Authorization', 'Bearer ' + accessToken);
  requestHeaders.append("Content-Type", "application/json");

  async function fetchPaginationResults(request: Request, jsonDataArray: Array<JSON> = []): Promise<Array<any>> {
    const response: Response = await fetch(request);
    if (response.status === 200) {
      const data = await response.json();
      jsonDataArray = jsonDataArray.concat(data);
      if (data.nextPageToken) {
        const paginationRequest = new Request(requestURL + "&pageToken=" + data.nextPageToken, {
          method: "GET",
          headers: requestHeaders
        });
        return await fetchPaginationResults(paginationRequest, jsonDataArray);
      }
    }
    else  {
      displaySuccessStatus(false);
    }
    return jsonDataArray;
  }
  

  const initialRequest = new Request(requestURL, {
    method: "GET",
    headers: requestHeaders
  });

  return fetchPaginationResults(initialRequest);
}

function getSubscriptions(userData: Array<any>): Array<string> {
  let subscriptionList: Array<string> = [];
  userData.forEach((data) => {
    const items = data.items;
    items.forEach((channel: any) => {
      subscriptionList.push(channel.snippet.title);
    })
  })
  return subscriptionList
}

function addSubscriptionsToChanges() {
  const inputted_url: HTMLInputElement  = document.getElementById("url_add") as HTMLInputElement;
  const url: string = inputted_url.value.trim();
  const split_url: Array<string> = url.split("/");
  if (split_url.length >= 3 && split_url.at(-2) === "channel") {
    const channel_id: string = split_url.at(-1) as string;
    getAccessToken()
    .then((access_token) => getUserInfo(access_token, channel_id))
    .then((userData) => {
      if (userData.length > 0) {
        const subscriptionList = getSubscriptions(userData);
        addChanges(subscriptionList);
      }
    })
  }
  else {
    displaySuccessStatus(false)
  }
}

function openSubscriptionForm() {
    let popup = document.getElementById("subscription-form") as HTMLElement;
    if (popup) {
        popup.style.display = "block";
    }
}

function closeSubscriptionForm() {
    let popup = document.getElementById("subscription-form") as HTMLElement;
    if (popup) {
        popup.style.display = "none";
    }
}

function displaySuccessStatus(isSuccess: boolean) {
  const statusDiv = document.getElementById("status") as HTMLElement;
  if (isSuccess) {
    statusDiv.style.color = "green"
    statusDiv.innerText = "SUCCESS! Do not forget to APPLY CHANGES!"
  }
  else {
    statusDiv.style.color = "red"
    statusDiv.innerText = "FAILED"
  }
  setTimeout(() => {
    statusDiv.innerText = ""
  }, 5000)
}

function addButtonListeners() {
  const apply_changes = document.getElementById("apply-changes") as HTMLElement;
  apply_changes.addEventListener("click", applyChanges);
  
  const revert_changes = document.getElementById("revert-changes") as HTMLElement;
  revert_changes.addEventListener("click", revertChanges);

  const open_popup = document.getElementById("open-subscription-form") as HTMLElement;
  open_popup.addEventListener("click", openSubscriptionForm);

  const close_popup = document.getElementById("close-button") as HTMLElement;
  close_popup.addEventListener("click", closeSubscriptionForm);

  const submit_subscription = document.getElementById("submit-subscription-list") as HTMLElement;
  submit_subscription.addEventListener("click", addSubscriptionsToChanges);

}

addButtonListeners();