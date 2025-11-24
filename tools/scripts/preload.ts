import { createMdxPlugin } from 'quantomdocs-mdx/bun';
import { postInstall } from 'quantomdocs-mdx/next';

const configPath = 'source.script.ts';
await postInstall({ configPath });
Bun.plugin(createMdxPlugin({ configPath }));
