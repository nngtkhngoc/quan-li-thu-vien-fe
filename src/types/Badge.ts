import type { UserResponse } from "./User";

export type BadgeDetails = {
  id: string;
  name: string;
  description: string;
  category: string;
  xpAwarded: number;
  icon_url: string;
  xpRequired: number;
  reviewsRequired: number;
  borrowedBooksRequired: number;
};

export type Badge = {
  badge: BadgeDetails;
  users: UserResponse[];
};

export type BadgeResponse = {
  success: boolean;
  message: string;
  data: Badge[];
};

export type CreateOrUpdateBadgeRequest = {
  name: string;
  description: string;
  category: string;
  xpAwarded: number;
  icon_url: string;
  xpRequired: number;
  reviewsRequired: number;
  borrowedBooksRequired: number;
};
