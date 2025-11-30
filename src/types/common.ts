export type AlertType =
  | "info"
  | "error"
  | "success"
  | "danger"
  | "warning"
  | "question";
export interface ModalConfig {
  open: boolean;
  type: AlertType;
  title: string;
  description: string;
  cancelText?: string;
  confirmText?: string;
  onConfirm?: () => void;
}
export interface CreateHotelFormData {
  email: string;
  password: string;
  name: string;
  avatar?: string;
  description: string;
  country: string;
  state: string;
  city: string;
  stars: 1 | 2 | 3 | 4 | 5;
}
