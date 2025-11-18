import * as esbuild from 'esbuild';
import path from 'path';
import fs from 'fs';

// --- Configuration ---

// Get the directory where this script is executed
const currentDir = process.cwd();

// Assume the package.json is in the same directory where this script is run
const pkgPath = path.resolve(currentDir, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

// The prefix for your internal packages that MUST be bundled
const internalPackagePrefix = '@fluxify/';
const unwantedDrivers = [
  // List drivers you DO NOT want in your bundle:
  'mysql',
  'mysql2',
  'sqlite3',
  'better-sqlite3',
  'pg-query-stream',
  'oracledb',
  'tedious',
  // ... add any others if necessary
];
// 1. Get the list of ALL production dependencies from package.json
const allDependencies = [
  ...Object.keys(pkg.dependencies || {}),
  ...unwantedDrivers, // <-- ADDED THE UNWANTED DRIVERS
  ...Object.keys(pkg.peerDependencies || {}),
];

// 2. Node.js built-ins (esbuild handles most, but explicit list is robust)
const nodeBuiltins = [
  'fs', 'path', 'http', 'os', 'child_process', 'crypto',
  'net', 'stream', 'util', 'zlib', 'assert', 'events', 'url'
];

// 3. ⭐ Filter: Externalize all dependencies that are NOT your internal packages ⭐
const externalModules = [
  // ...nodeBuiltins,
  // Filter to keep only external NPM packages (i.e., exclude @fluxify/*)
  ...allDependencies.filter(dep => !dep.startsWith(internalPackagePrefix)),
];

// ---------------------------------

async function build() {
  const entryPoint = process.env.ESBUILD_ENTRY || 'deployments/standalone.ts'; // Use environment variable or default
  const outputDir = process.env.ESBUILD_OUTDIR || 'build';

  console.log(`Building ${entryPoint}...`);

  try {
    await esbuild.build({
      entryPoints: [entryPoint],
      outdir: outputDir,
      bundle: true,
      platform: 'node', // Crucial for backend and auto-externalizing some built-ins
      format: 'cjs',
      sourcemap: true, // Enable sourcemaps

      // ⭐ The finalized list of modules to exclude from the bundle ⭐
      external: externalModules,

      // We rely on the TypeScript resolver to find the symlinked @fluxify/* packages
      // and bundle them because they are NOT in the 'external' list.
    });

    console.log('✅ Esbuild build completed successfully!');
  } catch (error) {
    console.error('❌ Esbuild build failed:', error);
    process.exit(1);
  }
}

build();