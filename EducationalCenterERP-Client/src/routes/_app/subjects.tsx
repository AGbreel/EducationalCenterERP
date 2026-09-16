import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { BookOpen, ChevronLeft, ChevronRight, Plus, Search, Trash2, X } from "lucide-react";
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

export const Route = createFileRoute("/_app/subjects")({
  head: () => ({
    meta: [
      { title: "المواد الدراسية | منصّة السنتر" },
      {
        name: "description",
        content: "إدارة المواد الدراسية داخل السنتر.",
      },
      { property: "og:title", content: "المواد الدراسية" },
      {
        property: "og:description",
        content: "إضافة وتعديل وحذف المواد الدراسية.",
      },
    ],
  }),
  component: SubjectsPage,
});

function SubjectsPage() {
  const db = useDb();

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  // =========================
  // Filter & Pagination
  // =========================

  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredSubjects = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return db.subjects;
    }

    return db.subjects.filter((subject) => {
      const name = subject.name?.toLowerCase() ?? "";
      const description = subject.description?.toLowerCase() ?? "";

      return (
        name.includes(searchValue) ||
        description.includes(searchValue)
      );
    });
  }, [db.subjects, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSubjects.length / Number(pageSize))
  );

  const paginatedSubjects = useMemo(() => {
    const startIndex = (currentPage - 1) * Number(pageSize);
    const endIndex = startIndex + Number(pageSize);

    return filteredSubjects.slice(startIndex, endIndex);
  }, [filteredSubjects, currentPage, pageSize]);

  // لو الفلتر قلل عدد الصفحات
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Reset pagination عند تغيير البحث
  useEffect(() => {
    setCurrentPage(1);
  }, [search, pageSize]);

  const clearFilters = () => {
    setSearch("");
    setPageSize("10");
    setCurrentPage(1);
  };

  const hasFilters = search.trim() !== "" || pageSize !== "10";

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
  // Add Subject
  // =========================

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("اكتب اسم المادة");
      return;
    }

    api
      .addSubject({
        name: form.name,
        description: form.description,
      })
      .then(() => {
        setForm({
          name: "",
          description: "",
        });

        toast.success("تم إضافة المادة");
      })
      .catch((err: Error) => toast.error(err.message));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold">المواد الدراسية</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          إدارة المواد الدراسية وإضافة أو حذف المواد.
        </p>
      </header>

      {/* Add Subject */}
      <form
        onSubmit={submit}
        className="surface-card grid gap-4 p-5 md:grid-cols-3"
      >
        <div className="space-y-2">
          <Label htmlFor="sname">اسم المادة</Label>

          <Input
            id="sname"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            placeholder="الرياضيات"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sdesc">وصف المادة</Label>

          <Input
            id="sdesc"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
            placeholder="وصف المادة"
          />
        </div>

        <div className="flex items-end">
          <Button type="submit" className="w-full" size="lg">
            <Plus className="size-4" />
            إضافة المادة
          </Button>
        </div>
      </form>

      {/* Filters */}
      <div className="surface-card space-y-4 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          {/* Search */}
          <div className="flex-1 space-y-2">
            <Label htmlFor="subject-search">بحث</Label>

            <div className="relative">
              <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="subject-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث باسم المادة أو الوصف..."
                className="pr-9"
              />
            </div>
          </div>

          {/* Page Size */}
          <div className="w-full lg:w-48 space-y-2">
            <Label>عدد النتائج</Label>

            <Select
              value={pageSize}
              onValueChange={setPageSize}
            >
              <SelectTrigger>
                <SelectValue placeholder="عدد النتائج" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="5">5 نتائج</SelectItem>
                <SelectItem value="10">10 نتائج</SelectItem>
                <SelectItem value="20">20 نتيجة</SelectItem>
                <SelectItem value="50">50 نتيجة</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear */}
          {hasFilters && (
            <Button
              type="button"
              variant="outline"
              onClick={clearFilters}
              className="gap-2"
            >
              <X className="size-4" />
              مسح الفلتر
            </Button>
          )}
        </div>

        {/* Result Count */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            إجمالي المواد:{" "}
            <span className="font-semibold text-foreground">
              {filteredSubjects.length}
            </span>
          </span>

          {filteredSubjects.length > 0 && (
            <span>
              عرض{" "}
              <span className="font-semibold text-foreground">
                {(currentPage - 1) * Number(pageSize) + 1}
              </span>{" "}
              إلى{" "}
              <span className="font-semibold text-foreground">
                {Math.min(
                  currentPage * Number(pageSize),
                  filteredSubjects.length
                )}
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Subjects */}
      {paginatedSubjects.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {paginatedSubjects.map((s) => {
            const count = db.enrollments.filter(
              (e) => e.courseClassId === s.id
            ).length;

            return (
              <div
                key={s.id}
                className="surface-card space-y-3 p-5"
              >
                <div className="flex items-start justify-between">
                  <span className="grid size-11 place-items-center rounded-xl bg-accent-gradient text-accent-foreground">
                    <BookOpen className="size-5" />
                  </span>

                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="حذف"
                    onClick={() => {
                      api
                        .removeSubject(s.id)
                        .then(() =>
                          toast.success("تم حذف المادة")
                        )
                        .catch((err: Error) =>
                          toast.error(err.message)
                        );
                    }}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>

                <div>
                  <p className="text-lg font-bold">
                    {s.name}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {s.description || "لا يوجد وصف"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge>
                    {count} طالب
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="surface-card py-12 text-center">
          <BookOpen className="mx-auto mb-3 size-10 text-muted-foreground" />

          <p className="font-semibold">
            لا توجد مواد
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            {search
              ? "لا توجد مواد تطابق البحث."
              : "لم تتم إضافة أي مواد حتى الآن."}
          </p>

          {search && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={clearFilters}
            >
              مسح البحث
            </Button>
          )}
        </div>
      )}

      {/* Pagination */}
      {filteredSubjects.length > 0 && totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {/* Previous */}
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage((page) => Math.max(1, page - 1))
            }
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
                variant={
                  currentPage === page
                    ? "default"
                    : "outline"
                }
                size="icon"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            )
          )}

          {/* Next */}
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((page) =>
                Math.min(totalPages, page + 1)
              )
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
