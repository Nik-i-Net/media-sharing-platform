import { sniffMimeType } from './utils/sniff-mime-type';

interface Env {
	MEDIA_BUCKET: R2Bucket;
	MEDIA_UPLOADS_QUEUE: Queue;
	CONFIRM_UPLOADS_WEBHOOK_URL: string;
	API_KEY: string;
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
		const promises = batch.messages.map(async (msg) => {
			const objectMetadata = (msg.body as any).object;
			const data = await env.MEDIA_BUCKET.get(objectMetadata.key, {
				range: { offset: 0, length: 12 },
			});

			// If deleted from bucket
			if (!data) {
				msg.ack();
				return null;
			}

			const buffer = await data.arrayBuffer();
			const header = new Uint8Array(buffer);

			return {
				key: objectMetadata.key,
				sizeBytes: objectMetadata.size,
				mimeType: sniffMimeType(header),
			};
		});

		const objects = (await Promise.all(promises)).filter(Boolean);
		const payload = { event: 'upload.confirmed', objects };

		const response = await fetch(env.CONFIRM_UPLOADS_WEBHOOK_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Api-Key': env.API_KEY,
			},
			body: JSON.stringify(payload),
		});

		if (!response.ok) {
			throw new Error(`RETRY_BATCH: Backend responded with ${response.status}`);
		}

		batch.ackAll();
	},
} satisfies ExportedHandler<Env>;
