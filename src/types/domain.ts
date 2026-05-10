export type TicketType = "general" | "vip";
export type OrderStatus = "pending" | "paid" | "failed" | "refunded";
export type TicketStatus = "active" | "used" | "cancelled" | "refunded";
export type RefundStatus = "requested" | "succeeded" | "failed";
export type AddOnId = "livestream_replay" | "priority_checkin" | "sponsor_networking";

export type OrderAddOn = {
  id: AddOnId;
  label: string;
  amount: number;
};

export type EventRecord = {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  location: string;
  imageUrl?: string | null;
  generalPrice: number;
  vipPrice: number;
  createdAt: string;
  updatedAt: string;
};

export type OrderRecord = {
  id: string;
  eventId: string;
  buyerEmail: string;
  buyerWallet?: string | null;
  ticketType: TicketType;
  amount: number;
  totalAmount: number;
  addOns: OrderAddOn[];
  currency: string;
  status: OrderStatus;
  customOrderId: string;
  kirapayCheckoutUrl?: string | null;
  kirapayLinkCode?: string | null;
  kirapayPaymentLinkId?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TicketRecord = {
  id: string;
  orderId: string;
  eventId: string;
  buyerEmail: string;
  ticketType: TicketType;
  ticketCode: string;
  qrUrl: string;
  status: TicketStatus;
  checkedIn: boolean;
  checkedInAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type KiraPayTransactionRecord = {
  id: string;
  orderId: string;
  kirapayTransactionId?: string | null;
  hash?: string | null;
  status: string;
  price?: number | null;
  settlementAmount?: number | null;
  sender?: string | null;
  recipient?: string | null;
  rawPayload: unknown;
  createdAt: string;
};

export type WebhookEventRecord = {
  id: string;
  eventType: string;
  orderId?: string | null;
  kirapayTransactionId?: string | null;
  rawPayload: unknown;
  processed: boolean;
  processedAt?: string | null;
  processingError?: string | null;
  createdAt: string;
};

export type RefundRecord = {
  id: string;
  orderId: string;
  transactionId: string;
  refundTxHash?: string | null;
  amount: number;
  reason?: string | null;
  status: RefundStatus;
  rawPayload?: unknown;
  createdAt: string;
};

export type TicketWithOrder = TicketRecord & {
  order: OrderRecord;
  event: EventRecord;
};

export type AttendeeRow = {
  order: OrderRecord;
  ticket: TicketRecord | null;
  event: EventRecord;
  transaction: KiraPayTransactionRecord | null;
};

export type KiraPayCreateLinkRequest = {
  tokenOut: {
    chainId: string;
    address: string;
  };
  receiver: string;
  originalPrice: number;
  fiatCurrency: "USD";
  name: string;
  customOrderId: string;
  redirectUrl: string;
  type: "single_use";
  isViewAsCrypto: boolean;
};

export type KiraPayCreateLinkResponse = {
  message?: string;
  code?: number;
  data: {
    url: string;
    price?: number;
    originalPrice?: number;
    code?: string;
    _id?: string;
    id?: string;
  };
};

export type KiraPayTransactionPayload = {
  id?: string;
  _id?: string;
  transactionId?: string;
  status?: string;
  hash?: string;
  transaction_hash?: string;
  price?: number;
  amount?: number;
  settlementAmount?: number;
  sender?: string;
  recipient?: string;
  receiver?: string;
  customOrderId?: string;
  orderId?: string;
  linkCode?: string;
  payment_link_id?: string;
  link?: string;
  createdAt?: string;
};

export type KiraPayWebhookEvent = {
  event: string;
  data: KiraPayTransactionPayload;
};
