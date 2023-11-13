/* GENERAL */
// Root data
const months = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dec"];
const root = getComputedStyle(document.documentElement);
const font = root.getPropertyValue("font");
// Color data
const bg = root.getPropertyValue("--bg").trim();
const cc = root.getPropertyValue("--lk").trim();
const tc = root.getPropertyValue("--tc").trim();
// Size data
const cs = parseInt(root.getPropertyValue("--cw"));
const fs = root.getPropertyValue("--fs").trim();
const m = {
    top: 200,
    right: 100,
    bottom: 100,
    left: 200
};
const w = (cs * 12) + m.left + m.right;

// Function to wrap text lines on axis
function wrapLine(line, thresh) {
    line.each(function () {
        // Select text
        var txt = d3.select(this),
            words = txt.text().split(/\s+/).reverse(),
            word,
            line = [],
            // Lines counter
            count = 0,
            // em
            height = 1,
            // Initial position
            y = parseFloat(txt.attr("y")), // Initial y position
            // Initial offset
            dy = 0,
            // Initial tspan
            tspan = txt.text(null).append("tspan").attr("x", 0).attr("dy", dy + "em"),
            // Current line width
            currWidth = 0;

        while (word = words.pop()) {
            // Add word to the current line
            line.push(word);
            // Set text content to the current line
            tspan.text(line.join(" "));

            // Check if the current line width exceeds the threshold
            if (currWidth > thresh) {
                // Pop last word
                line.pop();
                // Set text content to the current line
                tspan.text(line.join(" "));
                // Start a new line with the current word
                line = [word];
                // New tspan for the new line
                tspan = txt.append("tspan").attr("x", 0).attr("dy", ++count * height + dy + "em").text(word);
                // Update the current line width
                currWidth = tspan.node().getComputedTextLength();
                // Align the new line with others
                tspan.attr("dx", "-1em")
            } else {
                currWidth = tspan.node().getComputedTextLength(); // Update the current line width
            }
        }
    });
}

