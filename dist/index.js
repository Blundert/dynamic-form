function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var reactJss = require('react-jss');

var validate = function validate(validation, data) {
  var error = false;

  switch (validation.kind) {
    case "required":
      error = requiredValidation(data);
      break;

    case "pattern":
      error = patternValidation(data, validation.reg, validation.considerRegAs);
      break;

    case "minlength":
      error = minLengthValidation(data, validation.value);
      break;

    case "maxlength":
      error = maxLengthValidation(data, validation.value);
      break;

    case "validobject":
      error = validAObjectValidation(data);
      break;

    case "equalfield":
      error = fatherValidation();
      break;

    case "equalfield:father":
      error = equalfieldValidation(data, validation.valueToCompare);
      break;

    default:
      error = false;
      break;
  }

  return error;
};

var fatherValidation = function fatherValidation() {
  return null;
};

var requiredValidation = function requiredValidation(data) {
  var error = false;

  if (data === "" || data === false || Array.isArray(data) && data.length === 0) {
    error = true;
  }

  return error;
};

var minLengthValidation = function minLengthValidation(data, value) {
  var error = false;

  if (data.length < value) {
    error = true;
  }

  return error;
};

var maxLengthValidation = function maxLengthValidation(data, value) {
  var error = false;

  if (data.length > value) {
    error = true;
  }

  return error;
};

var validAObjectValidation = function validAObjectValidation(data) {
  var error = false;

  if (typeof data !== "object") {
    error = true;
  }

  return error;
};

var patternValidation = function patternValidation(data, reg, considerRegAs) {
  var error = false;

  if (data && data !== "") {
    var check = data.match(reg);
    error = check && check.length > 0 ? true : false;

    if (considerRegAs === "positive") {
      error = !error;
    }
  }

  return error;
};

var equalfieldValidation = function equalfieldValidation(data, valueToCompare) {
  var error = false;

  if (data !== null && valueToCompare !== null && data !== valueToCompare) {
    error = true;
  }

  return error;
};

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

var deafultTheme = {
  colorPrimary: 'green'
};

var DynamicFormModelStateContext = /*#__PURE__*/React.createContext();
var DynamicFormModelDispatchContext = /*#__PURE__*/React.createContext();
var DynamicFormErrorStateContext = /*#__PURE__*/React.createContext();
var DynamicFormErrorDispatchContext = /*#__PURE__*/React.createContext();
var DynamicFormStyleContext = /*#__PURE__*/React.createContext();
var DynamicFormHelperContext = /*#__PURE__*/React.createContext();
var modelState = {};
var errorState = {};

var encryptionLocal = function encryptionLocal(value) {
  return value;
};

var helpers = {
  submit: function submit() {

    var copyOfModelState = _extends({}, modelState);

    var copyOfErrorState = _extends({}, errorState);

    var _globalErrors = 0;
    delete copyOfModelState._metadata;
    delete copyOfModelState._touched;
    delete copyOfErrorState._globalErrors;
    delete copyOfErrorState._showError;
    console.log(modelState);
    console.log(errorState);
    console.log("devo popolare errorstate");
    copyOfErrorState = updateErrors(getConfig())(copyOfModelState);
    console.log(copyOfErrorState);
    getDomElement().current.upadareErrorService(copyOfErrorState);
    Object.keys(copyOfErrorState).forEach(function (element) {
      _globalErrors += copyOfErrorState[element].length;
    });

    if (Object.keys(copyOfErrorState).length === 0) {
      return {
        state: copyOfModelState,
        stateCrypted: applyCrypt2State(copyOfModelState, getConfig()),
        stateFull: modelState
      };
    } else {
      throw {
        globalErrors: _globalErrors,
        errors: copyOfErrorState
      };
    }
  }
};

function dynamicFormModelReducer(state, action) {
  var type = action.type,
      newState = action.newState,
      metadata = action.metadata;

  switch (type) {
    case "UPDATE_MODEL":
      {
        var newStateLocal = _extends({}, state, newState, {
          _metadata: metadata,
          _touched: true
        });

        modelState = newStateLocal;
        return newStateLocal;
      }

    case "SETUP_MODEL":
      {
        var _newStateLocal = _extends({}, state, newState, {
          _metadata: metadata
        });

        modelState = _newStateLocal;
        return _newStateLocal;
      }

    default:
      {
        throw new Error("Unhandled action type: " + action.type);
      }
  }
}

