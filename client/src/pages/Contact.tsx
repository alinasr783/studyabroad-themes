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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">تواصل معنا</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            نحن هنا لمساعدتك في رحلتك التعليمية. تواصل معنا للحصول على استشارة مجانية
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">أرسل لنا رسالة</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="full_name">الاسم الكامل *</Label>
                      <Input
                        id="full_name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        required
                        placeholder="أدخل اسمك الكامل"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">البريد الإلكتروني *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="أدخل بريدك الإلكتروني"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">رقم الهاتف</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="أدخل رقم هاتفك"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject">الموضوع *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        placeholder="موضوع الرسالة"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">الرسالة *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      placeholder="اكتب رسالتك هنا..."
                      className="resize-none"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      "جاري الإرسال..."
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        إرسال الرسالة
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">معلومات التواصل</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">الهاتف</h3>
                    <p className="text-muted-foreground">+966 50 123 4567</p>
                    <p className="text-muted-foreground">+966 11 234 5678</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">البريد الإلكتروني</h3>
                    <p className="text-muted-foreground">info@futuretostudy.com</p>
                    <p className="text-muted-foreground">support@futuretostudy.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">العنوان</h3>
                    <p className="text-muted-foreground">
                      شارع الملك فهد، حي العليا<br />
                      الرياض 12345، المملكة العربية السعودية
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">ساعات العمل</h3>
                    <p className="text-muted-foreground">
                      الأحد - الخميس: 9:00 ص - 6:00 م<br />
                      الجمعة: 2:00 م - 6:00 م<br />
                      السبت: مغلق
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Consultation */}
            <Card className="bg-gradient-to-br from-primary to-secondary text-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3">استشارة سريعة</h3>
                <p className="mb-4 opacity-90">
                  هل تحتاج إلى استشارة فورية؟ تواصل معنا عبر واتساب للحصول على إجابات سريعة
                </p>
                <Button 
                  variant="secondary" 
                  className="w-full bg-white text-primary hover:bg-gray-100"
                  asChild
                >
                  <a 
                    href="https://wa.me/966501234567" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    تواصل عبر واتساب
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Map Placeholder */}
            <Card>
              <CardContent className="p-0">
                <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">خريطة الموقع</p>
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