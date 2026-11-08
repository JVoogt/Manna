import { Toaster } from 'sonner';

export function ToastProvider() {
  return <Toaster position="top-center" offset={88} mobileOffset={88} duration={3000} />;
}