function dynamicFormErrorReducer(state, action) {
  var type = action.type,
      newState = action.newState;

  switch (type) {
    case "UPDATE_ERROR":
      {
        var _globalErrors = 0;

        var errorSummary = _extends({}, state, newState);

        var showError = errorSummary._showError;
        delete errorSummary._globalErrors;
        delete errorSummary._showError;
        Object.keys(errorSummary).forEach(function (element) {
          _globalErrors += errorSummary[element].length;
        });
        errorSummary["_globalErrors"] = _globalErrors;
        errorSummary["_showError"] = showError;
        errorState = errorSummary;
        return errorSummary;
      }

    case "UPDATE_ERROR_ON_SUBMIT":
      {
        var _globalErrors2 = 0;

        var _errorSummary = _extends({}, state, newState);

        delete _errorSummary._globalErrors;
        delete _errorSummary._showError;
        Object.keys(_errorSummary).forEach(function (element) {
          _globalErrors2 += _errorSummary[element].length;
        });
        _errorSummary["_globalErrors"] = _globalErrors2;
        _errorSummary["_showError"] = true;
        errorState = _errorSummary;
        return _errorSummary;
      }

    case "SHOW_ERROR":
      {
        return _extends({}, state, {
          _showError: !state._showError
        });
      }

    default:
      {
        throw new Error("Unhandled action type: " + action.type);
      }
  }
}

var initialStateError = {
  _showError: false
};
var initialStateModel = {
  _metadata: false,
  _touched: false
};
var DynamicFormProvider = function DynamicFormProvider(props) {
  var _ref = props || {},
      encryption = _ref.encryption,
      customTheme = _ref.customTheme,
      children = _ref.children;

  if (encryption && typeof encryption === "function") {
    encryptionLocal = encryption;
  }

  var _useReducer = React.useReducer(dynamicFormModelReducer, initialStateModel),
      stateModel = _useReducer[0],
      dispatchModel = _useReducer[1];

  var _useReducer2 = React.useReducer(dynamicFormErrorReducer, initialStateError),
      stateError = _useReducer2[0],
      dispatchError = _useReducer2[1];

  return /*#__PURE__*/React__default.createElement(DynamicFormHelperContext.Provider, {
    value: helpers
  }, /*#__PURE__*/React__default.createElement(DynamicFormStyleContext.Provider, {
    value: _extends({}, deafultTheme, customTheme)
  }, /*#__PURE__*/React__default.createElement(DynamicFormModelStateContext.Provider, {
    value: stateModel
  }, /*#__PURE__*/React__default.createElement(DynamicFormModelDispatchContext.Provider, {
    value: dispatchModel
  }, /*#__PURE__*/React__default.createElement(DynamicFormErrorStateContext.Provider, {
    value: stateError
  }, /*#__PURE__*/React__default.createElement(DynamicFormErrorDispatchContext.Provider, {
    value: dispatchError
  }, children))))));
};
var useDynamicForm = function useDynamicForm(type, version) {
  var contextDynamic = null;

  switch (version) {
    case "error":
      if (type === "state") {
        contextDynamic = DynamicFormErrorStateContext;
      } else if (type === "dispatch") {
        contextDynamic = DynamicFormErrorDispatchContext;
      }

      break;

    case "model":
      if (type === "state") {
        contextDynamic = DynamicFormModelStateContext;
      } else if (type === "dispatch") {
        contextDynamic = DynamicFormModelDispatchContext;
      }

      break;

    default:
      if (!type && !version) {
        contextDynamic = DynamicFormHelperContext;
      } else {
        throw new Error("Your combination of type and version is not allowed.");
      }

  }

  if (contextDynamic === null) {
    throw new Error("Your combination of type and version is not allowed.");
  }

  var context = React.useContext(contextDynamic);

  if (context === undefined) {
    throw new Error("this function must be used within a provider");
  }

  return context;
};
var useTheme = function useTheme() {
  var context = React.useContext(DynamicFormStyleContext);

  if (context === undefined) {
    throw new Error("this function must be used within a provider");
  }

  return context;
};
var applyCrypt2State = function applyCrypt2State(state, config) {
  var copyState = _extends({}, state);

  config && Array.isArray(config) && config.length > 0 && config.forEach(function (configObj) {
    if (configObj.crypt !== undefined && configObj.crypt === true) {
      copyState[configObj.name] = encryptionLocal(copyState[configObj.name]);
    }
  });
  return copyState;
};

var updateErrors = function updateErrors(config) {
  return function (stateFromService) {
    var errorsObj = {};
    config.forEach(function (componentConfig) {
      var name = componentConfig.name,
          validations = componentConfig.validations;
      var data = stateFromService[name];
      errorsObj[name] = [];
      validations && validations.forEach(function (validation) {
        var validationResult = validate(validation, data || "");

        if (validationResult) {
          errorsObj[name].push(validation);
        }
      });
    });
    return errorsObj;
  };
};

