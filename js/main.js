// Set favicon
const F = ["🌴", "🌌", "💯", "🦐", "🌈", "🔥", "🍑"];
const LNK = document.createElement("link");
LNK.rel = "shortcut icon";
LNK.type = "image/svg+xml";
LNK.href = "data:image/svg+xml, <svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 132 132%22><text y=%221em%22 font-size=%22100%22>" + F[new Date().getDay()] + "</text></svg>";
const FRA = document.createDocumentFragment();
FRA.appendChild(LNK);
document.head.appendChild(FRA);

// Set color mode
root = document.querySelector(":root");
if (document.cookie.includes("mode=light")) {
    root.style.setProperty("--bg", "#fafafa");
    root.style.setProperty("--lk", "#7868e6e0");
    root.style.setProperty("--tc", "#000");
    root.style.setProperty("--sh", "#0000004d");
    root.style.setProperty("--bs", "#ffffffe6");
    document.getElementById("color-mode-link").innerHTML = '<svg id="color-mode" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m12 3v1m0 16v1m-8-9h-1m3.3141-5.6859-0.81412-0.81412m12.186 0.81412 0.8141-0.81412m-12.186 12.19-0.81412 0.8101m12.186-0.8101 0.8141 0.8101m2.5-6.5001h-1m-4 0c0 2.2091-1.7909 4-4 4-2.2091 0-4-1.7909-4-4 0-2.2091 1.7909-4 4-4 2.2091 0 4 1.7909 4 4z" stroke="#7868e6e0" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>';
} else {
    root.style.setProperty("--bg", "#000");
    root.style.setProperty("--lk", "#fda0a0bf");
    root.style.setProperty("--tc", "#fcfcfc");
    root.style.setProperty("--sh", "#fcfcfc4d");
    root.style.setProperty("--bs", "#000000e6");
    document.getElementById("color-mode-link").innerHTML = '<svg id="color-mode" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m3.3203 11.684c0 4.9706 4.0294 9 9 9 3.7872 0 7.028-2.3392 8.3565-5.6515-1.0366 0.4166-2.1709 0.6514-3.3565 0.6514-4.9706 0-9-4.0294-9-9 0-1.18 0.23134-2.3208 0.64422-3.3535-3.3085 1.3303-5.6442 4.5692-5.6442 8.3535z" stroke="#fda0a0bf" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>';
}

// Function to set color mode
function setColorMode() {
    const currMode = document.cookie.includes("mode=light") ? "light" : "dark";
    const newMode = currMode === "light" ? "dark" : "light";
    document.cookie = "mode=" + newMode + "; max-age=2592000; path=/; SameSite=Strict";
    location.reload();
}

// Function to delete cookies
function deleteCookies() {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=; max-age=-1; path=/; SameSite=Strict";
    }
}
