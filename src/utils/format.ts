import { format } from "date-fns";

export function formatDate(date: Date | string, pattern = "dd/MM/yyyy"): string {
  return format(new Date(date), pattern);
}
