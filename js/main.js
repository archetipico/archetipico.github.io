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

    function readMode() {
        if (document.cookie.includes("mode=light")) return "light";
        if (document.cookie.includes("mode=dark"))  return "dark";
        return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches
            ? "light"
            : "dark";
    }
    function writeMode(m) {
        document.cookie = "mode=" + m + "; max-age=31536000; path=/; SameSite=Strict";
    }

    function applyMode(m) {
        html.setAttribute("data-mode", m);
        const tgl = document.getElementById("mode-toggle");
        if (tgl) tgl.setAttribute("aria-pressed", m === "light" ? "true" : "false");
    }

    const initialMode = readMode();
    applyMode(initialMode);

    const DICT = {
        en: {
            "skip": "Skip to content",
            "meta.city": "Milan, IT",
            "meta.est": "est. 1997",
            "meta.title": "archetipico",
            "meta.desc": "Computer scientist in Milan. Side projects across security, graphics, programming languages, and games.",
            "mode.aria": "Toggle color mode",
            "lang.aria": "Language",
            "sl.bio": "01 · whoami",
            "sl.proj": "02 · projects",
            "sl.foot": "03 · colophon",
            "h.bio": "I turn bits into reality.",
            "h.proj": "Selected work",
            "bio.p1": "<b>Milan</b>, since 1997. Scientific high school, thesis on malware as art.",
            "bio.p2": "<b>Computer Science</b> at Universita' degli Studi di Milano. Final thesis: a visual language for the identification of entities extracted from tabular data.",
            "bio.p3": "<b>Full-stack developer</b> by day. Outside work: information security, graphics programming, programming languages, videogames, and anything with a CPU.",
            "desc.fragmentary": "Write and edit shaders straight in the browser.",
            "desc.aplamp": "Client-side APL interpreter.",
            "desc.convoy": "Minimal LAN chat. No server, no signup.",
            "desc.android": "Remove bloatware and pre-installed apps from Android phones.",
            "desc.tg": "Personal Telegram bot: weather, regex compiler, palette extraction from images, and much more!",
            "desc.emerger": "Update any operating system by typing <code>up</code>. Built with <a href=\"https://mastercruelty.github.io/\" rel=\"noopener noreferrer nofollow\" target=\"_blank\">MasterCruelty</a>.",
            "desc.wp": "Time-of-day wallpaper rotation for Windows 10.",
            "desc.seasonal": "Italian almanac of seasonal fruit and vegetables. <span class=\"project__lang\" lang=\"it\">In italiano.</span>",
            "desc.paddle16": "Two-player paddle game in pure NASM.",
            "desc.site": "This site.",
            "tag.lang.it": "In Italian only",
            "foot.note": "Cookies used only for theme and language.",
            "foot.clear": "Delete cookies",
            "foot.cleared": "Cleared"
        },
        it: {
            "skip": "Salta al contenuto",
            "meta.city": "Milano, IT",
            "meta.est": "dal 1997",
            "meta.title": "archetipico",
            "meta.desc": "Informatico a Milano. Progetti personali su sicurezza, grafica, linguaggi di programmazione e videogiochi.",
            "mode.aria": "Cambia tema",
            "lang.aria": "Lingua",
            "sl.bio": "01 · whoami",
            "sl.proj": "02 · progetti",
            "sl.foot": "03 · colophon",
            "h.bio": "Trasformo i bit in realtà.",
            "h.proj": "Lavori scelti",
            "bio.p1": "<b>Milano</b>, dal 1997. Liceo scientifico, tesi sul malware come arte.",
            "bio.p2": "<b>Informatica</b> alla Statale di Milano. Tesi: un linguaggio visuale per l'identificazione di entità estratte da dati tabellari.",
            "bio.p3": "Di giorno <b>full-stack developer</b>. Fuori dal lavoro: sicurezza informatica, grafica, linguaggi di programmazione, videogiochi e tutto ciò che ha una CPU.",
            "desc.fragmentary": "Scrivi e modifica shader direttamente nel browser.",
            "desc.aplamp": "Interprete APL client-side.",
            "desc.convoy": "Chat LAN minimale. Niente server, niente registrazione.",
            "desc.android": "Rimuovi bloatware e app preinstallate dai telefoni Android.",
            "desc.tg": "Bot Telegram personale: meteo, compilatore di regex, estrazione di palette dalle immagini e tanto altro!",
            "desc.emerger": "Aggiorna qualsiasi sistema operativo scrivendo <code>up</code>. Scritto insieme a <a href=\"https://mastercruelty.github.io/\" rel=\"noopener noreferrer nofollow\" target=\"_blank\">MasterCruelty</a>.",
            "desc.wp": "Cambia lo sfondo di Windows 10 in base all'ora del giorno.",
            "desc.seasonal": "Almanacco italiano della frutta e verdura di stagione.",
            "desc.paddle16": "Gioco con racchette per due persone, scritto in NASM.",
            "desc.site": "Questo sito.",
            "tag.lang.it": "Solo in italiano",
            "foot.note": "Cookie solo per tema e lingua.",
            "foot.clear": "Cancella i cookie",
            "foot.cleared": "Fatto"
        }
    };

    function readLang() {
        if (document.cookie.includes("lang=it")) return "it";
        if (document.cookie.includes("lang=en")) return "en";
        const nav = (navigator.language || "").toLowerCase();
        return nav.indexOf("it") === 0 ? "it" : "en";
    }
    function writeLang(l) {
        document.cookie = "lang=" + l + "; max-age=31536000; path=/; SameSite=Strict";
    }

    const META_TITLE_SELECTORS = ['meta[name="title"]', 'meta[property="og:title"]', 'meta[name="twitter:title"]'];
    const META_DESC_SELECTORS  = ['meta[name="description"]', 'meta[property="og:description"]', 'meta[name="twitter:description"]'];

    function applyLang(l) {
        const dict = DICT[l] || DICT.en;
        html.lang = l;

        document.querySelectorAll("[data-i18n]").forEach((el) => {
            const k = el.getAttribute("data-i18n");
            if (dict[k] != null) el.innerHTML = dict[k];
        });
        document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
            const k = el.getAttribute("data-i18n-aria-label");
            if (dict[k] != null) el.setAttribute("aria-label", dict[k]);
        });
        document.querySelectorAll("[data-i18n-title]").forEach((el) => {
            const k = el.getAttribute("data-i18n-title");
            if (dict[k] != null) el.setAttribute("title", dict[k]);
        });

        if (dict["meta.title"]) {
            document.title = dict["meta.title"];
            META_TITLE_SELECTORS.forEach((s) => {
                const el = document.querySelector(s);
                if (el) el.setAttribute("content", dict["meta.title"]);
            });
        }
        if (dict["meta.desc"]) {
            META_DESC_SELECTORS.forEach((s) => {
                const el = document.querySelector(s);
                if (el) el.setAttribute("content", dict["meta.desc"]);
            });
        }
        const ogl = document.querySelector('meta[property="og:locale"]');
        if (ogl) ogl.setAttribute("content", l === "it" ? "it_IT" : "en_US");

        document.querySelectorAll(".lang-toggle__btn").forEach((b) => {
            b.setAttribute("aria-pressed", b.getAttribute("data-lang") === l ? "true" : "false");
        });

        html.classList.remove("lang-pending");
    }

    const initialLang = readLang();
    applyLang(initialLang);

    function ready(fn) {
        if (document.readyState !== "loading") fn();
        else document.addEventListener("DOMContentLoaded", fn);
    }

    ready(() => {
        applyLang(readLang());

        const tgl = document.getElementById("mode-toggle");
        if (tgl) {
            tgl.addEventListener("click", () => {
                const cur = html.getAttribute("data-mode") === "light" ? "light" : "dark";
                const next = cur === "light" ? "dark" : "light";
                writeMode(next);
                applyMode(next);
            });
        }

        document.querySelectorAll(".lang-toggle__btn").forEach((b) => {
            b.addEventListener("click", () => {
                const l = b.getAttribute("data-lang");
                if (!l || !DICT[l]) return;
                writeLang(l);
                applyLang(l);
            });
        });

        const clr = document.getElementById("clear-storage");
        if (clr) {
            clr.addEventListener("click", (ev) => {
                ev.preventDefault();
                document.cookie.split(";").forEach((c) => {
                    const eq = c.indexOf("=");
                    const name = (eq > -1 ? c.slice(0, eq) : c).trim();
                    document.cookie = name + "=; max-age=-1; path=/; SameSite=Strict";
                });
                const cur = html.lang === "it" ? "it" : "en";
                const original = DICT[cur]["foot.clear"];
                clr.textContent = DICT[cur]["foot.cleared"];
                setTimeout(() => { clr.textContent = original; }, 1400);
            });
        }

        const yr = document.getElementById("foot-year");
        if (yr) yr.textContent = String(new Date().getFullYear());
    });
})();
