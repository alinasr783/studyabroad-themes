import { useLocation } from "react-router-dom";
import WhatsAppButton from "./WhatsAppButton";

const WhatsAppButtonWrapper = () => {
  const location = useLocation();
  
  // إخفاء زر الواتساب في صفحات الإدمن والمنصة
  const hideWhatsApp = location.pathname.startsWith('/admin') || 
                      location.pathname.startsWith('/platform') ||
                      location.pathname.startsWith('/login');

  if (hideWhatsApp) {
    return null;
  }

  return <WhatsAppButton />;
};

export default WhatsAppButtonWrapper;