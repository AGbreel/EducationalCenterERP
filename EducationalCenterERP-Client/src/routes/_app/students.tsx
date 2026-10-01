import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
  Download,
  Plus,
  QrCode,
  Trash2,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { api, type Student } from "@/lib/data";
import { useDb } from "@/lib/use-db";

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

  // =========================
  // Search / Filter / Pagination
  // =========================

  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // =========================
  // Grades
  // =========================

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

  // =========================
  // Add Student
  // =========================

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.fullName.trim()) {
      toast.error("اكتب اسم الطالب");
      return;
    }

    if (form.fullName.trim().length < 3) {
      toast.error("اسم الطالب غير صحيح");
      return;
    }

    if (form.phone.length !== 11) {
      toast.error("رقم الهاتف غير صحيح");
      return;
    }

    if (form.parentPhone.length !== 11) {
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
        parentPhone: "",
        address: "",
        school: "",
        grade: "",
      });

      setQrStudent(student);

      toast.success(`تم تسجيل ${student.fullName} وإنشاء كود ${student.code}`);

      // نرجع لأول صفحة بعد إضافة طالب
      setCurrentPage(1);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // Download QR
  // =========================

  const downloadQr = () => {
    const canvas =
      document.querySelector<HTMLCanvasElement>("#student-qr canvas");

    if (!canvas || !qrStudent) return;

    const link = document.createElement("a");

    link.href = canvas.toDataURL("image/png");
    link.download = `${qrStudent.code}.png`;
    link.click();
  };

  // =========================
  // Search + Filter
  // =========================

  const filteredStudents = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return db.students.filter((student) => {
      const matchesSearch =
        !searchValue ||
        student.fullName.toLowerCase().includes(searchValue) ||
        student.code.toLowerCase().includes(searchValue) ||
        (student.phone || "").toLowerCase().includes(searchValue) ||
        (student.parentPhone || "").toLowerCase().includes(searchValue);

      const matchesGrade =
        gradeFilter === "all" || student.grade === gradeFilter;

      return matchesSearch && matchesGrade;
    });
  }, [db.students, search, gradeFilter]);

  // =========================
  // Pagination
  // =========================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredStudents.length / itemsPerPage),
  );

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;

    return filteredStudents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredStudents, currentPage]);

  // لو عدد الصفحات قل بسبب البحث أو الفلتر
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // =========================
  // Reset Page When Search/Filter Changes
  // =========================

  useEffect(() => {
    setCurrentPage(1);
  }, [search, gradeFilter]);

  // =========================
  // Debug
  // =========================

  useEffect(() => {
    console.log(db.students);
  }, [db.students]);

  // =========================
  // Clear Filters
  // =========================

  const clearFilters = () => {
    setSearch("");
    setGradeFilter("all");
    setCurrentPage(1);
  };

  const hasFilters = search.trim() !== "" || gradeFilter !== "all";

  // =========================
  // Pagination Numbers
  // =========================

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* =========================
          Header
      ========================= */}

      <header>
        <h1 className="text-3xl font-bold">تسجيل الطلاب</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          كل طالب جديد يحصل تلقائيًا على كود QR خاص به للحضور والدفع.
        </p>
      </header>

      {/* =========================
          Add Student Form
      ========================= */}

      <form
        onSubmit={(e) => void submit(e)}
        className="surface-card grid gap-4 p-5 md:grid-cols-4"
      >
        {/* Name */}

        <div className="space-y-2">
          <Label htmlFor="fullName">اسم الطالب</Label>

          <Input
            id="fullName"
            value={form.fullName}
            onChange={(e) =>
              setForm({
                ...form,
                fullName: e.target.value,
              })
            }
            placeholder="مثال: أحمد كريم"
            required
          />
        </div>

        {/* Phone */}

        <div className="space-y-2">
          <Label htmlFor="phone">رقم الهاتف</Label>

          <Input
            id="phone"
            value={form.phone}
            onChange={(e) =>
              setForm({
                ...form,
                phone: e.target.value,
              })
            }
            placeholder="01xxxxxxxxx"
            maxLength={11}
          />
        </div>

        {/* Parent Phone */}

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
            maxLength={11}
          />
        </div>

        {/* School */}

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

        {/* Address */}

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

        {/* Grade */}

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

        {/* Submit */}

        <div className="flex items-end">
          <Button type="submit" className="w-full" size="lg" disabled={saving}>
            <Plus className="size-4" />

            {saving ? "جاري الحفظ..." : "إضافة الطالب"}
          </Button>
        </div>
      </form>

      {/* =========================
          Search & Filters
      ========================= */}

      <div className="surface-card rounded-xl border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">بحث وتصفية الطلاب</h2>

            <p className="text-sm text-muted-foreground">
              ابحث بالاسم أو الكود أو رقم الهاتف.
            </p>
          </div>

          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              type="button"
            >
              <X className="size-4" />
              مسح الفلاتر
            </Button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Search */}

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="student-search">بحث</Label>

            <div className="relative">
              <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="student-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث باسم الطالب أو الكود أو رقم الهاتف..."
                className="pr-10"
              />
            </div>
          </div>

          {/* Grade Filter */}

          <div className="space-y-2">
            <Label>الصف الدراسي</Label>

            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="كل الصفوف" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">كل الصفوف</SelectItem>

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
        </div>

        {/* Results Count */}

        <div className="mt-4 flex items-center justify-between border-t pt-4 text-sm text-muted-foreground">
          <span>
            إجمالي الطلاب:{" "}
            <span className="font-bold text-foreground">
              {db.students.length}
            </span>
          </span>

          <span>
            النتائج:{" "}
            <span className="font-bold text-foreground">
              {filteredStudents.length}
            </span>
          </span>
        </div>
      </div>

      {/* =========================
          Students List
      ========================= */}

      <div className="space-y-4">
        {paginatedStudents.length === 0 ? (
          <div className="surface-card rounded-xl border bg-card p-10 text-center">
            <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-muted">
              <Search className="size-6 text-muted-foreground" />
            </div>

            <h3 className="font-bold">لا توجد نتائج</h3>

            <p className="mt-1 text-sm text-muted-foreground">
              لم يتم العثور على طلاب مطابقين للبحث أو الفلتر.
            </p>

            {hasFilters && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={clearFilters}
                type="button"
              >
                مسح الفلاتر
              </Button>
            )}
          </div>
        ) : (
          paginatedStudents.map((student) => {
            return (
              <div
                key={student.id}
                className="surface-card rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  {/* Student Data */}

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

                  {/* Buttons */}

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
          })
        )}
      </div>

      {/* =========================
          Pagination
      ========================= */}

      {filteredStudents.length > itemsPerPage && (
        <div className="flex flex-col items-center justify-between gap-4 rounded-xl border bg-card p-4 sm:flex-row">
          {/* Results Info */}

          <div className="text-sm text-muted-foreground">
            عرض{" "}
            <span className="font-semibold text-foreground">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            إلى{" "}
            <span className="font-semibold text-foreground">
              {Math.min(currentPage * itemsPerPage, filteredStudents.length)}
            </span>{" "}
            من{" "}
            <span className="font-semibold text-foreground">
              {filteredStudents.length}
            </span>{" "}
            طالب
          </div>

          {/* Pagination Buttons */}

          <div className="flex items-center gap-1">
            {/* Previous */}

            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              type="button"
            >
              <ChevronRight className="size-4" />
            </Button>

            {/* Pages */}

            {getPageNumbers().map((page, index) => {
              if (page === "...") {
                return (
                  <span
                    key={`dots-${index}`}
                    className="flex size-9 items-center justify-center text-muted-foreground"
                  >
                    ...
                  </span>
                );
              }

              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="icon"
                  onClick={() => setCurrentPage(page as number)}
                  type="button"
                >
                  {page}
                </Button>
              );
            })}

            {/* Next */}

            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              type="button"
            >
              <ChevronLeft className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* =========================
          QR Dialog
      ========================= */}

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
              <Download className="size-4" />
              تحميل الكود
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
