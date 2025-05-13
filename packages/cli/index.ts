#!/usr/bin/env node
import { Command } from 'commander';
import fs from 'fs';
import path from 'path';

const program = new Command();

program
  .name('reangular')
  .description('Reangular CLI')
  .version('0.0.1');

function copyRecursive(src: string, dest: string) {
  const files = fs.readdirSync(src);
  for (const file of files) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

program
  .command('create <projectName>')
  .description('Create a new Reangular project')
  .option('--front', 'Include front-end module')
  .option('--back', 'Include back-end module')
  .option('--nocode', 'Include no-code builder')
  .option('--analytics', 'Include analytics module')
  .action((projectName, options) => {
    const targetDir = path.join(process.cwd(), projectName);

    if (fs.existsSync(targetDir)) {
      console.error(`❌ Folder "\${projectName}" already exists.`);
      return;
    }

    fs.mkdirSync(targetDir, { recursive: true });

    const selectedModules = [];
    if (options.front) selectedModules.push("front");
    if (options.back) selectedModules.push("back");
    if (options.nocode) selectedModules.push("nocode");
    if (options.analytics) selectedModules.push("analytics");

    for (const module of selectedModules) {
      const templateDir = path.join(__dirname, 'templates', module);
      if (!fs.existsSync(templateDir)) {
        console.warn(`⚠️ Template for "\${module}" not found. Skipping...`);
        continue;
      }
      copyRecursive(templateDir, targetDir);
    }

    console.log(`✅ Project "\${projectName}" created with: \${selectedModules.join(", ")}`);
  });

program.parse(process.argv);
