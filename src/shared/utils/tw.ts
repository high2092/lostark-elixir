import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function twClsx(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
