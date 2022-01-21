module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = require('../../ssr-module-cache.js');
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./pages/api/note/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/next-connect/dist/index.cjs":
/*!**************************************************!*\
  !*** ./node_modules/next-connect/dist/index.cjs ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const Trouter = __webpack_require__(/*! trouter */ "trouter");

const onerror = (err, req, res) =>
  (res.statusCode = err.status || 500) && res.end(err.message);
const isResSent = (res) => res.finished || res.headersSent || res.writableEnded;
const mount = (fn) => (fn.routes ? fn.handle.bind(fn) : fn);

module.exports = function factory({
  onError = onerror,
  onNoMatch = onerror.bind(null, { status: 404, message: "not found" }),
  attachParams = false,
} = {}) {
  function nc(req, res) {
    return nc.run(req, res).then(
      () => !isResSent(res) && onNoMatch(req, res),
      (err) => onError(err, req, res)
    );
  }
  nc.routes = [];
  const _use = Trouter.prototype.use.bind(nc);
  const _find = Trouter.prototype.find.bind(nc);
  const _add = Trouter.prototype.add.bind(nc);
  function add(method, base, ...fns) {
    if (typeof base === "function") return add(method, "*", base, ...fns);
    _add(method, base, ...fns);
    return nc;
  }
  nc.use = function use(base, ...fns) {
    if (typeof base === "function") return this.use("/", base, ...fns);
    if (typeof base === "string" && base !== "/") {
      let slashAdded = false;
      fns.unshift((req, _, next) => {
        req.url = req.url.substring(base.length);
        if ((slashAdded = req.url[0] !== "/")) req.url = "/" + req.url;
        next();
      });
      fns.push(
        (req, _, next) =>
          (req.url = base + (slashAdded ? req.url.substring(1) : req.url)) &&
          next()
      );
    }

    _use(base, ...fns.map(mount));
    return nc;
  };
  nc.all = add.bind(nc, "");
  nc.get = add.bind(nc, "GET");
  nc.head = add.bind(nc, "HEAD");
  nc.post = add.bind(nc, "POST");
  nc.put = add.bind(nc, "PUT");
  nc.delete = add.bind(nc, "DELETE");
  nc.options = add.bind(nc, "OPTIONS");
  nc.trace = add.bind(nc, "TRACE");
  nc.patch = add.bind(nc, "PATCH");
  nc.run = function run(req, res) {
    return new Promise((resolve, reject) => {
      this.handle(req, res, (err) => (err ? reject(err) : resolve()));
    });
  };
  nc.handle = function handle(req, res, done) {
    const idx = req.url.indexOf("?");
    const { handlers, params } = _find(
      req.method,
      idx !== -1 ? req.url.substring(0, idx) : req.url
    );
    if (attachParams) req.params = params;
    let i = 0;
    const len = handlers.length;
    const loop = async (next) => handlers[i++](req, res, next);
    const next = (err) => {
      i < len
        ? err
          ? onError(err, req, res, next)
          : loop(next).catch(next)
        : done && done(err);
    };
    next();
  };
  return nc;
}


/***/ }),

/***/ "./pages/api/note/index.js":
/*!*********************************!*\
  !*** ./pages/api/note/index.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var next_connect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-connect */ "./node_modules/next-connect/dist/index.cjs");
/* harmony import */ var next_connect__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_connect__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _src_data_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../src/data/data */ "./src/data/data.js");
/* harmony import */ var _src_data_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_src_data_data__WEBPACK_IMPORTED_MODULE_1__);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



