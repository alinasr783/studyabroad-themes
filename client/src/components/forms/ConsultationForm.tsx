import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { articlesApi, countriesApi, universitiesApi, programsApi, consultationsApi, contactMessagesApi, testimonialsApi } from "@/lib/api";
import { X, Calendar, Clock } from "lucide-react";

interface ConsultationFormProps {
  onClose: () => void;
  programName?: string;
}

const ConsultationForm = ({ onClose, programName }: ConsultationFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    country_preference: "",
    study_level: "",
    field_of_interest: programName || "",
    budget_range: "",
    preferred_date: "",
    preferred_time: "",
    message: ""
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get client_id from settings or use default
      const clientId = "00000000-0000-0000-0000-000000000001";
      
      const { error } = await supabase
        .from('consultations')
        .insert([{
          ...formData,
          client_id: clientId
        }]);

      if (error) throw error;

      toast({
        title: "تم حجز الاستشارة بنجاح",
        description: "سنتواصل معك قريباً لتأكيد موعد الاستشارة",
      });

      onClose();
    } catch (error) {
      toast({
        title: "خطأ في حجز الاستشارة",
        description: "حدث خطأ، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">احجز استشارة مجانية</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-muted-foreground">
            احصل على استشارة مجانية مع خبرائنا لتحديد أفضل مسار دراسي لك
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">المعلومات الشخصية</h3>
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
              <div>
                <Label htmlFor="phone">رقم الهاتف *</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="أدخل رقم هاتفك"
                />
              </div>
            </div>

            {/* Study Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">التفضيلات الدراسية</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country_preference">الدولة المفضلة</Label>
                  <Select onValueChange={(value) => handleSelectChange("country_preference", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الدولة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usa">الولايات المتحدة</SelectItem>
                      <SelectItem value="uk">المملكة المتحدة</SelectItem>
                      <SelectItem value="canada">كندا</SelectItem>
                      <SelectItem value="australia">أستراليا</SelectItem>
                      <SelectItem value="germany">ألمانيا</SelectItem>
                      <SelectItem value="france">فرنسا</SelectItem>
                      <SelectItem value="other">أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="study_level">المستوى الدراسي</Label>
                  <Select onValueChange={(value) => handleSelectChange("study_level", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المستوى" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bachelor">بكالوريوس</SelectItem>
                      <SelectItem value="master">ماجستير</SelectItem>
                      <SelectItem value="phd">دكتوراه</SelectItem>
                      <SelectItem value="language">دورة لغة</SelectItem>
                      <SelectItem value="diploma">دبلوم</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="field_of_interest">مجال الاهتمام</Label>
                  <Input
                    id="field_of_interest"
                    name="field_of_interest"
                    value={formData.field_of_interest}
                    onChange={handleInputChange}
                    placeholder="مثل: الهندسة، الطب، إدارة الأعمال"
                  />
                </div>
                <div>
                  <Label htmlFor="budget_range">الميزانية المتوقعة</Label>
                  <Select onValueChange={(value) => handleSelectChange("budget_range", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الميزانية" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under_20k">أقل من 20,000 دولار</SelectItem>
                      <SelectItem value="20k_40k">20,000 - 40,000 دولار</SelectItem>
                      <SelectItem value="40k_60k">40,000 - 60,000 دولار</SelectItem>
                      <SelectItem value="60k_80k">60,000 - 80,000 دولار</SelectItem>
                      <SelectItem value="over_80k">أكثر من 80,000 دولار</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Consultation Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">موعد الاستشارة</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="preferred_date">التاريخ المفضل</Label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      id="preferred_date"
                      name="preferred_date"
                      type="date"
                      value={formData.preferred_date}
                      onChange={handleInputChange}
                      className="pl-10"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="preferred_time">الوقت المفضل</Label>
                  <div className="relative">
                    <Clock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      id="preferred_time"
                      name="preferred_time"
                      type="time"
                      value={formData.preferred_time}
                      onChange={handleInputChange}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Message */}
            <div>
              <Label htmlFor="message">رسالة إضافية (اختيارية)</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                placeholder="أي معلومات إضافية تود مشاركتها معنا..."
                className="resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button 
                type="submit" 
                className="flex-1" 
                disabled={loading}
              >
                {loading ? "جاري الحجز..." : "حجز الاستشارة"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={loading}
              >
                إلغاء
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsultationForm;