document.addEventListener("DOMContentLoaded", function () {
    const createUrlButton = document.getElementById("createUrlButton");
    createUrlButton.addEventListener("click", handleCreateUrl);
});

async function handleCreateUrl() {
    // UI Elements
    const createUrlButton = document.getElementById("createUrlButton");
    const loadingContainer = document.getElementById("loadingMessage");
    const errorMessage = document.getElementById("errorMessage");
    const videoUrlContainer = document.getElementById("videoUrlContainer");
    const videoUrlLink = document.getElementById("videoUrlLink");

    // Reset UI state
    errorMessage.style.display = "none";
    errorMessage.textContent = "";
    videoUrlContainer.style.display = "none";

    // Show loading state
    loadingContainer.style.display = "flex";
    createUrlButton.disabled = true;

    const usersCredentials = {
        username: "NETWIN_FINTECH",
        password: "Netwin@123",
    };

    const requestBody = {
        task: "url",
        essentials: {
            matchImage: [
                "https://i.ibb.co/FjfwxGh/WIN-20250109-18-11-55-Pro.jpg",
            ],
            idCardVerification: "false",
            redirectUrl: "",
            customVideoRecordTime: "5",
            callbackUrl: "https://webhook.site/3fca27d8-d2fa-468a-a4d5-08a36abc3e66",
            enableLocationCapture: "true",
            customizations: {},
        },
    };

    try {
        // First API call - Login
        const loginResponse = await axios.post(
            "https://192.168.43.208/api/v2/patrons/login",
            usersCredentials,
        );
        console.log("loginResponse :- ", loginResponse);

        const { id, userId } = loginResponse.data;
        console.log(id, userId);

        // Second API call - Get URL
        const urlResponse = await axios.post(
            `https://192.168.43.208/api/v2/patrons/${userId}/getUrl`,
            requestBody,
            { headers: { Authorization: id } },
        );
        console.log("urlResponse :- ", urlResponse);

        const { videoUrl } = urlResponse.data.result;

        // Update UI with the generated URL
        videoUrlLink.href = videoUrl;
        videoUrlLink.textContent = videoUrl;
        videoUrlContainer.style.display = "block";
    } catch (err) {
        console.error(err);

        if (err.response) {
            errorMessage.textContent = `Error: ${err.response.data.message || "Something went wrong"
                }`;
        } else {
            errorMessage.textContent = "Network error or server not reachable.";
        }
        errorMessage.style.display = "block";
    } finally {
        // Hide loading state
        loadingContainer.style.display = "none";
        createUrlButton.disabled = false;
    }
}
