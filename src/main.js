async function loadPart(id, file) {
    try {
        const res = await fetch(file);
        document.getElementById(id).innerHTML = await res.text();
    } catch (e) {
        console.error('loadPart failed', e);
    }
}
loadPart("header", "public/header.html").then(r => console.log("Header загружен"));
loadPart("footer", "public/footer.html").then(r => console.log("Footer загружен"));