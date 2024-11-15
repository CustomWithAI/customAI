import fs from 'node:fs';
import path from 'node:path';

export async function GET() {
  const countPagefromManifest = (directory: string): number => {
    const manifestData = fs.readFileSync(directory, 'utf-8');
    const manifest = JSON.parse(manifestData);
    const pages = Object.keys(manifest.pages);
    return pages.length / 2;
  };

  const pagesDirectory = path.join(__dirname.split("/").slice(0, -4).join("/"), 'app-build-manifest.json'); 
  const totalPages = countPagefromManifest(pagesDirectory);

  return new Response(
    JSON.stringify({
      status: 'ok',
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      totalPages: totalPages,
    }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}
