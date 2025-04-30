const handleGoogleDriveError = (error, errorMessage) => {
    if (error.code === 403 && error.errors?.[0]?.reason === "userRateLimitExceeded") {
        return new Error("Google Drive quota exceeded. Please try again later.");
    }
    if (error.code === 404) {
        return new Error("File or folder not found on Google Drive.");
    }
    if (error.code === 401) {
        return new Error("Google Drive authentication failed.");
    }
    return new Error(`${errorMessage}: ${error.message}`);
};

const executeDriveRequest = async (request) => {
    const response = await request;
    return response.data;
};

const handleDriveRequest = async (request, errorMessage) => {
    try {
        return await executeDriveRequest(request);
    } catch (error) {
        throw handleGoogleDriveError(error, errorMessage);
    }
};

const retryDriveRequest = async (request, errorMessage, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            return await handleDriveRequest(request, errorMessage);
        } catch (error) {
            if (error.message.includes("quota exceeded") && i < retries - 1) {
                await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
                continue;
            }
            throw error;
        }
    }
    throw new Error(`${errorMessage}: Max retries exceeded`);
};

module.exports = { handleDriveRequest, retryDriveRequest };
