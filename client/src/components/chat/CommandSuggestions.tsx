import React, { useState, useEffect, useRef } from 'react';
import './CommandSuggestions.css';

interface Command {
  name: string;
  description: string;
  execute: (args: string) => string;
}

const commands: Command[] = [
  {
    name: '/shrug',
    description: 'Append a shrug',
    execute: (args) => `${args || ''} ¯\\_(ツ)_/¯`.trim(),
  },
  {
    name: '/me',
    description: 'Italic action message',
    execute: (args) => `*${args}*`,
  },
  {
    name: '/tableflip',
    description: 'Flip a table',
    execute: () => '(╯°□°）╯︵ ┻━┻',
  },
  {
    name: '/unflip',
    description: 'Unflip a table',
    execute: () => '┬─┬ノ( º _ ºノ)',
  },
  {
    name: '/lenny',
    description: 'Lenny face',
    execute: (args) => `${args || ''} ( ͡° ͜ʖ ͡°)`.trim(),
  },
  {
    name: '/help',
    description: 'Show available commands',
    execute: () => 'Commands: /shrug, /me, /tableflip, /unflip, /lenny, /help',
  },
];

interface CommandSuggestionsProps {
  input: string;
  onSelect: (processedContent: string) => void;
}

export default function CommandSuggestions({ input, onSelect }: CommandSuggestionsProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Check if input starts with a command
  const isCommand = input.startsWith('/');
  const query = isCommand ? input.split(' ')[0].toLowerCase() : '';

  const filteredCommands = commands.filter((cmd) => cmd.name.startsWith(query));

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isCommand || filteredCommands.length === 0) return null;

  const handleSelect = (cmd: Command) => {
    const args = input.slice(cmd.name.length).trim();
    onSelect(cmd.execute(args));
  };

  return (
    <div className="command-suggestions" role="listbox" aria-label="Command suggestions">
      {filteredCommands.map((cmd, index) => (
        <button
          key={cmd.name}
          className={`command-item ${index === selectedIndex ? 'command-item-active' : ''}`}
          onClick={() => handleSelect(cmd)}
          role="option"
          aria-selected={index === selectedIndex}
        >
          <span className="command-name">{cmd.name}</span>
          <span className="command-desc">{cmd.description}</span>
        </button>
      ))}
    </div>
  );
}
