(() => {
    const DIV = document.getElementById("scene");
    var w = window.innerWidth;
    var h = window.innerHeight;
    const REND = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    REND.setSize(w, h);
    DIV.appendChild(REND.domElement);
    const CAM = new THREE.PerspectiveCamera(100, w / h, 1, 11);
    CAM.position.set(0, 0, 0);
    const SCN = new THREE.Scene();
    const GEO = new THREE.IcosahedronGeometry(11, 0);
    const WRFR = new THREE.WireframeGeometry(GEO);
    const SKEL = new THREE.LineSegments(WRFR);
    var color = localStorage.getItem("data-mode") == "light" ? light : dark;
    SKEL.material.color.setHex(color);
    SCN.add(SKEL);
    setInterval(() => {
        SKEL.rotation.x += 0.0003;
        SKEL.rotation.y += 0.0001;
        SKEL.rotation.z += 0.0002;
        REND.render(SCN, CAM)
    }, 10);
    window.onresize = () => {
        w = window.innerWidth;
        h = window.innerHeight;
        CAM.aspect = w / h;
        CAM.updateProjectionMatrix();
        REND.setSize(w, h)
    };
    this.redraw = () => {
        color = localStorage.getItem("data-mode") == "light" ? light : dark;
        SKEL.material.color.setHex(color)
    }
})();