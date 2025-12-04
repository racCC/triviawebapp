import dotenv from 'dotenv';
dotenv.config();

export const TRIVIA_API = {
  BASE_URL: process.env.TRIVIA_API_URL,
  CATEGORIES_URL: process.env.CATEGORIES_API_URL 
};