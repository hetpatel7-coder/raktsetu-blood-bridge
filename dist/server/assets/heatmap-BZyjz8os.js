import { S as React, r as reactExports, T as jsxRuntimeExports } from "./worker-entry-IDUWrsFe.js";
import { c as createLucideIcon, d as BLOOD_TYPES, F as Flame, b as Link, s as supabase } from "./router-dIrcSwBL.js";
import { C as CircleCheck } from "./circle-check-GaPsBfnK.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$1 = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
];
const RefreshCw = createLucideIcon("refresh-cw", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const TriangleAlert = createLucideIcon("triangle-alert", __iconNode);
function __insertCSS(code) {
  if (typeof document == "undefined") return;
  let head = document.head || document.getElementsByTagName("head")[0];
  let style = document.createElement("style");
  style.type = "text/css";
  head.appendChild(style);
  style.styleSheet ? style.styleSheet.cssText = code : style.appendChild(document.createTextNode(code));
}
Array(12).fill(0);
let toastsCounter = 1;
class Observer {
  constructor() {
    this.subscribe = (subscriber) => {
      this.subscribers.push(subscriber);
      return () => {
        const index = this.subscribers.indexOf(subscriber);
        this.subscribers.splice(index, 1);
      };
    };
    this.publish = (data) => {
      this.subscribers.forEach((subscriber) => subscriber(data));
    };
    this.addToast = (data) => {
      this.publish(data);
      this.toasts = [
        ...this.toasts,
        data
      ];
    };
    this.create = (data) => {
      var _data_id;
      const { message, ...rest } = data;
      const id = typeof (data == null ? void 0 : data.id) === "number" || ((_data_id = data.id) == null ? void 0 : _data_id.length) > 0 ? data.id : toastsCounter++;
      const alreadyExists = this.toasts.find((toast2) => {
        return toast2.id === id;
      });
      const dismissible = data.dismissible === void 0 ? true : data.dismissible;
      if (this.dismissedToasts.has(id)) {
        this.dismissedToasts.delete(id);
      }
      if (alreadyExists) {
        this.toasts = this.toasts.map((toast2) => {
          if (toast2.id === id) {
            this.publish({
              ...toast2,
              ...data,
              id,
              title: message
            });
            return {
              ...toast2,
              ...data,
              id,
              dismissible,
              title: message
            };
          }
          return toast2;
        });
      } else {
        this.addToast({
          title: message,
          ...rest,
          dismissible,
          id
        });
      }
      return id;
    };
    this.dismiss = (id) => {
      if (id) {
        this.dismissedToasts.add(id);
        requestAnimationFrame(() => this.subscribers.forEach((subscriber) => subscriber({
          id,
          dismiss: true
        })));
      } else {
        this.toasts.forEach((toast2) => {
          this.subscribers.forEach((subscriber) => subscriber({
            id: toast2.id,
            dismiss: true
          }));
        });
      }
      return id;
    };
    this.message = (message, data) => {
      return this.create({
        ...data,
        message
      });
    };
    this.error = (message, data) => {
      return this.create({
        ...data,
        message,
        type: "error"
      });
    };
    this.success = (message, data) => {
      return this.create({
        ...data,
        type: "success",
        message
      });
    };
    this.info = (message, data) => {
      return this.create({
        ...data,
        type: "info",
        message
      });
    };
    this.warning = (message, data) => {
      return this.create({
        ...data,
        type: "warning",
        message
      });
    };
    this.loading = (message, data) => {
      return this.create({
        ...data,
        type: "loading",
        message
      });
    };
    this.promise = (promise, data) => {
      if (!data) {
        return;
      }
      let id = void 0;
      if (data.loading !== void 0) {
        id = this.create({
          ...data,
          promise,
          type: "loading",
          message: data.loading,
          description: typeof data.description !== "function" ? data.description : void 0
        });
      }
      const p = Promise.resolve(promise instanceof Function ? promise() : promise);
      let shouldDismiss = id !== void 0;
      let result;
      const originalPromise = p.then(async (response) => {
        result = [
          "resolve",
          response
        ];
        const isReactElementResponse = React.isValidElement(response);
        if (isReactElementResponse) {
          shouldDismiss = false;
          this.create({
            id,
            type: "default",
            message: response
          });
        } else if (isHttpResponse(response) && !response.ok) {
          shouldDismiss = false;
          const promiseData = typeof data.error === "function" ? await data.error(`HTTP error! status: ${response.status}`) : data.error;
          const description = typeof data.description === "function" ? await data.description(`HTTP error! status: ${response.status}`) : data.description;
          const isExtendedResult = typeof promiseData === "object" && !React.isValidElement(promiseData);
          const toastSettings = isExtendedResult ? promiseData : {
            message: promiseData
          };
          this.create({
            id,
            type: "error",
            description,
            ...toastSettings
          });
        } else if (response instanceof Error) {
          shouldDismiss = false;
          const promiseData = typeof data.error === "function" ? await data.error(response) : data.error;
          const description = typeof data.description === "function" ? await data.description(response) : data.description;
          const isExtendedResult = typeof promiseData === "object" && !React.isValidElement(promiseData);
          const toastSettings = isExtendedResult ? promiseData : {
            message: promiseData
          };
          this.create({
            id,
            type: "error",
            description,
            ...toastSettings
          });
        } else if (data.success !== void 0) {
          shouldDismiss = false;
          const promiseData = typeof data.success === "function" ? await data.success(response) : data.success;
          const description = typeof data.description === "function" ? await data.description(response) : data.description;
          const isExtendedResult = typeof promiseData === "object" && !React.isValidElement(promiseData);
          const toastSettings = isExtendedResult ? promiseData : {
            message: promiseData
          };
          this.create({
            id,
            type: "success",
            description,
            ...toastSettings
          });
        }
      }).catch(async (error) => {
        result = [
          "reject",
          error
        ];
        if (data.error !== void 0) {
          shouldDismiss = false;
          const promiseData = typeof data.error === "function" ? await data.error(error) : data.error;
          const description = typeof data.description === "function" ? await data.description(error) : data.description;
          const isExtendedResult = typeof promiseData === "object" && !React.isValidElement(promiseData);
          const toastSettings = isExtendedResult ? promiseData : {
            message: promiseData
          };
          this.create({
            id,
            type: "error",
            description,
            ...toastSettings
          });
        }
      }).finally(() => {
        if (shouldDismiss) {
          this.dismiss(id);
          id = void 0;
        }
        data.finally == null ? void 0 : data.finally.call(data);
      });
      const unwrap = () => new Promise((resolve, reject) => originalPromise.then(() => result[0] === "reject" ? reject(result[1]) : resolve(result[1])).catch(reject));
      if (typeof id !== "string" && typeof id !== "number") {
        return {
          unwrap
        };
      } else {
        return Object.assign(id, {
          unwrap
        });
      }
    };
    this.custom = (jsx, data) => {
      const id = (data == null ? void 0 : data.id) || toastsCounter++;
      this.create({
        jsx: jsx(id),
        id,
        ...data
      });
      return id;
    };
    this.getActiveToasts = () => {
      return this.toasts.filter((toast2) => !this.dismissedToasts.has(toast2.id));
    };
    this.subscribers = [];
    this.toasts = [];
    this.dismissedToasts = /* @__PURE__ */ new Set();
  }
}
const ToastState = new Observer();
const toastFunction = (message, data) => {
  const id = (data == null ? void 0 : data.id) || toastsCounter++;
  ToastState.addToast({
    title: message,
    ...data,
    id
  });
  return id;
};
const isHttpResponse = (data) => {
  return data && typeof data === "object" && "ok" in data && typeof data.ok === "boolean" && "status" in data && typeof data.status === "number";
};
const basicToast = toastFunction;
const getHistory = () => ToastState.toasts;
const getToasts = () => ToastState.getActiveToasts();
const toast = Object.assign(basicToast, {
  success: ToastState.success,
  info: ToastState.info,
  warning: ToastState.warning,
  error: ToastState.error,
  custom: ToastState.custom,
  message: ToastState.message,
  promise: ToastState.promise,
  dismiss: ToastState.dismiss,
  loading: ToastState.loading
}, {
  getHistory,
  getToasts
});
__insertCSS("[data-sonner-toaster][dir=ltr],html[dir=ltr]{--toast-icon-margin-start:-3px;--toast-icon-margin-end:4px;--toast-svg-margin-start:-1px;--toast-svg-margin-end:0px;--toast-button-margin-start:auto;--toast-button-margin-end:0;--toast-close-button-start:0;--toast-close-button-end:unset;--toast-close-button-transform:translate(-35%, -35%)}[data-sonner-toaster][dir=rtl],html[dir=rtl]{--toast-icon-margin-start:4px;--toast-icon-margin-end:-3px;--toast-svg-margin-start:0px;--toast-svg-margin-end:-1px;--toast-button-margin-start:0;--toast-button-margin-end:auto;--toast-close-button-start:unset;--toast-close-button-end:0;--toast-close-button-transform:translate(35%, -35%)}[data-sonner-toaster]{position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1:hsl(0, 0%, 99%);--gray2:hsl(0, 0%, 97.3%);--gray3:hsl(0, 0%, 95.1%);--gray4:hsl(0, 0%, 93%);--gray5:hsl(0, 0%, 90.9%);--gray6:hsl(0, 0%, 88.7%);--gray7:hsl(0, 0%, 85.8%);--gray8:hsl(0, 0%, 78%);--gray9:hsl(0, 0%, 56.1%);--gray10:hsl(0, 0%, 52.3%);--gray11:hsl(0, 0%, 43.5%);--gray12:hsl(0, 0%, 9%);--border-radius:8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:0;z-index:999999999;transition:transform .4s ease}@media (hover:none) and (pointer:coarse){[data-sonner-toaster][data-lifted=true]{transform:none}}[data-sonner-toaster][data-x-position=right]{right:var(--offset-right)}[data-sonner-toaster][data-x-position=left]{left:var(--offset-left)}[data-sonner-toaster][data-x-position=center]{left:50%;transform:translateX(-50%)}[data-sonner-toaster][data-y-position=top]{top:var(--offset-top)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--offset-bottom)}[data-sonner-toast]{--y:translateY(100%);--lift-amount:calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);touch-action:none;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:0;overflow-wrap:anywhere}[data-sonner-toast][data-styled=true]{padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px rgba(0,0,0,.1);width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}[data-sonner-toast]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-y-position=top]{top:0;--y:translateY(-100%);--lift:1;--lift-amount:calc(1 * var(--gap))}[data-sonner-toast][data-y-position=bottom]{bottom:0;--y:translateY(100%);--lift:-1;--lift-amount:calc(var(--lift) * var(--gap))}[data-sonner-toast][data-styled=true] [data-description]{font-weight:400;line-height:1.4;color:#3f3f3f}[data-rich-colors=true][data-sonner-toast][data-styled=true] [data-description]{color:inherit}[data-sonner-toaster][data-sonner-theme=dark] [data-description]{color:#e8e8e8}[data-sonner-toast][data-styled=true] [data-title]{font-weight:500;line-height:1.5;color:inherit}[data-sonner-toast][data-styled=true] [data-icon]{display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}[data-sonner-toast][data-promise=true] [data-icon]>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}[data-sonner-toast][data-styled=true] [data-icon]>*{flex-shrink:0}[data-sonner-toast][data-styled=true] [data-icon] svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}[data-sonner-toast][data-styled=true] [data-content]{display:flex;flex-direction:column;gap:2px}[data-sonner-toast][data-styled=true] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;font-weight:500;cursor:pointer;outline:0;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}[data-sonner-toast][data-styled=true] [data-button]:focus-visible{box-shadow:0 0 0 2px rgba(0,0,0,.4)}[data-sonner-toast][data-styled=true] [data-button]:first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}[data-sonner-toast][data-styled=true] [data-cancel]{color:var(--normal-text);background:rgba(0,0,0,.08)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-styled=true] [data-cancel]{background:rgba(255,255,255,.3)}[data-sonner-toast][data-styled=true] [data-close-button]{position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;color:var(--gray12);background:var(--normal-bg);border:1px solid var(--gray4);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast][data-styled=true] [data-close-button]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-styled=true] [data-disabled=true]{cursor:not-allowed}[data-sonner-toast][data-styled=true]:hover [data-close-button]:hover{background:var(--gray2);border-color:var(--gray5)}[data-sonner-toast][data-swiping=true]::before{content:'';position:absolute;left:-100%;right:-100%;height:100%;z-index:-1}[data-sonner-toast][data-y-position=top][data-swiping=true]::before{bottom:50%;transform:scaleY(3) translateY(50%)}[data-sonner-toast][data-y-position=bottom][data-swiping=true]::before{top:50%;transform:scaleY(3) translateY(-50%)}[data-sonner-toast][data-swiping=false][data-removed=true]::before{content:'';position:absolute;inset:0;transform:scaleY(2)}[data-sonner-toast][data-expanded=true]::after{content:'';position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}[data-sonner-toast][data-mounted=true]{--y:translateY(0);opacity:1}[data-sonner-toast][data-expanded=false][data-front=false]{--scale:var(--toasts-before) * 0.05 + 1;--y:translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}[data-sonner-toast]>*{transition:opacity .4s}[data-sonner-toast][data-x-position=right]{right:0}[data-sonner-toast][data-x-position=left]{left:0}[data-sonner-toast][data-expanded=false][data-front=false][data-styled=true]>*{opacity:0}[data-sonner-toast][data-visible=false]{opacity:0;pointer-events:none}[data-sonner-toast][data-mounted=true][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}[data-sonner-toast][data-removed=true][data-front=true][data-swipe-out=false]{--y:translateY(calc(var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=false]{--y:translateY(40%);opacity:0;transition:transform .5s,opacity .2s}[data-sonner-toast][data-removed=true][data-front=false]::before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount-y,0)) translateX(var(--swipe-amount-x,0));transition:none}[data-sonner-toast][data-swiped=true]{user-select:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation-duration:.2s;animation-timing-function:ease-out;animation-fill-mode:forwards}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=left]{animation-name:swipe-out-left}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=right]{animation-name:swipe-out-right}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=up]{animation-name:swipe-out-up}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=down]{animation-name:swipe-out-down}@keyframes swipe-out-left{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) - 100%));opacity:0}}@keyframes swipe-out-right{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) + 100%));opacity:0}}@keyframes swipe-out-up{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) - 100%));opacity:0}}@keyframes swipe-out-down{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) + 100%));opacity:0}}@media (max-width:600px){[data-sonner-toaster]{position:fixed;right:var(--mobile-offset-right);left:var(--mobile-offset-left);width:100%}[data-sonner-toaster][dir=rtl]{left:calc(var(--mobile-offset-left) * -1)}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - var(--mobile-offset-left) * 2)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset-left)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--mobile-offset-bottom)}[data-sonner-toaster][data-y-position=top]{top:var(--mobile-offset-top)}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset-left);right:var(--mobile-offset-right);transform:none}}[data-sonner-toaster][data-sonner-theme=light]{--normal-bg:#fff;--normal-border:var(--gray4);--normal-text:var(--gray12);--success-bg:hsl(143, 85%, 96%);--success-border:hsl(145, 92%, 87%);--success-text:hsl(140, 100%, 27%);--info-bg:hsl(208, 100%, 97%);--info-border:hsl(221, 91%, 93%);--info-text:hsl(210, 92%, 45%);--warning-bg:hsl(49, 100%, 97%);--warning-border:hsl(49, 91%, 84%);--warning-text:hsl(31, 92%, 45%);--error-bg:hsl(359, 100%, 97%);--error-border:hsl(359, 100%, 94%);--error-text:hsl(360, 100%, 45%)}[data-sonner-toaster][data-sonner-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg:#000;--normal-border:hsl(0, 0%, 20%);--normal-text:var(--gray1)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg:#fff;--normal-border:var(--gray3);--normal-text:var(--gray12)}[data-sonner-toaster][data-sonner-theme=dark]{--normal-bg:#000;--normal-bg-hover:hsl(0, 0%, 12%);--normal-border:hsl(0, 0%, 20%);--normal-border-hover:hsl(0, 0%, 25%);--normal-text:var(--gray1);--success-bg:hsl(150, 100%, 6%);--success-border:hsl(147, 100%, 12%);--success-text:hsl(150, 86%, 65%);--info-bg:hsl(215, 100%, 6%);--info-border:hsl(223, 43%, 17%);--info-text:hsl(216, 87%, 65%);--warning-bg:hsl(64, 100%, 6%);--warning-border:hsl(60, 100%, 9%);--warning-text:hsl(46, 87%, 65%);--error-bg:hsl(358, 76%, 10%);--error-border:hsl(357, 89%, 16%);--error-text:hsl(358, 100%, 81%)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]{background:var(--normal-bg);border-color:var(--normal-border);color:var(--normal-text)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]:hover{background:var(--normal-bg-hover);border-color:var(--normal-border-hover)}[data-rich-colors=true][data-sonner-toast][data-type=success]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=info]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=error]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}[data-rich-colors=true][data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size:16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:first-child{animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}100%{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}100%{opacity:.15}}@media (prefers-reduced-motion){.sonner-loading-bar,[data-sonner-toast],[data-sonner-toast]>*{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}");
const CITIES = ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"];
const LEVEL_BG = {
  critical: "#7f1d1d",
  low: "#78350f",
  moderate: "#713f12",
  good: "#14532d"
};
const LEVEL_LABEL = {
  critical: "CRITICAL",
  low: "LOW",
  moderate: "MODERATE",
  good: "GOOD"
};
function getLevel(count) {
  if (count === 0) return "critical";
  if (count <= 2) return "low";
  if (count <= 5) return "moderate";
  return "good";
}
function emptyCounts() {
  const out = {};
  for (const c of CITIES) {
    out[c] = {};
    for (const b of BLOOD_TYPES) out[c][b] = 0;
  }
  return out;
}
function timeAgo(d) {
  if (!d) return "—";
  const s = Math.floor((Date.now() - d.getTime()) / 1e3);
  if (s < 10) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min${m > 1 ? "s" : ""} ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}
function AnimatedNumber({
  value,
  duration = 800
}) {
  const [n, setN] = reactExports.useState(0);
  const startRef = reactExports.useRef(null);
  const fromRef = reactExports.useRef(0);
  reactExports.useEffect(() => {
    fromRef.current = n;
    startRef.current = null;
    let raf = 0;
    const tick = (t) => {
      if (startRef.current == null) startRef.current = t;
      const p = Math.min(1, (t - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(fromRef.current + (value - fromRef.current) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: n });
}
function HeatmapPage() {
  const [counts, setCounts] = reactExports.useState(() => emptyCounts());
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [updatedAt, setUpdatedAt] = reactExports.useState(null);
  const [, force] = reactExports.useState(0);
  const firstLoad = reactExports.useRef(true);
  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const {
        data,
        error: e
      } = await supabase.from("donors").select("city, blood_type, available").eq("available", true);
      if (e) throw e;
      const next = emptyCounts();
      for (const r of data ?? []) {
        const c = r.city;
        const b = r.blood_type;
        if (CITIES.includes(c) && BLOOD_TYPES.includes(b)) {
          next[c][b]++;
        }
      }
      setCounts(next);
      setUpdatedAt(/* @__PURE__ */ new Date());
      setError(null);
      if (silent && !firstLoad.current) toast.success("Heatmap refreshed");
      firstLoad.current = false;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load donors";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    fetchData();
    const poll = setInterval(() => fetchData(true), 6e4);
    const tick = setInterval(() => force((n) => n + 1), 15e3);
    return () => {
      clearInterval(poll);
      clearInterval(tick);
    };
  }, []);
  const cityTotals = reactExports.useMemo(() => {
    const out = {};
    for (const c of CITIES) out[c] = BLOOD_TYPES.reduce((s, b) => s + counts[c][b], 0);
    return out;
  }, [counts]);
  const cityWorst = reactExports.useMemo(() => {
    const out = {};
    for (const c of CITIES) {
      let worst = BLOOD_TYPES[0];
      let worstCount = Infinity;
      for (const b of BLOOD_TYPES) {
        if (counts[c][b] < worstCount) {
          worstCount = counts[c][b];
          worst = b;
        }
      }
      out[c] = {
        type: worst,
        count: worstCount,
        level: getLevel(worstCount)
      };
    }
    return out;
  }, [counts]);
  const criticalCells = reactExports.useMemo(() => {
    const out = [];
    for (const c of CITIES) for (const b of BLOOD_TYPES) if (counts[c][b] === 0) out.push({
      city: c,
      type: b
    });
    return out;
  }, [counts]);
  const statewideTotals = reactExports.useMemo(() => {
    const out = {};
    for (const b of BLOOD_TYPES) out[b] = CITIES.reduce((s, c) => s + counts[c][b], 0);
    return out;
  }, [counts]);
  const mostNeeded = reactExports.useMemo(() => {
    return [...BLOOD_TYPES].map((b) => ({
      type: b,
      count: statewideTotals[b]
    })).sort((a, b) => a.count - b.count).slice(0, 3);
  }, [statewideTotals]);
  const scrollToCity = (city) => {
    const el = document.getElementById(`city-${city}`);
    if (el) el.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-24 space-y-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "space-y-2 animate-rs-fade-up", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rs-eyebrow flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { size: 11 }),
        " Live Heatmap"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-serif font-bold text-4xl sm:text-5xl leading-tight", children: [
        "Blood ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
          color: "#dc2626"
        }, children: "Stock" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rs-body", children: "Real-time shortage map across Gujarat" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 pt-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rs-pill text-text-muted", children: [
          "Updated ",
          timeAgo(updatedAt)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => fetchData(), className: "rs-pill text-muted-foreground hover:text-primary inline-flex items-center gap-1 transition-colors", "aria-label": "Refresh", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 11 }),
          " Refresh"
        ] })
      ] })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rs-card p-4 border-primary/40 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rs-pill text-primary", children: "Error" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rs-body mt-1", children: error })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => fetchData(), className: "rs-btn rs-btn-secondary", children: "Retry" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rs-eyebrow", children: "Cities" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0", children: CITIES.map((c) => {
        const total = cityTotals[c];
        const hasCritical = BLOOD_TYPES.some((b) => counts[c][b] === 0);
        const hasLow = BLOOD_TYPES.some((b) => counts[c][b] >= 1 && counts[c][b] <= 2);
        const status = hasCritical ? "critical" : hasLow ? "low" : "good";
        const worst = cityWorst[c];
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => scrollToCity(c), className: "rs-card rs-card-hover text-left p-4 min-w-[200px] flex-shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-serif font-bold text-lg", children: [
              "📍 ",
              c
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rs-pill px-2 py-0.5 rounded", style: {
              background: LEVEL_BG[status],
              color: "#fff"
            }, children: status === "critical" ? "CRITICAL" : status === "low" ? "LOW STOCK" : "STABLE" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 font-mono text-2xl font-bold", children: loading ? "—" : /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedNumber, { value: total }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rs-body-sm mt-0.5", children: "total available" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rs-pill text-text-muted", children: "Most needed" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-bold text-sm px-2 py-0.5 rounded", style: {
              background: "#1a0707",
              color: "#dc2626"
            }, children: worst.type })
          ] })
        ] }, c);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rs-eyebrow", children: "Heatmap" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rs-card p-4 overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-separate", style: {
        borderSpacing: 4
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rs-pill text-text-muted", children: "City" }) }),
          BLOOD_TYPES.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-bold text-xs px-2 py-1 rounded inline-block", style: {
            background: "#1a0707",
            color: "#dc2626",
            letterSpacing: "0.5px"
          }, children: b }) }, b))
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: CITIES.map((c, ci) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "pr-3 align-middle", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-bold text-sm", children: [
              "📍 ",
              c
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rs-pill text-text-muted", children: c.toLowerCase() })
          ] }),
          BLOOD_TYPES.map((b, bi) => {
            const count = counts[c][b];
            const level = getLevel(count);
            const idx = ci * BLOOD_TYPES.length + bi;
            return /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { title: `${c} — ${b}: ${count} donor${count === 1 ? "" : "s"} available`, className: `flex items-center justify-center rounded-lg transition-all duration-300 hover:brightness-150 cursor-default ${level === "critical" ? "animate-rs-pulse-soft" : ""}`, style: {
              minWidth: 52,
              minHeight: 52,
              background: LEVEL_BG[level],
              border: "1px solid rgba(255,255,255,0.05)",
              animation: loading ? void 0 : `rs-fade-up 400ms ease-out ${idx * 30}ms both`
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-bold text-white text-base", children: loading ? "·" : /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedNumber, { value: count }) }) }) }, b);
          })
        ] }, c)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "rs-card p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-x-6 gap-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rs-pill text-text-muted", children: "Legend" }),
      ["good", "moderate", "low", "critical"].map((lv) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-4 h-4 rounded", style: {
          background: LEVEL_BG[lv],
          border: "1px solid rgba(255,255,255,0.05)"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rs-pill", children: [
          LEVEL_LABEL[lv],
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-text-muted ml-1", children: lv === "good" ? "(6+)" : lv === "moderate" ? "(3–5)" : lv === "low" ? "(1–2)" : "(0)" })
        ] })
      ] }, lv))
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rs-eyebrow flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 11 }),
        " Critical Shortages"
      ] }),
      criticalCells.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rs-card p-6 flex items-center gap-3", style: {
        borderColor: "rgba(34,197,94,0.4)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 24, className: "text-success" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif font-bold text-lg text-success", children: "All blood types stocked across Gujarat ✓" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rs-body-sm", children: "No critical shortages detected." })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", children: criticalCells.map(({
        city,
        type
      }, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rs-card p-4 relative animate-rs-pulse-glow", style: {
        borderLeft: "3px solid #dc2626",
        animationDelay: `${i * 80}ms`
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-serif font-bold", style: {
            fontSize: 28,
            color: "#dc2626",
            lineHeight: 1
          }, children: type }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rs-body-sm mt-1", children: city }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs mt-2", style: {
            color: "#dc2626",
            letterSpacing: "0.5px"
          }, children: "0 DONORS AVAILABLE" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/requests", className: "rs-btn rs-btn-primary !py-2 !px-3 text-[10px]", children: "Post Request" })
      ] }) }, `${city}-${type}`)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rs-eyebrow", children: "City Breakdown" }),
      CITIES.map((c) => {
        const total = cityTotals[c];
        const hasCritical = BLOOD_TYPES.some((b) => counts[c][b] === 0);
        const hasLow = BLOOD_TYPES.some((b) => counts[c][b] >= 1 && counts[c][b] <= 2);
        const status = hasCritical ? "critical" : hasLow ? "low" : "good";
        const max = Math.max(1, ...BLOOD_TYPES.map((b) => counts[c][b]));
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: `city-${c}`, className: "rs-card p-5 scroll-mt-24", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-serif font-bold text-xl", children: [
                "📍 ",
                c
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rs-body-sm", children: [
                total,
                " donors available"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rs-pill px-2 py-0.5 rounded", style: {
              background: LEVEL_BG[status],
              color: "#fff"
            }, children: status === "critical" ? "CRITICAL" : status === "low" ? "LOW STOCK" : "STABLE" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: BLOOD_TYPES.map((b, i) => {
            const v = counts[c][b];
            const lv = getLevel(v);
            const pct = v / max * 100;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono font-bold text-xs w-10", style: {
                color: "#dc2626"
              }, children: b }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-6 rounded overflow-hidden", style: {
                background: "#0c0c0c"
              }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full rounded transition-all duration-700 ease-out", style: {
                width: loading ? "0%" : `${pct}%`,
                background: LEVEL_BG[lv],
                transitionDelay: `${i * 60}ms`
              } }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono font-bold text-sm w-8 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedNumber, { value: v }) })
            ] }, b);
          }) })
        ] }, c);
      })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rs-eyebrow", children: "Statewide Priority" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rs-card p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-serif font-bold text-2xl mb-1", children: [
          "Most Needed ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
            color: "#dc2626"
          }, children: "Across Gujarat" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rs-body-sm mb-6", children: "Lowest available donor counts statewide" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end justify-center gap-4 sm:gap-8 flex-wrap", children: mostNeeded.map((m, i) => {
          const sizes = [120, 92, 76];
          const fonts = [44, 32, 26];
          const glow = ["0 0 60px rgba(220,38,38,0.7)", "0 0 32px rgba(220,38,38,0.45)", "0 0 20px rgba(220,38,38,0.3)"];
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rs-pill text-text-muted mb-2", children: [
              "#",
              i + 1
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl flex items-center justify-center font-serif font-bold text-white", style: {
              width: sizes[i],
              height: sizes[i],
              fontSize: fonts[i],
              background: "linear-gradient(135deg, oklch(0.58 0.22 27), oklch(0.42 0.18 27))",
              boxShadow: glow[i]
            }, children: m.type }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rs-body-sm mt-3", children: [
              "Only ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-bold text-foreground", children: m.count }),
              " ",
              "donor",
              m.count === 1 ? "" : "s",
              " statewide"
            ] })
          ] }, m.type);
        }) })
      ] })
    ] })
  ] });
}
export {
  HeatmapPage as component
};
