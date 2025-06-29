export type CreateReservationRequest = {
  user_id: number;
  book_id: number;
};

export interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  avg_rating: number;
  image?: string;
  catalog?: {
    id: number;
    name: string;
  };
  bookItems?: {
    id: number;
  }[];
}

export interface BookItem {
  id: number;
  book: Book;
}

export interface ReservationResponse {
  reservation_id: number;
  book: Book;
  reservationDate: string;
  returned: boolean;
}

export type UpdateReservationRequest = {
  returned: boolean;
};
