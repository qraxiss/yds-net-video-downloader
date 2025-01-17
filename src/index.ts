import download from "./download";
import fetchStreamUrl from "./fetch-stream-url";
import readline from "readline";

async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.question("Enter Bearer token: ", async (token) => {
        if (!token) {
            console.error("Bearer token is required.");
            rl.close();
            return;
        }

        rl.question("Enter lesson URL: ", async (url) => {
            if (!url) {
                console.error("Lesson URL is required.");
                rl.close();
                return;
            }

            try {
                // Extract lesson ID from the URL
                const match = url.match(/\/([0-9]+)$/);
                if (!match) {
                    throw new Error("Invalid lesson URL format.");
                }
                const lessonId = parseInt(match[1], 10);

                const authorizationHeader = {
                    authorization: `Bearer ${token}`,
                };

                // Fetch stream URL
                const streamUrl = await fetchStreamUrl(lessonId, authorizationHeader);
                console.log("Stream URL:", streamUrl);

                // Download the stream
                await download(streamUrl);
                console.log("Download completed successfully.");
            } catch (error: any) {
                console.error("Failed to process the lesson:", error.message);
            } finally {
                rl.close();
            }
        });
    });
}

main();