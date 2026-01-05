import type { Struct, Schema } from "@strapi/strapi";

type AccountStatus = "APPROVED" | "DENIED" | "CREATE_APPROVED";

type UserLevel = "DEFAULT" | "SMALL" | "MID_SIZE" | "VIP" | "WHOLE_SELLER";

export type UserApprovalRequestInput = {
  documentId: string;
  data: {
    account_status: AccountStatus;
    level: UserLevel;
    odoo_user_id: string;
  };
};

type BusinessType = "INSTALLER" | "RETAILER";

export type RegisterUserInput = {
  email: string;
  username: string;
  password: string;
  businessName: string;
  businessNumber: string;
  businessType: BusinessType;
  phone: string;
  street1: string;
  street2: string;
  state: string;
  city: string;
  country: string;
  zipCode: string;
};

type UserAccountDetails = {
  odooId: string;
  userPricingLevel: string;
};

export type ProductInputArgs = {
  documentId: string;
  data: {
    name: string;
    description: string;
    odoo_product_id: string;
    category: string;
    vendor: string;
    collection: string[];
    tags: string[];
    specification: any[];
    price_list: {
      price: number;
      sale_price: number;
      min_quantity: number;
      max_quantity: number;
      user_level: UserLevel;
    }[];
    inventory: { location: string; quantity: number }[];
    key_features: { feature: string }[];
    files: string[];
    images: string[];
  };
};

export type PaginationInputArgs = {
  limit: number;
  page: number;
  pageSize: number;
  start: number;
};
export type SortInputArgs = string[];

type ImportPrice = {
  price: number;
  comparePrice: number;
  min_quantity: number;
  max_quantity: number;
  user_level: string;
};

export type ImportPriceListInput = {
  handle?: string | null;
  price_lists: ImportPrice[];
};

export type ImportSpecificationInput = {
  value?: string;
  key?: string;
};

export type ImportKeyFeatureInput = {
  feature?: string;
};

export type ImportTagInput = {
  tag?: string;
};

export type ImportCollectionInput = {
  collection?: string;
};

export type ImportShippingInput = {
  weight?: number;
  height?: number;
  width?: number;
  length?: number;
};

export type ImportInventoryInput = {
  melbourne?: number;
  sydney?: number;
  brisbane?: number;
};

export type ImportProductsInput = {
  handle?: string;
  name?: string;
  description?: string;
  product_type?: string;
  vendor?: string;
  odoo_product_id?: string;
  odoo_product_name?: string;
  model?: string;
  brand?: string;
  releasedAt?: string;
  madeBy?: string;
  improvedBy?: string;
  removedBy?: string;
  maxQuantity?: number;
  maxQuantityForLargeShipment?: number;
  publishedAt?: string;
  inventory?: ImportInventoryInput;
  shipping?: ImportShippingInput;
  price_lists?: ImportPriceInput[];
  specifications?: ImportSpecificationInput[];
  key_features?: ImportKeyFeatureInput[];
  tags?: ImportTagInput[];
  collections?: ImportCollectionInput[];
};