var withProvider = function withProvider(attributes) {
  return function (WrappedComponent) {
    var WithProvider = /*#__PURE__*/function (_React$Component) {
      _inheritsLoose(WithProvider, _React$Component);

      function WithProvider() {
        return _React$Component.apply(this, arguments) || this;
      }

      var _proto = WithProvider.prototype;

      _proto.render = function render() {
        return /*#__PURE__*/React__default.createElement(DynamicFormProvider, attributes, /*#__PURE__*/React__default.createElement(WrappedComponent, null));
      };

      return WithProvider;
    }(React__default.Component);

    return WithProvider;
  };
};

var configGlobal = {};
var domelement = null;
var saveConfig = function saveConfig(config, ref) {
  configGlobal = config;
  domelement = ref;
};
var getConfig = function getConfig() {
  return configGlobal;
};
var getDomElement = function getDomElement() {
  return domelement;
};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var b="function"===typeof Symbol&&Symbol.for,c=b?Symbol.for("react.element"):60103,d=b?Symbol.for("react.portal"):60106,e=b?Symbol.for("react.fragment"):60107,f=b?Symbol.for("react.strict_mode"):60108,g=b?Symbol.for("react.profiler"):60114,h=b?Symbol.for("react.provider"):60109,k=b?Symbol.for("react.context"):60110,l=b?Symbol.for("react.async_mode"):60111,m=b?Symbol.for("react.concurrent_mode"):60111,n=b?Symbol.for("react.forward_ref"):60112,p=b?Symbol.for("react.suspense"):60113,q=b?
Symbol.for("react.suspense_list"):60120,r=b?Symbol.for("react.memo"):60115,t=b?Symbol.for("react.lazy"):60116,v=b?Symbol.for("react.block"):60121,w=b?Symbol.for("react.fundamental"):60117,x=b?Symbol.for("react.responder"):60118,y=b?Symbol.for("react.scope"):60119;
function z(a){if("object"===typeof a&&null!==a){var u=a.$$typeof;switch(u){case c:switch(a=a.type,a){case l:case m:case e:case g:case f:case p:return a;default:switch(a=a&&a.$$typeof,a){case k:case n:case t:case r:case h:return a;default:return u}}case d:return u}}}function A(a){return z(a)===m}var AsyncMode=l;var ConcurrentMode=m;var ContextConsumer=k;var ContextProvider=h;var Element=c;var ForwardRef=n;var Fragment=e;var Lazy=t;var Memo=r;var Portal=d;
var Profiler=g;var StrictMode=f;var Suspense=p;var isAsyncMode=function(a){return A(a)||z(a)===l};var isConcurrentMode=A;var isContextConsumer=function(a){return z(a)===k};var isContextProvider=function(a){return z(a)===h};var isElement=function(a){return "object"===typeof a&&null!==a&&a.$$typeof===c};var isForwardRef=function(a){return z(a)===n};var isFragment=function(a){return z(a)===e};var isLazy=function(a){return z(a)===t};
var isMemo=function(a){return z(a)===r};var isPortal=function(a){return z(a)===d};var isProfiler=function(a){return z(a)===g};var isStrictMode=function(a){return z(a)===f};var isSuspense=function(a){return z(a)===p};
var isValidElementType=function(a){return "string"===typeof a||"function"===typeof a||a===e||a===m||a===g||a===f||a===p||a===q||"object"===typeof a&&null!==a&&(a.$$typeof===t||a.$$typeof===r||a.$$typeof===h||a.$$typeof===k||a.$$typeof===n||a.$$typeof===w||a.$$typeof===x||a.$$typeof===y||a.$$typeof===v)};var typeOf=z;

var reactIs_production_min = {
	AsyncMode: AsyncMode,
	ConcurrentMode: ConcurrentMode,
	ContextConsumer: ContextConsumer,
	ContextProvider: ContextProvider,
	Element: Element,
	ForwardRef: ForwardRef,
	Fragment: Fragment,
	Lazy: Lazy,
	Memo: Memo,
	Portal: Portal,
	Profiler: Profiler,
	StrictMode: StrictMode,
	Suspense: Suspense,
	isAsyncMode: isAsyncMode,
	isConcurrentMode: isConcurrentMode,
	isContextConsumer: isContextConsumer,
	isContextProvider: isContextProvider,
	isElement: isElement,
	isForwardRef: isForwardRef,
	isFragment: isFragment,
	isLazy: isLazy,
	isMemo: isMemo,
	isPortal: isPortal,
	isProfiler: isProfiler,
	isStrictMode: isStrictMode,
	isSuspense: isSuspense,
	isValidElementType: isValidElementType,
	typeOf: typeOf
};

