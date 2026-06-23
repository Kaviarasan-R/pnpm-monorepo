import { nestConfig } from '@boilerplate/eslint-config/nest';

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
