import arcjet, { shield, detectBot, tokenBucket, slidingWindow } from "@arcjet/node";


const aj = arcjet({
    key: process.env.ARCJET_KEY,
    rules: [
        shield({ mode: "LIVE" }),
        detectBot({
            mode: "LIVE",
            allow: [
                "CATEGORY:SEARCH_ENGINE",
                "CATEGORY:PREVIEW",
            ],
        }),
        slidingWindow({
            interval: '2s',
            max: 5,
            mode: "LIVE",
        })
    ],
});

export default aj;