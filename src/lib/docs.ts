import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';

export async function getDocsPage(slug: string) {
  const docsDirectory = path.join(process.cwd(), 'src/app/docs');
  const filePath = path.join(docsDirectory, `${slug}.mdx`);
  
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    
    // Process the MDX content
    const processedContent = await remark()
      .use(html)
      .process(fileContents);
    
    return {
      content: processedContent.toString(),
      slug,
    };
  } catch {
    throw new Error(`Page not found: ${slug}`);
  }
} 