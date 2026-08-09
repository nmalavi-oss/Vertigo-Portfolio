import { PageFlip } from "page-flip";

const app = document.getElementById("app");

app.innerHTML = `
    <div id="fullscreen-btn" title="Fullscreen">
        ⛶
    </div>

    <div id="flipbook"></div>
`;

// =================================
// Device Detection
// =================================

const isIPhone =
    /iPhone|iPod/i.test(navigator.userAgent);

// =================================
// PageFlip
// =================================

const pageFlip = new PageFlip(
    document.getElementById("flipbook"),
    {
        width: 1754,
        height: 1400,

        size: "stretch",

        minWidth: 150,
        maxWidth: 1754,

        minHeight: 200,
        maxHeight: 1400,

        showCover: true,

        usePortrait: false,

        mobileScrollSupport: true
    }
);

// =================================
// Pages
// =================================

const images = import.meta.glob("../pages/*.png", {
    eager: true,
    import: "default"
});

const pages = Object.keys(images)
    .sort()
    .map((key) => images[key]);

pageFlip.loadFromImages(pages);

// =================================
// Constants
// =================================

const SPREAD_RATIO =
    (1754 * 2) / 1400;

// =================================
// Viewport
// =================================

function getViewportSize() {
    const vv = window.visualViewport;

    return {
        width: Math.round(
            vv?.width ||
            window.innerWidth
        ),

        height: Math.round(
            vv?.height ||
            window.innerHeight
        )
    };
}

function isLandscapeMode() {
    const { width, height } =
        getViewportSize();

    return width > height;
}

// =================================
// Canvas Synchronization
// =================================

function syncPageFlipCanvas() {
    try {
        const ui =
            pageFlip.getUI();

        if (
            ui &&
            typeof ui.update === "function"
        ) {
            ui.update();
        }

    } catch (error) {
        console.warn(
            "Canvas UI update failed:",
            error
        );
    }

    pageFlip.update();
}

// =================================
// Normal Responsive Mode
//
// Android
// Desktop
// iPhone Portrait
// =================================

function fitNormalMode() {
    const { width, height } =
        getViewportSize();

    const appElement =
        document.getElementById("app");

    const flipbookElement =
        document.getElementById("flipbook");

    if (
        !appElement ||
        !flipbookElement
    ) {
        return;
    }

    appElement.style.width =
        `${width}px`;

    appElement.style.height =
        `${height}px`;

    const maxWidthFromHeight =
        height * SPREAD_RATIO;

    const targetWidth =
        Math.min(
            width,
            maxWidthFromHeight
        );

    flipbookElement.style.width =
        `${Math.floor(targetWidth)}px`;

    flipbookElement.style.height =
        `${height}px`;

    flipbookElement.style.maxWidth =
        "";

    flipbookElement.style.maxHeight =
        "";

    flipbookElement.style.transform =
        "none";

    requestAnimationFrame(() => {

        syncPageFlipCanvas();

        requestAnimationFrame(() => {
            syncPageFlipCanvas();
        });

    });
}

// =================================
// iPhone Landscape
// =================================

function fitIPhoneLandscape() {
    const {
        width: viewportWidth,
        height: viewportHeight
    } = getViewportSize();

    const appElement =
        document.getElementById("app");

    const flipbookElement =
        document.getElementById("flipbook");

    if (
        !appElement ||
        !flipbookElement
    ) {
        return;
    }

    const horizontalPadding = 20;
    const verticalPadding = 20;

    const availableWidth =
        Math.max(
            1,
            viewportWidth -
            horizontalPadding
        );

    const availableHeight =
        Math.max(
            1,
            viewportHeight -
            verticalPadding
        );

    let targetWidth =
        availableWidth;

    let targetHeight =
        targetWidth /
        SPREAD_RATIO;

    if (
        targetHeight >
        availableHeight
    ) {
        targetHeight =
            availableHeight;

        targetWidth =
            targetHeight *
            SPREAD_RATIO;
    }

    appElement.style.width =
        `${viewportWidth}px`;

    appElement.style.height =
        `${viewportHeight}px`;

    flipbookElement.style.width =
        `${Math.floor(targetWidth)}px`;

    flipbookElement.style.height =
        `${Math.floor(targetHeight)}px`;

    flipbookElement.style.maxWidth =
        `${Math.floor(targetWidth)}px`;

    flipbookElement.style.maxHeight =
        `${Math.floor(targetHeight)}px`;

    flipbookElement.style.transform =
        "none";

    requestAnimationFrame(() => {

        syncPageFlipCanvas();

        requestAnimationFrame(() => {
            syncPageFlipCanvas();
        });

    });
}

