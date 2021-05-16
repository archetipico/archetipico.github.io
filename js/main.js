var light=7891174;
var dark=15046037;

let mode = localStorage.getItem( "data-mode" );
if ( mode == "light" || ( mode == null && window.matchMedia( "(prefers-color-scheme: light)" ).matches ) ) {
    localStorage.setItem( "data-mode", "light" );
    document.documentElement.setAttribute( "data-mode", "light" );
    document.getElementById( "dark-mode" ).innerHTML = "&#58125;";
} else if ( mode == "dark" || ( mode == null && window.matchMedia( "(prefers-color-scheme: dark)" ).matches ) ) {
    localStorage.setItem( "data-mode", "dark" );
    document.documentElement.setAttribute( "data-mode" , "dark" );
    document.getElementById( "dark-mode" ).innerHTML = "&#61830;";
}

let fav = "🌴";
switch ( new Date().getDay() ) {
    case 1:
        fav = "🌌";
        break;
    case 2:
        fav = "💯";
        break;
    case 3:
        fav = "🍤";
        break;
    case 4:
        fav = "🌈";
        break;
    case 5:
        fav = "🍸";
        break;
    case 6:
        fav = "🍑";
        break;
    default:
        break;
}
changeFav( fav );

function changeFav( fav ) {
    var link = document.createElement( "link" );
    link.rel = "shortcut icon";
    link.type = "image/svg+xml";
    link.href = "data:image/svg+xml, <svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 132 132%22><text y=%221em%22 font-size=%22100%22>"+fav+"</text></svg>";

    document.head.appendChild( link );
}

function clearStorage() {
    localStorage.clear();

    document.getElementById( "storage" ).innerHTML = "Storage deleted";
    setTimeout( () => {
        document.getElementById( "storage" ).innerHTML = "Erase page storage";
    }, 2000 );
}

function setMode(){
    if ( localStorage.getItem( "data-mode" ) == "light" ) {
        localStorage.setItem( "data-mode", "dark");
        document.documentElement.setAttribute( "data-mode", "dark" );
        document.getElementById( "dark-mode" ).innerHTML = "&#61830;";
    } else {
        localStorage.setItem( "data-mode", "light");
        document.documentElement.setAttribute( "data-mode", "light" );
        document.getElementById( "dark-mode" ).innerHTML = "&#58125;";
    }

    redraw();
}

function setTitle( title ) {
    let arr = title.split( "" );
    arr.forEach( ( c, i ) => {
        setTimeout( () => {
            document.querySelector( "h1" ).innerHTML += c;
        }, i * 75 );
    } );
}

document.getElementById("ico").addEventListener("click", () => {
    var loc = document.location.href.split("/").pop();
    if ( loc == "index.html" || loc == "" ) {
        document.location.href = "./projects.html";
    } else if ( loc == "projects.html" ) {
        document.location.href = "./index.html";
    }
});