var reactIs_development = createCommonjsModule(function (module, exports) {



if (process.env.NODE_ENV !== "production") {
  (function() {

// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var hasSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
// (unstable) APIs that have been removed. Can we remove the symbols?

var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for('react.block') : 0xead9;
var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;

function isValidElementType(type) {
  return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
  type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
}

function typeOf(object) {
  if (typeof object === 'object' && object !== null) {
    var $$typeof = object.$$typeof;

    switch ($$typeof) {
      case REACT_ELEMENT_TYPE:
        var type = object.type;

        switch (type) {
          case REACT_ASYNC_MODE_TYPE:
          case REACT_CONCURRENT_MODE_TYPE:
          case REACT_FRAGMENT_TYPE:
          case REACT_PROFILER_TYPE:
          case REACT_STRICT_MODE_TYPE:
          case REACT_SUSPENSE_TYPE:
            return type;

          default:
            var $$typeofType = type && type.$$typeof;

            switch ($$typeofType) {
              case REACT_CONTEXT_TYPE:
              case REACT_FORWARD_REF_TYPE:
              case REACT_LAZY_TYPE:
              case REACT_MEMO_TYPE:
              case REACT_PROVIDER_TYPE:
                return $$typeofType;

              default:
                return $$typeof;
            }

        }

      case REACT_PORTAL_TYPE:
        return $$typeof;
    }
  }

  return undefined;
} // AsyncMode is deprecated along with isAsyncMode

var AsyncMode = REACT_ASYNC_MODE_TYPE;
var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
var ContextConsumer = REACT_CONTEXT_TYPE;
var ContextProvider = REACT_PROVIDER_TYPE;
var Element = REACT_ELEMENT_TYPE;
var ForwardRef = REACT_FORWARD_REF_TYPE;
var Fragment = REACT_FRAGMENT_TYPE;
var Lazy = REACT_LAZY_TYPE;
var Memo = REACT_MEMO_TYPE;
var Portal = REACT_PORTAL_TYPE;
var Profiler = REACT_PROFILER_TYPE;
var StrictMode = REACT_STRICT_MODE_TYPE;
var Suspense = REACT_SUSPENSE_TYPE;
var hasWarnedAboutDeprecatedIsAsyncMode = false; // AsyncMode should be deprecated

function isAsyncMode(object) {
  {
    if (!hasWarnedAboutDeprecatedIsAsyncMode) {
      hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint

      console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
    }
  }

  return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
}
function isConcurrentMode(object) {
  return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
}
function isContextConsumer(object) {
  return typeOf(object) === REACT_CONTEXT_TYPE;
}
function isContextProvider(object) {
  return typeOf(object) === REACT_PROVIDER_TYPE;
}
function isElement(object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}
function isForwardRef(object) {
  return typeOf(object) === REACT_FORWARD_REF_TYPE;
}
function isFragment(object) {
  return typeOf(object) === REACT_FRAGMENT_TYPE;
}
function isLazy(object) {
  return typeOf(object) === REACT_LAZY_TYPE;
}
function isMemo(object) {
  return typeOf(object) === REACT_MEMO_TYPE;
}
function isPortal(object) {
  return typeOf(object) === REACT_PORTAL_TYPE;
}
function isProfiler(object) {
  return typeOf(object) === REACT_PROFILER_TYPE;
}
function isStrictMode(object) {
  return typeOf(object) === REACT_STRICT_MODE_TYPE;
}
function isSuspense(object) {
  return typeOf(object) === REACT_SUSPENSE_TYPE;
}

exports.AsyncMode = AsyncMode;
exports.ConcurrentMode = ConcurrentMode;
exports.ContextConsumer = ContextConsumer;
exports.ContextProvider = ContextProvider;
exports.Element = Element;
exports.ForwardRef = ForwardRef;
exports.Fragment = Fragment;
exports.Lazy = Lazy;
exports.Memo = Memo;
exports.Portal = Portal;
exports.Profiler = Profiler;
exports.StrictMode = StrictMode;
exports.Suspense = Suspense;
exports.isAsyncMode = isAsyncMode;
exports.isConcurrentMode = isConcurrentMode;
exports.isContextConsumer = isContextConsumer;
exports.isContextProvider = isContextProvider;
exports.isElement = isElement;
exports.isForwardRef = isForwardRef;
exports.isFragment = isFragment;
exports.isLazy = isLazy;
exports.isMemo = isMemo;
exports.isPortal = isPortal;
exports.isProfiler = isProfiler;
exports.isStrictMode = isStrictMode;
exports.isSuspense = isSuspense;
exports.isValidElementType = isValidElementType;
exports.typeOf = typeOf;
  })();
}
});

var reactIs = createCommonjsModule(function (module) {

if (process.env.NODE_ENV === 'production') {
  module.exports = reactIs_production_min;
} else {
  module.exports = reactIs_development;
}
});

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

var ReactPropTypesSecret_1 = ReactPropTypesSecret;

var printWarning = function() {};

