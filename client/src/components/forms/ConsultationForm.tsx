import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { X, Calendar, Clock } from "lucide-react";

interface ConsultationFormProps {
  onClose: () => void;
  programName?: string;
  clientId?: string;
}

const ConsultationForm = ({ onClose, programName, clientId = "00000000-0000-0000-0000-000000000001" }: ConsultationFormProps) => {
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
      const { error } = await supabase
        .from('consultations')
        .insert([{
          ...formData,
          client_id: clientId,
          preferred_date: formData.preferred_date || null,
          preferred_time: formData.preferred_time || null
        }]);

      if (error) throw error;

      toast({
        title: "تم حجز الاستشارة بنجاح",
        description: "سنتواصل معك قريباً لتأكيد موعد الاستشارة",
      });

      onClose();
    } catch (error) {
      console.error('Error submitting consultation:', error);
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border-0">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">احجز استشارة مجانية</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-white hover:bg-white/10 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-white/90">
            احصل على استشارة مجانية مع خبرائنا لتحديد أفضل مسار دراسي لك
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">المعلومات الشخصية</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="text-gray-700">الاسم الكامل *</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    required
                    placeholder="أدخل اسمك الكامل"
                    className="focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">البريد الإلكتروني *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="أدخل بريدك الإلكتروني"
                    className="focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700">رقم الهاتف *</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="أدخل رقم هاتفك"
                  className="focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Study Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">التفضيلات الدراسية</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country_preference" className="text-gray-700">الدولة المفضلة</Label>
                  <Select 
                    onValueChange={(value) => handleSelectChange("country_preference", value)}
                    value={formData.country_preference}
                  >
                    <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
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
                <div className="space-y-2">
                  <Label htmlFor="study_level" className="text-gray-700">المستوى الدراسي</Label>
                  <Select 
                    onValueChange={(value) => handleSelectChange("study_level", value)}
                    value={formData.study_level}
                  >
                    <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
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
                <div className="space-y-2">
                  <Label htmlFor="field_of_interest" className="text-gray-700">مجال الاهتمام</Label>
                  <Input
                    id="field_of_interest"
                    name="field_of_interest"
                    value={formData.field_of_interest}
                    onChange={handleInputChange}
                    placeholder="مثل: الهندسة، الطب، إدارة الأعمال"
                    className="focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget_range" className="text-gray-700">الميزانية المتوقعة</Label>
                  <Select 
                    onValueChange={(value) => handleSelectChange("budget_range", value)}
                    value={formData.budget_range}
                  >
                    <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
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
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">موعد الاستشارة</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preferred_date" className="text-gray-700">التاريخ المفضل</Label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
                    <Input
                      id="preferred_date"
                      name="preferred_date"
                      type="date"
                      value={formData.preferred_date}
                      onChange={handleInputChange}
                      className="pl-10 focus:ring-2 focus:ring-blue-500"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferred_time" className="text-gray-700">الوقت المفضل</Label>
                  <div className="relative">
                    <Clock className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
                    <Input
                      id="preferred_time"
                      name="preferred_time"
                      type="time"
                      value={formData.preferred_time}
                      onChange={handleInputChange}
                      className="pl-10 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Message */}
            <div className="space-y-2">
              <Label htmlFor="message" className="text-gray-700">رسالة إضافية (اختيارية)</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                placeholder="أي معلومات إضافية تود مشاركتها معنا..."
                className="resize-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                className="flex-1 bg-blue-600 hover:bg-blue-700 transition-colors duration-300 py-3 text-lg"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جاري الحجز...
                  </span>
                ) : "حجز الاستشارة"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={loading}
                className="py-3 text-lg border-gray-300 hover:bg-gray-50"
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