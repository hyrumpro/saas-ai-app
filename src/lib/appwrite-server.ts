import { Client, Account, Databases } from 'node-appwrite';

let client: Client | null = null;

function getClient() {
  if (!client) {
    client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
      .setKey(process.env.APPWRITE_API_KEY!);
  }
  return client;
}

export const appwriteServer = {
  get account() {
    return new Account(getClient());
  },
  get databases() {
    return new Databases(getClient());
  },
};

export default appwriteServer;
