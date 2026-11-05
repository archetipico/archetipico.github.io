(() => {
    const html = document.documentElement;

    const EMOJI = ["\u{1F334}", "\u{1F30C}", "\u{1F4AF}", "\u{1F990}", "\u{1F308}", "\u{1F525}", "\u{1F351}"];
    const e = EMOJI[new Date().getDay()];
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><text x='4' y='52' font-size='52'>${e}</text></svg>`;
    const lnk = document.createElement("link");
    lnk.rel = "icon";
    lnk.type = "image/svg+xml";
    lnk.href = "data:image/svg+xml;utf8," + encodeURIComponent(svg);
    document.head.appendChild(lnk);

    const tgl = document.getElementById("mode-toggle");

    function applyMode(m) {
        html.setAttribute("data-mode", m);
        tgl.setAttribute("aria-pressed", m === "light" ? "true" : "false");
    }

    applyMode(html.getAttribute("data-mode"));

    tgl.addEventListener("click", () => {
        const next = html.getAttribute("data-mode") === "light" ? "dark" : "light";
        document.cookie = "mode=" + next + "; max-age=31536000; path=/; SameSite=Strict";
        applyMode(next);
    });

    const clr = document.getElementById("clear-storage");
    const clearLabel = clr.textContent;
    clr.addEventListener("click", () => {
        document.cookie.split(";").forEach((c) => {
            const eq = c.indexOf("=");
            const name = (eq > -1 ? c.slice(0, eq) : c).trim();
            document.cookie = name + "=; max-age=-1; path=/; SameSite=Strict";
        });
        clr.textContent = "Deleted";
        setTimeout(() => { clr.textContent = clearLabel; }, 1400);
    });

    // One picture pixel covers a whole number of device pixels, or the dither shows moire.
    // Below the ratio where that fits the cap, smooth scaling replaces the dither with solid tone.
    const PICTURE_SIZE = 320;
    const LARGEST_SCALED = 240;

    function fitPortrait() {
        const dpr = devicePixelRatio;
        const scale = Math.floor(LARGEST_SCALED * dpr / PICTURE_SIZE);
        const size = scale > 0 ? PICTURE_SIZE * scale / dpr : LARGEST_SCALED;
        html.style.setProperty("--portrait", size + "px");
        html.style.setProperty("--portrait-rendering", scale > 0 ? "pixelated" : "auto");
    }

    fitPortrait();
    addEventListener("resize", fitPortrait, { passive: true });

    document.getElementById("foot-year").textContent = String(new Date().getFullYear());
})();
