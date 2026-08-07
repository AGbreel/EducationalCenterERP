import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { a as cn, o as emptyDb, s as fetchDb } from "./data-BNilzuWy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-db-EiXjrZy6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
	variants: { variant: {
		default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
		secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
		destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
		outline: "text-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
function useDb() {
	const [db, setDb] = (0, import_react.useState)(emptyDb);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const sync = (0, import_react.useCallback)(async () => {
		try {
			setDb(await fetchDb());
		} finally {
			setLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		sync();
		const handler = () => void sync();
		window.addEventListener("db-change", handler);
		window.addEventListener("storage", handler);
		return () => {
			window.removeEventListener("db-change", handler);
			window.removeEventListener("storage", handler);
		};
	}, [sync]);
	return Object.assign(db, {
		loading,
		refresh: sync
	});
}
//#endregion
export { useDb as n, Badge as t };
