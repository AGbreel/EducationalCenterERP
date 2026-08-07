import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-Ca3y25as.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-BS0gHJYj.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$12 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "منصّة إدارة السنتر التعليمي" },
			{
				name: "description",
				content: "نظام متكامل لإدارة الطلاب والمدرسين والمواد مع حضور ومدفوعات بالـ QR Code."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&family=Tajawal:wght@500;700;800&display=swap"
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "ar",
		dir: "rtl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$12.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			position: "top-center",
			richColors: true
		})]
	});
}
var $$splitComponentImporter$11 = () => import("./routes-CQ47Lxd3.mjs");
var Route$11 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "تسجيل الدخول | منصّة إدارة السنتر" },
		{
			name: "description",
			content: "سجّل الدخول لإدارة الطلاب والمدرسين والحضور والمدفوعات عبر QR Code."
		},
		{
			property: "og:title",
			content: "تسجيل الدخول | منصّة إدارة السنتر"
		},
		{
			property: "og:description",
			content: "لوحة تحكم احترافية لإدارة السنتر التعليمي بالكامل."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("../_app-BY8fMNQS.mjs");
var Route$10 = createFileRoute("/_app")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./attendance-qEDzIy5U.mjs");
var Route$9 = createFileRoute("/_app/attendance")({
	head: () => ({ meta: [
		{ title: "تسجيل الحضور | منصة السنتر" },
		{
			name: "description",
			content: "تسجيل حضور الطلاب بواسطة QR Code أو كود الطالب."
		},
		{
			property: "og:title",
			content: "تسجيل الحضور"
		},
		{
			property: "og:description",
			content: "إدارة حضور الطلاب داخل الكلاسات."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./classes-B5gS82cl.mjs");
var Route$8 = createFileRoute("/_app/classes")({
	head: () => ({ meta: [
		{ title: "إدارة الكلاسات | منصة السنتر" },
		{
			name: "description",
			content: "إنشاء وإدارة الكلاسات وربطها بالمادة والمدرس وتحديد المواعيد والقاعة."
		},
		{
			property: "og:title",
			content: "إدارة الكلاسات"
		},
		{
			property: "og:description",
			content: "إنشاء الكلاسات وتحديد المادة والمدرس ومواعيد الدراسة."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./dashboard-vhLV2cor.mjs");
var Route$7 = createFileRoute("/_app/dashboard")({
	head: () => ({ meta: [{ title: "لوحة التحكم | Educational Center ERP" }, {
		name: "description",
		content: "لوحة تحكم شاملة لإدارة السنتر."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./enrollments-CyYbPUcp.mjs");
var Route$6 = createFileRoute("/_app/enrollments")({
	head: () => ({ meta: [
		{ title: "تسجيل الطلاب داخل الكلاسات | منصة السنتر" },
		{
			name: "description",
			content: "تسجيل الطلاب داخل الكلاسات وإدارة الاشتراكات الشهرية."
		},
		{
			property: "og:title",
			content: "Student Enrollments"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./payments-DQI8bACg.mjs");
var Route$5 = createFileRoute("/_app/payments")({
	head: () => ({ meta: [{ title: "إدارة المدفوعات | منصة السنتر" }, {
		name: "description",
		content: "تسجيل وإدارة جميع مدفوعات الطلاب داخل السنتر."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./scan-CmuThqUX.mjs");
var Route$4 = createFileRoute("/_app/scan")({
	head: () => ({ meta: [
		{ title: "سكان QR للحضور والمصاريف | منصّة السنتر" },
		{
			name: "description",
			content: "امسح كود الطالب ثم اختر المادة لتسجيل الحضور أو تسجيل دفعة الرسوم الخاصة بها."
		},
		{
			property: "og:title",
			content: "سكان QR للحضور والمصاريف"
		},
		{
			property: "og:description",
			content: "مسح سريع لكود الطالب لتسجيل الحضور أو الدفع."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./student-enrollment-CWSDVMMi.mjs");
var Route$3 = createFileRoute("/_app/student-enrollment")({
	head: () => ({ meta: [{ title: "تسجيل الطلاب داخل الكلاسات | منصة السنتر" }, {
		name: "description",
		content: "ربط الطلاب بالكلاسات وتحديد قيمة الاشتراك الشهري."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./students-C_APF6N9.mjs");
var Route$2 = createFileRoute("/_app/students")({
	head: () => ({ meta: [
		{ title: "تسجيل الطلاب و QR Code | منصّة السنتر" },
		{
			name: "description",
			content: "سجّل طالب جديد، أنشئ له QR Code، وحدد المواد المشترك بها."
		},
		{
			property: "og:title",
			content: "تسجيل الطلاب و QR Code"
		},
		{
			property: "og:description",
			content: "إدارة بيانات الطلاب وأكواد QR والاشتراك في المواد."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./subjects-DQH72dhp.mjs");
var Route$1 = createFileRoute("/_app/subjects")({
	head: () => ({ meta: [
		{ title: "المواد الدراسية | منصّة السنتر" },
		{
			name: "description",
			content: "إدارة المواد الدراسية داخل السنتر."
		},
		{
			property: "og:title",
			content: "المواد الدراسية"
		},
		{
			property: "og:description",
			content: "إضافة وتعديل وحذف المواد الدراسية."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./teachers-Bva3ldXK.mjs");
var Route = createFileRoute("/_app/teachers")({
	head: () => ({ meta: [
		{ title: "المدرسون | منصّة السنتر" },
		{
			fullName: "description",
			content: "إدارة بيانات المدرسين داخل السنتر."
		},
		{
			property: "og:title",
			content: "المدرسون والمواد"
		},
		{
			property: "og:description",
			content: "إضافة وإدارة المدرسين داخل السنتر."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$11.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$12
});
var AppRoute = Route$10.update({
	id: "/_app",
	getParentRoute: () => Route$12
});
var AppRouteChildren = {
	AppAttendanceRoute: Route$9.update({
		id: "/attendance",
		path: "/attendance",
		getParentRoute: () => AppRoute
	}),
	AppClassesRoute: Route$8.update({
		id: "/classes",
		path: "/classes",
		getParentRoute: () => AppRoute
	}),
	AppDashboardRoute: Route$7.update({
		id: "/dashboard",
		path: "/dashboard",
		getParentRoute: () => AppRoute
	}),
	AppEnrollmentsRoute: Route$6.update({
		id: "/enrollments",
		path: "/enrollments",
		getParentRoute: () => AppRoute
	}),
	AppPaymentsRoute: Route$5.update({
		id: "/payments",
		path: "/payments",
		getParentRoute: () => AppRoute
	}),
	AppScanRoute: Route$4.update({
		id: "/scan",
		path: "/scan",
		getParentRoute: () => AppRoute
	}),
	AppStudentEnrollmentRoute: Route$3.update({
		id: "/student-enrollment",
		path: "/student-enrollment",
		getParentRoute: () => AppRoute
	}),
	AppStudentsRoute: Route$2.update({
		id: "/students",
		path: "/students",
		getParentRoute: () => AppRoute
	}),
	AppSubjectsRoute: Route$1.update({
		id: "/subjects",
		path: "/subjects",
		getParentRoute: () => AppRoute
	}),
	AppTeachersRoute: Route.update({
		id: "/teachers",
		path: "/teachers",
		getParentRoute: () => AppRoute
	})
};
var rootRouteChildren = {
	IndexRoute,
	AppRoute: AppRoute._addFileChildren(AppRouteChildren)
};
var routeTree = Route$12._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
