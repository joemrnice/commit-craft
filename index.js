#!/usr/bin/env node

/**
 * Commit Craft — a zero-dependency CLI that turns a plain-English
 * description of your change into a clean Conventional Commit message.
 *
 * Usage:
 *   node index.js
 *   commit-craft            (if installed globally / linked)
 *
 * Built for "Build-Lab Saturday" — one file, no npm installs, works
 * anywhere Node runs.
 */

const readline = require('readline');
const { execSync } = require('child_process');

const TYPES = [
  { key: 'feat', label: 'feat — new feature' },
  { key: 'fix', label: 'fix — bug fix' },
  { key: 'refactor', label: 'refactor — code change, no behavior change' },
  { key: 'docs', label: 'docs — documentation only' },
  { key: 'chore', label: 'chore — maintenance / tooling' },
  { key: 'style', label: 'style — formatting only' },
  { key: 'perf', label: 'perf — performance improvement' },
  { key: 'test', label: 'test — adding/fixing tests' },
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, (answer) => resolve(answer.trim())));
}

async function askMultiline(question) {
  console.log(question + ' (empty line to finish)');
  const lines = [];
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const line = await ask('  > ');
    if (line === '') break;
    lines.push(line.startsWith('-') ? line : `- ${line}`);
  }
  return lines.join('\n');
}

function buildMessage({ type, scope, summary, details, breaking }) {
  const header = `${type}${scope ? `(${scope})` : ''}${breaking ? '!' : ''}: ${summary}`;
  let msg = header;
  if (details) msg += `\n\n${details}`;
  if (breaking) msg += `\n\nBREAKING CHANGE: ${summary}`;
  return msg;
}

function isInsideGitRepo() {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

async function main() {
  console.log('\n⚡ Commit Craft — build a clean commit message\n');

  TYPES.forEach((t, i) => console.log(`  ${i + 1}. ${t.label}`));
  let typeIndex = -1;
  while (typeIndex < 0 || typeIndex >= TYPES.length) {
    const answer = await ask(`\nPick a type (1-${TYPES.length}): `);
    typeIndex = parseInt(answer, 10) - 1;
  }
  const type = TYPES[typeIndex].key;

  const scope = await ask('Scope (optional, e.g. auth/api/ui): ');
  let summary = '';
  while (!summary) {
    summary = await ask('What did you change? (one short line): ');
  }
  const details = await askMultiline('Why / details (optional)');
  const breakingAnswer = (await ask('Breaking change? (y/N): ')).toLowerCase();
  const breaking = breakingAnswer === 'y' || breakingAnswer === 'yes';

  const message = buildMessage({ type, scope, summary, details, breaking });

  console.log('\n--- Generated commit message ---\n');
  console.log(message);
  console.log('\n---------------------------------\n');

  if (isInsideGitRepo()) {
    const useIt = (await ask('Run `git commit` with this message now? (y/N): ')).toLowerCase();
    if (useIt === 'y' || useIt === 'yes') {
      try {
        execSync('git commit -F -', { input: message, stdio: ['pipe', 'inherit', 'inherit'] });
        console.log('\n✅ Committed.');
      } catch (err) {
        console.error('\n⚠️  git commit failed — nothing was committed. Message above is still yours to copy.');
      }
    } else {
      console.log('Not committing. Copy the message above whenever you\'re ready.');
    }
  } else {
    console.log('(Not inside a git repo — just copy the message above.)');
  }

  rl.close();
}

main();
