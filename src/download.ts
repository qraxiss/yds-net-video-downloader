import { download } from "node-hls-downloader"

export default async function (streamUrl: string) {
    await download({
        quality: "best",
        concurrency: 3,
        outputFile: "output.mp4",
        streamUrl: streamUrl,
        httpHeaders: {
            "accept": "*/*",
            "accept-language": "en,tr-TR;q=0.9,tr;q=0.8,en-US;q=0.7",
            "sec-ch-ua": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"macOS"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "Referer": "https://client.yds.net/",
            "Referrer-Policy": "strict-origin-when-cross-origin",
        }

    });
}
