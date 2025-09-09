import {
  pgTable,
  // foreignKey,
  // unique,
  text,
  timestamp,
  integer,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
// import { sql } from "drizzle-orm";

export const accountTypeEnum = pgEnum("account_type_enum", [
  "savings",
  "checking",
  "business",
  "other",
]);
export const adjustmentType = pgEnum("adjustment_type", [
  "debit",
  "credit",
  "refund",
  "fee",
  "penalty",
  "bonus",
]);
export const discountCodeType = pgEnum("discount_code_type", [
  "percentage",
  "fixed_amount",
]);
export const discountType = pgEnum("discount_type", [
  "percentage",
  "fixed_amount",
  "free",
]);
export const documentTypeEnum = pgEnum("document_type_enum", [
  "CC",
  "CE",
  "DNI",
  "RUT",
  "RFC",
  "CPF",
  "PASSPORT",
  "OTHER",
]);
export const eventLanguage = pgEnum("event_language", [
  "en",
  "es",
  "fr",
  "pt",
  "it",
  "de",
]);
export const eventStatus = pgEnum("event_status", [
  "draft",
  "published",
  "cancelled",
  "completed",
]);
export const eventStatusType = pgEnum("event_status_type", [
  "draft",
  "active",
  "inactive",
  "sold_out",
  "cancelled",
]);
export const feePaymentType = pgEnum("fee_payment_type", [
  "absorver_fees",
  "dividir_fee",
  "pasar_fees",
]);
export const frequencyType = pgEnum("frequency_type", ["single", "recurring"]);
export const languageType = pgEnum("language_type", ["es", "en", "pt", "fr"]);
export const paymentStatus = pgEnum("payment_status", [
  "pending",
  "processing",
  "succeeded",
  "failed",
  "cancelled",
  "refunded",
]);
export const privacyType = pgEnum("privacy_type", ["public", "private"]);
export const refundStatus = pgEnum("refund_status", [
  "pending",
  "accepted",
  "rejected",
]);
export const themeModeType = pgEnum("theme_mode_type", [
  "light",
  "dark",
  "adaptive",
]);
export const ticketTriggerType = pgEnum("ticket_trigger_type", [
  "automatic",
  "manually",
]);
export const paymentProcessorType = pgEnum("payment_processor_type", [
  "stripe",
  "mercadopago",
]);
export const paymentProcessorStatus = pgEnum("payment_processor_status", [
  "active",
  "inactive",
  "suspended",
]);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  isAnonymous: boolean("is_anonymous"),
  phoneNumber: text("phone_number").unique(),
  phoneNumberVerified: boolean("phone_number_verified"),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const passkey = pgTable("passkey", {
  id: text("id").primaryKey(),
  name: text("name"),
  publicKey: text("public_key").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  credentialID: text("credential_i_d").notNull(),
  counter: integer("counter").notNull(),
  deviceType: text("device_type").notNull(),
  backedUp: boolean("backed_up").notNull(),
  transports: text("transports"),
  createdAt: timestamp("created_at"),
});

export const paymentProcessorAccount = pgTable("payment_processor_account", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  processorType: paymentProcessorType("processor_type").notNull(),
  processorAccountId: text("processor_account_id").notNull(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  tokenExpiresAt: timestamp("token_expires_at"),
  scope: text("scope"),
  status: paymentProcessorStatus("status").notNull().default("active"),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const schema = { user, session, account, verification, passkey, paymentProcessorAccount };