if (process.env.NODE_ENV !== 'production') {
  var ReactPropTypesSecret$1 = ReactPropTypesSecret_1;
  var loggedTypeFailures = {};
  var has = Function.call.bind(Object.prototype.hasOwnProperty);

  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (process.env.NODE_ENV !== 'production') {
    for (var typeSpecName in typeSpecs) {
      if (has(typeSpecs, typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            var err = Error(
              (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
              'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.'
            );
            err.name = 'Invariant Violation';
            throw err;
          }
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret$1);
        } catch (ex) {
          error = ex;
        }
        if (error && !(error instanceof Error)) {
          printWarning(
            (componentName || 'React class') + ': type specification of ' +
            location + ' `' + typeSpecName + '` is invalid; the type checker ' +
            'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
            'You may have forgotten to pass an argument to the type checker ' +
            'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
            'shape all require an argument).'
          );
        }
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          printWarning(
            'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
          );
        }
      }
    }
  }
}

/**
 * Resets warning cache when testing.
 *
 * @private
 */
checkPropTypes.resetWarningCache = function() {
  if (process.env.NODE_ENV !== 'production') {
    loggedTypeFailures = {};
  }
};

var checkPropTypes_1 = checkPropTypes;

var has$1 = Function.call.bind(Object.prototype.hasOwnProperty);
var printWarning$1 = function() {};

