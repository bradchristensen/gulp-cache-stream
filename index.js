import through from 'through2';
import bufferEqual from 'buffer-equal';

var caches = {};

export default function (cacheMissTransform, uniqueCacheName) {
	uniqueCacheName = uniqueCacheName || '_default';
	if (!caches[uniqueCacheName]) {
		caches[uniqueCacheName] = {};
	}
	var cache = caches[uniqueCacheName];

	return through.obj(function (file, enc, cb) {
		var cached = cache[file.path];
		var contents = file.contents;
		if (cached && bufferEqual(contents, cached.originalContents)) {
			cb(null, cached.transformed.clone());
		} else {
			var stream = through.obj();
			stream.write(file);

			cacheMissTransform(stream).on('data', transformedFile => {
				cache[file.path] = {
					originalContents: contents,
					transformed: transformedFile.clone()
				};
				cb(null, transformedFile);
			});
		}
	});
}
