import { createSlice ,createAsyncThunk, PayloadAction, current} from '@reduxjs/toolkit';
import { BookApi} from '../services/BookApi';
import { Book } from '../types/book';
import { RootState } from './store';
import { useQuery } from "react-query";


const {getBooks} = BookApi();

interface BooksProps {
  books: Book[];
  totalPages: number;
  terms: string;
  totalItemsPerPage: number;
}

interface getBooksWithTermsProps {
  terms: string;
  page: number;
}

const initialState:BooksProps = {
  books: [],
  totalItemsPerPage: 12,
  totalPages: 0,
  terms: "",
}

interface payloadDates{
  type: string;
  payload: {
    newStartDate: string;
    newEndDate: string;
  }
}

export const getBooksWithTerms = createAsyncThunk<any, getBooksWithTermsProps>('books/getBooksWithTerms', async ({ terms, page }, thunkAPI) => {
  try {
    const response = await getBooks(terms, page);

    return response;
  } catch (error) {
    // Handle errors here if needed;
    throw error;
  }
});

export const BooksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setTerms: (state, action: PayloadAction<string>) => {
      state.terms = action.payload;
    },

    cleanStates: (state) => {
      state.books = [];
      state.totalPages = 0;
    },
    filterBooks: (state, action : PayloadAction<string>): void => {
      // Use 'produce' to access the draft state
      const draftBooks = [... current(state.books)];

      if (draftBooks?.length > 0) {
        switch (action.payload) {
          case "year":
            const sortedBooksByYear = draftBooks.sort((a, b) => {
              const dateA = new Date(a.publishDate);
              const dateB = new Date(b.publishDate);
              return dateA.getTime() - dateB.getTime();
            });
            state.books = sortedBooksByYear;
            break;

          case "title":
            const sortedBooksByTitle =draftBooks.sort((a, b) => {
              const titleA = a.title.toLowerCase();
              const titleB = b.title.toLowerCase();

              if (titleA < titleB) {
                return -1;
              }
              if (titleA > titleB) {
                return 1;
              }
              return 0;
            });

            state.books = sortedBooksByTitle;
            break;
          default:
            return;
        }
      }
    },
    filterYear : (state, action : payloadDates): void => {
      const startDate = new Date(action.payload?.newStartDate);
      const endDate = new Date(action.payload?.newEndDate);

      const newStartYear = startDate.getFullYear();
      const newEndYear = endDate.getFullYear();

      if(newStartYear &&(newEndYear > newStartYear)){
        const draftBooks = [... current(state.books)];

        const filteredYearBooks = draftBooks.filter((book) => {
          if (book.publishDate) {
            const bookYear = new Date(book.publishDate).getFullYear();
            return bookYear >= newStartYear && bookYear <= newEndYear;
          }
          return false; // Skip books without a publishDate
        });

        state.books = filteredYearBooks;
      }
    }
  },
  extraReducers: (builder: any) => {
    console.log(builder);
    builder.addCase(getBooksWithTerms.fulfilled, (state: any, action: any) => {

      console.log(action);

      if(action.payload.totalItems  === 0) {
        state.books = [];
        return;
      }

      const formatBooks = action.payload.items.map((book: any) => {
        return {
          id: book.id,
          img: book.volumeInfo?.imageLinks?.thumbnail,
          title: book.volumeInfo?.title,
          authors: String(book.volumeInfo?.authors).replaceAll(","," "),
          publisher: book.volumeInfo?.publisher,
          description: book.volumeInfo?.description,
          pageCount: book.volumeInfo?.pageCount,
          publishDate: book.volumeInfo?.publishedDate,
        }
      });

      console.log(formatBooks);

      state.books = formatBooks;
      state.totalPages = Math.ceil(action.payload.totalItems / state.totalItemsPerPage);
    })
  }
})

export const {setTerms,cleanStates, filterBooks, filterYear } = BooksSlice.actions;
export const SelectBooks = (state: RootState) => state.books;

export default BooksSlice.reducer;