if (process.env.NODE_ENV !== 'production') {
  printWarning$1 = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

function emptyFunctionThatReturnsNull() {
  return null;
}

var factoryWithTypeCheckers = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    elementType: createElementTypeTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker,
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (process.env.NODE_ENV !== 'production') {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret_1) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          var err = new Error(
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
          err.name = 'Invariant Violation';
          throw err;
        } else if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            printWarning$1(
              'You are manually calling a React.PropTypes validation ' +
              'function for the `' + propFullName + '` prop on `' + componentName  + '`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.'
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunctionThatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret_1);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!reactIs.isValidElementType(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement type.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      if (process.env.NODE_ENV !== 'production') {
        if (arguments.length > 1) {
          printWarning$1(
            'Invalid arguments supplied to oneOf, expected an array, got ' + arguments.length + ' arguments. ' +
            'A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).'
          );
        } else {
          printWarning$1('Invalid argument supplied to oneOf, expected an array.');
        }
      }
      return emptyFunctionThatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
        var type = getPreciseType(value);
        if (type === 'symbol') {
          return String(value);
        }
        return value;
      });
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + String(propValue) + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (has$1(propValue, key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
      process.env.NODE_ENV !== 'production' ? printWarning$1('Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
      return emptyFunctionThatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        printWarning$1(
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
          'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.'
        );
        return emptyFunctionThatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret_1) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (!checker) {
          continue;
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from
      // props.
      var allKeys = objectAssign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (!checker) {
          return new PropTypeError(
            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
            '\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')
          );
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // falsy value can't be a Symbol
    if (!propValue) {
      return false;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes_1;
  ReactPropTypes.resetWarningCache = checkPropTypes_1.resetWarningCache;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

function emptyFunction() {}
function emptyFunctionWithReset() {}
emptyFunctionWithReset.resetWarningCache = emptyFunction;

var factoryWithThrowingShims = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret_1) {
      // It is still safe when called from React.
      return;
    }
    var err = new Error(
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
    err.name = 'Invariant Violation';
    throw err;
  }  shim.isRequired = shim;
  function getShim() {
    return shim;
  }  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    elementType: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim,

    checkPropTypes: emptyFunctionWithReset,
    resetWarningCache: emptyFunction
  };

  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

var propTypes = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (process.env.NODE_ENV !== 'production') {
  var ReactIs = reactIs;

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = factoryWithTypeCheckers(ReactIs.isElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = factoryWithThrowingShims();
}
});

var useStyles = function useStyles(theme) {
  return reactJss.createUseStyles({
    wrapper: {
      display: "flex",
      flexDirection: "column",
      width: "100%"
    }
  });
};

var handleChange = function handleChange(dispatch, type) {
  return function (name, actionOfTheEvent) {
    return function (event) {
      var _event$target = event.target,
          eventType = _event$target.type,
          value = _event$target.value,
          checked = _event$target.checked;
      var newState = {};
      var newValue = null;

      switch (eventType) {
        case "checkbox":
          newValue = checked;
          break;

        default:
          newValue = value;
          break;
      }

      newState[name] = newValue;
      console.log({
        type: type,
        newState: newState,
        metadata: {
          lastEvent: actionOfTheEvent
        }
      });
      dispatch({
        type: type,
        newState: newState,
        metadata: {
          lastEvent: actionOfTheEvent
        }
      });
    };
  };
};

var noModelTags = ["label"];
var model = {};
var error = {};
var htmlToRender = function htmlToRender(_ref) {
  var stateFromService = _ref.stateFromService,
      errorFromService = _ref.errorFromService,
      dispatchModel = _ref.dispatchModel,
      handleChange = _ref.handleChange;
  return function (config, _ref2) {
    var debug = _ref2.debug;
    var value = config ? config.map(function (configObj, index) {
      var name = configObj.name,
          tag = configObj.tag;

      if (noModelTags.indexOf(tag) === -1) {
        model[name] = configObj.defaultValue !== undefined && configObj.defaultValue !== null ? configObj.defaultValue : null;
        error[name] = [];
      }

      if (tag === "hidden") {
        model[name] = configObj.value;
      }

      return /*#__PURE__*/React__default.createElement("span", {
        key: index * index + 1
      }, /*#__PURE__*/React__default.createElement(FactoryComponent, {
        debug: debug,
        onChange: handleChange(dispatchModel, "UPDATE_MODEL"),
        config: configObj,
        data: stateFromService && stateFromService[configObj.name] ? tag === "hidden" ? model[name] : stateFromService[configObj.name] : configObj.defaultValue !== undefined && configObj.defaultValue !== null ? configObj.defaultValue : "",
        error: errorFromService && errorFromService[configObj.name] ? tag === "hidden" ? error[name] : errorFromService[configObj.name] : false
      }), debug && /*#__PURE__*/React__default.createElement(DebugFactoryComponent, {
        model: model[configObj.name],
        state: stateFromService && stateFromService[configObj.name] ? tag === "hidden" ? model[name] : stateFromService[configObj.name] : configObj.defaultValue !== undefined && configObj.defaultValue !== null ? configObj.defaultValue : "",
        error: errorFromService[configObj.name]
      }));
    }) : /*#__PURE__*/React__default.createElement("span", null);
    return value;
  };
};

var updateError = function updateError(config, updateModelAtBlur, dispatchError) {
  return function (stateFromService, errorFromService) {
    var _ref = stateFromService || {},
        metadata = _ref._metadata;

    var _ref2 = metadata || {},
        lastEvent = _ref2.lastEvent;

    var errorsObj = _extends({}, errorFromService);

    config.forEach(function (componentConfig) {
      var name = componentConfig.name,
          validations = componentConfig.validations;
      var data = stateFromService[name];

      if (data || data === "") {
        errorsObj[name] = [];
      }

      (data || data === "") && validations && validations.forEach(function (validation) {
        var validationResult = validate(validation, data);

        if (validationResult) {
          errorsObj[name].push(validation);
        }
      });
    });

    if (lastEvent === "onChange" && (!updateModelAtBlur || updateModelAtBlur === undefined) || lastEvent === "onBlur") {
      dispatchError({
        type: "UPDATE_ERROR",
        newState: errorsObj
      });
    }
  };
};

var updateErrorOnSubmit = function updateErrorOnSubmit(dispatchError) {
  return function (errorFromDynamicFormValidationOnSubmit) {
    debugger;
    dispatchError({
      type: "UPDATE_ERROR_ON_SUBMIT",
      newState: errorFromDynamicFormValidationOnSubmit
    });
  };
};

var setupModel = function setupModel(config, dispatchModel) {
  var modelObj = {};
  config.forEach(function (componentConfig) {
    var name = componentConfig.name,
        defaultValue = componentConfig.defaultValue;
    modelObj[name] = defaultValue !== undefined && defaultValue !== null ? defaultValue : null;
  });
  dispatchModel({
    type: "SETUP_MODEL",
    newState: modelObj
  });
};

var DynamicForm = /*#__PURE__*/React.forwardRef(function (props, ref) {
  var config = props.config,
      updateModelAtBlur = props.updateModelAtBlur,
      debug = props.debug;
  var stateFromService = useDynamicForm("state", "model");
  var errorFromService = useDynamicForm("state", "error");
  var dispatchModel = useDynamicForm("dispatch", "model");
  var dispatchError = useDynamicForm("dispatch", "error");
  var theme = useTheme();
  var classes = useStyles()();

  var _ref = classes || {},
      wrapperStyle = _ref.wrapper;

  React.useImperativeHandle(ref, function () {
    return {
      validateAll: function validateAll() {
        return errorFromService;
      },
      upadareErrorService: function upadareErrorService(errorFromDynamicFormValidationOnSubmit) {
        debugger;
        updateErrorOnSubmit(dispatchError)(errorFromDynamicFormValidationOnSubmit);
      }
    };
  });

  var updateGlobalErrors = function updateGlobalErrors() {
    updateError(config, updateModelAtBlur, dispatchError)(stateFromService, errorFromService);
  };

  var memoizeDispatchFunc = React.useCallback(updateGlobalErrors, [stateFromService]);
  React.useEffect(function () {
    memoizeDispatchFunc();
  }, [memoizeDispatchFunc]);

  var init = function init() {
    setupModel(config, dispatchModel);
    saveConfig(config, ref);
  };

  var initFunc = React.useCallback(init, []);
  React.useEffect(function () {
    initFunc();
  }, [initFunc]);
  return /*#__PURE__*/React__default.createElement("section", {
    className: wrapperStyle
  }, htmlToRender({
    stateFromService: stateFromService,
    errorFromService: errorFromService,
    dispatchModel: dispatchModel,
    handleChange: handleChange
  })(config, {
    debug: debug
  }), debug && /*#__PURE__*/React__default.createElement(DebugDynamicForm, null));
});
DynamicForm.propTypes = {
  config: propTypes.array,
  validateOnFocusOut: propTypes.bool,
  debug: propTypes.bool
};

var useStyles$1 = function useStyles(theme) {
  var colorPrimary = theme.colorPrimary;
  return reactJss.createUseStyles({
    background: {
      backgroundColor: colorPrimary,
      whiteSpace: "pre-wrap"
    }
  });
};

var renderCountDebugDynamicForm = 1;

function DebugDynamicForm() {
  var stateFromService = useDynamicForm("state", "model");
  var errorFromService = useDynamicForm("state", "error");
  var theme = useTheme();
  var classes = useStyles$1(theme)();

  var _ref = classes || {},
      backgroundStyle = _ref.background;

  var printCounter = function printCounter() {
    renderCountDebugDynamicForm++;
    console.table({
      "From file": "src/dynamicForm/components/DebugDynamicForm/index.js",
      "Render count": renderCountDebugDynamicForm
    });
  };

  var renderComponent = function renderComponent() {
    printCounter();
    return /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement("pre", {
      className: backgroundStyle
    }, /*#__PURE__*/React__default.createElement("span", null, "stateFromService"), JSON.stringify(stateFromService, undefined, 2)), /*#__PURE__*/React__default.createElement("pre", {
      className: backgroundStyle
    }, /*#__PURE__*/React__default.createElement("span", null, "errorFromService"), JSON.stringify(errorFromService, undefined, 2)));
  };

  return React.useMemo(renderComponent, [stateFromService, errorFromService]);
}

