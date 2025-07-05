export const genreList = [
  'FICTION',
  'NON_FICTION',
  'SCIENCE',
  'HISTORY',
  'BIOGRAPHY',
  'FANTASY',
] as const;

type Genre = (typeof genreList)[number];



export interface IBook {
  title: string;
  author: string;
  genre: Genre;
  isbn: string;
  description?: string;
  copies: number;
  available?: boolean;
}

// const book = {
//     "title": "string",
//   "author": "string",
//   "genre": "FICTION",
//   "isbn": "string",
//   "description": "this is it",
//   "available": true,
//   "copies": 10
// }