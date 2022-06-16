"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitFeedback = void 0;
const submitFeedback = async (updatedFeedback) => {
    const URL = "https://tpzmoaw42e.execute-api.eu-west-1.amazonaws.com/prod/contact";
    try {
        await fetch(URL, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedFeedback),
        });
        return { status: "success", message: "Thank you so much for your feedback! We will improve." };
    }
    catch (err) {
        return {
            status: "error",
            message: "Aww... So sorry something went wrong. Please try emailing. We'd love to hear from you!",
        };
    }
};
exports.submitFeedback = submitFeedback;
