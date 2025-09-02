import { notFound } from "next/navigation";
import Link from "next/link";
import { getDocsPage } from "@/lib/docs";

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export default async function DocsPage({ params }: PageProps) {
  const { slug } = await params;

  // Handle root /docs route
  if (!slug || slug.length === 0) {
    return (
      <div className="bg-background p-8">
        <div className="">
          <h1 className="text-4xl font-bold mb-8">Documentation</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-6 border rounded-lg ">
              <h2 className="text-xl font-semibold mb-3">Getting Started</h2>
              <p className="text-muted-foreground mb-4">
                Learn how to get started with our platform and set up your first
                project.
              </p>
              <Link
                href="/docs/getting-started"
                className="text-primary hover:underline"
              >
                Read more →
              </Link>
            </div>

            <div className="p-6 border rounded-lg ">
              <h2 className="text-xl font-semibold mb-3">Components</h2>
              <p className="text-muted-foreground mb-4">
                Explore our collection of reusable components and their usage.
              </p>
              <Link
                href="/docs/components"
                className="text-primary hover:underline"
              >
                Read more →
              </Link>
            </div>

            <div className="p-6 border rounded-lg ">
              <h2 className="text-xl font-semibold mb-3">API Reference</h2>
              <p className="text-muted-foreground mb-4">
                Detailed API documentation and integration guides.
              </p>
              <Link href="/docs/api" className="text-primary hover:underline">
                Read more →
              </Link>
            </div>

            <div className="p-6 border rounded-lg ">
              <h2 className="text-xl font-semibold mb-3">Examples</h2>
              <p className="text-muted-foreground mb-4">
                Real-world examples and use cases for our platform.
              </p>
              <Link
                href="/docs/examples"
                className="text-primary hover:underline"
              >
                Read more →
              </Link>
            </div>

            <div className="p-6 border rounded-lg ">
              <h2 className="text-xl font-semibold mb-3">Deployment</h2>
              <p className="text-muted-foreground mb-4">
                Learn how to deploy your applications to production.
              </p>
              <Link
                href="/docs/deployment"
                className="text-primary hover:underline"
              >
                Read more →
              </Link>
            </div>

            <div className="p-6 border rounded-lg ">
              <h2 className="text-xl font-semibold mb-3">Contributing</h2>
              <p className="text-muted-foreground mb-4">
                Guidelines for contributing to our open-source project.
              </p>
              <Link
                href="/docs/contributing"
                className="text-primary hover:underline"
              >
                Read more →
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle specific docs pages
  const pagePath = slug.join("/");

  try {
    const page = await getDocsPage(pagePath);
    return (
      <div className="bg-background p-8 max-w-7xl mx-auto">
        <div className="prose prose-gray dark:prose-invert max-w-none prose-headings:scroll-mt-20">
          <div
            className="docs-content prose prose-lg prose-gray dark:prose-invert max-w-none
                       prose-headings:font-semibold prose-h1:text-4xl prose-h1:mb-8
                       prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
                       prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                       prose-p:text-base prose-p:leading-relaxed
                       prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                       prose-pre:border prose-pre:rounded-lg
                       prose-strong:font-semibold
                       prose-ul:my-6 prose-ol:my-6
                       prose-li:my-2
                       prose-blockquote:border-l-4 prose-blockquote:border-primary
                       prose-blockquote:pl-4 prose-blockquote:italic
                       prose-hr:my-8 prose-hr:border-gray-300 dark:prose-hr:border-gray-600"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}
