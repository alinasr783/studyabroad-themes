import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, User, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";

interface Manager {
  id: string;
  email: string;
  name?: string | null;
  client_id: string;
  created_at: string;
  updated_at?: string;
  is_active?: boolean;
}

const AdminManagers = () => {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingManager, setEditingManager] = useState<Manager | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    is_active: true,
  });

  useEffect(() => {
    const checkSessionAndFetchData = async () => {
      try {
        const session = localStorage.getItem("manager_session");
        if (!session) {
          navigate("/admin/login");
          return;
        }

        const sessionData = JSON.parse(session);
        if (!sessionData.client_id) {
          throw new Error("بيانات الجلسة غير صالحة");
        }

        // التحقق من أن الجلسة لم تنتهي (30 دقيقة)
        const sessionAge = Date.now() - (sessionData.timestamp || 0);
        if (sessionAge > 30 * 60 * 1000) {
          localStorage.removeItem("manager_session");
          navigate("/admin/login");
          return;
        }

        await fetchManagers(sessionData.client_id);
      } catch (err) {
        console.error("Error initializing managers:", err);
        setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
        setLoading(false);
      }
    };

    checkSessionAndFetchData();
  }, [navigate]);

  const fetchManagers = async (clientId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("managers")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setManagers(data || []);
    } catch (error) {
      console.error("Error fetching managers:", error);
      setError("حدث خطأ أثناء تحميل المديرين");
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل قائمة المديرين",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const session = localStorage.getItem("manager_session");
      if (!session) {
        navigate("/admin/login");
        return;
      }

      const { client_id } = JSON.parse(session);

      const managerData = {
        email: formData.email,
        name: formData.name || null,
        client_id,
        is_active: formData.is_active,
        ...(formData.password && { password: formData.password }) // Only include password if provided
      };

      let result;
      if (editingManager) {
        // Update existing manager
        const { data, error } = await supabase
          .from("managers")
          .update(managerData)
          .eq("id", editingManager.id)
          .select()
          .single();

        if (error) throw error;
        result = data;
        toast({
          title: "تم التحديث",
          description: "تم تحديث المدير بنجاح",
        });
      } else {
        // Create new manager
        if (!formData.password) {
          throw new Error("كلمة المرور مطلوبة للمدير الجديد");
        }

        const { data, error } = await supabase
          .from("managers")
          .insert([{ ...managerData, password: formData.password }])
          .select()
          .single();

        if (error) throw error;
        result = data;
        toast({
          title: "تم الإضافة",
          description: "تم إضافة المدير بنجاح",
        });
      }

      fetchManagers(client_id);
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error("Error saving manager:", error);
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء حفظ المدير",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (manager: Manager) => {
    setEditingManager(manager);
    setFormData({
      email: manager.email,
      name: manager.name || "",
      password: "",
      is_active: manager.is_active ?? true,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المدير؟")) return;

    try {
      const session = localStorage.getItem("manager_session");
      if (!session) {
        navigate("/admin/login");
        return;
      }

      const { client_id } = JSON.parse(session);

      const { error } = await supabase
        .from("managers")
        .delete()
        .eq("id", id)
        .eq("client_id", client_id);

      if (error) throw error;

      toast({
        title: "تم الحذف",
        description: "تم حذف المدير بنجاح",
      });

      fetchManagers(client_id);
    } catch (error) {
      console.error("Error deleting manager:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف المدير",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      email: "",
      name: "",
      password: "",
      is_active: true,
    });
    setEditingManager(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center text-red-500">
            <p className="font-bold">خطأ!</p>
            <p>{error}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">إدارة المديرين</h1>
            <p className="text-muted-foreground">إدارة حسابات المديرين في النظام</p>
          </div>

          <Dialog open={showForm} onOpenChange={(open) => {
            if (!open) resetForm();
            setShowForm(open);
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="w-4 h-4 ml-2" />
                إضافة مدير جديد
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingManager ? "تعديل المدير" : "إضافة مدير جديد"}</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">البريد الإلكتروني *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={!!editingManager}
                  />
                </div>

                <div>
                  <Label htmlFor="name">الاسم (اختياري)</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="password">
                    {editingManager ? "كلمة المرور الجديدة (اختياري)" : "كلمة المرور *"}
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={!editingManager}
                    minLength={6}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="is_active">الحساب نشط</Label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      resetForm();
                      setShowForm(false);
                    }}
                  >
                    إلغاء
                  </Button>
                  <Button type="submit">
                    {editingManager ? "حفظ التعديلات" : "إضافة"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>قائمة المديرين ({managers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الاسم</TableHead>
                  <TableHead>البريد الإلكتروني</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>تاريخ الإضافة</TableHead>
                  <TableHead>آخر تحديث</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {managers.map((manager) => (
                  <TableRow key={manager.id}>
                    <TableCell>{manager.name || "بدون اسم"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        {manager.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      {manager.is_active ? (
                        <Badge variant="default">نشط</Badge>
                      ) : (
                        <Badge variant="destructive">غير نشط</Badge>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(manager.created_at)}</TableCell>
                    <TableCell>{manager.updated_at ? formatDate(manager.updated_at) : "-"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(manager)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(manager.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {managers.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">لا يوجد مديرين حتى الآن</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminManagers;