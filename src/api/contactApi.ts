import type { ContactMessage, ContactPayload } from "../types/contact";
import api from "./axios";

export const sendContactMessage = async (data: ContactPayload) => {
    const response = await api.post("/contact", data);
    return response.data;
}
export const getContactMessages = async (): Promise<ContactMessage[]> => {
  const response = await api.get("/contact");
  return response.data;
};
 
export const markContactAsRead = async (id: number) => {
  await api.put(`/contact/${id}/read`);
};
 
export const deleteContactMessage = async (id: number) => {
  await api.delete(`/contact/${id}`);
};