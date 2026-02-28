interface Env {
	MEDIA_BUCKET: R2Bucket;
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		if (request.method !== 'GET') {
			return new Response('Method Not Allowed', {
				status: 405,
				headers: { Allow: 'GET' },
			});
		}

		const url = new URL(request.url);
		const key = url.pathname.slice(1);
		const object = await env.MEDIA_BUCKET.get(key);

		if (object === null) {
			return new Response('Object Not Found', { status: 404 });
		}

		const headers = new Headers();
		object.writeHttpMetadata(headers);
		headers.set('etag', object.httpEtag);
		headers.set('Cache-Control', 'public, max-age=20, immutable');

		return new Response(object.body, {
			headers,
		});
	},
} satisfies ExportedHandler<Env>;
