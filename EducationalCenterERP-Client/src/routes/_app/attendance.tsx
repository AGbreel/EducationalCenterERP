import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { api, type Attendance, type StudentAttendanceLookup } from "@/lib/data";

import { useDb } from "@/lib/use-db";

export const Route = createFileRoute("/_app/attendance")({
  head: () => ({
    meta: [
      {
        title: "تسجيل الحضور | منصة السنتر",
      },
      {
        name: "description",
        content: "تسجيل حضور الطلاب بواسطة QR Code أو كود الطالب.",
      },
      {
        property: "og:title",
        content: "تسجيل الحضور",
      },
      {
        property: "og:description",
        content: "إدارة حضور الطلاب داخل المجموعات.",
      },
    ],
  }),
  component: AttendancePage,
});

function AttendancePage() {
  const db = useDb();

  // =========================
  // Student Search
  // =========================

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  const [student, setStudent] = useState<StudentAttendanceLookup | null>(null);

  const [selectedClass, setSelectedClass] = useState("");

  const [attendance, setAttendance] = useState<Attendance[]>([]);

  const [markingAttendance, setMarkingAttendance] = useState(false);

  // =========================
  // Attendance Filters
  // =========================

  const [attendanceSearch, setAttendanceSearch] = useState("");

  const [classFilter, setClassFilter] = useState("all");

  const [dateFilter, setDateFilter] = useState("all");

  const [statusFilter, setStatusFilter] = useState("all");

  // =========================
  // Pagination
  // =========================

  const [pageSize, setPageSize] = useState("10");

  const [currentPage, setCurrentPage] = useState(1);

  // =========================
  // Delete Dialog
  // =========================

  const [deleteAttendance, setDeleteAttendance] = useState<Attendance | null>(
    null,
  );

  const [deleting, setDeleting] = useState(false);

  // =========================
  // Load Attendance
  // =========================

  const loadAttendance = async () => {
    try {
      const rows = await api.getAttendance();

      setAttendance(rows);
    } catch {
      toast.error("تعذر تحميل سجل الحضور");
    }
  };

  useEffect(() => {
    void loadAttendance();
  }, []);

  // =========================
  // Search Student
  // =========================

  const searchStudent = async () => {
    const value = search.trim();

    if (!value) {
      toast.error("اكتب كود الطالب أو QR");
      return;
    }

    setLoading(true);

    try {
      let result = await api.getStudentClassesByCode(value);

      if (!result) {
        result = await api.getStudentClassesByQr(value);
      }

      if (!result) {
        toast.error("لم يتم العثور على الطالب");

        setStudent(null);
        setSelectedClass("");

        return;
      }

      setStudent(result);

      const firstClass = result.classes[0];

      if (firstClass) {
        setSelectedClass(firstClass.courseClassId);
      } else {
        setSelectedClass("");
        toast.warning("الطالب موجود لكنه غير مسجل في أي مجموعة");
      }

      toast.success(`تم العثور على ${result.studentName}`);
    } catch (err) {
      toast.error((err as Error).message || "حدث خطأ أثناء البحث");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Mark Attendance
  // =========================

  const markAttendance = async () => {
    if (!student) {
      toast.error("ابحث عن الطالب أولاً");
      return;
    }

    if (student.classes.length === 0) {
      toast.error("الطالب غير مسجل في أي مجموعة");
      return;
    }

    if (!selectedClass) {
      toast.error("اختر المجموعة أولاً");
      return;
    }

    try {
      setMarkingAttendance(true);

      await api.markAttendance(student.studentId, selectedClass);

      toast.success("تم تسجيل الحضور بنجاح");

      await loadAttendance();

      // تنظيف بيانات البحث مباشرة
      setStudent(null);
      setSearch("");
      setSelectedClass("");
    } catch (err) {
      toast.error((err as Error).message || "تعذر تسجيل الحضور");
    } finally {
      setMarkingAttendance(false);
    }
  };

  // =========================
  // Attendance Display Data
  // =========================

  const attendanceData = useMemo(() => {
    return attendance.map((row) => {
      const student = db.students.find((x) => x.id === row.studentId);

      const courseClass = db.courseClasses.find(
        (x) => x.id === row.courseClassId,
      );

      return {
        row,
        student,
        courseClass,
      };
    });
  }, [attendance, db.students, db.courseClasses]);

  // =========================
  // Date Helpers
  // =========================

  const startOfDay = (date: Date) => {
    const result = new Date(date);

    result.setHours(0, 0, 0, 0);

    return result;
  };

  const today = startOfDay(new Date());

  const matchesDateFilter = (attendanceDate: string) => {
    if (dateFilter === "all") {
      return true;
    }

    const date = startOfDay(new Date(attendanceDate));

    if (dateFilter === "today") {
      return date.getTime() === today.getTime();
    }

    if (dateFilter === "7days") {
      const start = new Date(today);

      start.setDate(start.getDate() - 6);

      return date >= start && date <= today;
    }

    if (dateFilter === "30days") {
      const start = new Date(today);

      start.setDate(start.getDate() - 29);

      return date >= start && date <= today;
    }

    return true;
  };

  // =========================
  // Filter Attendance
  // =========================

  const filteredAttendance = useMemo(() => {
    const searchValue = attendanceSearch.trim().toLowerCase();

    return attendanceData.filter(({ row, student, courseClass }) => {
      const studentName = student?.fullName?.toLowerCase() ?? "";

      const className = courseClass?.name?.toLowerCase() ?? "";

      const teacherName = courseClass?.teacher?.toLowerCase() ?? "";

      const matchesSearch =
        !searchValue ||
        studentName.includes(searchValue) ||
        className.includes(searchValue) ||
        teacherName.includes(searchValue) ||
        row.studentId.toLowerCase().includes(searchValue);

      const matchesClass =
        classFilter === "all" || row.courseClassId === classFilter;

      const matchesStatus =
        statusFilter === "all" || row.status === statusFilter;

      const matchesDate = matchesDateFilter(row.attendanceDate);

      return matchesSearch && matchesClass && matchesStatus && matchesDate;
    });
  }, [attendanceData, attendanceSearch, classFilter, statusFilter, dateFilter]);

  // =========================
  // Pagination
  // =========================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAttendance.length / Number(pageSize)),
  );

  const paginatedAttendance = useMemo(() => {
    const start = (currentPage - 1) * Number(pageSize);

    const end = start + Number(pageSize);

    return filteredAttendance.slice(start, end);
  }, [filteredAttendance, currentPage, pageSize]);

  // لو الفلاتر قللت عدد الصفحات
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Reset pagination
  useEffect(() => {
    setCurrentPage(1);
  }, [attendanceSearch, classFilter, dateFilter, statusFilter, pageSize]);

  // =========================
  // Clear Filters
  // =========================

  const clearFilters = () => {
    setAttendanceSearch("");
    setClassFilter("all");
    setDateFilter("all");
    setStatusFilter("all");
    setPageSize("10");
    setCurrentPage(1);
  };

  const hasFilters =
    attendanceSearch.trim() !== "" ||
    classFilter !== "all" ||
    dateFilter !== "all" ||
    statusFilter !== "all" ||
    pageSize !== "10";

  // =========================
  // Pagination Numbers
  // =========================

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    }

    pages.push(1);

    if (currentPage > 4) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);

    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 3) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  // =========================
  // Delete Attendance
  // =========================

  const confirmDeleteAttendance = async () => {
    if (!deleteAttendance) {
      return;
    }

    try {
      setDeleting(true);

      await api.deleteAttendance(deleteAttendance.id);

      toast.success("تم حذف سجل الحضور");

      setDeleteAttendance(null);

      await loadAttendance();
    } catch (err) {
      toast.error((err as Error).message || "تعذر حذف سجل الحضور");
    } finally {
      setDeleting(false);
    }
  };

  // =========================
  // Statistics
  // =========================

  const todayAttendance = attendance.filter(
    (x) => startOfDay(new Date(x.attendanceDate)).getTime() === today.getTime(),
  ).length;

  const filteredTodayAttendance = filteredAttendance.filter(
    ({ row }) =>
      startOfDay(new Date(row.attendanceDate)).getTime() === today.getTime(),
  ).length;

  const uniqueStudentsToday = new Set(
    attendance
      .filter(
        (x) =>
          startOfDay(new Date(x.attendanceDate)).getTime() === today.getTime(),
      )
      .map((x) => x.studentId),
  ).size;

  return (
    <div className="space-y-8">
      {/* =========================
          Header
      ========================= */}

      <header>
        <h1 className="text-3xl font-bold">تسجيل الحضور</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          ابحث بكود الطالب أو امسح QR ثم اختر المجموعة وسجل الحضور.
        </p>
      </header>

      {/* =========================
          Statistics
      ========================= */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="surface-card rounded-xl p-5">
          <p className="text-sm text-muted-foreground">إجمالي الحضور</p>

          <p className="mt-2 text-3xl font-bold">{attendance.length}</p>
        </div>

        <div className="surface-card rounded-xl p-5">
          <p className="text-sm text-muted-foreground">حضور اليوم</p>

          <p className="mt-2 text-3xl font-bold">{todayAttendance}</p>
        </div>

        <div className="surface-card rounded-xl p-5">
          <p className="text-sm text-muted-foreground">طلاب حضروا اليوم</p>

          <p className="mt-2 text-3xl font-bold">{uniqueStudentsToday}</p>
        </div>

        <div className="surface-card rounded-xl p-5">
          <p className="text-sm text-muted-foreground">المجموعات</p>

          <p className="mt-2 text-3xl font-bold">{db.courseClasses.length}</p>
        </div>
      </div>

      {/* =========================
          Search Student
      ========================= */}

      <Card className="surface-card">
        <CardHeader>
          <CardTitle>البحث عن الطالب</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 md:grid-cols-[1fr_auto]">
          <div className="space-y-2">
            <Label>كود الطالب أو QR</Label>

            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ST-xxxxxxxx أو QR Value"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();

                  void searchStudent();
                }
              }}
            />
          </div>

          <div className="flex items-end gap-2">
            <Button
              className="min-w-32"
              onClick={() => void searchStudent()}
              disabled={loading}
            >
              <Search className="size-4" />

              {loading ? "جاري البحث..." : "بحث"}
            </Button>

            <Link to="/scan">
              <Button
                variant="outline"
                type="button"
                // disabled
                title="سيتم تفعيل قارئ QR لاحقًا"
              >
                <Camera className="size-4" />
                QR Scanner
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* =========================
          Student Result
      ========================= */}

      {student && (
        <Card className="surface-card">
          <CardHeader>
            <CardTitle>بيانات الطالب</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">{student.studentName}</h2>

                <p className="mt-1 text-sm text-muted-foreground">كود الطالب</p>

                <Badge variant="secondary" className="mt-2 font-mono">
                  {student.studentCode}
                </Badge>
              </div>

              <Badge>{student.classes.length} مجموعة</Badge>
            </div>

            {student.classes.length === 0 ? (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 text-center">
                <p className="font-semibold text-destructive">
                  الطالب غير مسجل في أي مجموعة
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  قم بتسجيل الطالب داخل مجموعة أولاً حتى تستطيع تسجيل الحضور.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <Label>اختر المجموعة</Label>

                  <RadioGroup
                    value={selectedClass}
                    onValueChange={setSelectedClass}
                    className="grid gap-3"
                  >
                    {student.classes.map((c) => (
                      <label
                        key={c.courseClassId}
                        htmlFor={c.courseClassId}
                        className="flex cursor-pointer items-center justify-between rounded-xl border p-4 transition hover:bg-muted/40"
                      >
                        <div>
                          <p className="font-bold">{c.className}</p>

                          <p className="text-sm text-muted-foreground">
                            {c.subject}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {c.teacher}
                          </p>
                        </div>

                        <RadioGroupItem
                          id={c.courseClassId}
                          value={c.courseClassId}
                        />
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => void markAttendance()}
                  disabled={markingAttendance || !selectedClass}
                >
                  <CheckCircle2 className="size-4" />

                  {markingAttendance ? "جاري تسجيل الحضور..." : "تسجيل الحضور"}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* =========================
          Attendance Log
      ========================= */}

      <Card className="surface-card">
        <CardHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>سجل الحضور</CardTitle>

            <Badge variant="secondary">{filteredAttendance.length} سجل</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Filters */}
          <div className="rounded-xl border p-4">
            <div className="grid gap-4 lg:grid-cols-4">
              {/* Search */}
              <div className="space-y-2 lg:col-span-2">
                <Label>بحث في سجل الحضور</Label>

                <div className="relative">
                  <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    value={attendanceSearch}
                    onChange={(e) => setAttendanceSearch(e.target.value)}
                    placeholder="اسم الطالب أو المجموعة أو المدرس..."
                    className="pr-9"
                  />
                </div>
              </div>

              {/* Class */}
              <div className="space-y-2">
                <Label>المجموعة</Label>

                <Select value={classFilter} onValueChange={setClassFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all">كل المجموعات</SelectItem>

                    {db.courseClasses.map((courseClass) => (
                      <SelectItem key={courseClass.id} value={courseClass.id}>
                        {courseClass.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label>الفترة</Label>

                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all">كل الفترات</SelectItem>

                    <SelectItem value="today">اليوم</SelectItem>

                    <SelectItem value="7days">آخر 7 أيام</SelectItem>

                    <SelectItem value="30days">آخر 30 يوم</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-wrap items-end gap-3">
                {/* Status */}
                <div className="space-y-2">
                  <Label>الحالة</Label>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="all">كل الحالات</SelectItem>

                      <SelectItem value="Present">حاضر</SelectItem>

                      <SelectItem value="Absent">غائب</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Page Size */}
                <div className="space-y-2">
                  <Label>عدد النتائج</Label>

                  <Select value={pageSize} onValueChange={setPageSize}>
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="5">5 نتائج</SelectItem>

                      <SelectItem value="10">10 نتائج</SelectItem>

                      <SelectItem value="20">20 نتيجة</SelectItem>

                      <SelectItem value="50">50 نتيجة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {hasFilters && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearFilters}
                    className="gap-2"
                  >
                    <X className="size-4" />
                    مسح الفلاتر
                  </Button>
                )}
              </div>

              <div className="text-sm text-muted-foreground">
                إجمالي النتائج:{" "}
                <span className="font-semibold text-foreground">
                  {filteredAttendance.length}
                </span>
                {filteredAttendance.length > 0 && (
                  <>
                    {" "}
                    — عرض{" "}
                    <span className="font-semibold text-foreground">
                      {(currentPage - 1) * Number(pageSize) + 1}
                    </span>{" "}
                    إلى{" "}
                    <span className="font-semibold text-foreground">
                      {Math.min(
                        currentPage * Number(pageSize),
                        filteredAttendance.length,
                      )}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Table */}
          {paginatedAttendance.length === 0 ? (
            <div className="py-10 text-center">
              <Search className="mx-auto mb-3 size-10 text-muted-foreground" />

              <p className="font-semibold">لا توجد نتائج</p>

              <p className="mt-1 text-sm text-muted-foreground">
                {hasFilters
                  ? "لا يوجد حضور مطابق للفلاتر الحالية."
                  : "لا يوجد حضور مسجل حتى الآن."}
              </p>

              {hasFilters && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={clearFilters}
                >
                  مسح الفلاتر
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full min-w-175 text-sm">
                <thead className="border-b bg-muted/30">
                  <tr className="text-right">
                    <th className="p-3">الطالب</th>

                    <th className="p-3">المجموعة</th>

                    <th className="p-3">المدرس</th>

                    <th className="p-3">التاريخ</th>

                    <th className="p-3">الحالة</th>

                    <th className="w-20 p-3">حذف</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedAttendance.map(({ row, student, courseClass }) => (
                    <tr
                      key={row.id}
                      className="border-b last:border-0 transition hover:bg-muted/40"
                    >
                      <td className="p-3 font-medium">
                        {student?.fullName ?? row.studentId}
                      </td>

                      <td className="p-3">
                        {courseClass?.name ?? row.courseClassId}
                      </td>

                      <td className="p-3">{courseClass?.teacher ?? "-"}</td>

                      <td className="p-3 whitespace-nowrap">
                        {new Date(row.attendanceDate).toLocaleString("ar-EG", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>

                      <td className="p-3">
                        <Badge>{row.status}</Badge>
                      </td>

                      <td className="p-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteAttendance(row)}
                          aria-label="حذف الحضور"
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {filteredAttendance.length > 0 && totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                aria-label="الصفحة السابقة"
              >
                <ChevronRight className="size-4" />
              </Button>

              {getPageNumbers().map((page, index) =>
                page === "..." ? (
                  <span
                    key={`dots-${index}`}
                    className="px-2 text-muted-foreground"
                  >
                    ...
                  </span>
                ) : (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ),
              )}

              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                aria-label="الصفحة التالية"
              >
                <ChevronLeft className="size-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* =========================
          Delete Confirmation
      ========================= */}

      <AlertDialog
        open={!!deleteAttendance}
        onOpenChange={(open) => {
          if (!open && !deleting) {
            setDeleteAttendance(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف سجل الحضور؟</AlertDialogTitle>

            <AlertDialogDescription>
              سيتم حذف سجل الحضور هذا نهائيًا. هل أنت متأكد من الاستمرار؟
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>إلغاء</AlertDialogCancel>

            <AlertDialogAction
              disabled={deleting}
              onClick={(e) => {
                e.preventDefault();

                void confirmDeleteAttendance();
              }}
            >
              {deleting ? "جاري الحذف..." : "حذف الحضور"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
