/* =========================================================
   MUSA TIK — CUTE RGB V1
   APP.JS
   ========================================================= */

"use strict";

/* =========================================================
   GLOBAL SETTINGS
   ========================================================= */

const MusaTik = {

    apiUrl: "/api/download",

    rgb: {
        enabled: true,
        hue: 330,
        glow: 75
    },

    state: {
        downloading: false,
        menuOpen: false
    }

};


/* =========================================================
   DOM HELPER
   ========================================================= */

function $(selector) {
    return document.querySelector(selector);
}

function $all(selector) {
    return document.querySelectorAll(selector);
}


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initNavigation();

    initRGB();

    initDownload();

    initPasteButton();

    initFAQ();

    initScrollEffects();

    initKeyboard();

    initStats();

    console.log(
        "%c MusaTik Cute RGB V1 ",
        "background:#ff2d78;color:white;font-weight:900;padding:8px;border-radius:8px"
    );

    console.log(
        "%c Developed with ❤️ by Musa ",
        "color:#00f2ea;font-weight:bold"
    );

});


/* =========================================================
   NAVIGATION
   ========================================================= */

function initNavigation() {

    const menuButton =
        $(".menu-button");

    const mobileMenu =
        $(".mobile-menu");

    if (!menuButton || !mobileMenu) {
        return;
    }

    menuButton.addEventListener("click", () => {

        MusaTik.state.menuOpen =
            !MusaTik.state.menuOpen;

        mobileMenu.classList.toggle(
            "show",
            MusaTik.state.menuOpen
        );

        menuButton.classList.toggle(
            "active",
            MusaTik.state.menuOpen
        );

    });


    const mobileLinks =
        mobileMenu.querySelectorAll("a");

    mobileLinks.forEach(link => {

        link.addEventListener("click", () => {

            MusaTik.state.menuOpen =
                false;

            mobileMenu.classList.remove("show");

            menuButton.classList.remove("active");

        });

    });


    document.addEventListener("click", event => {

        if (
            MusaTik.state.menuOpen &&
            !mobileMenu.contains(event.target) &&
            !menuButton.contains(event.target)
        ) {

            MusaTik.state.menuOpen =
                false;

            mobileMenu.classList.remove("show");

        }

    });

}


/* =========================================================
   RGB SYSTEM
   ========================================================= */

function initRGB() {

    const hueRange =
        $("#hueRange");

    const glowRange =
        $("#glowRange");

    const hueOutput =
        $("#hueValue");

    const glowOutput =
        $("#glowValue");

    const rgbToggle =
        $(".rgb-toggle");

    const presets =
        $all(".color-preset");


    if (hueRange) {

        hueRange.value =
            MusaTik.rgb.hue;

        hueRange.addEventListener(
            "input",
            event => {

                const value =
                    Number(event.target.value);

                MusaTik.rgb.hue =
                    value;

                updateRGB();

            }
        );

    }


    if (glowRange) {

        glowRange.value =
            MusaTik.rgb.glow;

        glowRange.addEventListener(
            "input",
            event => {

                const value =
                    Number(event.target.value);

                MusaTik.rgb.glow =
                    value;

                updateRGB();

            }
        );

    }


    if (rgbToggle) {

        rgbToggle.classList.toggle(
            "active",
            MusaTik.rgb.enabled
        );

        rgbToggle.textContent =
            MusaTik.rgb.enabled
                ? "ON"
                : "OFF";


        rgbToggle.addEventListener(
            "click",
            () => {

                MusaTik.rgb.enabled =
                    !MusaTik.rgb.enabled;

                rgbToggle.classList.toggle(
                    "active",
                    MusaTik.rgb.enabled
                );

                rgbToggle.textContent =
                    MusaTik.rgb.enabled
                        ? "ON"
                        : "OFF";

                updateRGB();

            }
        );

    }


    presets.forEach(preset => {

        preset.addEventListener(
            "click",
            () => {

                const hue =
                    Number(
                        preset.dataset.hue
                    );

                if (
                    Number.isFinite(hue)
                ) {

                    MusaTik.rgb.hue =
                        hue;

                    if (hueRange) {

                        hueRange.value =
                            hue;

                    }

                    updateRGB();

                }

            }
        );

    });


    updateRGB();

}


/* =========================================================
   UPDATE RGB
   ========================================================= */

function updateRGB() {

    const root =
        document.documentElement;

    const hue =
        MusaTik.rgb.hue;

    const glow =
        MusaTik.rgb.glow;

    root.style.setProperty(
        "--hue",
        hue
    );

    root.style.setProperty(
        "--glow-power",
        MusaTik.rgb.enabled
            ? glow / 100
            : 0
    );


    const hueOutput =
        $("#hueValue");

    const glowOutput =
        $("#glowValue");


    if (hueOutput) {

        hueOutput.textContent =
            `${hue}°`;

    }


    if (glowOutput) {

        glowOutput.textContent =
            `${glow}%`;

    }


    updateRGBBackground();

}


