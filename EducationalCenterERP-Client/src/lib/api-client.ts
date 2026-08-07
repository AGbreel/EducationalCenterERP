// عميل HTTP للربط مع الـ API الحقيقي (Swagger endpoints)
const BASE_KEY = "edu-center-api-base";
const TOKEN_KEY = "edu-center-token";

const DEFAULT_BASE =
  (import.meta.env["VITE_API_BASE_URL"] as string | undefined) ?? import.meta.env.VITE_API_URL ?? "https://localhost:7121/api";

export function getApiBase(): string {
  if (typeof window === "undefined") return DEFAULT_BASE;
  return (window.localStorage.getItem(BASE_KEY) || DEFAULT_BASE).replace(/\/+$/, "");
}

export function setApiBase(url: string) {
  window.localStorage.setItem(BASE_KEY, url.trim().replace(/\/+$/, ""));
  window.dispatchEvent(new Event("db-change"));
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; auth?: boolean } = {},
): Promise<T> {
  const { method = "GET", body, auth = true } = options;
  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const token = auth ? getToken() : null;
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${getApiBase()}${path}`, {
      method,
      headers,
      body: body === undefined ? null : JSON.stringify(body),
    });
  } catch {
    throw new ApiError("تعذّر الاتصال بالسيرفر — تأكد أن الـ API يعمل وأن CORS مفعّل.", 0);
  }

  if (res.status === 401) {
    setToken(null);
    throw new ApiError("انتهت الجلسة — سجّل الدخول من جديد.", 401);
  }

  const text = await res.text();
  const data = text ? safeJson(text) : null;

  if (!res.ok) {
    const message =
      (data && typeof data === "object"
        ? pickMessage(data as Record<string, unknown>)
        : typeof data === "string"
          ? data
          : null) ?? `فشل الطلب (${res.status})`;
    throw new ApiError(message, res.status);
  }

  return data as T;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function pickMessage(obj: Record<string, unknown>): string | null {
  for (const key of ["message", "Message", "title", "error", "detail"]) {
    const v = obj[key];
    if (typeof v === "string" && v) return v;
  }
  return null;
}

/** يقرأ خاصية من الكائن بأي صيغة (camelCase أو PascalCase). */
export function field<T = unknown>(obj: unknown, ...names: string[]): T | undefined {
  if (!obj || typeof obj !== "object") return undefined;
  const rec = obj as Record<string, unknown>;
  for (const name of names) {
    const variants = [name, name[0]!.toUpperCase() + name.slice(1), name[0]!.toLowerCase() + name.slice(1)];
    for (const v of variants) if (rec[v] !== undefined && rec[v] !== null) return rec[v] as T;
  }
  return undefined;
}

/** يستخرج المصفوفة من الاستجابة (مصفوفة مباشرة أو ملفوفة في data/items/result). */
export function asArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  for (const key of ["data", "items", "result", "results", "value"]) {
    const v = field<unknown>(payload, key);
    if (Array.isArray(v)) return v;
  }
  return [];
}
