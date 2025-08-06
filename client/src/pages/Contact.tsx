import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";

// Contact information data in JSON format
const contactInfo = {
  header: {
    title: "تواصل معنا",
    description: "نحن هنا لمساعدتك في رحلتك التعليمية. تواصل معنا للحصول على استشارة مجانية"
  },
  contactDetails: {
    phone: ["+966 50 123 4567", "+966 11 234 5678"],
    email: ["info@futuretostudy.com", "support@futuretostudy.com"],
    address: "شارع الملك فهد، حي العليا\nالرياض 12345، المملكة العربية السعودية",
    workingHours: "الأحد - الخميس: 9:00 ص - 6:00 م\nالجمعة: 2:00 م - 6:00 م\nالسبت: مغلق"
  },
  quickConsultation: {
    title: "استشارة سريعة",
    description: "هل تحتاج إلى استشارة فورية؟ تواصل معنا عبر واتساب للحصول على إجابات سريعة",
    whatsappNumber: "966501234567"
  },
  map: {
    placeholderText: "خريطة الموقع",
    googleMapsLink: "https://maps.google.com/?q=شارع الملك فهد، حي العليا، الرياض"
  }
};

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "تم إرسال رسالتك بنجاح",
        description: "سنتواصل معك في أقرب وقت ممكن",
      });

      setFormData({
        full_name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      toast({
        title: "خطأ في إرسال الرسالة",
        description: "حدث خطأ، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header with animated gradient */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {contactInfo.header.title}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            {contactInfo.header.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Contact Form with subtle animation */}
          <div className="animate-fade-in-up">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
                  <Send className="w-5 h-5 text-primary" />
                  أرسل لنا رسالة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="full_name" className="text-sm md:text-base">الاسم الكامل *</Label>
                      <Input
                        id="full_name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        required
                        placeholder="أدخل اسمك الكامل"
                        className="py-2 md:py-3"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="email" className="text-sm md:text-base">البريد الإلكتروني *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="أدخل بريدك الإلكتروني"
                        className="py-2 md:py-3"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="phone" className="text-sm md:text-base">رقم الهاتف</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="أدخل رقم هاتفك"
                        className="py-2 md:py-3"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="subject" className="text-sm md:text-base">الموضوع *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        placeholder="موضوع الرسالة"
                        className="py-2 md:py-3"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="message" className="text-sm md:text-base">الرسالة *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      placeholder="اكتب رسالتك هنا..."
                      className="resize-none py-2 md:py-3 min-h-[120px]"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full mt-2 md:mt-4" 
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        جاري الإرسال...
                      </span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 ml-2" />
                        إرسال الرسالة
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-4 md:space-y-6">
            {/* Contact Details */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary" />
                  معلومات التواصل
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="bg-primary/10 p-2 md:p-3 rounded-lg flex-shrink-0">
                    <Phone className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm md:text-base mb-1">الهاتف</h3>
                    {contactInfo.contactDetails.phone.map((phone, index) => (
                      <p key={index} className="text-muted-foreground text-sm md:text-base">{phone}</p>
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-3 md:gap-4">
                  <div className="bg-primary/10 p-2 md:p-3 rounded-lg flex-shrink-0">
                    <Mail className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm md:text-base mb-1">البريد الإلكتروني</h3>
                    {contactInfo.contactDetails.email.map((email, index) => (
                      <p key={index} className="text-muted-foreground text-sm md:text-base">{email}</p>
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-3 md:gap-4">
                  <div className="bg-primary/10 p-2 md:p-3 rounded-lg flex-shrink-0">
                    <MapPin className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm md:text-base mb-1">العنوان</h3>
                    <p className="text-muted-foreground text-sm md:text-base whitespace-pre-line">
                      {contactInfo.contactDetails.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 md:gap-4">
                  <div className="bg-primary/10 p-2 md:p-3 rounded-lg flex-shrink-0">
                    <Clock className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm md:text-base mb-1">ساعات العمل</h3>
                    <p className="text-muted-foreground text-sm md:text-base whitespace-pre-line">
                      {contactInfo.contactDetails.workingHours}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Consultation */}
            <Card className="bg-gradient-to-br from-primary to-secondary text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">{contactInfo.quickConsultation.title}</h3>
                <p className="mb-3 md:mb-4 opacity-90 text-sm md:text-base">
                  {contactInfo.quickConsultation.description}
                </p>
                <Button 
                  variant="secondary" 
                  className="w-full bg-white text-primary hover:bg-gray-100 text-sm md:text-base"
                  asChild
                >
                  <a 
                    href={`https://wa.me/${contactInfo.quickConsultation.whatsappNumber}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    تواصل عبر واتساب
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Map Placeholder with interactive element */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-0 overflow-hidden rounded-lg">
                <div className="w-full h-48 md:h-64 bg-gray-100 relative flex items-center justify-center">
                  <div className="text-center z-10 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-sm">
                    <MapPin className="w-10 h-10 text-primary mx-auto mb-2" />
                    <p className="text-gray-700 font-medium">{contactInfo.map.placeholderText}</p>
                    <Button 
                      variant="link" 
                      className="text-primary mt-2 text-sm"
                      asChild
                    >
                      <a 
                        href={contactInfo.map.googleMapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        عرض على خرائط جوجل
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;