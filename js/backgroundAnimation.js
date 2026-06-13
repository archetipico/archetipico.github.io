(() => {
    const canvas = document.getElementById("bg-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });

    const PERM = new Uint8Array(512);
    {
        const p = new Uint8Array(256);
        for (let i = 0; i < 256; i++) p[i] = i;
        let seed = (Math.floor(Date.now() / 1000) % 2147483646) + 1;
        const rand = () => {
            seed = (seed * 16807) % 2147483647;
            return seed / 2147483647;
        };
        for (let i = 255; i > 0; i--) {
            const j = (rand() * (i + 1)) | 0;
            [p[i], p[j]] = [p[j], p[i]];
        }
        for (let i = 0; i < 512; i++) PERM[i] = p[i & 255];
    }
    const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
    const lerp = (a, b, t) => a + (b - a) * t;
    const hashUnit = (X, Y) => PERM[(PERM[X & 255] + (Y & 255)) & 255] / 255;
    function noise2(x, y) {
        const X = Math.floor(x), Y = Math.floor(y);
        const xf = x - X, yf = y - Y;
        const u = fade(xf), v = fade(yf);
        const a = lerp(hashUnit(X,     Y),     hashUnit(X + 1, Y    ), u);
        const b = lerp(hashUnit(X,     Y + 1), hashUnit(X + 1, Y + 1), u);
        return lerp(a, b, v);
    }
    function fbm(x, y) {
        let v = 0, amp = 0.6, freq = 1, sum = 0;
        for (let i = 0; i < 3; i++) {
            v += noise2(x * freq, y * freq) * amp;
            sum += amp;
            amp *= 0.5;
            freq *= 2.05;
        }
        return v / sum;
    }

    let W = 0, H = 0, dpr = 1;
    let cols = 0, rows = 0, cellW = 0, cellH = 0;
    let field = null;
    let mode = document.documentElement.getAttribute("data-mode") || "dark";

    function readTokens() {
        const cs = getComputedStyle(document.documentElement);
        const pick = (n, d) => {
            const v = parseInt(cs.getPropertyValue(n), 10);
            return Number.isFinite(v) ? v : d;
        };
        return {
            warm: { r: pick("--canvas-r",  255), g: pick("--canvas-g",  180), b: pick("--canvas-b",  168) },
            mid:  { r: pick("--canvas2-r", 255), g: pick("--canvas2-g", 210), b: pick("--canvas2-b", 168) },
            cool: { r: pick("--canvas3-r", 120), g: pick("--canvas3-g", 168), b: pick("--canvas3-b", 255) }
        };
    }
    let tk = readTokens();

    function isMobile() { return W < 720; }

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 1.75);
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = Math.floor(W * dpr);
        canvas.height = Math.floor(H * dpr);
        canvas.style.width = W + "px";
        canvas.style.height = H + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const target = isMobile() ? 90 : 150;
        cellW = W / target;
        cellH = cellW;
        cols = Math.ceil(W / cellW) + 2;
        rows = Math.ceil(H / cellH) + 2;
        field = new Float32Array(cols * rows);
    }

    function sampleField() {
        const sx = 0.018;
        const sy = 0.016;
        for (let j = 0; j < rows; j++) {
            const yBase = j * sy;
            for (let i = 0; i < cols; i++) {
                const xBase = i * sx;
                const wx = noise2(xBase + 11.3, yBase - 4.7) - 0.5;
                const wy = noise2(xBase - 7.1,  yBase + 2.9) - 0.5;
                field[j * cols + i] = fbm(xBase + wx * 1.1, yBase + wy * 1.1);
            }
        }
    }

    function strokeIsoline(iso, rgba, lineWidth) {
        ctx.strokeStyle = rgba;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        for (let j = 0; j < rows - 1; j++) {
            const yT = j * cellH;
            const yB = yT + cellH;
            const rowA = j * cols;
            const rowB = rowA + cols;
            for (let i = 0; i < cols - 1; i++) {
                const a = field[rowA + i];
                const b = field[rowA + i + 1];
                const c = field[rowB + i + 1];
                const d = field[rowB + i];
                let idx = 0;
                if (a > iso) idx |= 1;
                if (b > iso) idx |= 2;
                if (c > iso) idx |= 4;
                if (d > iso) idx |= 8;
                if (idx === 0 || idx === 15) continue;

                const xL = i * cellW;
                const xR = xL + cellW;

                const dTop    = b - a; const tTop    = dTop    !== 0 ? (iso - a) / dTop    : 0.5;
                const dRight  = c - b; const tRight  = dRight  !== 0 ? (iso - b) / dRight  : 0.5;
                const dBottom = c - d; const tBottom = dBottom !== 0 ? (iso - d) / dBottom : 0.5;
                const dLeft   = d - a; const tLeft   = dLeft   !== 0 ? (iso - a) / dLeft   : 0.5;

                const xTop    = xL + tTop    * cellW;
                const yRight  = yT + tRight  * cellH;
                const xBottom = xL + tBottom * cellW;
                const yLeft   = yT + tLeft   * cellH;

                switch (idx) {
                    case 1: case 14:
                        ctx.moveTo(xTop, yT);     ctx.lineTo(xL,     yLeft);   break;
                    case 2: case 13:
                        ctx.moveTo(xTop, yT);     ctx.lineTo(xR,     yRight);  break;
                    case 3: case 12:
                        ctx.moveTo(xL,   yLeft);  ctx.lineTo(xR,     yRight);  break;
                    case 4: case 11:
                        ctx.moveTo(xR,   yRight); ctx.lineTo(xBottom, yB);     break;
                    case 5:
                        ctx.moveTo(xTop, yT);     ctx.lineTo(xR,     yRight);
                        ctx.moveTo(xBottom, yB);  ctx.lineTo(xL,     yLeft);   break;
                    case 6: case 9:
                        ctx.moveTo(xTop, yT);     ctx.lineTo(xBottom, yB);     break;
                    case 7: case 8:
                        ctx.moveTo(xL,   yLeft);  ctx.lineTo(xBottom, yB);     break;
                    case 10:
                        ctx.moveTo(xTop, yT);     ctx.lineTo(xL,     yLeft);
                        ctx.moveTo(xR,   yRight); ctx.lineTo(xBottom, yB);     break;
                }
            }
        }
        ctx.stroke();
    }

    const LEVELS = [0.40, 0.50, 0.60];

    function render() {
        ctx.clearRect(0, 0, W, H);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        sampleField();

        const baseA = mode === "light" ? 0.22 : 0.26;
        const dimA  = mode === "light" ? 0.15 : 0.08;
        const mid   = (LEVELS.length - 1) / 2;

        for (let k = 0; k < LEVELS.length; k++) {
            const iso = LEVELS[k];
            const centrality = 1 - Math.abs(k - mid) / mid;
            const alpha = lerp(dimA, baseA, centrality);
            const mix = k / (LEVELS.length - 1);
            const r = Math.round(lerp(tk.warm.r, tk.cool.r, mix));
            const g = Math.round(lerp(tk.warm.g, tk.cool.g, mix));
            const b = Math.round(lerp(tk.warm.b, tk.cool.b, mix));
            const lw = centrality > 0.66 ? 1.25 : (centrality > 0.33 ? 0.85 : 0.6);
            strokeIsoline(iso, `rgba(${r},${g},${b},${alpha})`, lw);
        }

        strokeIsoline(
            0.5,
            `rgba(${tk.mid.r},${tk.mid.g},${tk.mid.b},0.18)`,
            1.5
        );
    }

    let resizeTO = null;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTO);
        resizeTO = setTimeout(() => { resize(); render(); }, 120);
    }, { passive: true });

    const obs = new MutationObserver(() => {
        mode = document.documentElement.getAttribute("data-mode") || "dark";
        tk = readTokens();
        render();
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-mode"] });

    resize();
    render();
})();
