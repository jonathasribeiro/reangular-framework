#!/usr/bin/env node
import { Command } from 'commander';
const program = new Command();

program
  .name('reangular')
  .description('Reangular CLI')
  .version('0.0.1');

program
  .command('create')
  .description('Create a new Reangular project')
  .action(() => {
    console.log('🔧 Creating a new Reangular project...');
  });

program.parse(process.argv);
