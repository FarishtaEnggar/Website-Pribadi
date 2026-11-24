import { readFile } from "node:fs/promises";
import path from "node:path";
import { EXTENSION_MIME, UPLOAD_DIR } from "@/lib/uploads";

export async function GET(
  _request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await context.params;
  const root = path.resolve(UPLOAD_DIR);
  const target = path.resolve(root, ...segments);

  if (target !== root && !target.startsWith(root + path.sep)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const file = await readFile(target);
    const type =
      EXTENSION_MIME[path.extname(target).toLowerCase()] ??
      "application/octet-stream";

    return new Response(new Uint8Array(file), {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
