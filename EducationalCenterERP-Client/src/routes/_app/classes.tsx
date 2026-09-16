import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/data";
import { useDb } from "@/lib/use-db";

export const Route = createFileRoute("/_app/classes")({
  head: () => ({
    meta: [
      { title: "إدارة المجموعات | منصة السنتر" },
      {
        name: "description",
        content:
          "إنشاء وإدارة المجموعات وربطها بالمادة والمدرس وتحديد المواعيد والقاعة.",
      },
      {
        property: "og:title",
        content: "إدارة المجموعات",
      },
      {
        property: "og:description",
        content: "إنشاء المجموعات وتحديد المادة والمدرس ومواعيد الدراسة.",
      },
    ],
  }),
  component: ClassesPage,
});

function ClassesPage() {
  const db = useDb();

  const emptyForm = {
    name: "",
    subjectId: "",
    teacherId: "",
    day: "Saturday",
    startTime: "",
    endTime: "",
    hall: "",
    maxStudents: 20,
  };

  const [form, setForm] = useState(emptyForm);

  const [editingClassId, setEditingClassId] = useState<string | null>(null);

  const [loadingEdit, setLoadingEdit] = useState(false);

  // =========================
  // Filters & Pagination
  // =========================

  const [search, setSearch] = useState("");
  const [dayFilter, setDayFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [pageSize, setPageSize] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);

  // =========================
  // Filter Classes
  // =========================

  const filteredClasses = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return db.courseClasses.filter((c) => {
      const matchesSearch =
        !searchValue ||
        (c.name ?? "").toLowerCase().includes(searchValue) ||
        (c.subject ?? "").toLowerCase().includes(searchValue) ||
        (c.teacher ?? "").toLowerCase().includes(searchValue) ||
        (c.hall ?? "").toLowerCase().includes(searchValue);

      const matchesDay = dayFilter === "all" || c.day === dayFilter;

      const currentStudents = c.currentStudents ?? 0;
      const maxStudents = c.maxStudents ?? 0;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "available" && currentStudents < maxStudents) ||
        (statusFilter === "full" && currentStudents >= maxStudents);

      return matchesSearch && matchesDay && matchesStatus;
    });
  }, [db.courseClasses, search, dayFilter, statusFilter]);

  // =========================
  // Pagination
  // =========================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredClasses.length / Number(pageSize)),
  );

  const paginatedClasses = useMemo(() => {
    const startIndex = (currentPage - 1) * Number(pageSize);

    const endIndex = startIndex + Number(pageSize);

    return filteredClasses.slice(startIndex, endIndex);
  }, [filteredClasses, currentPage, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, dayFilter, statusFilter, pageSize]);

  // =========================
  // Clear Filters
  // =========================

  const clearFilters = () => {
    setSearch("");
    setDayFilter("all");
    setStatusFilter("all");
    setPageSize("10");
    setCurrentPage(1);
  };

  const hasFilters =
    search.trim() !== "" ||
    dayFilter !== "all" ||
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
  // Time Helper
  // =========================

  function formatTimeForInput(value: string | null | undefined) {
    if (!value) return "";

    return value.substring(0, 5);
  }

  // =========================
  // Add / Edit
  // =========================

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    try {
      if (editingClassId) {
        await api.updateClass(editingClassId, form);

        toast.success("تم تعديل المجموعة بنجاح");
      } else {
        await api.addClass(form);

        toast.success("تم إنشاء المجموعة بنجاح");
      }

      setForm(emptyForm);
      setEditingClassId(null);
    } catch (err: any) {
      toast.error(err?.message || "حدث خطأ أثناء حفظ المجموعة");
    }
  }

  // =========================
  // Edit Class
  // =========================

  async function handleEditClass(id: string) {
    try {
      setLoadingEdit(true);

      const classData = await api.getClassById(id);

      setForm({
        name: classData.name,
        subjectId: classData.subjectId ?? "",
        teacherId: classData.teacherId ?? "",
        day: classData.day,
        startTime: formatTimeForInput(classData.startTime),
        endTime: formatTimeForInput(classData.endTime),
        hall: classData.hall,
        maxStudents: classData.maxStudents,
      });

      // مهم جدًا: تحديد إننا في وضع التعديل
      setEditingClassId(id);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err: any) {
      toast.error(err?.message || "تعذر تحميل بيانات المجموعة");
    } finally {
      setLoadingEdit(false);
    }
  }

  // =========================
  // Cancel Edit
  // =========================

  function cancelEdit() {
    setEditingClassId(null);
    setForm(emptyForm);
  }

  // =========================
  // Delete
  // =========================

  async function handleDeleteClass(id: string) {
    try {
      await api.removeClass(id);

      toast.success("تم حذف المجموعة");
    } catch (err: any) {
      toast.error(err?.message || "حدث خطأ أثناء حذف المجموعة");
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}

      <header>
        <h1 className="text-3xl font-bold">إدارة المجموعات</h1>

        <p className="text-muted-foreground">إنشاء وإدارة مجموعة لكل مادة.</p>
      </header>

      {/* Add / Edit Form */}

      <form
        onSubmit={submit}
        className="surface-card grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-4"
      >
        {/* Name */}

        <div className="space-y-2">
          <Label>اسم المجموعة</Label>

          <Input
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            placeholder="مثال: رياضيات أولى ثانوي"
            required
          />
        </div>

        {/* Subject */}

        <div className="space-y-2">
          <Label>المادة</Label>

          <Select
            value={form.subjectId}
            onValueChange={(v) =>
              setForm({
                ...form,
                subjectId: v,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر المادة" />
            </SelectTrigger>

            <SelectContent>
              {db.subjects.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Teacher */}

        <div className="space-y-2">
          <Label>المدرس</Label>

          <Select
            value={form.teacherId}
            onValueChange={(v) =>
              setForm({
                ...form,
                teacherId: v,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر المدرس" />
            </SelectTrigger>

            <SelectContent>
              {db.teachers.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Day */}

        <div className="space-y-2">
          <Label>اليوم</Label>

          <Select
            value={form.day}
            onValueChange={(v) =>
              setForm({
                ...form,
                day: v,
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="Saturday">السبت</SelectItem>

              <SelectItem value="Sunday">الأحد</SelectItem>

              <SelectItem value="Monday">الإثنين</SelectItem>

              <SelectItem value="Tuesday">الثلاثاء</SelectItem>

              <SelectItem value="Wednesday">الأربعاء</SelectItem>

              <SelectItem value="Thursday">الخميس</SelectItem>

              <SelectItem value="Friday">الجمعة</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Start */}

        <div className="space-y-2">
          <Label>بداية</Label>

          <Input
            type="time"
            value={form.startTime}
            onChange={(e) =>
              setForm({
                ...form,
                startTime: e.target.value,
              })
            }
            required
          />
        </div>

        {/* End */}

        <div className="space-y-2">
          <Label>نهاية</Label>

          <Input
            type="time"
            value={form.endTime}
            onChange={(e) =>
              setForm({
                ...form,
                endTime: e.target.value,
              })
            }
            required
          />
        </div>

        {/* Hall */}

        <div className="space-y-2">
          <Label>القاعة</Label>

          <Input
            value={form.hall}
            onChange={(e) =>
              setForm({
                ...form,
                hall: e.target.value,
              })
            }
            placeholder="قاعة 1"
          />
        </div>

        {/* Max Students */}

        <div className="space-y-2">
          <Label>الحد الأقصى</Label>

          <Input
            type="number"
            min="1"
            value={form.maxStudents}
            onChange={(e) =>
              setForm({
                ...form,
                maxStudents: Number(e.target.value),
              })
            }
          />
        </div>

        {/* Buttons */}

        <div className="flex gap-2 md:col-span-2 xl:col-span-4">
          <Button className="flex-1" type="submit" disabled={loadingEdit}>
            {editingClassId ? (
              <>
                <Pencil className="mr-2 h-4 w-4" />
                حفظ التعديلات
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                إنشاء المجموعة
              </>
            )}
          </Button>

          {editingClassId && (
            <Button
              type="button"
              variant="outline"
              onClick={cancelEdit}
              disabled={loadingEdit}
            >
              <X className="mr-2 h-4 w-4" />
              إلغاء
            </Button>
          )}
        </div>
      </form>

      {/* Filters */}

      <div className="surface-card space-y-4 p-5">
        <div className="grid gap-4 lg:grid-cols-4">
          {/* Search */}

          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="class-search">بحث</Label>

            <div className="relative">
              <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="class-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث باسم المجموعة أو المادة أو المدرس أو القاعة..."
                className="pr-9"
              />
            </div>
          </div>

          {/* Day */}

          <div className="space-y-2">
            <Label>اليوم</Label>

            <Select value={dayFilter} onValueChange={setDayFilter}>
              <SelectTrigger>
                <SelectValue placeholder="كل الأيام" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">كل الأيام</SelectItem>

                <SelectItem value="Saturday">السبت</SelectItem>

                <SelectItem value="Sunday">الأحد</SelectItem>

                <SelectItem value="Monday">الإثنين</SelectItem>

                <SelectItem value="Tuesday">الثلاثاء</SelectItem>

                <SelectItem value="Wednesday">الأربعاء</SelectItem>

                <SelectItem value="Thursday">الخميس</SelectItem>

                <SelectItem value="Friday">الجمعة</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}

          <div className="space-y-2">
            <Label>حالة الأماكن</Label>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="كل المجموعات" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">كل المجموعات</SelectItem>

                <SelectItem value="available">يوجد أماكن</SelectItem>

                <SelectItem value="full">مكتمل العدد</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bottom */}

        <div className="flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-3">
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
            إجمالي المجموعات:{" "}
            <span className="font-semibold text-foreground">
              {filteredClasses.length}
            </span>
            {filteredClasses.length > 0 && (
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
                    filteredClasses.length,
                  )}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Classes */}

      {paginatedClasses.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {paginatedClasses.map((c) => {
            const currentStudents = c.currentStudents ?? 0;

            const maxStudents = c.maxStudents ?? 0;

            const isFull = currentStudents >= maxStudents;

            return (
              <div key={c.id} className="surface-card space-y-4 p-5">
                <div className="flex items-start justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent-gradient text-white">
                    <BookOpen className="h-5 w-5" />
                  </span>

                  <div className="flex items-center gap-1">
                    {/* Edit */}

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditClass(c.id)}
                      disabled={loadingEdit}
                      title="تعديل المجموعة"
                    >
                      <Pencil className="h-4 w-4 text-primary" />
                    </Button>

                    {/* Delete */}

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClass(c.id)}
                      title="حذف المجموعة"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-bold">{c.name}</h2>

                  <p className="text-sm text-muted-foreground">{c.subject}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge>{c.teacher}</Badge>

                  <Badge variant="secondary">{c.day}</Badge>

                  <Badge variant="outline">
                    {c.startTime} - {c.endTime}
                  </Badge>
                </div>

                <div className="text-sm text-muted-foreground">
                  القاعة : {c.hall || "غير محددة"}
                </div>

                <div className="flex justify-between text-sm">
                  <span>الطلاب</span>

                  <span
                    className={
                      isFull ? "font-bold text-destructive" : "font-semibold"
                    }
                  >
                    {currentStudents} / {maxStudents}
                  </span>
                </div>

                <Badge variant={isFull ? "destructive" : "secondary"}>
                  {isFull
                    ? "المجموعة مكتمل"
                    : `متاح ${maxStudents - currentStudents} مكان`}
                </Badge>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="surface-card py-12 text-center">
          <BookOpen className="mx-auto mb-3 size-10 text-muted-foreground" />

          <p className="font-semibold">لا توجد مجموعات</p>

          <p className="mt-1 text-sm text-muted-foreground">
            {search || dayFilter !== "all" || statusFilter !== "all"
              ? "لا توجد مجموعات مطابقة للفلاتر الحالية."
              : "لم تتم إضافة أي مجموعات حتى الآن."}
          </p>

          {(search || dayFilter !== "all" || statusFilter !== "all") && (
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              مسح الفلاتر
            </Button>
          )}
        </div>
      )}

      {/* Pagination */}

      {filteredClasses.length > 0 && totalPages > 1 && (
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
    </div>
  );
}
