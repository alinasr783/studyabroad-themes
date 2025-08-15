import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useNavigate } from "react-router-dom";

interface Consultation {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  country_preference?: string;
  study_level?: string;
  field_of_interest?: string;
  budget_range?: string;
  preferred_date?: string;
  preferred_time?: string;
  message?: string;
  status: string;
  created_at: string;
}

const AdminConsultations = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

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

        await fetchConsultations(sessionData.client_id);
      } catch (err) {
        console.error("Error initializing consultations:", err);
        setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
        setLoading(false);
      }
    };

    checkSessionAndFetchData();
  }, [navigate]);

  const fetchConsultations = async (clientId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("consultations")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setConsultations(data || []);
    } catch (error) {
      console.error("Error fetching consultations:", error);
      setError("حدث خطأ أثناء تحميل البيانات");
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل طلبات الاستشارة",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("consultations")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "تم التحديث",
        description: "تم تحديث حالة الطلب بنجاح",
      });

      // إعادة تحميل البيانات بعد التحديث
      const session = localStorage.getItem("manager_session");
      if (session) {
        const { client_id } = JSON.parse(session);
        await fetchConsultations(client_id);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث الحالة",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">قيد الانتظار</Badge>;
      case "contacted":
        return <Badge className="bg-blue-500 hover:bg-blue-600">تم التواصل</Badge>;
      case "completed":
        return <Badge variant="outline">مكتمل</Badge>;
      case "cancelled":
        return <Badge variant="destructive">ملغى</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
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
        <div>
          <h1 className="text-3xl font-bold">طلبات الاستشارة</h1>
          <p className="text-muted-foreground">إدارة طلبات الاستشارة الواردة من الموقع</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>قائمة الطلبات ({consultations.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">الاسم</TableHead>
                  <TableHead>معلومات التواصل</TableHead>
                  <TableHead>تفضيلات الدراسة</TableHead>
                  <TableHead>الميزانية</TableHead>
                  <TableHead>الموعد المفضل</TableHead>
                  <TableHead className="w-[120px]">الحالة</TableHead>
                  <TableHead className="w-[180px]">تاريخ التقديم</TableHead>
                  <TableHead className="w-[150px]">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consultations.map((consultation) => (
                  <TableRow key={consultation.id}>
                    <TableCell>
                      <div className="font-medium">{consultation.full_name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="w-3 h-3" />
                          {consultation.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="w-3 h-3" />
                          {consultation.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        {consultation.country_preference && (
                          <div>الدولة: {consultation.country_preference}</div>
                        )}
                        {consultation.study_level && (
                          <div>المستوى: {consultation.study_level}</div>
                        )}
                        {consultation.field_of_interest && (
                          <div>التخصص: {consultation.field_of_interest}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {consultation.budget_range || "غير محدد"}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {consultation.preferred_date && (
                          <div>{consultation.preferred_date}</div>
                        )}
                        {consultation.preferred_time && (
                          <div>{consultation.preferred_time}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(consultation.status)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatDate(consultation.created_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/admin/consultations/${consultation.id}`)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          عرض
                        </Button>
                        {consultation.status === "pending" && (
                          <Button
                            size="sm"
                            onClick={() => updateStatus(consultation.id, "contacted")}
                          >
                            تم التواصل
                          </Button>
                        )}
                        {consultation.status === "contacted" && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => updateStatus(consultation.id, "completed")}
                          >
                            إكمال
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {consultations.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">لا توجد طلبات استشارة حتى الآن</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminConsultations;