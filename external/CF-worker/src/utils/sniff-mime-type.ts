function eq(a: Uint8Array, b: number[]): boolean {
	return a.every((v, i) => v === b[i]);
}

export function sniffMimeType(bytes: Uint8Array): string | null {
	if (eq(bytes.slice(0, 4), [0x89, 0x50, 0x4e, 0x47])) {
		return 'image/png';
	}

	if (eq(bytes.slice(0, 3), [0xff, 0xd8, 0xff])) {
		return 'image/jpeg';
	}

	if (eq(bytes.slice(0, 4), [0x47, 0x49, 0x46, 0x38])) {
		return 'image/gif';
	}

	if (eq(bytes.slice(0, 4), [0x52, 0x49, 0x46, 0x46])) {
		if (eq(bytes.slice(8, 12), [0x57, 0x45, 0x42, 0x50])) {
			return 'image/webp';
		}
		if (eq(bytes.slice(8, 12), [0x57, 0x41, 0x56, 0x45])) {
			return 'audio/wav';
		}
		return null;
	}

	if (eq(bytes.slice(0, 3), [0x49, 0x44, 0x33])) {
		return 'audio/mpeg';
	}

	if (eq(bytes.slice(0, 4), [0x4f, 0x67, 0x67, 0x53])) {
		return 'audio/ogg';
	}

	if (eq(bytes.slice(4, 8), [0x66, 0x74, 0x79, 0x70])) {
		if (eq(bytes.slice(8, 12), [0x4d, 0x34, 0x41, 0x20])) {
			return 'audio/mp4';
		}
		return 'video/mp4';
	}

	if (eq(bytes.slice(0, 4), [0x1a, 0x45, 0xdf, 0xa3])) {
		return 'video/webm';
	}

	return null;
}
