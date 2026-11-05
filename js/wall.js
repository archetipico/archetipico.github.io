(() => {
    const root = document.documentElement;
    const canvas = document.getElementById("bg-canvas");
    const ctx = canvas.getContext("2d");

    const GLYPHS = "01{}[]<>/;=+*#";
    const FONT = '"Mono Subset", monospace';
    const CELL_WIDTH = 11;
    const CELL_HEIGHT = 18;
    const FONT_SIZE = 13;
    const NOISE_SCALE = 0.007;
    /** Share of grid cells that carry a glyph, the same for every seed and viewport. */
    const DENSITY = 0.6;

    const PERM = new Uint8Array(512);
    {
        const p = Array.from({ length: 256 }, (_, i) => i);
        // Lehmer generator: its state must stay in 1..2147483646, and 0 would stick at 0.
        let seed = 1 + Math.floor(Math.random() * 2147483646);
        const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
        for (let i = 255; i > 0; i--) {
            const j = (rand() * (i + 1)) | 0;
            [p[i], p[j]] = [p[j], p[i]];
        }
        for (let i = 0; i < 512; i++) PERM[i] = p[i & 255];
    }
    const hash = (x, y) => PERM[(PERM[x & 255] + (y & 255)) & 255] / 255;
    const fade = (t) => t * t * (3 - 2 * t);
    const lerp = (a, b, t) => a + (b - a) * t;
    function noise(x, y) {
        const X = Math.floor(x), Y = Math.floor(y);
        const u = fade(x - X), v = fade(y - Y);
        return lerp(lerp(hash(X, Y), hash(X + 1, Y), u), lerp(hash(X, Y + 1), hash(X + 1, Y + 1), u), v);
    }
    const fbm = (x, y) =>
        (noise(x, y) * 0.6 + noise(x * 2.05, y * 2.05) * 0.3 + noise(x * 4.2, y * 4.2) * 0.15) / 1.05;
    const glyph = (column, row) => GLYPHS[PERM[(column * 7 + PERM[row & 255]) & 255] % GLYPHS.length];

    function draw() {
        const dpr = Math.min(devicePixelRatio, 2);
        canvas.width = Math.floor(innerWidth * dpr);
        canvas.height = Math.floor(innerHeight * dpr);
        ctx.fillStyle = getComputedStyle(root).getPropertyValue("--canvas");
        ctx.font = `${FONT_SIZE * dpr}px ${FONT}`;

        // Whole device pixels keep the glyphs sharp at fractional zoom.
        const width = Math.round(CELL_WIDTH * dpr);
        const height = Math.round(CELL_HEIGHT * dpr);
        const cells = [];
        for (let row = 0, y = height; y < canvas.height + height; row++, y += height) {
            for (let column = 0, x = 0; x < canvas.width; column++, x += width) {
                cells.push({ column, row, x, y, level: fbm(x / dpr * NOISE_SCALE, y / dpr * NOISE_SCALE) });
            }
        }
        // A fixed cutoff on the noise would swing the density from seed to seed, so fill the highest cells.
        cells.sort((a, b) => b.level - a.level);
        for (const { column, row, x, y } of cells.slice(0, Math.round(cells.length * DENSITY))) {
            ctx.fillText(glyph(column, row), x, y);
        }
    }

    let resizeTimer;
    addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(draw, 120);
    }, { passive: true });

    new MutationObserver(draw).observe(root, { attributes: true, attributeFilter: ["data-mode"] });

    // The first draw waits for the font; without it the wall still appears in the fallback.
    document.fonts.load(`${FONT_SIZE}px "Mono Subset"`).then(draw, draw);
})();
