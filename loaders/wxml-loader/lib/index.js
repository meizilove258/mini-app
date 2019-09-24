'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (content) {
	this.cacheable && this.cacheable();

	const callback = this.async();
	var _options = this.options;
	const context = _options.context,
	      output = _options.output,
	      target = _options.target;
	var _module2 = this._module;

	const _module = _module2 === undefined ? {} : _module2,
	      resourcePath = this.resourcePath;

	const options = (0, _loaderUtils.getOptions)(this) || {};
	const resource = _module.resource;


	const hasIssuer = _module.issuer;
	const issuerContext = hasIssuer && _module.issuer.context || context;

	var _options$root = options.root;
	const root = _options$root === undefined ? (0, _path.resolve)(context, issuerContext) : _options$root;
	var _options$publicPath = options.publicPath;
	const publicPath = _options$publicPath === undefined ? output.publicPath || '' : _options$publicPath;
	var _options$enforceRelat = options.enforceRelativePath;
	const enforceRelativePath = _options$enforceRelat === undefined ? false : _options$enforceRelat,
	      format = options.format;
	var _options$transformCon = options.transformContent;
	const transformContent = _options$transformCon === undefined ? content => {
		switch (target.name) {
			case 'Alipay':
				return content.replace(/\bwx:/g, 'a:');
			case 'Wechat':
				return content.replace(/\ba:/g, 'wx:');
			default:
				return content;
		}
	} : _options$transformCon;
	var _options$transformUrl = options.transformUrl;

	const transformUrl = _options$transformUrl === undefined ? url => {
		switch (target.name) {
			case 'Alipay':
				return url.replace(/\.wxml$/g, '.axml');
			case 'Wechat':
				return url.replace(/\.axml$/g, '.wxml');
			default:
				return url;
		}
	} : _options$transformUrl,
	      forceMinimize = options.minimize,
	      minimizeOptions = _objectWithoutProperties(options, ['root', 'publicPath', 'enforceRelativePath', 'format', 'transformContent', 'transformUrl', 'minimize']);

	const requests = [];
	const hasMinimzeConfig = typeof forceMinimize === 'boolean';
	const shouldMinimize = hasMinimzeConfig ? forceMinimize : this.minimize;

	const loadModule = request => new Promise((resolve, reject) => {
		this.addDependency(request);
		this.loadModule(request, (err, src) => {
			/* istanbul ignore if */
			if (err) {
				reject(err);
			} else {
				resolve(src);
			}
		});
	});

	const xmlContent = `${ ROOT_TAG_START }${ content }${ ROOT_TAG_END }`;

	const ensureStartsWithDot = source => isStartsWithDot(source) ? source : `./${ source }`;

	const ensureRelativePath = source => {
		const sourcePath = (0, _path.join)(root, source);
		const resourceDirname = (0, _path.dirname)(resourcePath);
		source = (0, _path.relative)(resourceDirname, sourcePath).replace(/\\/g, '/');
		return ensureStartsWithDot(source);
	};

	const replaceRequest = (() => {
		var _ref2 = _asyncToGenerator(function* (_ref) {
			let request = _ref.request,
			    startIndex = _ref.startIndex,
			    endIndex = _ref.endIndex;

			const module = yield loadModule(request);
			let source = extract(module, publicPath);
			const isSourceAbsolute = (0, _path.isAbsolute)(source);
			if (!isSourceAbsolute && !hasProcotol(source)) {
				source = ensureStartsWithDot(source);
			}
			if (enforceRelativePath && isSourceAbsolute) {
				source = ensureRelativePath(source);
			}

			/* istanbul ignore else */
			if (typeof transformUrl === 'function') {
				source = transformUrl(source, resource);
			}
			content = replaceAt(content, startIndex, endIndex, source);
		});

		return function replaceRequest(_x) {
			return _ref2.apply(this, arguments);
		};
	})();

	const parser = _sax2.default.parser(false, { lowercase: true });

	parser.onattribute = (_ref3) => {
		let name = _ref3.name,
		    value = _ref3.value;

		if (!value || !isSrc(name) || isDynamicSrc(value) || !(0, _loaderUtils.isUrlRequest)(value, root)) {
			return;
		}

		const endIndex = parser.position - 1 - ROOT_TAG_LENGTH;
		const startIndex = endIndex - value.length;
		const request = (0, _loaderUtils.urlToRequest)(value, root);

		requests.unshift({ request, startIndex, endIndex });
	};

	parser.onend = _asyncToGenerator(function* () {
		try {
			for (const req of requests) {
				yield replaceRequest(req);
			}

			/* istanbul ignore else */
			if (typeof format === 'function') {
				/* istanbul ignore else */
				if (!format.__warned) {
					format.__warned = true;
					console.warn('[DEPRECATED]: wxml-loader `format` option has been deprecated.', 'Please use `transformContent() instead`.');
				}
				content = format(content, resource);
			} else if (typeof transformContent === 'function') {
				content = transformContent(content, resource);
			}

			if (shouldMinimize) {
				content = _htmlMinifier2.default.minify(content, _extends({}, defaultMinimizeConf, minimizeOptions));
			}
			callback(null, content);
		} catch (err) {
			/* istanbul ignore next */
			callback(err, content);
		}
	});
	
	parser.write(xmlContent).close();
};

var _path = require('path');

var _sax = require('sax');

var _sax2 = _interopRequireDefault(_sax);

var _vm = require('vm');

var _htmlMinifier = require('html-minifier');

var _htmlMinifier2 = _interopRequireDefault(_htmlMinifier);

var _loaderUtils = require('loader-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const ROOT_TAG_NAME = 'xxx-wxml-root-xxx';
const ROOT_TAG_START = `<${ ROOT_TAG_NAME }>`;
const ROOT_TAG_END = `</${ ROOT_TAG_NAME }>`;
const ROOT_TAG_LENGTH = ROOT_TAG_START.length;

const isSrc = name => name === 'src';

const isDynamicSrc = src => /\{\{/.test(src);

const isStartsWithDot = src => /^\./.test(src);

const hasProcotol = src => /^(\w+:)?\/\//.test(src);

const replaceAt = (str, start, end, replacement) => str.slice(0, start) + replacement + str.slice(end);

const extract = (src, __webpack_public_path__) => {
	const script = new _vm.Script(src, { displayErrors: true });
	const sandbox = {
		__webpack_public_path__,
		module: {}
	};
	script.runInNewContext(sandbox);
	return sandbox.module.exports.toString();
};

const defaultMinimizeConf = {
	caseSensitive: true,
	html5: true,
	removeComments: true,
	removeCommentsFromCDATA: true,
	removeCDATASectionsFromCDATA: true,
	collapseWhitespace: true,
	removeRedundantAttributes: true,
	removeEmptyAttributes: true,
	keepClosingSlash: true,
	removeScriptTypeAttributes: true,
	removeStyleLinkTypeAttributes: true
};