const handler = next_connect__WEBPACK_IMPORTED_MODULE_0___default()().get((req, res) => {
  res.json({
    data: _src_data_data__WEBPACK_IMPORTED_MODULE_1___default.a
  });
}).post((req, res) => {
  const note = _objectSpread(_objectSpread({}, req.body), {}, {
    id: Date.now()
  });

  if (!note) {
    return res.status(400).json({
      message: 'note cannot be empty'
    });
  }

  _src_data_data__WEBPACK_IMPORTED_MODULE_1___default.a.push(note);
  console.log(_src_data_data__WEBPACK_IMPORTED_MODULE_1___default.a);
  res.json({
    data: note
  });
});
/* harmony default export */ __webpack_exports__["default"] = (handler);

/***/ }),

/***/ "./src/data/data.js":
/*!**************************!*\
  !*** ./src/data/data.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

const notes = [{
  id: 1642683068138,
  title: 'Note 0'
}, {
  id: 1642683068139,
  title: 'Note 1'
}, {
  id: 1642683068140,
  title: 'Note 2'
}, {
  id: 1642683068141,
  title: 'Note 3'
}, {
  id: 1642683068142,
  title: 'Note 4'
}, {
  id: 1642683068143,
  title: 'Note 5'
}, {
  id: 1642683068144,
  title: 'Note 6'
}, {
  id: 1642683068145,
  title: 'Note 7'
}, {
  id: 1642683068146,
  title: 'Note 8'
}, {
  id: 1642683068147,
  title: 'Note 9'
}, {
  id: 1642683068148,
  title: 'Note 10'
}, {
  id: 1642683068149,
  title: 'Note 11'
}, {
  id: 1642683068150,
  title: 'Note 12'
}, {
  id: 1642683068151,
  title: 'Note 13'
}, {
  id: 1642683068152,
  title: 'Note 14'
}];
module.exports = notes;

/***/ }),

