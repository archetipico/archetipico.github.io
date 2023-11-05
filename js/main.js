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
if (localStorage["mode"] === undefined) localStorage["mode"] = "dark";

root = document.querySelector(":root");
if (localStorage["mode"] === "light") {
    root.style.setProperty("--bg", "#fafafa");
    root.style.setProperty("--lk", "#7868e6e0");
    root.style.setProperty("--tc", "#000");
    document.getElementById("color-mode").innerHTML = "&#58125;";
} else {
    root.style.setProperty("--bg", "#000");
    root.style.setProperty("--lk", "#fda0a0bf");
    root.style.setProperty("--tc", "#fcfcfc");
    document.getElementById("color-mode").innerHTML = "&#61830;";
}

// Function to set color mode
function setColorMode() {
    localStorage["mode"] = localStorage["mode"] === "light" ? "dark" : "light";
    location.reload();
}