var useStyles$2 = function useStyles(theme) {
  return reactJss.createUseStyles({
    wrapper: {
      display: "flex",
      flexDirection: "column",
      padding: "12px 0"
    },
    hide: {
      display: "none"
    }
  });
};

var handleChangeEvent = function handleChangeEvent(name, handleChange, eventType) {
  return function (e) {
    handleChange(name, eventType)(e);
  };
};

var renderCountFactory = {};
var printCounter = function printCounter(config) {
  renderCountFactory[config.name] = renderCountFactory[config.name] !== undefined ? renderCountFactory[config.name] + 1 : 1;
  console.table({
    "From file": "src/dynamicForm/components/FactoryComponent/index.js",
    "Input name": config.name,
    "Input type": config.type || "text",
    "Render count": renderCountFactory[config.name]
  });
};

var dataCoverterHandler = function dataCoverterHandler(data, config) {
  var dataConverted = data;

  if (config.dataManipulatorIn && typeof config.dataManipulatorIn === "function" && data !== "") {
    dataConverted = config.dataManipulatorIn(data);
  }

  return dataConverted;
};

var htmlToRender$1 = function htmlToRender(handleChangeEvent, classes) {
  return function (config, data, handleChange, error, debug) {
    debug && printCounter(config);
    var newValue = /*#__PURE__*/React__default.createElement("span", {
      className: classes.hide
    });
    var requiredField = config && config.validations && !!config.validations.find(function (validation) {
      return validation.kind === "required";
    });

    switch (config.tag) {
      case "input":
        newValue = /*#__PURE__*/React__default.createElement(InputComponent, {
          id: config.name,
          name: config.name,
          htmlFor: config.name,
          type: config.type,
          inputLabel: config.label,
          showErrorOnInput: true,
          error: error,
          errorMessage: error[0] && error[0].message,
          required: requiredField,
          onBlur: handleChangeEvent(config.name, handleChange, "onBlur"),
          onChange: handleChangeEvent(config.name, handleChange, "onChange"),
          value: dataCoverterHandler(data, config),
          placeholder: config.helperText,
          disabled: config.disabled === true ? true : config.disabled === false ? false : typeof config.disabled === "function" ? config.disabled({
            options: config.options
          }) : false,
          debug: debug
        });
        break;
    }

    return newValue;
  };
};

function FactoryComponent(props) {
  var config = props.config,
      data = props.data,
      onChange = props.onChange,
      debug = props.debug,
      error = props.error;
  var theme = useTheme();
  var classes = useStyles$2()();

  var _ref = classes || {},
      hideStyle = _ref.hide,
      wrapperStyle = _ref.wrapper;

  var renderWrapper = function renderWrapper() {
    return /*#__PURE__*/React__default.createElement("span", {
      className: config.tag === "hidden" ? hideStyle : wrapperStyle
    }, htmlToRender$1(handleChangeEvent, classes)(config, data, onChange, error, debug));
  };

  return React.useMemo(renderWrapper, [data, error]);
}

