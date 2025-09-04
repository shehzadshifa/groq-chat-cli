#!/usr/bin/env node
import readline from 'readline';
import chalk from 'chalk';
import figlet from 'figlet';
import boxen from 'boxen';
import { Groq } from 'groq-sdk';
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.GROQ_API_KEY) {
  console.error(chalk.red('Error: GROQ_API_KEY not set. Add it to your environment or .env file.'));
  process.exit(1);
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `
You are Groq CLI, an interactive AI assistant for the command line, created by Shehzad.
Your behavior:
- Be concise, smart, and helpful.
- You can explain, navigate, create files, read files, or debug code.
- Never execute destructive actions (rm -rf, sudo wipe, etc.).
- Format output for terminal: use markdown for readability, code blocks for code.
- Add emojis where helpful but keep it professional.
`;

console.log(
  chalk.cyan(
    figlet.textSync('Groq CLI', { horizontalLayout: 'default', verticalLayout: 'default' })
  )
);
console.log(chalk.gray('                                    by Shehzad\n'));
console.log(chalk.green(`Interactive AI CLI — Type 'help' for commands, 'exit' to quit.\n`));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: chalk.yellow('> ')
});

const safeCommands = ['cd', 'pwd', 'ls', 'cat', 'touch', 'mkdir', 'save', 'clear', 'help'];

function formatAIResponse(content) {
  return boxen(content, {
    padding: 1,
    margin: 1,
    borderColor: 'cyan',
    borderStyle: 'round'
  });
}

rl.prompt();

rl.on('line', async (line) => {
  let input = line.trim();
  input = input.replace(/^[^$]+\$\s*/, ''); // Strip accidental shell prefix

  if (input.toLowerCase() === 'exit') {
    rl.close();
    return;
  }

  if (input.toLowerCase() === 'clear') {
    console.clear();
    rl.prompt();
    return;
  }

  if (input.toLowerCase() === 'help') {
    console.log(chalk.magenta(`
Available commands:
  help   - Show this help message
  clear  - Clear the screen
  exit   - Exit the CLI
  ls     - List files in current directory
  cd     - Change directory
  pwd    - Show current directory
  touch  - Create an empty file
  mkdir  - Create a directory
  cat    - View file content
  save   - Save a note to a file
`));
    rl.prompt();
    return;
  }

  const [cmd, ...args] = input.split(' ');

  if (safeCommands.includes(cmd)) {
    try {
      switch (cmd) {
        case 'ls':
          console.log(fs.readdirSync(process.cwd()).join('\n'));
          break;
        case 'pwd':
          console.log(process.cwd());
          break;
        case 'cd':
          process.chdir(args[0] || process.env.HOME);
          console.log(`Moved to: ${process.cwd()}`);
          break;
        case 'touch':
          fs.writeFileSync(args[0], '', { flag: 'wx' });
          console.log(`Created file: ${args[0]}`);
          break;
        case 'mkdir':
          fs.mkdirSync(args[0], { recursive: true });
          console.log(`Created directory: ${args[0]}`);
          break;
        case 'cat':
          console.log(fs.readFileSync(args[0], 'utf8'));
          break;
        case 'save':
          const filePath = path.join(process.cwd(), args[0] || 'note.txt');
          const content = args.slice(1).join(' ') || 'Empty note';
          fs.writeFileSync(filePath, content);
          console.log(`Saved note to: ${filePath}`);
          break;
      }
    } catch (err) {
      console.error(chalk.red(`Error: ${err.message}`));
    }
    rl.prompt();
    return;
  }

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: input }
      ],
      model: 'openai/gpt-oss-120b',
      temperature: 0.8,
      max_completion_tokens: 8192,
      top_p: 1,
      stream: true,
      reasoning_effort: 'medium'
    });

    let output = '';
    for await (const chunk of chatCompletion) {
      output += chunk.choices[0]?.delta?.content || '';
    }

    console.log(formatAIResponse(`🤖 Groq:\n\n${output.trim()}`));
  } catch (err) {
    console.error(chalk.red(`\nError: ${err.message}\n`));
  }

  rl.prompt();
});

rl.on('close', () => {
  console.log(chalk.blue('\nGoodbye! 👋'));
  process.exit(0);
});
