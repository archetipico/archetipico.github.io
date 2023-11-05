const data = {
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

const months = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dec"];
const fruits = Object.keys(data);

const root = document.documentElement;
const cellSize = parseInt(getComputedStyle(root).getPropertyValue("--cell-width"));
const cellColor = getComputedStyle(root).getPropertyValue("--cell-color").trim();
const fontSize = getComputedStyle(root).getPropertyValue("--font-size").trim();

const margin = {
    top: 200,
    right: 100,
    bottom: 100,
    left: 200
};

const width = (cellSize * 12) + margin.left + margin.right;
const height = (cellSize * Object.keys(data).length) + margin.top + margin.bottom;

const svg = d3.select("#fruits-calendar")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

const y = d3.scaleBand()
    .domain(fruits)
    .range([margin.top, height - margin.bottom]);

const x = d3.scaleBand()
    .domain(months)
    .range([margin.left, width - margin.right]);

svg.append("text")
    .attr("x", width / 2)
    .attr("y", 50)
    .attr("text-anchor", "middle")
    .style("font-size", fontSize * 2)
    .style("font-family", "Arial, sans-serif")
    .style("font-weight", "bold")
    .text("Disponibilità di frutta di stagione in Italia");

svg.selectAll("g")
    .data(fruits)
    .join("g")
    .attr("transform", (d) => `translate(0, ${y(d)})`)
    .selectAll("rect")
    .data((d) => months.map((m, i) => ({
        fruit: d,
        month: i + 1
    })))
    .join("rect")
    .attr("x", (d) => x(months[d.month - 1]))
    .attr("y", 0)
    .attr("class", "cell")
    .attr("fill", (d) => data[d.fruit].months.includes(d.month) ? cellColor : "#e0e0e0")
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("rx", 6)
    .attr("ry", 6)
    .style("stroke", "#fff");

svg.append("g")
    .attr("transform", `translate(0, ${margin.top})`)
    .call(d3.axisTop(x).tickSize(0))
    .selectAll("text")
    .style("text-transform", "uppercase")
    .attr("font-size", fontSize)
    .attr("dy", "-1em")
    .style("fill", "#333");

svg.append("g")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(y).tickSize(0))
    .selectAll("text")
    .style("text-transform", "uppercase")
    .attr("font-size", fontSize)
    .attr("dx", "-1em")
    .style("fill", "#333");

document.getElementById("download-svg").addEventListener("click", function() {
    const svgElement = document.querySelector("svg");
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "graph.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});