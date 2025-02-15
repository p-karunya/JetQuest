import { Client } from "appwrite";

const appwrite = new Client()
      .setProject('67b0a193001cdabb42e4')
      .setEndpoint('https://cloud.appwrite.io/v1'); // Your API Endpoint

export default appwrite;