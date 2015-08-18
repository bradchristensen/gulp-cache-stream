'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _through2 = require('through2');

var _through22 = _interopRequireDefault(_through2);

var _bufferEqual = require('buffer-equal');

var _bufferEqual2 = _interopRequireDefault(_bufferEqual);

var caches = {};

exports['default'] = function (cacheMissTransform, uniqueCacheName) {
	uniqueCacheName = uniqueCacheName || '_default';
	if (!caches[uniqueCacheName]) {
		caches[uniqueCacheName] = {};
	}
	var cache = caches[uniqueCacheName];

	return _through22['default'].obj(function (file, enc, cb) {
		var cached = cache[file.path];
		var contents = file.contents;
		if (cached && (0, _bufferEqual2['default'])(contents, cached.originalContents)) {
			cb(null, cached.transformed.clone());
		} else {
			var stream = _through22['default'].obj();
			stream.write(file);

			cacheMissTransform(stream).on('data', function (transformedFile) {
				cache[file.path] = {
					originalContents: contents,
					transformed: transformedFile.clone()
				};
				cb(null, transformedFile);
			});
		}
	});
};

module.exports = exports['default'];