/* =========================================================
   RGB BACKGROUND
   ========================================================= */

function updateRGBBackground() {

    const root =
        document.documentElement;

    if (
        !MusaTik.rgb.enabled
    ) {

        root.style.setProperty(
            "--rgb",
            "#666"
        );

        return;

    }


    const hue =
        MusaTik.rgb.hue;


    const rgbColor =
        `hsl(${hue}, 100%, 65%)`;


    root.style.setProperty(
        "--rgb",
        rgbColor
    );

}


/* =========================================================
   DOWNLOAD SYSTEM
   ========================================================= */

function initDownload() {

    const downloadButton =
        $(".download-button");

    const input =
        $("#tiktokUrl");

    if (
        !downloadButton ||
        !input
    ) {

        return;

    }


    downloadButton.addEventListener(
        "click",
        async () => {

            if (
                MusaTik.state.downloading
            ) {

                return;

            }


            const url =
                input.value.trim();


            if (!url) {

                showMessage(
                    "⚠️ আগে TikTok ভিডিওর লিংক দিন।",
                    "error"
                );

                input.focus();

                return;

            }


            if (
                !isTikTokUrl(url)
            ) {

                showMessage(
                    "❌ এটি সঠিক TikTok লিংক মনে হচ্ছে না।",
                    "error"
                );

                input.focus();

                return;

            }


            await downloadVideo(
                url,
                downloadButton
            );

        }
    );


    input.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                downloadButton.click();

            }

        }
    );

}


/* =========================================================
   TIKTOK URL VALIDATOR
   ========================================================= */

function isTikTokUrl(url) {

    try {

        const parsed =
            new URL(url);


        const host =
            parsed.hostname
                .toLowerCase()
                .replace(
                    /^www\./,
                    ""
                );


        const allowedHosts = [

            "tiktok.com",
            "m.tiktok.com",
            "vm.tiktok.com",
            "vt.tiktok.com"

        ];


        return allowedHosts.some(
            allowed => {

                return (
                    host === allowed ||
                    host.endsWith(
                        "." + allowed
                    )
                );

            }
        );

    } catch {

        return false;

    }

}


/* =========================================================
   DOWNLOAD REQUEST
   ========================================================= */

async function downloadVideo(
    url,
    button
) {

    MusaTik.state.downloading =
        true;


    const originalHTML =
        button.innerHTML;


    button.disabled =
        true;


    button.innerHTML = `
        <span class="loader"></span>
        Processing...
    `;


    showMessage(
        "⏳ ভিডিও তথ্য সংগ্রহ করা হচ্ছে...",
        "loading"
    );


    try {

        /*
         * IMPORTANT:
         *
         * এই frontend নিজের থেকে TikTok
         * ভিডিও ডাউনলোড করে না।
         *
         * Backend-এর /api/download endpoint
         * এখানে request গ্রহণ করবে।
         */


        const response =
            await fetch(
                MusaTik.apiUrl,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({
                            url: url
                        })

                }
            );


        let data = null;


        try {

            data =
                await response.json();

        } catch {

            data = null;

        }


        if (
            !response.ok
        ) {

            throw new Error(
                data?.message ||
                `Server error: ${response.status}`
            );

        }


        if (
            data &&
            data.downloadUrl
        ) {

            showMessage(
                "✅ ভিডিও প্রস্তুত! Download বাটনে চাপুন।",
                "success"
            );


            createDownloadLink(
                data.downloadUrl,
                data.filename ||
                "MusaTik-Video.mp4"
            );


        } else if (
            data &&
            data.url
        ) {

            showMessage(
                "✅ ভিডিও প্রস্তুত!",
                "success"
            );


            createDownloadLink(
                data.url,
                data.filename ||
                "MusaTik-Video.mp4"
            );


        } else {

            showMessage(
                "⚠️ Server থেকে download link পাওয়া যায়নি।",
                "warning"
            );

        }


    } catch (error) {

        console.error(
            "Download error:",
            error
        );


        showMessage(
            `❌ ${error.message || "কিছু একটা সমস্যা হয়েছে।"}`,
            "error"
        );

    } finally {

        MusaTik.state.downloading =
            false;

        button.disabled =
            false;

        button.innerHTML =
            originalHTML;

    }

}


/* =========================================================
   CREATE DOWNLOAD LINK
   ========================================================= */

