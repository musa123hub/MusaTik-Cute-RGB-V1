/* =========================================================
   MUSA TIK — CUTE RGB V1
   NODE.JS BACKEND
   server.js
   ========================================================= */

"use strict";


/* =========================================================
   IMPORTS
   ========================================================= */

const express = require("express");
const path = require("path");


/* =========================================================
   APP CONFIG
   ========================================================= */

const app = express();

const PORT =
    process.env.PORT || 3000;


/* =========================================================
   MIDDLEWARE
   ========================================================= */

app.use(
    express.json({
        limit: "1mb"
    })
);


app.use(
    express.urlencoded({
        extended: true,
        limit: "1mb"
    })
);


/* =========================================================
   SECURITY HEADERS
   ========================================================= */

app.disable("x-powered-by");


app.use(
    (req, res, next) => {

        res.setHeader(
            "X-Content-Type-Options",
            "nosniff"
        );

        res.setHeader(
            "X-Frame-Options",
            "SAMEORIGIN"
        );

        res.setHeader(
            "Referrer-Policy",
            "strict-origin-when-cross-origin"
        );

        next();

    }
);


/* =========================================================
   STATIC WEBSITE
   ========================================================= */

app.use(
    express.static(
        path.join(
            __dirname,
            "public"
        )
    )
);


/* =========================================================
   HOME PAGE
   ========================================================= */

app.get(
    "/",
    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "public",
                "index.html"
            )
        );

    }
);


/* =========================================================
   HEALTH CHECK
   ========================================================= */

app.get(
    "/api/health",
    (req, res) => {

        res.json({

            success: true,

            service:
                "MusaTik Cute RGB V1",

            status:
                "online",

            time:
                new Date().toISOString()

        });

    }
);


/* =========================================================
   TIKTOK URL VALIDATOR
   ========================================================= */

function isTikTokUrl(value) {

    if (
        typeof value !== "string"
    ) {

        return false;

    }


    const input =
        value.trim();


    if (!input) {

        return false;

    }


    try {

        const url =
            new URL(input);


        const hostname =
            url.hostname
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
            host => {

                return (
                    hostname === host ||
                    hostname.endsWith(
                        "." + host
                    )
                );

            }
        );

    } catch {

        return false;

    }

}


/* =========================================================
   CLEAN URL
   ========================================================= */

function cleanTikTokUrl(value) {

    const url =
        new URL(
            value.trim()
        );


    return url.toString();

}


/* =========================================================
   DOWNLOAD API
   ========================================================= */

app.post(
    "/api/download",
    async (req, res) => {

        try {

            const {
                url
            } = req.body || {};


            /* -----------------------------------------
               CHECK INPUT
               ----------------------------------------- */

            if (
                !url
            ) {

                return res.status(
                    400
                ).json({

                    success: false,

                    message:
                        "TikTok URL is required."

                });

            }


            /* -----------------------------------------
               VALIDATE URL
               ----------------------------------------- */

            if (
                !isTikTokUrl(url)
            ) {

                return res.status(
                    400
                ).json({

                    success: false,

                    message:
                        "Invalid TikTok URL."

                });

            }


            const cleanUrl =
                cleanTikTokUrl(url);


            /* -----------------------------------------
               IMPORTANT
               -----------------------------------------

               এখানে কোনো unauthorized scraping,
               private-video bypass অথবা TikTok
               restriction bypass করা হচ্ছে না।

               বৈধ third-party downloader API ব্যবহার
               করতে হলে তার endpoint/API key এখানে
               server-side থেকে যুক্ত করতে হবে।
            ----------------------------------------- */


            return res.status(
                501
            ).json({

                success: false,

                message:
                    "Downloader provider is not configured yet.",

                url:
                    cleanUrl,

                note:
                    "Connect an authorized downloader/API provider on the server side."

            });


        } catch (error) {

            console.error(
                "Download API error:",
                error
            );


            return res.status(
                500
            ).json({

                success: false,

                message:
                    "Internal server error."

            });

        }

    }
);


