import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Shield, Crown } from "lucide-react";

const PlatformLogin = () => {
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
    setLoading(true);

    try {
      // Check if this is the platform owner (main admin)
      const { data, error } = await supabase
        .from("managers")
        .select("*, clients(*)")
        .eq("email", formData.email)
        .eq("password", formData.password)
        .is("client_id", null) // Platform owner has null client_id
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: "هذا الحساب ليس حساب صاحب المنصة",
          variant: "destructive",
        });
        return;
      }

      // Store platform owner session
      localStorage.setItem("platform_owner_session", JSON.stringify({
        id: data.id,
        email: data.email,
        is_platform_owner: true
      }));

      toast({
        title: "مرحباً بك صاحب المنصة",
        description: "تم تسجيل الدخول بنجاح",
      });

      navigate("/platform/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تسجيل الدخول",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-4">
      <Card className="w-full max-w-md border-2 border-primary/20">
        <CardHeader className="text-center">
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Platform Owner Login
          </CardTitle>
          <CardDescription>
            تسجيل دخول صاحب المنصة الرئيسي
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="alinasreldin783@gmail.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Alinasr89#"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" 
              disabled={loading}
            >
              <Shield className="w-4 h-4 mr-2" />
              {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlatformLogin;