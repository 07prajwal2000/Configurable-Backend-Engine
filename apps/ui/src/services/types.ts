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
  id?: string;
  type: string;
  position?: any;
  data?: any;
  routeId?: string;
};

export type UpdateBlockRequest = {
  type?: string;
  position?: any;
  data?: any;
  routeId?: string;
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

export type PaginationInfo = {
  currentPage: number;
  totalRecords: number;
  hasNextPage: boolean;
};

export type PaginatedBlocksResponse = {
  data: Block[];
  pagination: PaginationInfo;
};

// Bulk operation types
export type BulkBlockOperation = {
  action: "create" | "update" | "delete";
  content: any; // Block data
};

export type BulkEdgeOperation = {
  action: "create" | "update" | "delete";
  content: any; // Edge data
};

export type BulkOperationRequest = {
  blocks: BulkBlockOperation[];
  edges: BulkEdgeOperation[];
};

export type BulkOperationResponse = {
  success: boolean;
  message: string;
};

// App Config types
export type AppConfig = {
  id: number;
  keyName: string;
  description?: string;
  isEncrypted: boolean;
  encoding_type: "plaintext" | "base64" | "hex";
  createdAt?: string;
  updatedAt?: string;
  value?: string;
};

export type AppConfigWithoutValue = Omit<AppConfig, "value">;

export type CreateAppConfigRequest = {
  keyName: string;
  description?: string;
  value: string;
  isEncrypted?: boolean;
  encoding_type?: "plaintext" | "base64" | "hex";
};

export type UpdateAppConfigRequest = {
  keyName?: string;
  description?: string;
  value?: string;
  isEncrypted?: boolean;
  encoding_type?: "plaintext" | "base64" | "hex";
};

export type PaginatedAppConfigsResponse = {
  data: AppConfigWithoutValue[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};
