export interface Passkey {
  id: string;
  name?: string;
  deviceType: string;
  createdAt: Date;
  backedUp: boolean;
  transports?: string;
}

export interface AddPasskeyRequest {
  name?: string;
  authenticatorAttachment?: "platform" | "cross-platform";
}

export interface UpdatePasskeyRequest {
  id: string;
  name: string;
}

export interface DeletePasskeyRequest {
  id: string;
}