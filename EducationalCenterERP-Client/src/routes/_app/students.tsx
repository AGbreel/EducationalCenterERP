import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download, Pencil, Plus, QrCode, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api, type Student } from "@/lib/data";
import { useDb } from "@/lib/use-db";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/_app/students")({
  head: () => ({
    meta: [
      { title: "تسجيل الطلاب و QR Code | منصّة السنتر" },
      {
        name: "description",
        content: "سجّل طالب جديد، أنشئ له QR Code، وحدد المواد المشترك بها.",
      },
      { property: "og:title", content: "تسجيل الطلاب و QR Code" },
      {
        property: "og:description",
        content: "إدارة بيانات الطلاب وأكواد QR والاشتراك في المواد.",
      },
    ],
  }),
  component: StudentsPage,
});

function StudentsPage() {
  const db = useDb();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    parentPhone: "",
    address: "",
    school: "",
    grade: "",
  });
  const [qrStudent, setQrStudent] = useState<Student | null>(null);

  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim()) return;
    if (form.fullName.length < 3) {
      toast.error("اسم الطالب غير صحيح");
      return;
    }
    if (form.phone.length != 11) {
      toast.error("رقم الهاتف غير صحيح");
      return;
    }
    if (form.parentPhone.length != 11) {
      toast.error("رقم ولي الأمر غير صحيح");
      return;
    }
    setSaving(true);
    try {
      const student = await api.addStudent({
        fullName: form.fullName,
        phone: form.phone,
        parentPhone: form.parentPhone,
        address: form.address,
        school: form.school,
        grade: form.grade,
      });
      setForm({
        fullName: "",
        phone: "",
        grade: "",
        parentPhone: "",
        address: "",
        school: "",
      });

      setQrStudent(student);
      toast.success(`تم تسجيل ${student.fullName} وإنشاء كود ${student.code}`);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const downloadQr = () => {
    const canvas =
      document.querySelector<HTMLCanvasElement>("#student-qr canvas");
    if (!canvas || !qrStudent) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${qrStudent.code}.png`;
    link.click();
  };
  const grades = [
    {
      label: "المرحلة الإعدادية",
      items: [
        "الصف الأول الإعدادي",
        "الصف الثاني الإعدادي",
        "الصف الثالث الإعدادي",
      ],
    },
    {
      label: "المرحلة الثانوية",
      items: [
        "الصف الأول الثانوي",
        "الصف الثاني الثانوي",
        "الصف الثالث الثانوي",
      ],
    },
  ];

  useEffect(() => {
    console.log(db.students);
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">تسجيل الطلاب</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          كل طالب جديد يحصل تلقائيًا على كود QR خاص به للحضور والدفع.
        </p>
      </header>

      <form
        onSubmit={(e) => void submit(e)}
        className="surface-card grid gap-4 p-5 md:grid-cols-4"
      >
        <div className="space-y-2">
          <Label htmlFor="fullName">اسم الطالب</Label>
          <Input
            id="fullName"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            placeholder="مثال: أحمد كريم"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">رقم الهاتف</Label>
          <Input
            id="phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="01xxxxxxxxx"
          />
        </div>
        <div className="space-y-2">
          <Label>رقم ولي الأمر</Label>

          <Input
            value={form.parentPhone}
            onChange={(e) =>
              setForm({
                ...form,
                parentPhone: e.target.value,
              })
            }
            placeholder="01xxxxxxxxx"
          />
        </div>
        <div className="space-y-2">
          <Label>المدرسة</Label>

          <Input
            value={form.school}
            onChange={(e) =>
              setForm({
                ...form,
                school: e.target.value,
              })
            }
            placeholder="اسم المدرسة"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>العنوان</Label>

          <Input
            value={form.address}
            onChange={(e) =>
              setForm({
                ...form,
                address: e.target.value,
              })
            }
            placeholder="عنوان الطالب"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="grade">الصف الدراسي</Label>

          <Select
            value={form.grade}
            onValueChange={(value) =>
              setForm((prev) => ({
                ...prev,
                grade: value,
              }))
            }
          >
            <SelectTrigger id="grade" className="w-full">
              <SelectValue placeholder="اختر الصف الدراسي" />
            </SelectTrigger>

            <SelectContent>
              {grades.map((group) => (
                <SelectGroup key={group.label}>
                  <SelectLabel>{group.label}</SelectLabel>

                  {group.items.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button type="submit" className="w-full" size="lg" disabled={saving}>
            <Plus className="size-4" />{" "}
            {saving ? "جاري الحفظ..." : "إضافة الطالب"}
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        {db.students.map((student) => {
          const classes = db.courseClasses;
          const studentEnrollments = db.enrollments.filter(
            (e) => e.studentId === student.id,
          );
          console.log(db.students);
          const enrolledIds = studentEnrollments.map((e) => e.courseClassId);
          return (
            <div
              key={student.id}
              className="surface-card rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                {/* بيانات الطالب */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xl font-bold">{student.fullName}</h3>

                    <Badge variant="secondary" className="mt-2 font-mono">
                      {student.code}
                    </Badge>
                  </div>

                  <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                    <div>
                      📱{" "}
                      <span className="font-medium">
                        {student.phone || "--"}
                      </span>
                    </div>

                    <div>
                      👨‍👦{" "}
                      <span className="font-medium">
                        {student.parentPhone || "--"}
                      </span>
                    </div>

                    <div>
                      🎓{" "}
                      <span className="font-medium">
                        {student.grade || "--"}
                      </span>
                    </div>

                    <div>
                      🏫{" "}
                      <span className="font-medium">
                        {student.school || "--"}
                      </span>
                    </div>

                    <div className="md:col-span-2">
                      📍{" "}
                      <span className="font-medium">
                        {student.address || "--"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* الأزرار */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setQrStudent(student)}
                  >
                    <QrCode className="mr-2 h-4 w-4" />
                    QR Code
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>حذف الطالب</AlertDialogTitle>

                        <AlertDialogDescription>
                          هل تريد حذف
                          <strong> {student.fullName} </strong>
                          ؟
                          <br />
                          لن تستطيع استرجاع بياناته بعد الحذف.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>إلغاء</AlertDialogCancel>

                        <AlertDialogAction
                          onClick={async () => {
                            try {
                              await api.removeStudent(student.id);
                              toast.success("تم حذف الطالب");
                            } catch (err) {
                              toast.error((err as Error).message);
                            }
                          }}
                        >
                          حذف
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={!!qrStudent} onOpenChange={(o) => !o && setQrStudent(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>كود QR للطالب</DialogTitle>
            <DialogDescription>
              {qrStudent?.fullName} — استخدم هذا الكود في صفحة السكان للحضور أو
              الدفع.
            </DialogDescription>
          </DialogHeader>
          <div
            id="student-qr"
            className="flex flex-col items-center gap-4 py-2"
          >
            {qrStudent && (
              <div className="rounded-xl bg-card p-4 shadow-card">
                <QRCodeCanvas
                  value={qrStudent.code}
                  size={200}
                  level="H"
                  includeMargin
                />
              </div>
            )}
            <Badge variant="secondary" className="font-mono">
              {qrStudent?.code}
            </Badge>
            <Button onClick={downloadQr} className="w-full">
              <Download className="size-4" /> تحميل الكود
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
