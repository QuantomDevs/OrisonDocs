import { type Page } from '@/lib/source';

export async function getLLMText(page: Page) {
  if (page.data.type === 'openapi') return '';

  const category =
    {
      ui: 'QuantomDocs Framework',
      headless: 'QuantomDocs Core (core library of framework)',
      mdx: 'QuantomDocs MDX (the built-in content source)',
      cli: 'QuantomDocs CLI (the CLI tool for automating QuantomDocs apps)',
    }[page.slugs[0]] ?? page.slugs[0];

  const processed = await page.data.getText('processed');

  return `# ${category}: ${page.data.title}
URL: ${page.url}
Source: https://raw.githubusercontent.com/quantom-docs/quantomdocs/refs/heads/main/src/content/docs/${page.path}

${page.data.description ?? ''}
        
${processed}`;
}
