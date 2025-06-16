export type CreateReservationRequest = {
  user_id: number;
  book_item_id: number;
};

export type ReservationResponse = {
  reservation_id: number;
  user: any;
  book_item: any;
  reservation_date: Date;
  returned: boolean;
};

export type UpdateReservationRequest = {
  returned: boolean;
};
