import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const packages = [
  { dir: 'src/quantomdocs-core', namespace: '@core/' },
  { dir: 'src/quantomdocs-ui', namespace: '@ui/' },
  { dir: 'src/quantomdocs-mdx', namespace: '@mdx/' },
  { dir: 'src/quantomdocs-openapi', namespace: '@openapi/' },
];

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (file.match(/\.(ts|tsx)$/)) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function getRelativePath(from, to) {
  const rel = path.relative(path.dirname(from), to);
  return rel.startsWith('.') ? rel : './' + rel;
}

function fixImportsInFile(filePath, packageDir, namespace) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;

  // Match imports: from '@namespace/path' or from "@namespace/path"
  const importRegex = new RegExp(`from ['"]${namespace.replace('/', '\\/')}([^'"]+)['"]`, 'g');

  content = content.replace(importRegex, (match, importPath) => {
    modified = true;

    // Resolve the absolute path
    const targetPath = path.join(__dirname, packageDir, importPath);

    // Calculate relative path
    let relativePath = getRelativePath(filePath, targetPath);

    // Remove .ts/.tsx extension if present in the import
    relativePath = relativePath.replace(/\.(ts|tsx)$/, '');

    return `from '${relativePath}'`;
  });

  // Also fix dynamic imports: import('@namespace/path')
  const dynamicImportRegex = new RegExp(`import\\(['"]${namespace.replace('/', '\\/')}([^'"]+)['"]\\)`, 'g');

  content = content.replace(dynamicImportRegex, (match, importPath) => {
    modified = true;

    const targetPath = path.join(__dirname, packageDir, importPath);
    let relativePath = getRelativePath(filePath, targetPath);
    relativePath = relativePath.replace(/\.(ts|tsx)$/, '');

    return `import('${relativePath}')`;
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✓ Fixed: ${filePath}`);
  }

  return modified;
}

let totalFixed = 0;

packages.forEach(pkg => {
  console.log(`\nProcessing ${pkg.dir}...`);
  const packagePath = path.join(__dirname, pkg.dir);
  const files = getAllFiles(packagePath);

  let pkgFixed = 0;
  files.forEach(file => {
    if (fixImportsInFile(file, pkg.dir, pkg.namespace)) {
      pkgFixed++;
    }
  });

  console.log(`Fixed ${pkgFixed} files in ${pkg.dir}`);
  totalFixed += pkgFixed;
});

console.log(`\n✅ Total files fixed: ${totalFixed}`);
