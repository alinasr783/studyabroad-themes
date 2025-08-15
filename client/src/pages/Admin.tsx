import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast({
        title: "خطأ في الإدخال",
        description: "الرجاء إدخال البريد الإلكتروني وكلمة المرور",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: admin, error } = await supabase
        .from('admins')
        .select('id, email, full_name, client_id, is_active')
        .eq('email', formData.email)
        .eq('password', formData.password)
        .maybeSingle();

      if (error) throw error;
      if (!admin) throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      if (!admin.is_active) throw new Error('حسابك غير مفعل. يرجى التواصل مع المسؤول');

      localStorage.setItem('manager_session', JSON.stringify({
        admin_id: admin.id,
        client_id: admin.client_id,
        full_name: admin.full_name,
        email: admin.email,
        timestamp: new Date().getTime()
      }));

      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحبًا ${admin.full_name || ''}`,
      });

      navigate("/admin/dashboard");
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "خطأ في تسجيل الدخول",
        description: error instanceof Error ? error.message : 'حدث خطأ غير متوقع',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-gray-800">
            تسجيل دخول المدير
          </CardTitle>
          <CardDescription className="text-gray-600">
            يرجى إدخال بيانات الاعتماد الخاصة بك
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                البريد الإلكتروني
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="example@domain.com"
                className="border-gray-300 focus:border-primary focus:ring-primary"
                dir="ltr"
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">
                كلمة المرور
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="••••••••"
                className="border-gray-300 focus:border-primary focus:ring-primary"
                dir="ltr"
                autoComplete="current-password"
                minLength={8}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary-dark transition-colors"
              disabled={loading}
            >
              {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;