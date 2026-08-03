import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GraduationCap, LockKeyhole, Mail, QrCode, ScanLine, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/data";
import { getApiBase, setApiBase as saveApiBase } from "@/lib/api-client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "تسجيل الدخول | منصّة إدارة السنتر" },
      {
        name: "description",
        content: "سجّل الدخول لإدارة الطلاب والمدرسين والحضور والمدفوعات عبر QR Code.",
      },
      { property: "og:title", content: "تسجيل الدخول | منصّة إدارة السنتر" },
      {
        property: "og:description",
        content: "لوحة تحكم احترافية لإدارة السنتر التعليمي بالكامل.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiBase, setApiBase] = useState("");

  useEffect(() => setApiBase(getApiBase()), []);

  useEffect(() => {
    if (auth.current()) navigate({ to: "/dashboard", replace: true });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (await auth.login(name, password)) {
        toast.success("تم تسجيل الدخول بنجاح");
        navigate({ to: "/dashboard" });
        return;
      }
      toast.error("بيانات الدخول غير صحيحة");
    } catch (err) {
      console.log("====> ",err);
      toast.error((err as Error).message);
    }
    setLoading(false);
  };

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-brand-gradient p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-accent-gradient text-accent-foreground">
            <GraduationCap className="size-6" />
          </span>
          <span className="text-lg font-bold">منصّة السنتر</span>
        </div>
        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-extrabold leading-tight">
            إدارة كاملة للسنتر التعليمي من مكان واحد
          </h1>
          <p className="max-w-md text-primary-foreground/80">
            تسجيل الطلاب وإنشاء QR Code لكل طالب، متابعة المدرسين والمواد، وتسجيل الحضور والمدفوعات
            بمسح واحد.
          </p>
          <ul className="space-y-3 text-sm">
            {[
              { icon: Users, text: "ملفات الطلاب والمدرسين والمواد" },
              { icon: QrCode, text: "QR Code تلقائي لكل طالب" },
              { icon: ScanLine, text: "سكان سريع للحضور أو الدفع" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="grid size-8 place-items-center rounded-lg bg-primary-foreground/10">
                  <Icon className="size-4" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-primary-foreground/60">© {new Date().getFullYear()} منصّة السنتر</p>
        <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-16 size-96 rounded-full bg-accent/10 blur-3xl" />
      </section>

      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center lg:text-right">
            <h2 className="text-3xl font-bold">تسجيل الدخول</h2>
            <p className="text-sm text-muted-foreground">
              أدخل بيانات حسابك للوصول إلى لوحة التحكم.
            </p>
          </div>
          <form onSubmit={(e) => void submit(e)} className="surface-card space-y-5 p-6">
            <div className="space-y-2">
              <Label htmlFor="name">اسم المستخدم</Label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pr-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative">
                <LockKeyhole className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "جاري الدخول..." : "دخول"}
            </Button>
            <div className="space-y-2 border-t border-border pt-4">
              <Label htmlFor="apiBase" className="text-xs text-muted-foreground">
                عنوان الـ API
              </Label>
              <div className="flex gap-2">
                <Input
                  id="apiBase"
                  value={apiBase}
                  onChange={(e) => setApiBase(e.target.value)}
                  dir="ltr"
                  className="font-mono text-xs"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    saveApiBase(apiBase);
                    toast.success("تم حفظ عنوان الـ API");
                  }}
                >
                  حفظ
                </Button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
