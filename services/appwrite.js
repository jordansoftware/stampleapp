import 'react-native-url-polyfill/auto';
import { Client, Databases } from 'appwrite';
import { ENDPOINT, PROJECT_ID, DATABASE_ID, COLLECTION_ID } from '@env';

export const appwriteClient = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID);

export const appwriteDatabases = new Databases(appwriteClient);

export const ids = {
  PROJECT_ID,
  DATABASE_ID,
  COLLECTION_ID,
};


