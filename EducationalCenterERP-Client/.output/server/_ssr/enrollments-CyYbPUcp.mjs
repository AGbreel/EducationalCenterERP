import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as api, t as Button } from "./data-BNilzuWy.mjs";
import { f as Plus, o as Trash2, r as Users } from "../_libs/lucide-react.mjs";
import { n as Label, t as Input } from "./label-BJBFWfDZ.mjs";
import { n as useDb, t as Badge } from "./use-db-EiXjrZy6.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as SelectItem, n as SelectContent, o as SelectTrigger, s as SelectValue, t as Select } from "./select-C-QkCN5n.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/enrollments-CyYbPUcp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EnrollmentsPage() {
	const db = useDb();
	const [form, setForm] = (0, import_react.useState)({
		studentId: "",
		classId: "",
		monthlyFee: ""
	});
	const [saving, setSaving] = (0, import_react.useState)(false);
	(0, import_react.useMemo)(() => db.students.find((x) => x.id === form.studentId), [db.students, form.studentId]);
	const submit = async (e) => {
		e.preventDefault();
		if (!form.studentId) {
			toast.error("اختر الطالب");
			return;
		}
		if (!form.classId) {
			toast.error("اختر الكلاس");
			return;
		}
		if (!form.monthlyFee) {
			toast.error("ادخل المصروف الشهري");
			return;
		}
		setSaving(true);
		try {
			await api.enrollStudent(form.studentId, form.classId, Number(form.monthlyFee));
			toast.success("تم تسجيل الطالب داخل الكلاس");
			setForm({
				studentId: "",
				classId: "",
				monthlyFee: ""
			});
		} catch (err) {
			toast.error(err.message);
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold",
				children: "تسجيل الطلاب داخل الكلاسات"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "اختر الطالب ثم اختر الكلاس وحدد قيمة الاشتراك الشهري."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => void submit(e),
				className: "surface-card grid gap-4 p-5 md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "الطالب" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: form.studentId,
							onValueChange: (v) => setForm({
								...form,
								studentId: v
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "اختر الطالب" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: db.students.map((student) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: student.id,
								children: student.fullName
							}, student.id)) })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "الكلاس" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: form.classId,
							onValueChange: (v) => setForm({
								...form,
								classId: v
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "اختر الكلاس" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: db.courseClasses.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: c.id,
								children: c.name
							}, c.id)) })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "المصروف الشهري" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							placeholder: "500",
							value: form.monthlyFee,
							onChange: (e) => setForm({
								...form,
								monthlyFee: e.target.value
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "w-full",
							size: "lg",
							disabled: saving,
							type: "submit",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), saving ? "جاري التسجيل..." : "تسجيل الطالب"]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-4",
				children: db.students.map((student) => {
					const enrollments = db.enrollments.filter((e) => e.studentId === student.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card space-y-4 p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg font-bold",
								children: student.fullName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: student.grade || "بدون صف"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "mr-1 size-4" }),
								enrollments.length,
								" كلاس"
							] })]
						}), enrollments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground",
							children: "الطالب غير مسجل في أي كلاس."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3",
							children: enrollments.map((enrollment) => {
								const courseClass = db.courseClasses.find((c) => c.id === enrollment.courseClassId);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between rounded-xl border p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold",
												children: courseClass?.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm text-muted-foreground",
												children: courseClass?.teacher
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap gap-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
														variant: "secondary",
														children: courseClass?.day
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
														variant: "outline",
														children: [
															courseClass?.startTime,
															" - ",
															courseClass?.endTime
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
														variant: "outline",
														children: courseClass?.hall
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, { children: [enrollment.monthlyFee, " ج.م"] })
												]
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										onClick: () => {
											api.unenroll(enrollment.id).then(() => toast.success("تم حذف الطالب من الكلاس")).catch((err) => toast.error(err.message));
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4 text-destructive" })
									})]
								}, enrollment.id);
							})
						})]
					}, student.id);
				})
			})
		]
	});
}
//#endregion
export { EnrollmentsPage as component };
