export type CreateBorrowedBookRequest = {
  user_id: number;
  book_item_id: number;
};

export type UpdateBorrowedBookRequest = {
  return_date: string | null;
  status: string;
};

export type BorrowBookResponse = {
  id: number;
  book_item: any;
  user: any;
  borrow_date: Date;
  return_date: Date;
  due_date: Date;
  status: string;
};
