export type BookItemResponse = {
  id: number;
  status: "AVAILABLE" | "BORROWED";
  book: any;
};

export type BookItemCreate = {
  book_id: number;
};
export type BookItemUpdate = {
  status: "AVAILABLE" | "BORROWED";
};
