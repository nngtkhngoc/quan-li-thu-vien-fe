export type CreateReservationRequest = {
  user_id: number;
  book_item_id: number;
};

export type ReservationResponse = {
  reservation_id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  bookItem: {
    id: number;
    book: {
      id: number;
      title: string;
      author: string;
      description: string;
      avg_rating: number;
    };
  };
  reservationDate: Date;
  expiry_date: Date;
  returned: boolean;
};

export type UpdateReservationRequest = {
  returned: boolean;
};
