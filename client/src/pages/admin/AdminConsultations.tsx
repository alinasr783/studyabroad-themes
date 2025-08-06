import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { articlesApi, countriesApi, universitiesApi, programsApi, consultationsApi, contactMessagesApi, testimonialsApi } from "@/lib/api";
import AdminLayout from "@/components/admin/AdminLayout";

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
  const { toast } = useToast();

  useEffect(() => {
    fetchConsultations();
  }, []);

  const getClientId = () => {
    const session = localStorage.getItem("manager_session");
    return session ? JSON.parse(session).client_id : null;
  };

  const fetchConsultations = async () => {
    try {
      const clientId = getClientId();
      if (!clientId) return;

      const { data, error } = await supabase
        .from("consultations")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setConsultations(data || []);
    } catch (error) {
      console.error("Error fetching consultations:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل البيانات",
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

      fetchConsultations();
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
        return <Badge variant="default">تم التواصل</Badge>;
      case "completed":
        return <Badge variant="outline">مكتمل</Badge>;
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
                  <TableHead>الاسم</TableHead>
                  <TableHead>معلومات التواصل</TableHead>
                  <TableHead>تفضيلات الدراسة</TableHead>
                  <TableHead>الميزانية</TableHead>
                  <TableHead>الموعد المفضل</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>تاريخ التقديم</TableHead>
                  <TableHead>الإجراءات</TableHead>
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
                      <div className="flex gap-1">
                        {consultation.status === "pending" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateStatus(consultation.id, "contacted")}
                          >
                            تم التواصل
                          </Button>
                        )}
                        {consultation.status === "contacted" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateStatus(consultation.id, "completed")}
                          >
                            مكتمل
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