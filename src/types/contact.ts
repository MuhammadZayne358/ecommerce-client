export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}