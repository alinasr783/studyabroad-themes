import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Phone, Mail, MessageCircle } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20">
      <div className="container">
        <Card className="border-0 bg-gradient-to-br from-primary via-primary/90 to-secondary overflow-hidden relative">
          <div className="absolute inset-0 bg-black/10" />
          <CardContent className="p-12 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div className="space-y-6 text-white">
                <div className="space-y-4">
                  <h2 className="text-3xl lg:text-4xl font-bold leading-tight">
                    مستعد لبدء رحلتك التعليمية؟
                  </h2>
                  <p className="text-xl text-white/90 leading-relaxed">
                    احصل على استشارة مجانية من خبرائنا واكتشف الفرص المتاحة أمامك. 
                    نحن هنا لمساعدتك في كل خطوة نحو تحقيق حلمك الأكاديمي.
                  </p>
                </div>

                {/* Contact Options */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">اتصل بنا</div>
                      <div className="text-xs text-white/80">+966 50 123 4567</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">واتساب</div>
                      <div className="text-xs text-white/80">دردشة فورية</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">بريد إلكتروني</div>
                      <div className="text-xs text-white/80">info@studyabroad.com</div>
                    </div>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center space-x-6 rtl:space-x-reverse text-sm text-white/80">
                  <span>✓ استشارة مجانية</span>
                  <span>✓ فريق خبراء</span>
                  <span>✓ متابعة شخصية</span>
                </div>
              </div>

              {/* Form */}
              <div className="bg-white rounded-2xl p-8 shadow-2xl">
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold text-gray-900">
                      احجز استشارتك المجانية
                    </h3>
                    <p className="text-muted-foreground">
                      املأ النموذج وسنتواصل معك خلال 24 ساعة
                    </p>
                  </div>

                  <form className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input 
                        placeholder="الاسم الأول" 
                        className="text-right"
                      />
                      <Input 
                        placeholder="اسم العائلة" 
                        className="text-right"
                      />
                    </div>
                    
                    <Input 
                      type="email" 
                      placeholder="البريد الإلكتروني" 
                      className="text-right"
                    />
                    
                    <Input 
                      type="tel" 
                      placeholder="رقم الهاتف" 
                      className="text-right"
                    />
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-right">
                        <option value="">اختر الدولة المفضلة</option>
                        <option value="usa">الولايات المتحدة</option>
                        <option value="canada">كندا</option>
                        <option value="uk">المملكة المتحدة</option>
                        <option value="australia">أستراليا</option>
                        <option value="germany">ألمانيا</option>
                      </select>
                      
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-right">
                        <option value="">المستوى الدراسي</option>
                        <option value="bachelor">بكالوريوس</option>
                        <option value="master">ماجستير</option>
                        <option value="phd">دكتوراه</option>
                        <option value="diploma">دبلوم</option>
                      </select>
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all duration-300"
                    >
                      احجز استشارتك المجانية الآن
                      <ArrowRight className="mr-2 h-5 w-5" />
                    </Button>
                  </form>

                  <p className="text-xs text-muted-foreground text-center">
                    بالنقر على "احجز استشارتك" فإنك توافق على 
                    <span className="text-primary cursor-pointer hover:underline"> الشروط والأحكام</span> و
                    <span className="text-primary cursor-pointer hover:underline"> سياسة الخصوصية</span>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CTASection;