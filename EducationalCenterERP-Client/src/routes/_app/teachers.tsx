import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { api, Teacher } from "@/lib/data";
import { useDb } from "@/lib/use-db";
import {
  Plus,
  GraduationCap,
  Pencil,
  Trash2,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_app/teachers")({
  head: () => ({
    meta: [
      {
        title: "المدرسون | منصّة السنتر",
      },
      {
        name: "description",
        content: "إدارة بيانات المدرسين داخل السنتر.",
      },
      {
        property: "og:title",
        content: "المدرسون والمواد",
      },
      {
        property: "og:description",
        content: "إضافة وإدارة المدرسين داخل السنتر.",
      },
    ],
  }),
  component: TeachersPage,
});

function TeachersPage() {
  const db = useDb();

  // =========================
  // Add Teacher
  // =========================

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    salary: 0,
  });

  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.fullName.trim()) {
      toast.error("يرجى إدخال اسم المدرس");
      return;
    }

    setSaving(true);

    try {
      await api.addTeacher({
        ...form,
      });

      setForm({
        fullName: "",
        phone: "",
        email: "",
        salary: 0,
      });

      setCurrentPage(1);

      toast.success("تم إضافة المدرس بنجاح");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // Edit Teacher
  // =========================

  const [editingTeacher, setEditingTeacher] =
    useState<Teacher | null>(null);

  const [editForm, setEditForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    salary: 0,
  });

  const [updating, setUpdating] = useState(false);

  const openEditTeacher = (teacher: Teacher) => {
    setEditingTeacher(teacher);

    setEditForm({
      fullName: teacher.fullName,
      phone: teacher.phone ?? "",
      email: teacher.email ?? "",
      salary: teacher.salary ?? 0,
    });
  };

  const updateTeacher = async () => {
    if (!editingTeacher) return;

    if (!editForm.fullName.trim()) {
      toast.error("يرجى إدخال اسم المدرس");
      return;
    }

    setUpdating(true);

    try {
      await api.updateTeacher(editingTeacher.id, {
        ...editForm,
      });

      toast.success("تم تعديل بيانات المدرس");

      setEditingTeacher(null);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setUpdating(false);
    }
  };

  // =========================
  // Search / Filter
  // =========================

  const [search, setSearch] = useState("");

  const [salaryFilter, setSalaryFilter] =
    useState("all");

  // =========================
  // Pagination
  // =========================

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // =========================
  // Filtered Teachers
  // =========================

  const filteredTeachers = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return db.teachers.filter((teacher) => {
      const matchesSearch =
        !searchValue ||
        teacher.fullName
          .toLowerCase()
          .includes(searchValue) ||
        (teacher.phone ?? "")
          .toLowerCase()
          .includes(searchValue) ||
        (teacher.email ?? "")
          .toLowerCase()
          .includes(searchValue);

      const matchesSalary =
        salaryFilter === "all" ||
        (salaryFilter === "with-salary" &&
          (teacher.salary ?? 0) > 0) ||
        (salaryFilter === "without-salary" &&
          (teacher.salary ?? 0) <= 0);

      return matchesSearch && matchesSalary;
    });
  }, [db.teachers, search, salaryFilter]);

  // =========================
  // Total Pages
  // =========================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredTeachers.length / itemsPerPage,
    ),
  );

  // =========================
  // Current Page Data
  // =========================

  const paginatedTeachers = useMemo(() => {
    const startIndex =
      (currentPage - 1) * itemsPerPage;

    return filteredTeachers.slice(
      startIndex,
      startIndex + itemsPerPage,
    );
  }, [
    filteredTeachers,
    currentPage,
  ]);

  // =========================
  // Reset Pagination
  // =========================

  useEffect(() => {
    setCurrentPage(1);
  }, [search, salaryFilter]);

  // =========================
  // Fix Page If Needed
  // =========================

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // =========================
  // Clear Filters
  // =========================

  const hasFilters =
    search.trim() !== "" ||
    salaryFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setSalaryFilter("all");
    setCurrentPage(1);
  };

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

    const start = Math.max(
      2,
      currentPage - 1,
    );

    const end = Math.min(
      totalPages - 1,
      currentPage + 1,
    );

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
    <div className="space-y-8">
      {/* =========================
          Header
      ========================= */}

      <header>
        <h1 className="text-3xl font-bold">
          المدرسون
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          إدارة المدرسين وإضافة بياناتهم.
        </p>
      </header>

      {/* =========================
          Add Teacher Form
      ========================= */}

      <form
        onSubmit={(e) => void submit(e)}
        className="surface-card grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-5"
      >
        {/* الاسم */}

        <div className="space-y-2">
          <Label htmlFor="fullName">
            اسم المدرس
          </Label>

          <Input
            id="fullName"
            value={form.fullName}
            onChange={(e) =>
              setForm({
                ...form,
                fullName: e.target.value,
              })
            }
            placeholder="مثال: أحمد محمد"
            required
          />
        </div>

        {/* البريد الإلكتروني */}

        <div className="space-y-2">
          <Label htmlFor="email">
            البريد الإلكتروني
          </Label>

          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
            placeholder="teacher@example.com"
          />
        </div>

        {/* الهاتف */}

        <div className="space-y-2">
          <Label htmlFor="phone">
            رقم الهاتف
          </Label>

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
          />
        </div>

        {/* الراتب */}

        <div className="space-y-2">
          <Label htmlFor="salary">
            الراتب الشهري
          </Label>

          <Input
            id="salary"
            type="number"
            min={0}
            step={100}
            value={form.salary}
            onChange={(e) =>
              setForm({
                ...form,
                salary: Number(
                  e.target.value,
                ),
              })
            }
            placeholder="5000"
          />
        </div>

        {/* زر الإضافة */}

        <div className="flex items-end">
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={saving}
          >
            <Plus className="mr-2 h-4 w-4" />

            {saving
              ? "جارٍ الإضافة..."
              : "إضافة مدرس"}
          </Button>
        </div>
      </form>

      {/* =========================
          Search & Filters
      ========================= */}

      <div className="surface-card rounded-xl border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">
              بحث وتصفية المدرسين
            </h2>

            <p className="text-sm text-muted-foreground">
              ابحث بالاسم أو رقم الهاتف أو البريد الإلكتروني.
            </p>
          </div>

          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={clearFilters}
            >
              <X className="size-4" />
              مسح الفلاتر
            </Button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Search */}

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="teacher-search">
              بحث
            </Label>

            <div className="relative">
              <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="teacher-search"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="اسم المدرس أو الهاتف أو البريد..."
                className="pr-10"
              />
            </div>
          </div>

          {/* Salary Filter */}

          <div className="space-y-2">
            <Label>
              حالة الراتب
            </Label>

            <Select
              value={salaryFilter}
              onValueChange={setSalaryFilter}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="كل المدرسين" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  كل المدرسين
                </SelectItem>

                <SelectItem value="with-salary">
                  لديهم راتب
                </SelectItem>

                <SelectItem value="without-salary">
                  بدون راتب
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}

        <div className="mt-4 flex items-center justify-between border-t pt-4 text-sm text-muted-foreground">
          <span>
            إجمالي المدرسين:{" "}
            <span className="font-bold text-foreground">
              {db.teachers.length}
            </span>
          </span>

          <span>
            النتائج:{" "}
            <span className="font-bold text-foreground">
              {filteredTeachers.length}
            </span>
          </span>
        </div>
      </div>

      {/* =========================
          Teachers List
      ========================= */}

      <div className="grid gap-4 lg:grid-cols-2">
        {paginatedTeachers.length === 0 ? (
          <div className="surface-card col-span-full rounded-xl border bg-card p-10 text-center">
            <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-muted">
              <Search className="size-6 text-muted-foreground" />
            </div>

            <h3 className="font-bold">
              لا توجد نتائج
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              لم يتم العثور على مدرسين مطابقين للبحث أو الفلتر.
            </p>

            {hasFilters && (
              <Button
                variant="outline"
                className="mt-4"
                type="button"
                onClick={clearFilters}
              >
                مسح الفلاتر
              </Button>
            )}
          </div>
        ) : (
          paginatedTeachers.map(
            (teacher) => (
              <div
                key={teacher.id}
                className="surface-card rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  {/* بيانات المدرس */}

                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <GraduationCap className="h-7 w-7 text-primary" />
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h3 className="text-lg font-bold">
                          {teacher.fullName}
                        </h3>

                        <Badge variant="secondary">
                          مدرس
                        </Badge>
                      </div>

                      <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                        <div>
                          📞{" "}
                          {teacher.phone ||
                            "--"}
                        </div>

                        <div>
                          📧{" "}
                          {teacher.email ||
                            "--"}
                        </div>

                        <div>
                          💰{" "}
                          {teacher.salary?.toLocaleString() ||
                            "0"}{" "}
                          ج.م
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* الأزرار */}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() =>
                        openEditTeacher(
                          teacher,
                        )
                      }
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      تعديل
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger
                        asChild
                      >
                        <Button
                          variant="destructive"
                          size="icon"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            حذف المدرس
                          </AlertDialogTitle>

                          <AlertDialogDescription>
                            هل تريد حذف
                            <strong>
                              {" "}
                              {
                                teacher.fullName
                              }{" "}
                            </strong>
                            ؟
                            <br />
                            لا يمكن التراجع عن هذه العملية.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            إلغاء
                          </AlertDialogCancel>

                          <AlertDialogAction
                            onClick={async () => {
                              try {
                                await api.removeTeacher(
                                  teacher.id,
                                );

                                toast.success(
                                  "تم حذف المدرس",
                                );
                              } catch (err) {
                                toast.error(
                                  (
                                    err as Error
                                  ).message,
                                );
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
            ),
          )
        )}
      </div>

      {/* =========================
          Pagination
      ========================= */}

      {filteredTeachers.length >
        itemsPerPage && (
        <div className="flex flex-col items-center justify-between gap-4 rounded-xl border bg-card p-4 sm:flex-row">
          {/* Results Info */}

          <div className="text-sm text-muted-foreground">
            عرض{" "}
            <span className="font-semibold text-foreground">
              {(currentPage - 1) *
                itemsPerPage +
                1}
            </span>{" "}
            إلى{" "}
            <span className="font-semibold text-foreground">
              {Math.min(
                currentPage *
                  itemsPerPage,
                filteredTeachers.length,
              )}
            </span>{" "}
            من{" "}
            <span className="font-semibold text-foreground">
              {filteredTeachers.length}
            </span>{" "}
            مدرس
          </div>

          {/* Pagination */}

          <div className="flex items-center gap-1">
            {/* Previous */}

            <Button
              variant="outline"
              size="icon"
              type="button"
              disabled={
                currentPage === 1
              }
              onClick={() =>
                setCurrentPage(
                  (prev) =>
                    Math.max(
                      1,
                      prev - 1,
                    ),
                )
              }
            >
              <ChevronRight className="size-4" />
            </Button>

            {/* Pages */}

            {getPageNumbers().map(
              (page, index) => {
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
                    variant={
                      currentPage ===
                      page
                        ? "default"
                        : "outline"
                    }
                    size="icon"
                    type="button"
                    onClick={() =>
                      setCurrentPage(
                        page as number,
                      )
                    }
                  >
                    {page}
                  </Button>
                );
              },
            )}

            {/* Next */}

            <Button
              variant="outline"
              size="icon"
              type="button"
              disabled={
                currentPage ===
                totalPages
              }
              onClick={() =>
                setCurrentPage(
                  (prev) =>
                    Math.min(
                      totalPages,
                      prev + 1,
                    ),
                )
              }
            >
              <ChevronLeft className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* =========================
          Edit Dialog
      ========================= */}

      <Dialog
        open={!!editingTeacher}
        onOpenChange={(open) =>
          !open &&
          setEditingTeacher(null)
        }
      >
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              تعديل بيانات المدرس
            </DialogTitle>

            <DialogDescription>
              قم بتعديل البيانات ثم اضغط حفظ.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* الاسم */}

            <div className="space-y-2">
              <Label>
                اسم المدرس
              </Label>

              <Input
                value={
                  editForm.fullName
                }
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    fullName:
                      e.target.value,
                  })
                }
              />
            </div>

            {/* البريد */}

            <div className="space-y-2">
              <Label>
                البريد الإلكتروني
              </Label>

              <Input
                type="email"
                value={
                  editForm.email
                }
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    email:
                      e.target.value,
                  })
                }
              />
            </div>

            {/* الهاتف */}

            <div className="space-y-2">
              <Label>
                رقم الهاتف
              </Label>

              <Input
                value={
                  editForm.phone
                }
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    phone:
                      e.target.value,
                  })
                }
              />
            </div>

            {/* الراتب */}

            <div className="space-y-2">
              <Label>
                الراتب
              </Label>

              <Input
                type="number"
                min={0}
                value={
                  editForm.salary
                }
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    salary: Number(
                      e.target.value,
                    ),
                  })
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() =>
                setEditingTeacher(
                  null,
                )
              }
            >
              إلغاء
            </Button>

            <Button
              onClick={() =>
                void updateTeacher()
              }
              disabled={updating}
            >
              {updating
                ? "جارٍ الحفظ..."
                : "حفظ التعديلات"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
