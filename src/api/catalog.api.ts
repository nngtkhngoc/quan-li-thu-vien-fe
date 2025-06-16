import { axiosClient } from "../lib/axios";
import type {
  CatalogResponse,
  CreateCatalogRequest,
  UpdateCatalogRequest,
} from "../types/Catalog";

// Get all catalogs
export const getAllCatalogs = async (): Promise<CatalogResponse[]> => {
  const response = await axiosClient.get("/api/catalogs");
  return response.data;
};

// Create new catalog
export const createCatalog = async (
  data: CreateCatalogRequest
): Promise<CatalogResponse> => {
  const response = await axiosClient.post("/api/catalogs", data);
  return response.data;
};

// Update catalog
export const updateCatalog = async (
  id: number,
  data: UpdateCatalogRequest
): Promise<CatalogResponse> => {
  const response = await axiosClient.put(`/api/catalogs/${id}`, data);
  return response.data;
};

// Delete catalog
export const deleteCatalog = async (id: number): Promise<CatalogResponse> => {
  const response = await axiosClient.delete(`/api/catalogs/${id}`);
  return response.data;
};
