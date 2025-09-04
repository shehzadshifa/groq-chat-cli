# groq-chat-cli

A simple and interactive **Groq API command-line chat assistant**, built by **Shehzad Shifa**.

## Installation

```bash
npm install -g groq-chat-cli
````

## Quick Start

1. **Set your API key**

Create a `.env` file in your home directory or project root:

```bash
echo "GROQ_API_KEY=your_api_key_here" > ~/.groq-cli-env
```

Or set it temporarily:

```bash
export GROQ_API_KEY=your_api_key_here
```

2. **Run the CLI**

```bash
groq-chat
```

3. **Chat with AI**

```
> hello
> help me write a Python script
> save notes.txt "This is my note"
> exit
```

## Features

* Interactive chat with Groq models
* Streaming responses in real-time
* Lightweight shell-like commands (`cd`, `ls`, `save`)
* No destructive commands (safe by design)

## Commands

* `help` – List commands
* `exit` – Quit the CLI
* `clear` – Clear screen
* `cd <path>` – Change directory
* `save <file> "<content>"` – Save text content to a file

## Contributing

Clone and test locally:

```bash
git clone https://github.com/shehzadshifa/groq-chat-cli.git
cd groq-chat-cli
npm install
npm link
groq-chat
```

## License

MIT © 2025 [Shehzad Shifa](mailto:shehzadshifa@gmail.com)

```

