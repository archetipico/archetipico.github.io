// set favicon
const F = ["🌴", "🌌", "💯", "🦐", "🌈", "🔥", "🍑"];
const LNK = document.createElement("link");
LNK.rel = "shortcut icon";
LNK.type = "image/svg+xml";
LNK.href = "data:image/svg+xml, <svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 132 132%22><text y=%221em%22 font-size=%22100%22>" + F[new Date().getDay()] + "</text></svg>";
document.head.appendChild(LNK);
