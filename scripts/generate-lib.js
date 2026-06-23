const fs = require('fs');
const path = require('path');

const libName = process.argv[2];

if (!libName) {
  console.error('Usage: pnpm generate:lib <lib-name>');
  process.exit(1);
}

const libDir = path.join('libs', libName);

if (fs.existsSync(libDir)) {
  console.error(`Error: libs/${libName} already exists`);
  process.exit(1);
}

fs.mkdirSync(path.join(libDir, 'src'), { recursive: true });

fs.writeFileSync(
  path.join(libDir, 'package.json'),
  JSON.stringify(
    {
      name: `@boilerplate/${libName}`,
      main: './dist/index.js',
      exports: { '.': './dist/index.js' },
      scripts: {
        build: 'tsc --project tsconfig.json',
        lint: 'eslint "src/**/*.ts" --fix',
      },
      dependencies: {},
      devDependencies: {
        '@boilerplate/eslint-config': 'workspace:*',
        eslint: '^9.18.0',
        typescript: '^5.7.3',
      },
    },
    null,
    2,
  ),
);

fs.writeFileSync(
  path.join(libDir, 'tsconfig.json'),
  JSON.stringify(
    {
      extends: '../../tsconfig.json',
      compilerOptions: { outDir: './dist' },
      include: ['src/**/*'],
      exclude: ['node_modules', 'dist'],
    },
    null,
    2,
  ),
);

fs.writeFileSync(
  path.join(libDir, 'eslint.config.mjs'),
  `import { nestConfig } from "@boilerplate/eslint-config/nest";

export default [
  { ignores: ['eslint.config.mjs', 'dist/**'] },
  ...nestConfig,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
`,
);

fs.writeFileSync(path.join(libDir, 'src', 'index.ts'), '');

console.log(`Created libs/${libName}`);
console.log('Installing dependencies...');

const { execSync } = require('child_process');
execSync('pnpm install', { stdio: 'inherit' });
execSync(`pnpm run --filter @boilerplate/${libName} build`, {
  stdio: 'inherit',
});