FactoryComponent.propTypes = {
  config: propTypes.object,
  data: propTypes.any,
  onChange: propTypes.func,
  error: propTypes.any,
  debug: propTypes.bool
};

var useStyles$3 = function useStyles(theme) {
  return reactJss.createUseStyles({
    background: {
      backgroundColor: "#0044ff80",
      whiteSpace: "pre-wrap"
    }
  });
};

var renderCountDebugFactoryComponent = 1;

function DebugFactoryComponent(props) {
  var state = props.state,
      model = props.model,
      error = props.error;
  var theme = useTheme();
  var classes = useStyles$3()();

  var _ref = classes || {},
      backgroundStyle = _ref.background;

  var printCounter = function printCounter() {
    renderCountDebugFactoryComponent++;
    console.table({
      "From file": "src/dynamicForm/components/DebugFactoryComponent/index.js",
      "Render count": renderCountDebugFactoryComponent
    });
  };

  var renderComponent = function renderComponent() {
    printCounter();
    return /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement("pre", {
      className: backgroundStyle
    }, /*#__PURE__*/React__default.createElement("div", null, "DynamicForm"), /*#__PURE__*/React__default.createElement("div", null, "defaultValue: ", JSON.stringify(model || null, undefined, 2)), /*#__PURE__*/React__default.createElement("div", null, "Current value: ", JSON.stringify(state || {}, undefined, 2)), /*#__PURE__*/React__default.createElement("div", null, "Errors: ", JSON.stringify(error || [], undefined, 2))));
  };

  return renderComponent();
}

DebugFactoryComponent.propTypes = {
  state: propTypes.any
};

var useStyles$4 = function useStyles(theme) {
  return reactJss.createUseStyles({
    inputLabel: {
      display: 'block',
      margin: '1em 0'
    }
  });
};

var renderCount = {};

function InputComponent(props) {
  var id = props.id,
      name = props.name,
      htmlFor = props.htmlFor,
      type = props.type,
      inputLabel = props.inputLabel,
      showErrorOnInput = props.showErrorOnInput,
      error = props.error,
      errorMessage = props.errorMessage,
      value = props.value,
      placeholder = props.placeholder,
      required = props.required,
      disabled = props.disabled,
      onBlur = props.onBlur,
      onChange = props.onChange,
      debug = props.debug;
  var theme = useTheme();
  var classes = useStyles$4()();

  var _ref = classes || {},
      inputLabelStyle = _ref.inputLabel,
      inputErrorStyle = _ref.inputError;

  var attributes = {
    id: id,
    name: name,
    type: type,
    value: value,
    placeholder: placeholder,
    required: required,
    disabled: disabled,
    onBlur: onBlur,
    onChange: onChange
  };

  var printCounter = function printCounter() {
    renderCount[name] = renderCount[name] !== undefined ? renderCount[name] + 1 : 1;
    console.table({
      "From file": "src/dynamicForm/components/Input/index.js",
      "Input name": name,
      "Input type": type || "text",
      "Render count": renderCount[name]
    });
  };

  var renderInput = function renderInput() {
    debug && printCounter();
    return /*#__PURE__*/React__default.createElement("section", null, inputLabel && /*#__PURE__*/React__default.createElement("label", {
      className: inputLabelStyle,
      htmlFor: htmlFor
    }, inputLabel), /*#__PURE__*/React__default.createElement("input", attributes), error && showErrorOnInput && /*#__PURE__*/React__default.createElement("p", {
      className: inputErrorStyle
    }, errorMessage));
  };

  return React.useMemo(renderInput, [value, error, errorMessage]);
}

InputComponent.propTypes = {
  id: propTypes.string,
  name: propTypes.string,
  htmlFor: propTypes.string,
  type: propTypes.string,
  inputLabel: propTypes.string,
  showErrorOnInput: propTypes.bool,
  error: propTypes.any,
  errorMessage: propTypes.string,
  value: propTypes.any,
  placeholder: propTypes.string,
  required: propTypes.bool,
  disabled: propTypes.bool,
  onBlur: propTypes.func,
  onChange: propTypes.func,
  debug: propTypes.bool
};

exports.DynamicForm = DynamicForm;
exports.DynamicFormProvider = DynamicFormProvider;
exports.FactoryComponent = FactoryComponent;
exports.Input = InputComponent;
exports.applyCrypt2State = applyCrypt2State;
exports.useDynamicForm = useDynamicForm;
exports.validate = validate;
exports.withDynamicForm = withProvider;
//# sourceMappingURL=index.js.map