/***/ "trouter":
/*!**************************!*\
  !*** external "trouter" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("trouter");

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL25leHQtY29ubmVjdC9kaXN0L2luZGV4LmNqcyIsIndlYnBhY2s6Ly8vLi9wYWdlcy9hcGkvbm90ZS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZGF0YS9kYXRhLmpzIiwid2VicGFjazovLy9leHRlcm5hbCBcInRyb3V0ZXJcIiJdLCJuYW1lcyI6WyJoYW5kbGVyIiwibmMiLCJnZXQiLCJyZXEiLCJyZXMiLCJqc29uIiwiZGF0YSIsIm5vdGVzIiwicG9zdCIsIm5vdGUiLCJib2R5IiwiaWQiLCJEYXRlIiwibm93Iiwic3RhdHVzIiwibWVzc2FnZSIsInB1c2giLCJjb25zb2xlIiwibG9nIiwidGl0bGUiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOztRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsSUFBSTtRQUNKO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtR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LENBYlUsRUFjVjtBQUFFUixJQUFFLEVBQUUsYUFBTjtBQUFxQlEsT0FBSyxFQUFFO0FBQTVCLENBZFUsRUFlVjtBQUFFUixJQUFFLEVBQUUsYUFBTjtBQUFxQlEsT0FBSyxFQUFFO0FBQTVCLENBZlUsQ0FBZDtBQWlCQUMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCZCxLQUFqQixDOzs7Ozs7Ozs7OztBQ2pCQSxvQyIsImZpbGUiOiJwYWdlcy9hcGkvbm90ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0gcmVxdWlyZSgnLi4vLi4vc3NyLW1vZHVsZS1jYWNoZS5qcycpO1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHR2YXIgdGhyZXcgPSB0cnVlO1xuIFx0XHR0cnkge1xuIFx0XHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuIFx0XHRcdHRocmV3ID0gZmFsc2U7XG4gXHRcdH0gZmluYWxseSB7XG4gXHRcdFx0aWYodGhyZXcpIGRlbGV0ZSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0fVxuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vcGFnZXMvYXBpL25vdGUvaW5kZXguanNcIik7XG4iLCJjb25zdCBUcm91dGVyID0gcmVxdWlyZSgndHJvdXRlcicpO1xuXG5jb25zdCBvbmVycm9yID0gKGVyciwgcmVxLCByZXMpID0+XG4gIChyZXMuc3RhdHVzQ29kZSA9IGVyci5zdGF0dXMgfHwgNTAwKSAmJiByZXMuZW5kKGVyci5tZXNzYWdlKTtcbmNvbnN0IGlzUmVzU2VudCA9IChyZXMpID0+IHJlcy5maW5pc2hlZCB8fCByZXMuaGVhZGVyc1NlbnQgfHwgcmVzLndyaXRhYmxlRW5kZWQ7XG5jb25zdCBtb3VudCA9IChmbikgPT4gKGZuLnJvdXRlcyA/IGZuLmhhbmRsZS5iaW5kKGZuKSA6IGZuKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmYWN0b3J5KHtcbiAgb25FcnJvciA9IG9uZXJyb3IsXG4gIG9uTm9NYXRjaCA9IG9uZXJyb3IuYmluZChudWxsLCB7IHN0YXR1czogNDA0LCBtZXNzYWdlOiBcIm5vdCBmb3VuZFwiIH0pLFxuICBhdHRhY2hQYXJhbXMgPSBmYWxzZSxcbn0gPSB7fSkge1xuICBmdW5jdGlvbiBuYyhyZXEsIHJlcykge1xuICAgIHJldHVybiBuYy5ydW4ocmVxLCByZXMpLnRoZW4oXG4gICAgICAoKSA9PiAhaXNSZXNTZW50KHJlcykgJiYgb25Ob01hdGNoKHJlcSwgcmVzKSxcbiAgICAgIChlcnIpID0+IG9uRXJyb3IoZXJyLCByZXEsIHJlcylcbiAgICApO1xuICB9XG4gIG5jLnJvdXRlcyA9IFtdO1xuICBjb25zdCBfdXNlID0gVHJvdXRlci5wcm90b3R5cGUudXNlLmJpbmQobmMpO1xuICBjb25zdCBfZmluZCA9IFRyb3V0ZXIucHJvdG90eXBlLmZpbmQuYmluZChuYyk7XG4gIGNvbnN0IF9hZGQgPSBUcm91dGVyLnByb3RvdHlwZS5hZGQuYmluZChuYyk7XG4gIGZ1bmN0aW9uIGFkZChtZXRob2QsIGJhc2UsIC4uLmZucykge1xuICAgIGlmICh0eXBlb2YgYmFzZSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gYWRkKG1ldGhvZCwgXCIqXCIsIGJhc2UsIC4uLmZucyk7XG4gICAgX2FkZChtZXRob2QsIGJhc2UsIC4uLmZucyk7XG4gICAgcmV0dXJuIG5jO1xuICB9XG4gIG5jLnVzZSA9IGZ1bmN0aW9uIHVzZShiYXNlLCAuLi5mbnMpIHtcbiAgICBpZiAodHlwZW9mIGJhc2UgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHRoaXMudXNlKFwiL1wiLCBiYXNlLCAuLi5mbnMpO1xuICAgIGlmICh0eXBlb2YgYmFzZSA9PT0gXCJzdHJpbmdcIiAmJiBiYXNlICE9PSBcIi9cIikge1xuICAgICAgbGV0IHNsYXNoQWRkZWQgPSBmYWxzZTtcbiAgICAgIGZucy51bnNoaWZ0KChyZXEsIF8sIG5leHQpID0+IHtcbiAgICAgICAgcmVxLnVybCA9IHJlcS51cmwuc3Vic3RyaW5nKGJhc2UubGVuZ3RoKTtcbiAgICAgICAgaWYgKChzbGFzaEFkZGVkID0gcmVxLnVybFswXSAhPT0gXCIvXCIpKSByZXEudXJsID0gXCIvXCIgKyByZXEudXJsO1xuICAgICAgICBuZXh0KCk7XG4gICAgICB9KTtcbiAgICAgIGZucy5wdXNoKFxuICAgICAgICAocmVxLCBfLCBuZXh0KSA9PlxuICAgICAgICAgIChyZXEudXJsID0gYmFzZSArIChzbGFzaEFkZGVkID8gcmVxLnVybC5zdWJzdHJpbmcoMSkgOiByZXEudXJsKSkgJiZcbiAgICAgICAgICBuZXh0KClcbiAgICAgICk7XG4gICAgfVxuXG4gICAgX3VzZShiYXNlLCAuLi5mbnMubWFwKG1vdW50KSk7XG4gICAgcmV0dXJuIG5jO1xuICB9O1xuICBuYy5hbGwgPSBhZGQuYmluZChuYywgXCJcIik7XG4gIG5jLmdldCA9IGFkZC5iaW5kKG5jLCBcIkdFVFwiKTtcbiAgbmMuaGVhZCA9IGFkZC5iaW5kKG5jLCBcIkhFQURcIik7XG4gIG5jLnBvc3QgPSBhZGQuYmluZChuYywgXCJQT1NUXCIpO1xuICBuYy5wdXQgPSBhZGQuYmluZChuYywgXCJQVVRcIik7XG4gIG5jLmRlbGV0ZSA9IGFkZC5iaW5kKG5jLCBcIkRFTEVURVwiKTtcbiAgbmMub3B0aW9ucyA9IGFkZC5iaW5kKG5jLCBcIk9QVElPTlNcIik7XG4gIG5jLnRyYWNlID0gYWRkLmJpbmQobmMsIFwiVFJBQ0VcIik7XG4gIG5jLnBhdGNoID0gYWRkLmJpbmQobmMsIFwiUEFUQ0hcIik7XG4gIG5jLnJ1biA9IGZ1bmN0aW9uIHJ1bihyZXEsIHJlcykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLmhhbmRsZShyZXEsIHJlcywgKGVycikgPT4gKGVyciA/IHJlamVjdChlcnIpIDogcmVzb2x2ZSgpKSk7XG4gICAgfSk7XG4gIH07XG4gIG5jLmhhbmRsZSA9IGZ1bmN0aW9uIGhhbmRsZShyZXEsIHJlcywgZG9uZSkge1xuICAgIGNvbnN0IGlkeCA9IHJlcS51cmwuaW5kZXhPZihcIj9cIik7XG4gICAgY29uc3QgeyBoYW5kbGVycywgcGFyYW1zIH0gPSBfZmluZChcbiAgICAgIHJlcS5tZXRob2QsXG4gICAgICBpZHggIT09IC0xID8gcmVxLnVybC5zdWJzdHJpbmcoMCwgaWR4KSA6IHJlcS51cmxcbiAgICApO1xuICAgIGlmIChhdHRhY2hQYXJhbXMpIHJlcS5wYXJhbXMgPSBwYXJhbXM7XG4gICAgbGV0IGkgPSAwO1xuICAgIGNvbnN0IGxlbiA9IGhhbmRsZXJzLmxlbmd0aDtcbiAgICBjb25zdCBsb29wID0gYXN5bmMgKG5leHQpID0+IGhhbmRsZXJzW2krK10ocmVxLCByZXMsIG5leHQpO1xuICAgIGNvbnN0IG5leHQgPSAoZXJyKSA9PiB7XG4gICAgICBpIDwgbGVuXG4gICAgICAgID8gZXJyXG4gICAgICAgICAgPyBvbkVycm9yKGVyciwgcmVxLCByZXMsIG5leHQpXG4gICAgICAgICAgOiBsb29wKG5leHQpLmNhdGNoKG5leHQpXG4gICAgICAgIDogZG9uZSAmJiBkb25lKGVycik7XG4gICAgfTtcbiAgICBuZXh0KCk7XG4gIH07XG4gIHJldHVybiBuYztcbn1cbiIsImltcG9ydCBuYyBmcm9tICduZXh0LWNvbm5lY3QnXHJcblxyXG5pbXBvcnQgbm90ZXMgZnJvbSAnLi4vLi4vLi4vc3JjL2RhdGEvZGF0YSc7XHJcblxyXG5jb25zdCBoYW5kbGVyID0gbmMoKVxyXG5cclxuLmdldCgocmVxLCByZXMpPT57XHJcbiAgICByZXMuanNvbih7IGRhdGE6IG5vdGVzfSlcclxufSlcclxuXHJcbi5wb3N0KChyZXEsIHJlcyk9PntcclxuICAgIGNvbnN0IG5vdGUgPSB7IC4uLnJlcS5ib2R5LCBpZDogRGF0ZS5ub3coKX07XHJcbiAgICBpZighbm90ZSl7XHJcbiAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5qc29uKHttZXNzYWdlOiAnbm90ZSBjYW5ub3QgYmUgZW1wdHknfSlcclxuICAgIH1cclxuICAgIG5vdGVzLnB1c2gobm90ZSlcclxuICAgIGNvbnNvbGUubG9nKG5vdGVzKVxyXG5cclxuICAgIHJlcy5qc29uKHsgZGF0YTogbm90ZX0pXHJcbn0pXHJcblxyXG5leHBvcnQgZGVmYXVsdCBoYW5kbGVyOyIsImNvbnN0IG5vdGVzID0gW1xyXG4gICAgeyBpZDogMTY0MjY4MzA2ODEzOCwgdGl0bGU6ICdOb3RlIDAnIH0sXHJcbiAgICB7IGlkOiAxNjQyNjgzMDY4MTM5LCB0aXRsZTogJ05vdGUgMScgfSxcclxuICAgIHsgaWQ6IDE2NDI2ODMwNjgxNDAsIHRpdGxlOiAnTm90ZSAyJyB9LFxyXG4gICAgeyBpZDogMTY0MjY4MzA2ODE0MSwgdGl0bGU6ICdOb3RlIDMnIH0sXHJcbiAgICB7IGlkOiAxNjQyNjgzMDY4MTQyLCB0aXRsZTogJ05vdGUgNCcgfSxcclxuICAgIHsgaWQ6IDE2NDI2ODMwNjgxNDMsIHRpdGxlOiAnTm90ZSA1JyB9LFxyXG4gICAgeyBpZDogMTY0MjY4MzA2ODE0NCwgdGl0bGU6ICdOb3RlIDYnIH0sXHJcbiAgICB7IGlkOiAxNjQyNjgzMDY4MTQ1LCB0aXRsZTogJ05vdGUgNycgfSxcclxuICAgIHsgaWQ6IDE2NDI2ODMwNjgxNDYsIHRpdGxlOiAnTm90ZSA4JyB9LFxyXG4gICAgeyBpZDogMTY0MjY4MzA2ODE0NywgdGl0bGU6ICdOb3RlIDknIH0sXHJcbiAgICB7IGlkOiAxNjQyNjgzMDY4MTQ4LCB0aXRsZTogJ05vdGUgMTAnIH0sXHJcbiAgICB7IGlkOiAxNjQyNjgzMDY4MTQ5LCB0aXRsZTogJ05vdGUgMTEnIH0sXHJcbiAgICB7IGlkOiAxNjQyNjgzMDY4MTUwLCB0aXRsZTogJ05vdGUgMTInIH0sXHJcbiAgICB7IGlkOiAxNjQyNjgzMDY4MTUxLCB0aXRsZTogJ05vdGUgMTMnIH0sXHJcbiAgICB7IGlkOiAxNjQyNjgzMDY4MTUyLCB0aXRsZTogJ05vdGUgMTQnIH1cclxuICBdXHJcbm1vZHVsZS5leHBvcnRzID0gbm90ZXMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ0cm91dGVyXCIpOyJdLCJzb3VyY2VSb290IjoiIn0=