function createDownloadLink(
    url,
    filename
) {

    const oldArea =
        $("#resultArea");

    if (oldArea) {

        oldArea.remove();

    }


    const area =
        document.createElement("div");


    area.id =
        "resultArea";


    area.className =
        "message-box";


    area.style.marginTop =
        "12px";


    area.innerHTML = `

        <div
            style="
                display:flex;
                align-items:center;
                justify-content:space-between;
                gap:12px;
                flex-wrap:wrap;
            "
        >

            <div>

                <strong
                    style="
                        color:#fff;
                        display:block;
                        margin-bottom:4px;
                    "
                >
                    🎉 Download Ready
                </strong>

                <span
                    style="
                        color:#777;
                        font-size:10px;
                    "
                >
                    আপনার ভিডিও প্রস্তুত হয়েছে।
                </span>

            </div>

            <a
                href="${escapeHTML(url)}"
                download="${escapeHTML(filename)}"
                target="_blank"
                rel="noopener noreferrer"
                style="
                    display:inline-flex;
                    align-items:center;
                    gap:7px;
                    padding:11px 15px;
                    border-radius:11px;
                    background:var(--rgb);
                    color:#fff;
                    font-size:11px;
                    font-weight:900;
                    text-decoration:none;
                    box-shadow:0 0 20px var(--rgb);
                "
            >
                ⬇️ Download
            </a>

        </div>

    `;


    const downloadCard =
        $(".download-card");


    if (downloadCard) {

        downloadCard.appendChild(
            area
        );

    }

}


/* =========================================================
   PASTE BUTTON
   ========================================================= */

function initPasteButton() {

    const pasteButton =
        $(".paste-button");

    const input =
        $("#tiktokUrl");


    if (
        !pasteButton ||
        !input
    ) {

        return;

    }


    pasteButton.addEventListener(
        "click",
        async () => {

            try {

                if (
                    !navigator.clipboard
                ) {

                    throw new Error(
                        "Clipboard API unavailable"
                    );

                }


                const text =
                    await navigator.clipboard.readText();


                if (!text) {

                    showMessage(
                        "📋 Clipboard খালি।",
                        "warning"
                    );

                    return;

                }


                input.value =
                    text.trim();


                input.focus();


                pasteButton.textContent =
                    "✓ Pasted";


                setTimeout(
                    () => {

                        pasteButton.textContent =
                            "Paste";

                    },
                    1500
                );


            } catch {

                showMessage(
                    "📋 Clipboard থেকে paste করা যায়নি। নিজে link লিখুন।",
                    "warning"
                );

            }

        }
    );

}


/* =========================================================
   MESSAGE SYSTEM
   ========================================================= */

function showMessage(
    message,
    type = "info"
) {

    const existing =
        $(".message-box");


    let box =
        existing;


    if (!box) {

        box =
            document.createElement(
                "div"
            );

        box.className =
            "message-box";


        const card =
            $(".download-card");


        if (card) {

            card.appendChild(
                box
            );

        }

    }


    if (!box) {

        return;

    }


    box.classList.remove(
        "message-success",
        "message-error",
        "message-warning",
        "message-loading"
    );


    box.classList.add(
        `message-${type}`
    );


    box.textContent =
        message;


    box.style.display =
        "block";


    box.style.borderColor =
        getMessageColor(type);


    box.style.boxShadow =
        `0 0 20px ${getMessageColor(type)}22`;

}


/* =========================================================
   MESSAGE COLOR
   ========================================================= */

function getMessageColor(
    type
) {

    switch (type) {

        case "success":
            return "#39ff88";

        case "error":
            return "#ff3b30";

        case "warning":
            return "#ffd166";

        case "loading":
            return "#00f2ea";

        default:
            return "#888";

    }

}


/* =========================================================
   FAQ
   ========================================================= */

function initFAQ() {

    const faqs =
        $all(".faq");


    faqs.forEach(
        faq => {

            faq.addEventListener(
                "toggle",
                () => {

                    if (
                        !faq.open
                    ) {

                        return;

                    }


                    faqs.forEach(
                        other => {

                            if (
                                other !== faq &&
                                other.open
                            ) {

                                other.open =
                                    false;

                            }

                        }
                    );

                }
            );

        }
    );

}


/* =========================================================
   SCROLL EFFECTS
   ========================================================= */

function initScrollEffects() {

    const elements =
        $all(
            ".feature-card, .stat-card, .step, .about-card, .final-card"
        );


    if (
        !("IntersectionObserver" in window)
    ) {

        return;

    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.12
            }
        );


    elements.forEach(
        element => {

            element.style.opacity =
                "0";

            element.style.transform =
                "translateY(20px)";


            element.style.transition =
                "opacity .6s ease, transform .6s ease";


            observer.observe(
                element
            );

        }
    );


    const style =
        document.createElement(
            "style"
        );


    style.textContent = `

        .feature-card.visible,
        .stat-card.visible,
        .step.visible,
        .about-card.visible,
        .final-card.visible {

            opacity:1 !important;

            transform:
                translateY(0)
                !important;

        }

    `;


    document.head.appendChild(
        style
    );

}


/* =======================
