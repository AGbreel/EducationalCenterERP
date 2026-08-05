import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Plus, Trash2, Users } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/lib/data";
import { useDb } from "@/lib/use-db";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/app/classes")({
  component: ClassesPage,
});

function ClassesPage() {
  const db = useDb();

  const [loadingId, setLoadingId] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">الكلاسات</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            إدارة الكلاسات الخاصة بالمواد.
          </p>
        </div>

        <Button>
          <Plus className="size-4" />
          إضافة كلاس
        </Button>
      </header>

      {db.courseClasses.length === 0 ? (
        <div className="surface-card p-12 text-center text-muted-foreground">
          لا يوجد كلاسات حتى الآن.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {db.courseClasses.map((item) => (
            <div
              key={item.id}
              className="surface-card space-y-4 rounded-xl p-5"
            >
              <div className="flex items-start justify-between">
                <span className="grid size-12 place-items-center rounded-xl bg-primary/10">
                  <BookOpen className="size-5" />
                </span>

                <Button
                  size="icon"
                  variant="ghost"
                  disabled={loadingId === item.id}
                  onClick={async () => {
                    if (!confirm("هل تريد حذف هذا الكلاس؟")) return;

                    try {
                      setLoadingId(item.id);

                      await api.removeClass(item.id);

                      toast.success("تم حذف الكلاس");
                    } catch (e) {
                      toast.error(
                        e instanceof Error ? e.message : "حدث خطأ"
                      );
                    } finally {
                      setLoadingId(null);
                    }
                  }}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>

              <div>
                <h2 className="text-lg font-bold">
                  {item.name}
                </h2>

                <p className="text-sm text-muted-foreground">
                  {item.subject}
                </p>
              </div>

              <div className="space-y-2 text-sm">

                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    المدرس
                  </span>

                  <span>{item.teacher}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    اليوم
                  </span>

                  <span>{item.day}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    الوقت
                  </span>

                  <span>
                    {item.startTime} - {item.endTime}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    القاعة
                  </span>

                  <span>{item.hall}</span>
                </div>

              </div>

              <div className="flex items-center justify-between pt-2">

                <Badge variant="secondary">
                  <Users className="mr-1 size-3" />
                  {item.currentStudents}/{item.maxStudents}
                </Badge>

                <Button
                  variant="outline"
                  size="sm"
                >
                  تعديل
                </Button>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}