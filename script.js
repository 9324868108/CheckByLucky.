import apiService from './services/api.js';

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("trainForm");
    const trainNumberInput = document.getElementById("trainNumber");
    const resultDiv = document.getElementById("result");
    const errorDiv = document.getElementById("error");
    const loadingDiv = document.getElementById("loading");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const trainNumber = trainNumberInput.value.trim();

        if (!/^\d{5}$/.test(trainNumber)) {
            showError("Please enter a valid 5-digit train number");
            trainNumberInput.classList.add("shake");
            setTimeout(() => trainNumberInput.classList.remove("shake"), 500);
            return;
        }

        try {
            await fetchTrainStatus(trainNumber);
        } catch (error) {
            showError(error.message);
        }
    });

    async function fetchTrainStatus(trainNumber) {
        showLoading();

        try {
            const data = await apiService.getTrainStatus(trainNumber);
            
            if (data.status === "success") {
                showResult(data);
            } else {
                throw new Error(data.message || "Train not found or invalid");
            }
        } catch (error) {
            throw error;
        } finally {
            hideLoading();
        }
    }

    function showResult(data) {
        hideError();
        document.getElementById("trainDetails").textContent = `Train: ${data.train_name} (${data.train_number})`;
        document.getElementById("trainLocation").textContent = `Current Location: ${data.current_location}`;
        
        resultDiv.classList.remove("hidden");
        resultDiv.classList.add("fade-in");
    }

    function showError(message) {
        hideResult();
        errorDiv.textContent = message;
        errorDiv.classList.remove("hidden");
        errorDiv.classList.add("fade-in");
    }

    function hideError() {
        errorDiv.classList.add("hidden");
        errorDiv.classList.remove("fade-in");
    }

    function showLoading() {
        loadingDiv.classList.remove("hidden");
        loadingDiv.classList.add("fade-in");
    }

    function hideLoading() {
        loadingDiv.classList.add("hidden");
        loadingDiv.classList.remove("fade-in");
    }

    function hideResult() {
        resultDiv.classList.add("hidden");
        resultDiv.classList.remove("fade-in");
    }
});
