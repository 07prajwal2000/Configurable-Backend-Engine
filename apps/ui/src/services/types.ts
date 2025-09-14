// Shared types for API services

export type Route = {
  id: string;
  name?: string;
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  createdAt: string;
};

export type CreateRouteRequest = {
  name?: string;
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
};

export type Block = {
  id: string;
  type: string;
  position?: any;
  data?: any;
  createdAt: string;
  updatedAt?: string;
  routeId?: string;
};

export type CreateBlockRequest = {
  type: string;
  position?: any;
  data?: any;
  routeId?: string;
};

export type UpdateBlockRequest = {
  type?: string;
  position?: any;
  data?: any;
  updatedAt?: string;
};

export type Edge = {
  id: string;
  from: string;
  to: string;
  fromHandle?: string;
  toHandle?: string;
};

export type EdgeWithBlocks = Edge & {
  fromBlock?: any;
  toBlock?: any;
};

export type CreateEdgeRequest = {
  from: string;
  to: string;
  fromHandle?: string;
  toHandle?: string;
};

export type UpdateEdgeRequest = {
  from?: string;
  to?: string;
  fromHandle?: string;
  toHandle?: string;
};

export type ErrorResponse = {
  error: string;
};

export type SuccessMessage = {
  message: string;
};