// =================================
// Responsive Router
// =================================

function fitFlipbookToViewport() {

    if (
        isIPhone &&
        isLandscapeMode()
    ) {
        fitIPhoneLandscape();
    } else {
        fitNormalMode();
    }
}

// =================================
// Resize Synchronization
// =================================

function refreshFlipbookSize() {

    fitFlipbookToViewport();

    setTimeout(
        fitFlipbookToViewport,
        100
    );

    setTimeout(
        fitFlipbookToViewport,
        300
    );

    setTimeout(
        fitFlipbookToViewport,
        600
    );

    setTimeout(
        fitFlipbookToViewport,
        1000
    );

    setTimeout(
        syncPageFlipCanvas,
        1100
    );
}

// =================================
// Initial Load
// =================================

setTimeout(
    refreshFlipbookSize,
    100
);

// =================================
// Resize
// =================================

window.addEventListener(
    "resize",
    refreshFlipbookSize
);

// =================================
// Rotation
// =================================

window.addEventListener(
    "orientationchange",
    () => {

        refreshFlipbookSize();

        setTimeout(
            refreshFlipbookSize,
            500
        );

        setTimeout(
            syncPageFlipCanvas,
            1200
        );
    }
);

// =================================
// Visual Viewport
// =================================

if (window.visualViewport) {

    window.visualViewport.addEventListener(
        "resize",
        refreshFlipbookSize
    );
}

// =================================
// Fullscreen
// =================================

const fullscreenBtn =
    document.getElementById(
        "fullscreen-btn"
    );

// =================================
// iPhone
//
// Fullscreen API برای عناصر معمولی
// روی iPhone قابل اتکا نیست.
// دکمه روی iPhone مخفی می‌شود.
// =================================

if (isIPhone) {

    fullscreenBtn.style.display =
        "none";

}

// =================================
// Android / Desktop Fullscreen
// =================================

async function toggleFullscreen() {

    if (isIPhone) {
        return;
    }

    try {

        if (
            !document.fullscreenElement
        ) {

            const element =
                document.documentElement;

            if (
                element.requestFullscreen
            ) {

                await element
                    .requestFullscreen();

            } else if (
                element.webkitRequestFullscreen
            ) {

                element
                    .webkitRequestFullscreen();
            }

        } else {

            if (
                document.exitFullscreen
            ) {

                await document
                    .exitFullscreen();

            } else if (
                document.webkitExitFullscreen
            ) {

                document
                    .webkitExitFullscreen();
            }
        }

    } catch (error) {

        console.warn(
            "Fullscreen is not available:",
            error
        );
    }

    refreshFlipbookSize();
}

fullscreenBtn.addEventListener(
    "click",
    toggleFullscreen
);

// =================================
// Fullscreen Events
// =================================

document.addEventListener(
    "fullscreenchange",
    () => {

        if (
            document.fullscreenElement
        ) {

            fullscreenBtn
                .classList
                .add("is-active");

        } else {

            fullscreenBtn
                .classList
                .remove("is-active");
        }

        refreshFlipbookSize();
    }
);

document.addEventListener(
    "webkitfullscreenchange",
    refreshFlipbookSize
);

// =================================
// Keyboard Navigation
// =================================

window.addEventListener(
    "keydown",
    (e) => {

        const tag =
            document
                .activeElement
                ?.tagName;

        if (
            tag === "INPUT" ||
            tag === "TEXTAREA"
        ) {
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

            case "f":
            case "F":

                if (!isIPhone) {

                    e.preventDefault();

                    toggleFullscreen();
                }

                break;
        }
    }
);