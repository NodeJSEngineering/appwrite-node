const sdk = require("node-appwrite");

const client = new sdk.Client();

client
    .setEndpoint("https://cloud.appwrite.io/v1") // Ensure this is the correct endpoint
    .setProject("") // Replace with your Project ID
    .setKey(""); // Replace with your API Key

export default client;