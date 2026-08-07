globalThis.__nitro_main__ = import.meta.url;
import { n as HTTPError, r as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx+unenv.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
import { r as FastResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"4f95-3RXc3p2mhEAs1WBwaIvE0Y0uu0Y\"",
		"mtime": "2026-08-02T21:28:15.822Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-08-02T21:28:18.974Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/assets/alert-dialog-ldh7nALi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e6e-wcBu3VmjfLHaxyITqDe6sTqxBsk\"",
		"mtime": "2026-08-07T19:04:37.252Z",
		"size": 3694,
		"path": "../public/assets/alert-dialog-ldh7nALi.js"
	},
	"/assets/book-open-BQA5aWvj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10b-sc+DKN6I6TjcgPhho6qrD2afY4A\"",
		"mtime": "2026-08-07T19:04:37.256Z",
		"size": 267,
		"path": "../public/assets/book-open-BQA5aWvj.js"
	},
	"/assets/calendar-check-Ca7cRl0I.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"125-DoYFIVpqths1+1JmB+mkqRhX8l4\"",
		"mtime": "2026-08-07T19:04:37.256Z",
		"size": 293,
		"path": "../public/assets/calendar-check-Ca7cRl0I.js"
	},
	"/assets/attendance-B7BCjuFd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3620-FQhUhXXwfIF8T4Q1PGJ44zETSrk\"",
		"mtime": "2026-08-07T19:04:37.252Z",
		"size": 13856,
		"path": "../public/assets/attendance-B7BCjuFd.js"
	},
	"/assets/credit-card-CqnFh8xu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c3-gycv82tUIJOCWYoCJQxDH/XTSQk\"",
		"mtime": "2026-08-07T19:04:37.257Z",
		"size": 195,
		"path": "../public/assets/credit-card-CqnFh8xu.js"
	},
	"/assets/classes-X6jLsdNd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1388-L6aKoIE+gaHGnbBLHjkwWrTrezg\"",
		"mtime": "2026-08-07T19:04:37.256Z",
		"size": 5e3,
		"path": "../public/assets/classes-X6jLsdNd.js"
	},
	"/assets/Combination-Dw99q-nU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5821-NMOdq+X6Ujd8wCyYxMkH9zqFZWc\"",
		"mtime": "2026-08-07T19:04:37.251Z",
		"size": 22561,
		"path": "../public/assets/Combination-Dw99q-nU.js"
	},
	"/assets/dashboard-B8hGawOO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2724-Jbgq+Yynl0A3UDkUeO1/5PrPZKY\"",
		"mtime": "2026-08-07T19:04:37.257Z",
		"size": 10020,
		"path": "../public/assets/dashboard-B8hGawOO.js"
	},
	"/assets/dist-BcBjtS03.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ed6-ssyf+oax1FZLcU1/GbHK7eE7KFc\"",
		"mtime": "2026-08-07T19:04:37.259Z",
		"size": 7894,
		"path": "../public/assets/dist-BcBjtS03.js"
	},
	"/assets/dialog-s9ta7jWK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ae3-tvHK90xQwAlui/C35JTgOoJyixQ\"",
		"mtime": "2026-08-07T19:04:37.258Z",
		"size": 6883,
		"path": "../public/assets/dialog-s9ta7jWK.js"
	},
	"/assets/dist-Byo9jMv-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d30-t8RwiC6XQO6RJIIRedDBWsWUx3Q\"",
		"mtime": "2026-08-07T19:04:37.260Z",
		"size": 7472,
		"path": "../public/assets/dist-Byo9jMv-.js"
	},
	"/assets/data-ZfhHKvGk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a239-Z3tWCy2z7JcCdRNZkvrMd4iUJBw\"",
		"mtime": "2026-08-07T19:04:37.258Z",
		"size": 41529,
		"path": "../public/assets/data-ZfhHKvGk.js"
	},
	"/assets/dist-YLSUCiCM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1126-ETpxo9GB11FFxgAK4SG2LYbOOSM\"",
		"mtime": "2026-08-07T19:04:37.260Z",
		"size": 4390,
		"path": "../public/assets/dist-YLSUCiCM.js"
	},
	"/assets/enrollments-D2qcR97Z.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1169-5SXAU00CHS6ILmZHeCkpN10rlZI\"",
		"mtime": "2026-08-07T19:04:37.261Z",
		"size": 4457,
		"path": "../public/assets/enrollments-D2qcR97Z.js"
	},
	"/assets/graduation-cap-BASVzwLB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"140-cQ+iDdhyEPuoo0XmnPullgJY8Os\"",
		"mtime": "2026-08-07T19:04:37.262Z",
		"size": 320,
		"path": "../public/assets/graduation-cap-BASVzwLB.js"
	},
	"/assets/index-CEgyDbyM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5b90d-s6O17ucYd3jaIcGWiJII7tOAmg4\"",
		"mtime": "2026-08-07T19:04:37.251Z",
		"size": 375053,
		"path": "../public/assets/index-CEgyDbyM.js"
	},
	"/assets/jsx-runtime-DyPRzy-k.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c79-FL4B/VUGZRoWs/e2OiekDVcF8wQ\"",
		"mtime": "2026-08-07T19:04:37.262Z",
		"size": 11385,
		"path": "../public/assets/jsx-runtime-DyPRzy-k.js"
	},
	"/assets/label-BGuIjQCu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6ca-rdbFGc6TlncMzEIdwVLcTWtQykY\"",
		"mtime": "2026-08-07T19:04:37.263Z",
		"size": 1738,
		"path": "../public/assets/label-BGuIjQCu.js"
	},
	"/assets/qr-code-BqwaeWlG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"27e-QKG+0SJLvZXGiL+6Z31x1gFy6FY\"",
		"mtime": "2026-08-07T19:04:37.264Z",
		"size": 638,
		"path": "../public/assets/qr-code-BqwaeWlG.js"
	},
	"/assets/payments-C3PPM0GB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"385a-A1SrqcdBTaYZnxuqzCNoWJ7zfPc\"",
		"mtime": "2026-08-07T19:04:37.263Z",
		"size": 14426,
		"path": "../public/assets/payments-C3PPM0GB.js"
	},
	"/assets/plus-ByyJZPUo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8d-y61mr8x1T7gKRKZdHm9xGYxQD7E\"",
		"mtime": "2026-08-07T19:04:37.264Z",
		"size": 141,
		"path": "../public/assets/plus-ByyJZPUo.js"
	},
	"/assets/rolldown-runtime-CbXtAM7H.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"24d-+aXgvbJ1Wwcp2A8AXKIBByksYC8\"",
		"mtime": "2026-08-07T19:04:37.264Z",
		"size": 589,
		"path": "../public/assets/rolldown-runtime-CbXtAM7H.js"
	},
	"/assets/scan-line-BvXABGjq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13f-92HdpnEkFYA8THKQiPJaJfRoz74\"",
		"mtime": "2026-08-07T19:04:37.266Z",
		"size": 319,
		"path": "../public/assets/scan-line-BvXABGjq.js"
	},
	"/assets/routes-C7V4no89.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1212-Hy5h/Yqi9lL40dN0ukcUvBdiiK0\"",
		"mtime": "2026-08-07T19:04:37.265Z",
		"size": 4626,
		"path": "../public/assets/routes-C7V4no89.js"
	},
	"/assets/scan-M9i8aXLV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3988-vGQnN1bEN7xfdxCDJaeHxlmlQEE\"",
		"mtime": "2026-08-07T19:04:37.265Z",
		"size": 14728,
		"path": "../public/assets/scan-M9i8aXLV.js"
	},
	"/assets/student-enrollment-HkMk0hLe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1023-WrBqamly7xS3ZM/qnecBQKtLsOs\"",
		"mtime": "2026-08-07T19:04:37.267Z",
		"size": 4131,
		"path": "../public/assets/student-enrollment-HkMk0hLe.js"
	},
	"/assets/styles-BS0gHJYj.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"13acd-IBMdqojdzy7a2JPVyq59dT+86lU\"",
		"mtime": "2026-08-07T19:04:37.272Z",
		"size": 80589,
		"path": "../public/assets/styles-BS0gHJYj.css"
	},
	"/assets/select-DO4xoRJI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"bc2a-Zpv8N9OG67rWYmdRsMLtffLCyak\"",
		"mtime": "2026-08-07T19:04:37.266Z",
		"size": 48170,
		"path": "../public/assets/select-DO4xoRJI.js"
	},
	"/assets/students-QQGzLNzq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5c04-ovFQG7r+MK6kcGWSAjMGSL/PcCE\"",
		"mtime": "2026-08-07T19:04:37.267Z",
		"size": 23556,
		"path": "../public/assets/students-QQGzLNzq.js"
	},
	"/assets/subjects-ZH6X2ho2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b64-WRu/LejAAHIphZ1twgbTKxFdWuk\"",
		"mtime": "2026-08-07T19:04:37.267Z",
		"size": 2916,
		"path": "../public/assets/subjects-ZH6X2ho2.js"
	},
	"/assets/teachers-Ca6iZHRw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1954-cGT6L7E0HjWwxSI5EaJ44KE7Gfo\"",
		"mtime": "2026-08-07T19:04:37.268Z",
		"size": 6484,
		"path": "../public/assets/teachers-Ca6iZHRw.js"
	},
	"/assets/trash-2-Di9wdfPx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13c-hji8GwtRwftj7iFgL9lDkIfskvw\"",
		"mtime": "2026-08-07T19:04:37.269Z",
		"size": 316,
		"path": "../public/assets/trash-2-Di9wdfPx.js"
	},
	"/assets/esm-D4C8_tOq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5a04f-JvU0RWrdR7BiVjDiwr+ETyPG/Sc\"",
		"mtime": "2026-08-07T19:04:37.261Z",
		"size": 368719,
		"path": "../public/assets/esm-D4C8_tOq.js"
	},
	"/assets/use-db-B2mdAc18.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4e0-OP0gO3wDWreb3APeR84uyWub5ww\"",
		"mtime": "2026-08-07T19:04:37.270Z",
		"size": 1248,
		"path": "../public/assets/use-db-B2mdAc18.js"
	},
	"/assets/user-round-CVx7RpPi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"aa-Xm3m3BPhe0r3T79Z/blh4CMSjv8\"",
		"mtime": "2026-08-07T19:04:37.271Z",
		"size": 170,
		"path": "../public/assets/user-round-CVx7RpPi.js"
	},
	"/assets/users-PTuTDjaV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"126-h8Z9sW5n2A6mdNPBBlfpMG4vsc8\"",
		"mtime": "2026-08-07T19:04:37.271Z",
		"size": 294,
		"path": "../public/assets/users-PTuTDjaV.js"
	},
	"/assets/_app-CgGEgPNX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"12c4-sCOlY+INSYKZ3xZ+baotded2hLE\"",
		"mtime": "2026-08-07T19:04:37.251Z",
		"size": 4804,
		"path": "../public/assets/_app-CgGEgPNX.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_4VjeWZ = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_4VjeWZ
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
