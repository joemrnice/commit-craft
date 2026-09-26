# ⚡ Commit Craft

A zero-dependency CLI that turns "fixed stuff" into a clean [Conventional Commit](https://www.conventionalcommits.org/) message.

Built live during a **Build-Lab Saturday** session — the whole point was: small annoyance in, working tool out, same afternoon. No frameworks, no npm installs, one file.

## Why

Writing good commit messages is a small task that's easy to skip when you're moving fast. This tool removes the friction: pick a type, describe the change in plain English, get a properly formatted message back — and optionally commit with it right away.

## Install

No dependencies to install. Just clone and run:

```bash
git clone https://github.com/joemrnice/commit-craft.git
cd commit-craft
node index.js
```

Or link it globally so `commit-craft` works anywhere:

```bash
npm link
commit-craft
```

## Usage

```
$ commit-craft

⚡ Commit Craft — build a clean commit message

  1. feat — new feature
  2. fix — bug fix
  3. refactor — code change, no behavior change
  4. docs — documentation only
  5. chore — maintenance / tooling
  6. style — formatting only
  7. perf — performance improvement
  8. test — adding/fixing tests

Pick a type (1-8): 2
Scope (optional, e.g. auth/api/ui): auth
What did you change? (one short line): handle expired session tokens
Why / details (optional) (empty line to finish)
  > was silently failing on refresh
  > now redirects to login with a message
  >
Breaking change? (y/N): n

--- Generated commit message ---

fix(auth): handle expired session tokens

- was silently failing on refresh
- now redirects to login with a message

---------------------------------

Run `git commit` with this message now? (y/N): y

✅ Committed.
```

## How it works

- Prompts run on Node's built-in `readline` — no `inquirer`, no external prompt library.
- If you're inside a git repository, it offers to run `git commit -F -` with the generated message directly, piping the message in via stdin so multi-line messages come through exactly as typed.
- If you're not in a git repo, or you say no, it just prints the message for you to copy.

## There's also a browser version

Same logic, no install needed: [Commit Craft (web)]() — good for a quick one-off message without touching the terminal.

## License

MIT — fork it, break it, improve it. That's the whole build-lab spirit.
