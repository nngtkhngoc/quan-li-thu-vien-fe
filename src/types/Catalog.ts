export type CreateCatalogRequest = {
  name: string;
};

export type UpdateCatalogRequest = {
  name: string;
};

export type CatalogResponse = {
  id: number;
  name: string;
  created_at?: Date;
  updated_at?: Date;
};
