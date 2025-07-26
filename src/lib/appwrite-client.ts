import { Client, Account, Databases } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

export const appwriteClient = {
  get account() {
    return new Account(client);
  },
  get databases() {
    return new Databases(client);
  },
};

export default appwriteClient;
