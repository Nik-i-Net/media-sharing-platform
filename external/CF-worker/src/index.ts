interface Env {
	MEDIA_BUCKET: R2Bucket;
	MEDIA_UPLOADS_QUEUE: Queue;
	CONFIRM_UPLOADS_WEBHOOK_URL: string;
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

	async queue(batch, env, ctx): Promise<void> {
		const response = await fetch(env.CONFIRM_UPLOADS_WEBHOOK_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				event: 'upload.confirmed',
				data: batch.messages.map((message) => message.body),
			}),
		});

		if (!response.ok) {
			throw new Error(`RETRY_BATCH: Backend responded with ${response.status}`);
		}

		batch.ackAll();
	},
} satisfies ExportedHandler<Env>;