// Create graph
function generateGraph(data, name) {
    const keys = Object.keys(data);
    const h = (cs * Object.keys(data).length) + m.top + m.bottom;

    // Append SVG
    svg = d3.select(name)
        .append("svg")
        .attr("viewBox", `0 0 ${w} ${h}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("color", "#00000000")
        .attr("fill", bg);
    // Background
    svg.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", bg);
    // Y-axis
    y = d3.scaleBand().domain(keys).range([m.top, h - m.bottom]);
    // X-axis
    x = d3.scaleBand().domain(months).range([m.left, w - m.right]);
    // Blocks
    svg.selectAll("g")
        .data(keys)
        .join("g")
        .attr("transform", (d) => `translate(0, ${y(d)})`)
        .selectAll("rect")
        .data((d) => months.map((m, i) => ({
            item: d,
            month: i + 1
        })))
        .join("rect")
        .attr("x", (d) => x(months[d.month - 1]))
        .attr("y", 0)
        .attr("class", "cell")
        .attr("fill", (d) => data[d.item].months.includes(d.month) ? cc : "#00000000")
        .attr("width", cs)
        .attr("height", cs)
        .attr("rx", 50)
        .attr("ry", 50)
        .style("stroke", document.cookie.includes("mode=light") ? "#00000030" : "#ffffff30");
    // Y-axis text
    svg.append("g")
        .attr("transform", `translate(${m.left}, 0)`)
        .call(d3.axisLeft(y).tickSize(0))
        .selectAll("text")
        .style("text-transform", "uppercase")
        .attr("font-size", fs)
        .style("font-family", "font")
        .attr("dx", "-1em")
        .style("fill", tc)
        .call(wrapLine, x.bandwidth());
    // X-axis text
    svg.append("g")
        .attr("transform", `translate(0, ${m.top})`)
        .call(d3.axisTop(x).tickSize(0))
        .selectAll("text")
        .style("text-transform", "uppercase")
        .attr("font-size", fs)
        .style("font-family", "font")
        .attr("transform", `translate(0, ${m.top - 210})`)
        .style("fill", tc)
        .call(wrapLine, x.bandwidth());
}

/* FRUITS */
// Fruit data
const fruitData = {
    "albicocca": {
        "months": [6, 7, 8]
    },
    "amarena": {
        "months": [6, 7, 8]
    },
    "ananas": {
        "months": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    },
    "anguria": {
        "months": [6, 7, 8]
    },
    "arancia": {
        "months": [1, 2, 3, 4, 11, 12]
    },
    "avocado": {
        "months": [1, 2, 3, 4, 11, 12]
    },
    "banana": {
        "months": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    },
    "caco": {
        "months": [10, 11, 12]
    },
    "carruba": {
        "months": [8, 9, 10]
    },
    "castagna": {
        "months": [9, 10, 11]
    },
    "ciliegia": {
        "months": [5, 6, 7, 8]
    },
    "clementina": {
        "months": [1, 2, 10, 11, 12]
    },
    "cocco": {
        "months": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    },
    "fico d'india": {
        "months": [8, 9, 10, 11]
    },
    "fico": {
        "months": [6, 7, 8, 9]
    },
    "fragola": {
        "months": [4, 5, 6]
    },
    "frutto della passione": {
        "months": [6, 7, 8, 9, 10, 11, 12]
    },
    "kiwi": {
        "months": [1, 2, 3, 4, 11, 12]
    },
    "lampone": {
        "months": [5, 6, 7, 8, 9, 10]
    },
    "limone": {
        "months": [1, 2, 3, 4, 10, 11, 12]
    },
    "litchi": {
        "months": [1, 2, 11, 12]
    },
    "mandarancio": {
        "months": [1, 2, 3, 4, 11, 12]
    },
    "mandarino": {
        "months": [1, 2, 11, 12]
    },
    "mango": {
        "months": [8, 9, 10]
    },
    "melagrana": {
        "months": [10, 11]
    },
    "mela": {
        "months": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    },
    "mela cotogna": {
        "months": [10, 11]
    },
    "melone": {
        "months": [5, 6, 7, 8, 9]
    },
    "mirtillo": {
        "months": [7, 8, 9]
    },
    "mora": {
        "months": [7, 8, 9]
    },
    "nespola": {
        "months": [4, 5, 6]
    },
    "papaya": {
        "months": [7, 8, 9, 10, 11, 12]
    },
    "pera": {
        "months": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    },
    "pesca": {
        "months": [6, 7, 8, 9]
    },
    "pesca noce": {
        "months": [6, 7, 8, 9]
    },
    "pompelmo": {
        "months": [1, 2, 3, 4, 5, 11, 12]
    },
    "pompelmo rosa": {
        "months": [1, 2, 3, 4, 5, 11, 12]
    },
    "prugna": {
        "months": [5, 6, 7, 8, 9, 10]
    },
    "ribes": {
        "months": [6, 7, 8]
    },
    "susina": {
        "months": [5, 6, 7, 8, 9, 10]
    },
    "uva": {
        "months": [9, 10, 11, 12]
    },
    "uva rossa": {
        "months": [9, 10, 11, 12]
    },
    "uva spina": {
        "months": [7, 8]
    }
}
generateGraph(fruitData, "#fruits-calendar")

/* VEGETABLES */
const vegetableData = {
    "aglio": {
        "months": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    },
    "agretto": {
        "months": [3, 4, 5]
    },
    "asparago": {
        "months": [3, 4, 5, 6]
    },
    "barbabietola rossa": {
        "months": [1, 2, 5, 6, 7, 8, 9, 10, 11, 12]
    },
    "bieta": {
        "months": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    },
    "broccolo a testa": {
        "months": [1, 2, 3, 4, 10, 11, 12]
    },
    "carciofo": {
        "months": [1, 2, 3, 4, 5, 6, 10, 11, 12]
    },
    "cardo": {
        "months": [1, 2, 3, 11, 12]
    },
    "carote": {
        "months": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    },
    "catalogna": {
        "months": [1, 2, 3, 4, 5, 9, 10, 11, 12]
    },
    "cavoletti di bruxelles": {
        "months": [1, 2, 3, 4, 10, 11, 12]
    },
    "cavolfiore": {
        "months": [1, 2, 3, 4, 5, 9, 10, 11, 12]
    },
    "cavolo broccolo": {
        "months": [1, 2, 3, 4, 10, 11, 12]
    },
    "cavolo cappuccio": {
        "months": [1, 2, 3, 4, 10, 11, 12]
    },
    "cavolo nero": {
        "months": [1, 2, 3, 4, 10, 11, 12]
    },
    "cavolo rosso": {
        "months": [1, 2, 3, 4, 10, 11, 12]
    },
    "cavolo verza": {
        "months": [1, 2, 3, 4, 10, 11, 12]
    },
    "cetriolo": {
        "months": [5, 6, 7, 8, 9]
    },
    "cicoria": {
        "months": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    },
    "cima di rapa": {
        "months": [1, 2, 3, 4, 10, 11, 12]
    },
    "cipolla": {
        "months": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    },
    "crescione": {
        "months": [3, 4, 5, 6, 7]
    },
    "erba cipollina": {
        "months": [4, 5, 6, 7]
    },
    "erbetta": {
        "months": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    },
    "fagiolo": {
        "months": [4, 5, 6, 7, 8, 9, 10, 11]
    },
    "fagiolino": {
        "months": [4, 5, 6, 7, 8, 9]
    },
    "fava": {
        "months": [4, 5, 6, 7, 8, 9]
    },
    "finocchio": {
        "months": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    },
    "fiore di zucca": {
        "months": [5, 6, 7, 8, 9, 10]
    },
    "fungo": {
        "months": [8, 9, 10, 11]
    },
    "indivia belga": {
        "months": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    },
    "lattuga": {
        "months": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    },
    "lenticchia": {
        "months": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    },
    "melanzana": {
        "months": [5, 6, 7, 8, 9, 10]
    },
    "patata": {
        "months": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    },
    "peperone": {
        "months": [5, 6, 7, 8, 9, 10]
    },
    "pisello": {
        "months": [4, 5, 6, 7, 8, 9]
    },
    "pomodoro": {
        "months": [5, 6, 7, 8, 9, 10]
    },
    "porro": {
        "months": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    },
    "puntarella": {
        "months": [1, 2, 3, 4, 5, 9, 10, 11, 12]
    },
    "radicchio": {
        "months": [1, 2, 3, 11, 12]
    },
    "rafano": {
        "months": [1, 2, 3, 10, 11, 12]
    },
    "rapa": {
        "months": [1, 2, 3, 11, 12]
    },
    "ravanello": {
        "months": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    },
    "rucola": {
        "months": [4, 5, 6, 7, 8, 9, 10]
    },
    "scalogno": {
        "months": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    },
    "scarola": {
        "months": [1, 2, 3, 6, 7, 8, 9, 10, 11, 12]
    },
    "sedano": {
        "months": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    },
    "spinacio": {
        "months": [1, 2, 3, 4, 5, 9, 10, 11, 12]
    },
    "tartufo": {
        "months": [1, 10, 11, 12]
    },
    "topinambur": {
        "months": [1, 2, 3, 10, 11, 12]
    },
    "valerianella": {
        "months": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    },
    "zucca": {
        "months": [1, 2, 3, 9, 10, 11, 12]
    },
    "zucchina": {
        "months": [5, 6, 7, 8, 9, 10]
    },
}
generateGraph(vegetableData, "#vegetables-calendar")

/* OTHER */
// Function to download as SVG
function downloadAsSVG() {
    const elem = document.getElementById("calendars-container");
    const str = new XMLSerializer().serializeToString(elem);
    const blob = new Blob([str], {
        type: "image/svg+xml"
    });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "graph.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
