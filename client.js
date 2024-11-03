const sdk = require("node-appwrite");

const client = new sdk.Client();

client
    .setEndpoint("https://cloud.appwrite.io/v1") // Ensure this is the correct endpoint
    .setProject("6711634f0020cdd71c99") // Replace with your Project ID
    .setKey("standard_bf4e4161feb11586ed2764842d0c0b7914014c3ddbd9d86cd1505ac9117c29af43c31dbd13b06129de2beb0bfea13cbf7989924e05ebda87e48914f509eb2960f0f01fa4e5e5d561bf0df496c965ebccb356cf7d0ce007458dda3a037e01c19479bfbf7ed85cdc6315eaf5c143badc711688623648ec6461bd9a57251e1478ee"); // Replace with your API Key

export default client;