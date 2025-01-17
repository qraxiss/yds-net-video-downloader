import axios from 'axios';

interface AuthHeaders {
    authorization: string;
}

interface VideoDetails {
    provider_id: number;
    account_id: number;
    video_id: string;
}

const fetchStreamUrl = async (lessonId: number, headers: AuthHeaders): Promise<string> => {
    try {
        const commonHeaders = {
            accept: "application/json, text/plain, */*",
            "accept-language": "en,tr-TR;q=0.9,tr;q=0.8,en-US;q=0.7",
            "sec-ch-ua": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"macOS"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            Referer: "https://client.yds.net/",
            "Referrer-Policy": "strict-origin-when-cross-origin",
        };

        // Step 1: Fetch lecture details
        const lectureResponse = await axios.get(`https://yds.net/api/v1/lesson/lecture/${lessonId}`, {
            headers: {
                ...commonHeaders,
                ...headers,
            },
        });

        const videoId = lectureResponse.data?.data?.streams?.[0]?.stream_data?.video_id;

        if (!videoId) {
            throw new Error("Video ID not found in lecture details.");
        }

        // Step 2: Fetch video public URL
        const videoDetails: VideoDetails = {
            provider_id: 1,
            account_id: 1,
            video_id: videoId,
        };

        const videoResponse = await axios.post(
            "https://yds.net/api/v1/stream/provider/get-video-detail",
            videoDetails,
            {
                headers: {
                    ...commonHeaders,
                    ...headers,
                    "content-type": "application/json",
                },
            }
        );

        const publicUrl = videoResponse.data?.data?.public_url?.replace(/\\/g, "");

        if (!publicUrl) {
            throw new Error("Public URL not found in video details.");
        }

        // Step 3: Fetch the final stream URL
        const streamResponse = await axios.get(publicUrl, {
            headers: {
                ...commonHeaders,
                ...headers,
                "sec-fetch-site": "cross-site",
            },
        });

        const streamUrl = streamResponse.data?.data?.stream?.url?.replace(/\\/g, "");

        if (!streamUrl) {
            throw new Error("Stream URL not found.");
        }

        return streamUrl;
    } catch (error) {
        console.error("Error fetching stream URL:", error);
        throw error;
    }
};

export default fetchStreamUrl;