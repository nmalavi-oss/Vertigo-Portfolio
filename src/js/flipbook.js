import { PageFlip } from "page-flip";

const app = document.getElementById("app");

app.innerHTML = `
<div id="flipbook">
</div>
`;

const pageFlip = new PageFlip(
    document.getElementById("flipbook"),
    {
        width:1754,
        height:1400,

        size:"stretch",

        minWidth:350,
        maxWidth:1754,

        minHeight:450,
        maxHeight:1400,

        showCover:true,

        mobileScrollSupport:true
    }
);

const images = import.meta.glob("../pages/*.png", {
    eager: true,
    import: "default"
});

const pages = Object.keys(images)
    .sort()
    .map(key => images[key]);

pageFlip.loadFromImages(pages);
// ================================
// Keyboard Navigation
// ================================
window.addEventListener("keydown", (e) => {

    // اگر کاربر داخل یک input یا textarea در حال تایپ است
    // میانبرها عمل نکنند.
    const tag = document.activeElement?.tagName;

    if (tag === "INPUT" || tag === "TEXTAREA") {
        return;
    }

    switch (e.key) {

        case "ArrowRight":
            e.preventDefault();
            pageFlip.flipNext();
            break;

        case "ArrowLeft":
            e.preventDefault();
            pageFlip.flipPrev();
            break;
    }

});