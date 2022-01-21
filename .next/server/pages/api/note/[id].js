module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = require('../../../ssr-module-cache.js');
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./pages/api/note/[id].js");
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

/***/ "./pages/api/note/[id].js":
/*!********************************!*\
  !*** ./pages/api/note/[id].js ***!
  \********************************/
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




const getNote = id => _src_data_data__WEBPACK_IMPORTED_MODULE_1___default.a.find(n => n.id === parseInt(id));

const handler = next_connect__WEBPACK_IMPORTED_MODULE_0___default()().get((req, res) => {
  const note = getNote(req.query.id);

  if (!note) {
    res.status(404);
    res.end();
    return;
  }

  res.json({
    data: note
  });
}).patch((req, res) => {
  const note = getNote(req.query.id);

  if (!note) {
    res.status(404);
    res.end();
    return;
  }

  const i = _src_data_data__WEBPACK_IMPORTED_MODULE_1___default.a.findIndex(n => n.id === parseInt(req.query.id));

  const updated = _objectSpread(_objectSpread({}, note), req.body);

  _src_data_data__WEBPACK_IMPORTED_MODULE_1___default.a[i] = updated;
  res.json({
    data: updated
  });
}).delete((req, res) => {
  const note = getNote(req.query.id);

  if (!note) {
    res.status(404);
    res.end();
    return;
  }

  const i = _src_data_data__WEBPACK_IMPORTED_MODULE_1___default.a.findIndex(n => n.id === parseInt(req.query.id));
  _src_data_data__WEBPACK_IMPORTED_MODULE_1___default.a.splice(i, 1);
  res.json({
    data: req.query.id
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL25leHQtY29ubmVjdC9kaXN0L2luZGV4LmNqcyIsIndlYnBhY2s6Ly8vLi9wYWdlcy9hcGkvbm90ZS8uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RhdGEvZGF0YS5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ0cm91dGVyXCIiXSwibmFtZXMiOlsiZ2V0Tm90ZSIsImlkIiwibm90ZXMiLCJmaW5kIiwibiIsInBhcnNlSW50IiwiaGFuZGxlciIsIm5jIiwiZ2V0IiwicmVxIiwicmVzIiwibm90ZSIsInF1ZXJ5Iiwic3RhdHVzIiwiZW5kIiwianNvbiIsImRhdGEiLCJwYXRjaCIsImkiLCJmaW5kSW5kZXgiLCJ1cGRhdGVkIiwiYm9keSIsImRlbGV0ZSIsInNwbGljZSIsInRpdGxlIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLElBQUk7UUFDSjtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFD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QUFBcUJ1QixPQUFLLEVBQUU7QUFBNUIsQ0FiVSxFQWNWO0FBQUV2QixJQUFFLEVBQUUsYUFBTjtBQUFxQnVCLE9BQUssRUFBRTtBQUE1QixDQWRVLEVBZVY7QUFBRXZCLElBQUUsRUFBRSxhQUFOO0FBQXFCdUIsT0FBSyxFQUFFO0FBQTVCLENBZlUsQ0FBZDtBQWlCQUMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCeEIsS0FBakIsQzs7Ozs7Ozs7Ozs7QUNqQkEsb0MiLCJmaWxlIjoicGFnZXMvYXBpL25vdGUvW2lkXS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0gcmVxdWlyZSgnLi4vLi4vLi4vc3NyLW1vZHVsZS1jYWNoZS5qcycpO1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHR2YXIgdGhyZXcgPSB0cnVlO1xuIFx0XHR0cnkge1xuIFx0XHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuIFx0XHRcdHRocmV3ID0gZmFsc2U7XG4gXHRcdH0gZmluYWxseSB7XG4gXHRcdFx0aWYodGhyZXcpIGRlbGV0ZSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0fVxuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vcGFnZXMvYXBpL25vdGUvW2lkXS5qc1wiKTtcbiIsImNvbnN0IFRyb3V0ZXIgPSByZXF1aXJlKCd0cm91dGVyJyk7XG5cbmNvbnN0IG9uZXJyb3IgPSAoZXJyLCByZXEsIHJlcykgPT5cbiAgKHJlcy5zdGF0dXNDb2RlID0gZXJyLnN0YXR1cyB8fCA1MDApICYmIHJlcy5lbmQoZXJyLm1lc3NhZ2UpO1xuY29uc3QgaXNSZXNTZW50ID0gKHJlcykgPT4gcmVzLmZpbmlzaGVkIHx8IHJlcy5oZWFkZXJzU2VudCB8fCByZXMud3JpdGFibGVFbmRlZDtcbmNvbnN0IG1vdW50ID0gKGZuKSA9PiAoZm4ucm91dGVzID8gZm4uaGFuZGxlLmJpbmQoZm4pIDogZm4pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZhY3Rvcnkoe1xuICBvbkVycm9yID0gb25lcnJvcixcbiAgb25Ob01hdGNoID0gb25lcnJvci5iaW5kKG51bGwsIHsgc3RhdHVzOiA0MDQsIG1lc3NhZ2U6IFwibm90IGZvdW5kXCIgfSksXG4gIGF0dGFjaFBhcmFtcyA9IGZhbHNlLFxufSA9IHt9KSB7XG4gIGZ1bmN0aW9uIG5jKHJlcSwgcmVzKSB7XG4gICAgcmV0dXJuIG5jLnJ1bihyZXEsIHJlcykudGhlbihcbiAgICAgICgpID0+ICFpc1Jlc1NlbnQocmVzKSAmJiBvbk5vTWF0Y2gocmVxLCByZXMpLFxuICAgICAgKGVycikgPT4gb25FcnJvcihlcnIsIHJlcSwgcmVzKVxuICAgICk7XG4gIH1cbiAgbmMucm91dGVzID0gW107XG4gIGNvbnN0IF91c2UgPSBUcm91dGVyLnByb3RvdHlwZS51c2UuYmluZChuYyk7XG4gIGNvbnN0IF9maW5kID0gVHJvdXRlci5wcm90b3R5cGUuZmluZC5iaW5kKG5jKTtcbiAgY29uc3QgX2FkZCA9IFRyb3V0ZXIucHJvdG90eXBlLmFkZC5iaW5kKG5jKTtcbiAgZnVuY3Rpb24gYWRkKG1ldGhvZCwgYmFzZSwgLi4uZm5zKSB7XG4gICAgaWYgKHR5cGVvZiBiYXNlID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBhZGQobWV0aG9kLCBcIipcIiwgYmFzZSwgLi4uZm5zKTtcbiAgICBfYWRkKG1ldGhvZCwgYmFzZSwgLi4uZm5zKTtcbiAgICByZXR1cm4gbmM7XG4gIH1cbiAgbmMudXNlID0gZnVuY3Rpb24gdXNlKGJhc2UsIC4uLmZucykge1xuICAgIGlmICh0eXBlb2YgYmFzZSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gdGhpcy51c2UoXCIvXCIsIGJhc2UsIC4uLmZucyk7XG4gICAgaWYgKHR5cGVvZiBiYXNlID09PSBcInN0cmluZ1wiICYmIGJhc2UgIT09IFwiL1wiKSB7XG4gICAgICBsZXQgc2xhc2hBZGRlZCA9IGZhbHNlO1xuICAgICAgZm5zLnVuc2hpZnQoKHJlcSwgXywgbmV4dCkgPT4ge1xuICAgICAgICByZXEudXJsID0gcmVxLnVybC5zdWJzdHJpbmcoYmFzZS5sZW5ndGgpO1xuICAgICAgICBpZiAoKHNsYXNoQWRkZWQgPSByZXEudXJsWzBdICE9PSBcIi9cIikpIHJlcS51cmwgPSBcIi9cIiArIHJlcS51cmw7XG4gICAgICAgIG5leHQoKTtcbiAgICAgIH0pO1xuICAgICAgZm5zLnB1c2goXG4gICAgICAgIChyZXEsIF8sIG5leHQpID0+XG4gICAgICAgICAgKHJlcS51cmwgPSBiYXNlICsgKHNsYXNoQWRkZWQgPyByZXEudXJsLnN1YnN0cmluZygxKSA6IHJlcS51cmwpKSAmJlxuICAgICAgICAgIG5leHQoKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBfdXNlKGJhc2UsIC4uLmZucy5tYXAobW91bnQpKTtcbiAgICByZXR1cm4gbmM7XG4gIH07XG4gIG5jLmFsbCA9IGFkZC5iaW5kKG5jLCBcIlwiKTtcbiAgbmMuZ2V0ID0gYWRkLmJpbmQobmMsIFwiR0VUXCIpO1xuICBuYy5oZWFkID0gYWRkLmJpbmQobmMsIFwiSEVBRFwiKTtcbiAgbmMucG9zdCA9IGFkZC5iaW5kKG5jLCBcIlBPU1RcIik7XG4gIG5jLnB1dCA9IGFkZC5iaW5kKG5jLCBcIlBVVFwiKTtcbiAgbmMuZGVsZXRlID0gYWRkLmJpbmQobmMsIFwiREVMRVRFXCIpO1xuICBuYy5vcHRpb25zID0gYWRkLmJpbmQobmMsIFwiT1BUSU9OU1wiKTtcbiAgbmMudHJhY2UgPSBhZGQuYmluZChuYywgXCJUUkFDRVwiKTtcbiAgbmMucGF0Y2ggPSBhZGQuYmluZChuYywgXCJQQVRDSFwiKTtcbiAgbmMucnVuID0gZnVuY3Rpb24gcnVuKHJlcSwgcmVzKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMuaGFuZGxlKHJlcSwgcmVzLCAoZXJyKSA9PiAoZXJyID8gcmVqZWN0KGVycikgOiByZXNvbHZlKCkpKTtcbiAgICB9KTtcbiAgfTtcbiAgbmMuaGFuZGxlID0gZnVuY3Rpb24gaGFuZGxlKHJlcSwgcmVzLCBkb25lKSB7XG4gICAgY29uc3QgaWR4ID0gcmVxLnVybC5pbmRleE9mKFwiP1wiKTtcbiAgICBjb25zdCB7IGhhbmRsZXJzLCBwYXJhbXMgfSA9IF9maW5kKFxuICAgICAgcmVxLm1ldGhvZCxcbiAgICAgIGlkeCAhPT0gLTEgPyByZXEudXJsLnN1YnN0cmluZygwLCBpZHgpIDogcmVxLnVybFxuICAgICk7XG4gICAgaWYgKGF0dGFjaFBhcmFtcykgcmVxLnBhcmFtcyA9IHBhcmFtcztcbiAgICBsZXQgaSA9IDA7XG4gICAgY29uc3QgbGVuID0gaGFuZGxlcnMubGVuZ3RoO1xuICAgIGNvbnN0IGxvb3AgPSBhc3luYyAobmV4dCkgPT4gaGFuZGxlcnNbaSsrXShyZXEsIHJlcywgbmV4dCk7XG4gICAgY29uc3QgbmV4dCA9IChlcnIpID0+IHtcbiAgICAgIGkgPCBsZW5cbiAgICAgICAgPyBlcnJcbiAgICAgICAgICA/IG9uRXJyb3IoZXJyLCByZXEsIHJlcywgbmV4dClcbiAgICAgICAgICA6IGxvb3AobmV4dCkuY2F0Y2gobmV4dClcbiAgICAgICAgOiBkb25lICYmIGRvbmUoZXJyKTtcbiAgICB9O1xuICAgIG5leHQoKTtcbiAgfTtcbiAgcmV0dXJuIG5jO1xufVxuIiwiaW1wb3J0IG5jIGZyb20gJ25leHQtY29ubmVjdCdcclxuaW1wb3J0IG5vdGVzIGZyb20gJy4uLy4uLy4uL3NyYy9kYXRhL2RhdGEnXHJcblxyXG5jb25zdCBnZXROb3RlID0gaWQgPT4gbm90ZXMuZmluZChuID0+IG4uaWQgPT09IHBhcnNlSW50KGlkKSlcclxuXHJcbmNvbnN0IGhhbmRsZXIgPSBuYygpXHJcbiAgLmdldCgocmVxLCByZXMpID0+IHtcclxuICAgIFxyXG4gICAgY29uc3Qgbm90ZSA9IGdldE5vdGUocmVxLnF1ZXJ5LmlkKVxyXG5cclxuICAgIGlmICghbm90ZSkge1xyXG4gICAgICByZXMuc3RhdHVzKDQwNClcclxuICAgICAgcmVzLmVuZCgpXHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIHJlcy5qc29uKHtkYXRhOiBub3RlfSlcclxuICB9KVxyXG4gIC5wYXRjaCgocmVxLCByZXMpID0+IHtcclxuICAgIGNvbnN0IG5vdGUgPSBnZXROb3RlKHJlcS5xdWVyeS5pZClcclxuXHJcbiAgICBpZiAoIW5vdGUpIHtcclxuICAgICAgcmVzLnN0YXR1cyg0MDQpXHJcbiAgICAgIHJlcy5lbmQoKVxyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIFxyXG4gICAgY29uc3QgaSA9IG5vdGVzLmZpbmRJbmRleChuID0+IG4uaWQgPT09IHBhcnNlSW50KHJlcS5xdWVyeS5pZCkpXHJcbiAgICBjb25zdCB1cGRhdGVkID0gey4uLm5vdGUsIC4uLnJlcS5ib2R5fVxyXG5cclxuICAgIG5vdGVzW2ldID0gdXBkYXRlZFxyXG4gICAgcmVzLmpzb24oe2RhdGE6IHVwZGF0ZWR9KVxyXG4gIH0pXHJcbiAgLmRlbGV0ZSgocmVxLCByZXMpID0+IHtcclxuICAgIGNvbnN0IG5vdGUgPSBnZXROb3RlKHJlcS5xdWVyeS5pZClcclxuXHJcbiAgICBpZiAoIW5vdGUpIHtcclxuICAgICAgcmVzLnN0YXR1cyg0MDQpXHJcbiAgICAgIHJlcy5lbmQoKVxyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIGNvbnN0IGkgPSBub3Rlcy5maW5kSW5kZXgobiA9PiBuLmlkID09PSBwYXJzZUludChyZXEucXVlcnkuaWQpKVxyXG4gICAgXHJcbiAgICBub3Rlcy5zcGxpY2UoaSwgMSlcclxuXHJcbiAgICByZXMuanNvbih7ZGF0YTogcmVxLnF1ZXJ5LmlkfSlcclxuICB9KVxyXG4gIFxyXG5cclxuZXhwb3J0IGRlZmF1bHQgaGFuZGxlciIsImNvbnN0IG5vdGVzID0gW1xyXG4gICAgeyBpZDogMTY0MjY4MzA2ODEzOCwgdGl0bGU6ICdOb3RlIDAnIH0sXHJcbiAgICB7IGlkOiAxNjQyNjgzMDY4MTM5LCB0aXRsZTogJ05vdGUgMScgfSxcclxuICAgIHsgaWQ6IDE2NDI2ODMwNjgxNDAsIHRpdGxlOiAnTm90ZSAyJyB9LFxyXG4gICAgeyBpZDogMTY0MjY4MzA2ODE0MSwgdGl0bGU6ICdOb3RlIDMnIH0sXHJcbiAgICB7IGlkOiAxNjQyNjgzMDY4MTQyLCB0aXRsZTogJ05vdGUgNCcgfSxcclxuICAgIHsgaWQ6IDE2NDI2ODMwNjgxNDMsIHRpdGxlOiAnTm90ZSA1JyB9LFxyXG4gICAgeyBpZDogMTY0MjY4MzA2ODE0NCwgdGl0bGU6ICdOb3RlIDYnIH0sXHJcbiAgICB7IGlkOiAxNjQyNjgzMDY4MTQ1LCB0aXRsZTogJ05vdGUgNycgfSxcclxuICAgIHsgaWQ6IDE2NDI2ODMwNjgxNDYsIHRpdGxlOiAnTm90ZSA4JyB9LFxyXG4gICAgeyBpZDogMTY0MjY4MzA2ODE0NywgdGl0bGU6ICdOb3RlIDknIH0sXHJcbiAgICB7IGlkOiAxNjQyNjgzMDY4MTQ4LCB0aXRsZTogJ05vdGUgMTAnIH0sXHJcbiAgICB7IGlkOiAxNjQyNjgzMDY4MTQ5LCB0aXRsZTogJ05vdGUgMTEnIH0sXHJcbiAgICB7IGlkOiAxNjQyNjgzMDY4MTUwLCB0aXRsZTogJ05vdGUgMTInIH0sXHJcbiAgICB7IGlkOiAxNjQyNjgzMDY4MTUxLCB0aXRsZTogJ05vdGUgMTMnIH0sXHJcbiAgICB7IGlkOiAxNjQyNjgzMDY4MTUyLCB0aXRsZTogJ05vdGUgMTQnIH1cclxuICBdXHJcbm1vZHVsZS5leHBvcnRzID0gbm90ZXMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ0cm91dGVyXCIpOyJdLCJzb3VyY2VSb290IjoiIn0=