/* =========================================================
   404 API
   ========================================================= */

app.use(
    "/api",
    (req, res) => {

        res.status(
            404
        ).json({

            success: false,

            message:
                "API endpoint not found."

        });

    }
);


/* =========================================================
   WEBSITE 404
   ========================================================= */

app.use(
    (req, res) => {

        res.status(
            404
        ).send(`

            <!DOCTYPE html>

            <html>

            <head>

                <meta charset="UTF-8">

                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                >

                <title>
                    404 — MusaTik
                </title>

                <style>

                    * {
                        box-sizing:border-box;
                    }

                    body {

                        margin:0;

                        min-height:100vh;

                        display:flex;

                        align-items:center;

                        justify-content:center;

                        background:#05050a;

                        color:white;

                        font-family:
                            Arial,
                            sans-serif;

                        text-align:center;

                    }

                    .box {

                        padding:40px;

                        border-radius:25px;

                        border:
                            1px solid
                            rgba(
                                255,
                                255,
                                255,
                                .1
                            );

                        background:
                            rgba(
                                255,
                                255,
                                255,
                                .04
                            );

                    }

                    h1 {

                        font-size:70px;

                        margin:0;

                        color:#ff2d78;

                    }

                    p {

                        color:#888;

                    }

                    a {

                        display:inline-block;

                        margin-top:15px;

                        padding:
                            12px 20px;

                        border-radius:12px;

                        background:
                            linear-gradient(
                                90deg,
                                #ff2d78,
                                #a855f7,
                                #00f2ea
                            );

                        color:white;

                        text-decoration:none;

                        font-weight:bold;

                    }

                </style>

            </head>

            <body>

                <div class="box">

                    <h1>404</h1>

                    <p>
                        Page not found.
                    </p>

                    <a href="/">
                        🏠 Go Home
                    </a>

                </div>

            </body>

            </html>

        `);

    }
);


/* =========================================================
   ERROR HANDLER
   ========================================================= */

app.use(
    (
        error,
        req,
        res,
        next
    ) => {

        console.error(
            "Server error:",
            error
        );


        if (
            res.headersSent
        ) {

            return next(
                error
            );

        }


        res.status(
            500
        ).json({

            success: false,

            message:
                "Something went wrong."

        });

    }
);


/* =========================================================
   START SERVER
   ========================================================= */

const server =
    app.listen(
        PORT,
        () => {

            console.log("");
            console.log(
                "======================================"
            );

            console.log(
                "     MUSA TIK — CUTE RGB V1"
            );

            console.log(
                "======================================"
            );

            console.log(
                `Server running on port ${PORT}`
            );

            console.log(
                `Local: http://localhost:${PORT}`
            );

            console.log(
                "API:   /api/download"
            );

            console.log(
                "Health: /api/health"
            );

            console.log(
                "======================================"
            );

            console.log("");

        }
    );


/* =========================================================
   GRACEFUL SHUTDOWN
   ========================================================= */

function shutdown(
    signal
) {

    console.log(
        `\n${signal} received.`
    );

    console.log(
        "Closing server..."
    );


    server.close(
        () => {

            console.log(
                "Server closed."
            );

            process.exit(
                0
            );

        }
    );

}


process.on(
    "SIGTERM",
    () => {

        shutdown(
            "SIGTERM"
        );

    }
);


process.on(
    "SIGINT",
    () => {

        shutdown(
            "SIGINT"
        );

    }
);


/* =========================================================
   UNHANDLED ERRORS
   ========================================================= */

process.on(
    "unhandledRejection",
    error => {

        console.error(
            "Unhandled rejection:",
            error
        );

    }
);


process.on(
    "uncaughtException",
    error => {

        console.error(
            "Uncaught exception:",
            error
        );

    }
);


/* =========================================================
   END OF SERVER.JS
   ========================================================= */
