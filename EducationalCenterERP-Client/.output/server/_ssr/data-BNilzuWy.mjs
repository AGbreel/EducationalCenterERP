import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { A as Slot, N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/data-BNilzuWy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var BASE_KEY = "edu-center-api-base";
var TOKEN_KEY = "edu-center-token";
var DEFAULT_BASE = {
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/",
	"VITE_API_URL": "https://localhost:7121/api"
}["VITE_API_BASE_URL"] ?? "https://localhost:7121/api" ?? "https://localhost:7121/api";
function getApiBase() {
	if (typeof window === "undefined") return DEFAULT_BASE;
	return (window.localStorage.getItem(BASE_KEY) || DEFAULT_BASE).replace(/\/+$/, "");
}
function getToken() {
	if (typeof window === "undefined") return null;
	return window.localStorage.getItem(TOKEN_KEY);
}
function setToken(token) {
	if (token) window.localStorage.setItem(TOKEN_KEY, token);
	else window.localStorage.removeItem(TOKEN_KEY);
}
var ApiError = class extends Error {
	status;
	constructor(message, status) {
		super(message);
		this.status = status;
	}
};
async function request(path, options = {}) {
	const { method = "GET", body, auth = true } = options;
	const headers = { Accept: "application/json" };
	if (body !== void 0) headers["Content-Type"] = "application/json";
	const token = auth ? getToken() : null;
	if (token) headers["Authorization"] = `Bearer ${token}`;
	let res;
	try {
		res = await fetch(`${getApiBase()}${path}`, {
			method,
			headers,
			body: body === void 0 ? null : JSON.stringify(body)
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
	if (!res.ok) throw new ApiError((data && typeof data === "object" ? pickMessage(data) : typeof data === "string" ? data : null) ?? `فشل الطلب (${res.status})`, res.status);
	return data;
}
function safeJson(text) {
	try {
		return JSON.parse(text);
	} catch {
		return text;
	}
}
function pickMessage(obj) {
	for (const key of [
		"message",
		"Message",
		"title",
		"error",
		"detail"
	]) {
		const v = obj[key];
		if (typeof v === "string" && v) return v;
	}
	return null;
}
/** يقرأ خاصية من الكائن بأي صيغة (camelCase أو PascalCase). */
function field(obj, ...names) {
	if (!obj || typeof obj !== "object") return void 0;
	const rec = obj;
	for (const name of names) {
		const variants = [
			name,
			name[0].toUpperCase() + name.slice(1),
			name[0].toLowerCase() + name.slice(1)
		];
		for (const v of variants) if (rec[v] !== void 0 && rec[v] !== null) return rec[v];
	}
}
/** يستخرج المصفوفة من الاستجابة (مصفوفة مباشرة أو ملفوفة في data/items/result). */
function asArray(payload) {
	if (Array.isArray(payload)) return payload;
	for (const key of [
		"data",
		"items",
		"result",
		"results",
		"value"
	]) {
		const v = field(payload, key);
		if (Array.isArray(v)) return v;
	}
	return [];
}
var emptyDb = {
	students: [],
	teachers: [],
	subjects: [],
	enrollments: [],
	attendance: [],
	payments: [],
	courseClasses: []
};
var str = (v, fallback = "") => v === void 0 || v === null ? fallback : String(v);
var num = (v) => typeof v === "number" ? v : Number(v) || 0;
function toStudent(data) {
	return {
		id: data.id,
		code: data.studentCode,
		fullName: data.fullName,
		phone: data.phone ?? "",
		parentPhone: data.parentPhone ?? "",
		address: data.address ?? "",
		school: data.school ?? "",
		grade: data.grade ?? "",
		createdAt: data.createdAt
	};
}
function toTeacher(raw) {
	return {
		id: str(field(raw, "id", "teacherId")),
		fullName: str(field(raw, "fullName", "fullName")),
		phone: str(field(raw, "phone", "phoneNumber")),
		email: str(field(raw, "email")),
		salary: num(field(raw, "salary"))
	};
}
function toSubject(raw) {
	return {
		id: str(field(raw, "id", "classId")),
		name: str(field(raw, "name", "className", "subjectName")),
		description: str(field(raw, "description", "classDescription", "subjectDescription"))
	};
}
function toAttendance(raw) {
	return {
		id: str(field(raw, "id")),
		studentId: str(field(raw, "studentId")),
		studentName: str(field(raw, "studentName")),
		courseClassId: str(field(raw, "courseClassId")),
		className: str(field(raw, "className")),
		attendanceDate: str(field(raw, "attendanceDate")),
		status: str(field(raw, "status"))
	};
}
function toPayment(raw) {
	return {
		id: str(field(raw, "id")),
		studentId: str(field(raw, "studentId")),
		studentName: str(field(raw, "studentName")),
		studentClassId: str(field(raw, "studentClassId")),
		courseClassId: str(field(raw, "courseClassId")),
		className: str(field(raw, "className")),
		subjectName: str(field(raw, "subjectName")),
		teacherName: str(field(raw, "teacherName")),
		amount: num(field(raw, "amount")),
		month: num(field(raw, "month")),
		year: num(field(raw, "year")),
		paymentType: str(field(raw, "paymentType")),
		sessionsCount: field(raw, "sessionsCount") == null ? null : num(field(raw, "sessionsCount")),
		paymentMethod: str(field(raw, "paymentMethod")),
		notes: str(field(raw, "notes")),
		paymentDate: str(field(raw, "paymentDate"))
	};
}
function toEnrollment(raw) {
	return {
		id: str(field(raw, "id")),
		studentId: str(field(raw, "studentId")),
		studentName: str(field(raw, "studentName")),
		courseClassId: str(field(raw, "courseClassId")),
		className: str(field(raw, "className")),
		monthlyFee: num(field(raw, "monthlyFee")),
		enrollmentDate: str(field(raw, "enrollmentDate")),
		isActive: field(raw, "isActive") === void 0 ? true : Boolean(field(raw, "isActive"))
	};
}
function toStudentAttendanceLookup(raw) {
	return {
		studentId: str(field(raw, "studentId")),
		studentName: str(field(raw, "studentName")),
		studentCode: str(field(raw, "studentCode")),
		classes: asArray(field(raw, "classes")).map((c) => ({
			courseClassId: str(field(c, "courseClassId")),
			className: str(field(c, "className")),
			subject: str(field(c, "subject")),
			teacher: str(field(c, "teacher"))
		}))
	};
}
function toCourseClass(raw) {
	return {
		id: str(field(raw, "id")),
		name: str(field(raw, "name")),
		subjectId: str(field(raw, "subjectId")),
		subject: str(field(raw, "subject")),
		teacherId: str(field(raw, "teacherId")),
		teacher: str(field(raw, "teacher")),
		day: str(field(raw, "day")),
		startTime: str(field(raw, "startTime")),
		endTime: str(field(raw, "endTime")),
		hall: str(field(raw, "hall")),
		maxStudents: num(field(raw, "maxStudents")),
		currentStudents: num(field(raw, "currentStudents"))
	};
}
var list = async (path, map) => {
	try {
		return asArray(await request(path)).map(map);
	} catch {
		return [];
	}
};
/** يحمّل كل البيانات من الـ API. */
async function fetchDb() {
	const [students, teachers, subjects, courseClasses] = await Promise.all([
		list("/students", toStudent),
		list("/teachers", toTeacher),
		list("/subjects", toSubject),
		list("/classes", toCourseClass),
		list("/payments", toPayment)
	]);
	const [enrollmentsNested, attendanceNested, payments] = await Promise.all([
		Promise.all(students.map((s) => list(`/student-classes/student/${s.id}`, toEnrollment))),
		Promise.all(students.map((s) => list(`/attendance/student/${s.id}`, toAttendance))),
		list("/payments", toPayment)
	]);
	return {
		students,
		teachers,
		subjects,
		enrollments: enrollmentsNested.flatMap((rows, idx) => rows.map((row, i) => ({
			...row,
			id: row.id || `enr-${idx}-${i}`,
			studentId: row.studentId || (students[idx]?.id ?? "")
		}))),
		attendance: attendanceNested.flatMap((rows, idx) => rows.map((row, i) => ({
			...row,
			id: row.id || `att-${idx}-${i}`,
			studentId: row.studentId || (students[idx]?.id ?? "")
		}))),
		payments,
		courseClasses
	};
}
var changed = () => window.dispatchEvent(new Event("db-change"));
var api = {
	async addStudent(input) {
		const created = await request("/students", {
			method: "POST",
			body: {
				fullName: input.fullName,
				phone: input.phone,
				parentPhone: input.parentPhone,
				address: input.address,
				school: input.school,
				grade: input.grade
			}
		});
		changed();
		return toStudent(created ?? {});
	},
	async removeStudent(id) {
		await request(`/students/${id}`, { method: "DELETE" });
		changed();
	},
	async addTeacher(input) {
		await request("/teachers", {
			method: "POST",
			body: input
		});
		changed();
	},
	async updateTeacher(id, input) {
		const updated = await request(`/teachers/${id}`, {
			method: "PUT",
			body: {
				fullName: input.fullName,
				phone: input.phone,
				email: input.email,
				salary: input.salary
			}
		});
		changed();
		return toTeacher(updated ?? {});
	},
	async removeTeacher(id) {
		await request(`/teachers/${id}`, { method: "DELETE" });
		changed();
	},
	async addSubject(input) {
		await request("/subjects", {
			method: "POST",
			body: {
				name: input.name,
				description: input.description
			}
		});
		changed();
	},
	async removeSubject(id) {
		await request(`/subjects/${id}`, { method: "DELETE" });
		changed();
	},
	async enrollStudent(studentId, courseClassId, monthlyFee) {
		await request("/student-classes", {
			method: "POST",
			body: {
				studentId,
				courseClassId,
				monthlyFee
			}
		});
		changed();
	},
	async unenroll(id) {
		await request(`/student-classes/${id}`, { method: "DELETE" });
		changed();
	},
	async markAttendance(studentId, courseClassId) {
		await request("/attendance", {
			method: "POST",
			body: {
				studentId,
				courseClassId
			}
		});
		changed();
	},
	async getAttendance() {
		return list("/attendance", toAttendance);
	},
	async deleteAttendance(id) {
		await request(`/attendance/${id}`, { method: "DELETE" });
		changed();
	},
	async addPayment(input) {
		await request("/payments", {
			method: "POST",
			body: input
		});
		changed();
	},
	async removePayment(id) {
		await request(`/payments/${id}`, { method: "DELETE" });
		changed();
	},
	async findByQrValue(code) {
		try {
			const found = await request(`/students/qr/${encodeURIComponent(code.trim())}`);
			if (!found) return null;
			const rows = Array.isArray(found) ? found : null;
			return toStudent(rows ? rows[0] : found);
		} catch {
			return null;
		}
	},
	async findByStudentID(id) {
		try {
			const found = await request(`/students/${encodeURIComponent(id.trim())}`);
			if (!found) return null;
			const rows = Array.isArray(found) ? found : null;
			return toStudent(rows ? rows[0] : found);
		} catch {
			return null;
		}
	},
	async findByStudentCode(code) {
		try {
			return toStudent(await request(`/students/code/${encodeURIComponent(code.trim())}`));
		} catch {
			return null;
		}
	},
	async getStudentClassesByCode(code) {
		try {
			return toStudentAttendanceLookup(await request(`/students/code/${encodeURIComponent(code.trim())}/classes`));
		} catch {
			return null;
		}
	},
	async getStudentClassesByQr(qr) {
		try {
			return toStudentAttendanceLookup(await request(`/students/qr/${encodeURIComponent(qr.trim())}/classes`));
		} catch {
			return null;
		}
	},
	async addClass(input) {
		await request("/classes", {
			method: "POST",
			body: input
		});
		changed();
	},
	async updateClass(id, input) {
		await request(`/classes/${id}`, {
			method: "PUT",
			body: input
		});
		changed();
	},
	async removeClass(id) {
		await request(`/classes/${id}`, { method: "DELETE" });
		changed();
	},
	async getStudentClasses(studentId) {
		return list(`/student-classes/student/${studentId}`, toEnrollment);
	},
	async getClasses() {
		return list("/classes", toCourseClass);
	},
	async income() {
		return await request("/payments/income");
	},
	async getStudentPayments(studentId) {
		return list(`/payments/student/${studentId}`, toPayment);
	},
	async getStudentClassPayments(studentClassId) {
		return list(`/payments/student-class/${studentClassId}`, toPayment);
	}
};
var AUTH_KEY = "edu-center-auth";
var auth = {
	async login(userName, password) {
		const res = await request("/auth/login", {
			method: "POST",
			body: {
				userName,
				password
			},
			auth: false
		});
		const token = field(res, "token", "accessToken", "jwt") ?? field(field(res, "data"), "token", "accessToken");
		if (!token) return false;
		setToken(token);
		window.localStorage.setItem(AUTH_KEY, JSON.stringify({
			userName: str(field(res, "userName"), userName),
			at: Date.now()
		}));
		return true;
	},
	logout() {
		setToken(null);
		window.localStorage.removeItem(AUTH_KEY);
	},
	current() {
		if (typeof window === "undefined") return null;
		if (!getToken()) return null;
		const raw = window.localStorage.getItem(AUTH_KEY);
		if (!raw) return null;
		try {
			return JSON.parse(raw);
		} catch {
			return null;
		}
	}
};
//#endregion
export { cn as a, getApiBase as c, buttonVariants as i, api as n, emptyDb as o, auth as r, fetchDb as s, Button as t };
