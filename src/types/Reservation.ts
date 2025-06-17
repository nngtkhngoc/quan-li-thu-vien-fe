export type CreateReservationRequest = {
  user_id: number;
  book_item_id: number;
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
  bookItem: BookItem;
  reservationDate: string;
  returned: boolean;
}

export type UpdateReservationRequest = {
  returned: boolean;
};
