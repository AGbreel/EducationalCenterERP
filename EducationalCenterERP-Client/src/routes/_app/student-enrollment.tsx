import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { api } from "@/lib/data";
import { useDb } from "@/lib/use-db";

export const Route = createFileRoute("/_app/student-enrollment")({
  head: () => ({
    meta: [
      {
        title: "تسجيل الطلاب داخل المجموعات | منصة السنتر",
      },
      {
        name: "description",
        content: "ربط الطلاب بالمجموعات وتحديد قيمة الاشتراك الشهري.",
      },
    ],
  }),
  component: StudentEnrollmentPage,
});

function StudentEnrollmentPage() {
  const db = useDb();

  const [form, setForm] = useState({
    studentId: "",
    courseClassId: "",
    monthlyFee: "",
  });

  const [saving, setSaving] = useState(false);

  // =========================
  // Filters & Pagination
  // =========================

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [pageSize, setPageSize] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);

  // =========================
  // Create Enrollment
  // =========================

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.studentId || !form.courseClassId || !form.monthlyFee) {
      toast.error("أكمل جميع البيانات");
      return;
    }

    try {
      setSaving(true);

      await api.enrollStudent(
        form.studentId,
        form.courseClassId,
        Number(form.monthlyFee),
      );

      toast.success("تم تسجيل الطالب داخل المجموعة");

      setForm({
        studentId: "",
        courseClassId: "",
        monthlyFee: "",
      });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // Prepare Enrollment Data
  // =========================

  const enrollmentData = useMemo(() => {
    return db.enrollments.map((enrollment) => {
      const student = db.students.find((s) => s.id === enrollment.studentId);

      const courseClass = db.courseClasses.find(
        (c) => c.id === enrollment.courseClassId,
      );

      return {
        enrollment,
        student,
        courseClass,
      };
    });
  }, [db.enrollments, db.students, db.courseClasses]);

  // =========================
  // Filter
  // =========================

  const filteredEnrollments = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return enrollmentData.filter(({ student, courseClass }) => {
      const studentName = student?.fullName?.toLowerCase() ?? "";

      const className = courseClass?.name?.toLowerCase() ?? "";

      const teacherName = courseClass?.teacher?.toLowerCase() ?? "";

      const subjectName = courseClass?.subject?.toLowerCase() ?? "";

      const hall = courseClass?.hall?.toLowerCase() ?? "";

      const matchesSearch =
        !searchValue ||
        studentName.includes(searchValue) ||
        className.includes(searchValue) ||
        teacherName.includes(searchValue) ||
        subjectName.includes(searchValue) ||
        hall.includes(searchValue);

      const matchesClass =
        classFilter === "all" || courseClass?.id === classFilter;

      return matchesSearch && matchesClass;
    });
  }, [enrollmentData, search, classFilter]);

  // =========================
  // Pagination
  // =========================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEnrollments.length / Number(pageSize)),
  );

  const paginatedEnrollments = useMemo(() => {
    const startIndex = (currentPage - 1) * Number(pageSize);

    const endIndex = startIndex + Number(pageSize);

    return filteredEnrollments.slice(startIndex, endIndex);
  }, [filteredEnrollments, currentPage, pageSize]);

  // لو عدد الصفحات قل بسبب الفلتر
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Reset pagination عند تغيير الفلاتر
  useEffect(() => {
    setCurrentPage(1);
  }, [search, classFilter, pageSize]);

  // =========================
  // Clear Filters
  // =========================

  const clearFilters = () => {
    setSearch("");
    setClassFilter("all");
    setPageSize("10");
    setCurrentPage(1);
  };

  const hasFilters =
    search.trim() !== "" || classFilter !== "all" || pageSize !== "10";

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

  return (
    <div className="space-y-8">
      {/* =========================
          Header
      ========================= */}

      <header>
        <h1 className="text-3xl font-bold">تسجيل الطلاب داخل المجموعات</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          اربط الطالب بالمجموعة وحدد قيمة الاشتراك الشهري.
        </p>
      </header>

      {/* =========================
          Add Enrollment
      ========================= */}

      <form
        onSubmit={(e) => void submit(e)}
        className="surface-card grid gap-4 p-5 md:grid-cols-4"
      >
        <div className="space-y-2">
          <Label>الطالب</Label>

          <select
            className="h-10 w-full rounded-md border bg-background px-3"
            value={form.studentId}
            onChange={(e) =>
              setForm({
                ...form,
                studentId: e.target.value,
              })
            }
          >
            <option value="">اختر الطالب</option>

            {db.students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.fullName}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label>المجموعة</Label>

          <select
            className="h-10 w-full rounded-md border bg-background px-3"
            value={form.courseClassId}
            onChange={(e) =>
              setForm({
                ...form,
                courseClassId: e.target.value,
              })
            }
          >
            <option value="">اختر المجموعة</option>

            {db.courseClasses.map((courseClass) => (
              <option key={courseClass.id} value={courseClass.id}>
                {courseClass.name} - {courseClass.teacher}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label>الاشتراك الشهري</Label>

          <Input
            type="number"
            min="0"
            placeholder="300"
            value={form.monthlyFee}
            onChange={(e) =>
              setForm({
                ...form,
                monthlyFee: e.target.value,
              })
            }
          />
        </div>

        <div className="flex items-end">
          <Button className="w-full" size="lg" type="submit" disabled={saving}>
            <Plus className="size-4" />

            {saving ? "جاري التسجيل..." : "تسجيل الطالب"}
          </Button>
        </div>
      </form>

      {/* =========================
          Filters
      ========================= */}

      <div className="surface-card space-y-4 p-5">
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Search */}
          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="enrollment-search">بحث</Label>

            <div className="relative">
              <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="enrollment-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث باسم الطالب أو المجموعة أو المدرس أو المادة..."
                className="pr-9"
              />
            </div>
          </div>

          {/* Class Filter */}
          <div className="space-y-2">
            <Label>فلترة حسب المجموعة</Label>

            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger>
                <SelectValue placeholder="كل المجموعات" />
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
        </div>

        {/* Bottom Filters */}
        <div className="flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-wrap items-end gap-3">
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

          {/* Result Count */}
          <div className="text-sm text-muted-foreground">
            إجمالي التسجيلات:{" "}
            <span className="font-semibold text-foreground">
              {filteredEnrollments.length}
            </span>
            {filteredEnrollments.length > 0 && (
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
                    filteredEnrollments.length,
                  )}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* =========================
          Enrollments
      ========================= */}

      {paginatedEnrollments.length > 0 ? (
        <div className="space-y-4">
          {paginatedEnrollments.map(({ enrollment, student, courseClass }) => (
            <div key={enrollment.id} className="surface-card space-y-4 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-bold">
                    {student?.fullName ?? "طالب غير موجود"}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {courseClass?.name ?? "مجموعة غير موجود"}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {courseClass?.subject}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge>{courseClass?.teacher ?? "بدون مدرس"}</Badge>

                    <Badge variant="secondary">{courseClass?.day}</Badge>

                    <Badge variant="outline">
                      {courseClass?.startTime} - {courseClass?.endTime}
                    </Badge>

                    <Badge variant="outline">
                      {courseClass?.hall || "بدون قاعة"}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <Badge className="text-base">
                    {enrollment.monthlyFee} ج.م
                  </Badge>

                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="حذف"
                    onClick={() => {
                      api
                        .unenroll(enrollment.id)
                        .then(() => toast.success("تم إلغاء تسجيل الطالب"))
                        .catch((err: Error) => toast.error(err.message));
                    }}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="surface-card p-10 text-center">
          <p className="font-semibold">لا توجد تسجيلات</p>

          <p className="mt-1 text-sm text-muted-foreground">
            {search || classFilter !== "all"
              ? "لا توجد تسجيلات مطابقة للفلاتر الحالية."
              : "لا يوجد أي طالب مسجل داخل المجموعات حتى الآن."}
          </p>

          {(search || classFilter !== "all") && (
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              مسح الفلاتر
            </Button>
          )}
        </div>
      )}

      {/* =========================
          Pagination
      ========================= */}

      {filteredEnrollments.length > 0 && totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {/* Previous */}
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            aria-label="الصفحة السابقة"
          >
            <ChevronRight className="size-4" />
          </Button>

          {/* Page Numbers */}
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

          {/* Next */}
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
    </div>
  );
}
