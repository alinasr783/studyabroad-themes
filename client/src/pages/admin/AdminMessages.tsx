import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { articlesApi, countriesApi, universitiesApi, programsApi, consultationsApi, contactMessagesApi, testimonialsApi } from "@/lib/api";
import AdminLayout from "@/components/admin/AdminLayout";

interface ContactMessage {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  const getClientId = () => {
    const session = localStorage.getItem("manager_session");
    return session ? JSON.parse(session).client_id : null;
  };

  const fetchMessages = async () => {
    try {
      const clientId = getClientId();
      if (!clientId) return;

      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
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
        .from("contact_messages")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "تم التحديث",
        description: "تم تحديث حالة الرسالة بنجاح",
      });

      fetchMessages();
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
      case "unread":
        return <Badge variant="destructive">غير مقروءة</Badge>;
      case "read":
        return <Badge variant="secondary">مقروءة</Badge>;
      case "replied":
        return <Badge variant="default">تم الرد</Badge>;
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
          <h1 className="text-3xl font-bold">رسائل التواصل</h1>
          <p className="text-muted-foreground">إدارة رسائل التواصل الواردة من الموقع</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>قائمة الرسائل ({messages.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المرسل</TableHead>
                  <TableHead>الموضوع</TableHead>
                  <TableHead>الرسالة</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>تاريخ الإرسال</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{message.full_name}</div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          {message.email}
                        </div>
                        {message.phone && (
                          <div className="text-sm text-muted-foreground">
                            {message.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{message.subject}</div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={message.message}>
                        {message.message}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(message.status)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatDate(message.created_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {message.status === "unread" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateStatus(message.id, "read")}
                          >
                            تم القراءة
                          </Button>
                        )}
                        {message.status === "read" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateStatus(message.id, "replied")}
                          >
                            تم الرد
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`mailto:${message.email}?subject=Re: ${message.subject}`)}
                        >
                          رد
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {messages.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">لا توجد رسائل تواصل حتى الآن</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminMessages;