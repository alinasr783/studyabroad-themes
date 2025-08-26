import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WhatsAppButton = () => {
  const phoneNumber = "201272935877";
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  const handleClick = () => {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 bg-green-500 hover:bg-green-600 text-white border-2 border-green-400 hover:border-green-500 animate-pulse hover:animate-none"
      size="icon"
      aria-label="تواصل معنا عبر الواتساب"
      title="تواصل معنا عبر الواتساب"
      data-testid="whatsapp-button"
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  );
};

export default WhatsAppButton;