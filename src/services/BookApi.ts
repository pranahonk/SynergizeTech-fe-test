import axios from "axios";
import { useQuery } from 'react-query';


const API_KEY = process.env.BOOK_KEY;

export function BookApi() {
  let isLoading: boolean = false;
  const getBooks = async (terms: string, page: number) => {
    try {
      isLoading = true;
      const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${terms}:keyes&key=${API_KEY}&maxResults=12&startIndex=${page}`);

      return response.data;
    } catch (error) {
      return Promise.reject({error: 'Erro ao buscar livro'})
    }
    finally {
      isLoading = false;
    }
  }

  return {
    getBooks,
    isLoading
  }
}
