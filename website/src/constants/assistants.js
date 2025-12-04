/**
 * AI Assistant configurations and data
 */

export const ASSISTANT_DATA = {
  'Cursor': {
    url: 'https://cursor.com',
    description: 'Optimized for Cursor IDE'
  },
  'GitHub Copilot': {
    url: 'https://github.com/features/copilot',
    description: 'Optimized for GitHub Copilot'
  },
  'Claude Code': {
    url: 'https://www.claude.com/product/claude-code',
    description: 'Optimized for Claude Code'
  },
  'Gemini CLI': {
    url: 'https://geminicli.com',
    description: 'Optimized for Gemini CLI'
  },
  'Qwen Code': {
    url: 'https://qwenlm.github.io/qwen-code-docs/',
    description: 'Optimized for Qwen Code'
  },
  'opencode': {
    url: 'https://opencode.ai',
    description: 'Optimized for opencode'
  },
  'Windsurf': {
    url: 'https://windsurf.com',
    description: 'Optimized for Windsurf'
  },
  'Kilo Code': {
    url: 'https://kilocode.com',
    description: 'Optimized for Kilo Code'
  },
  'Auggie CLI': {
    url: 'https://docs.augmentcode.com/cli/overview',
    description: 'Optimized for Auggie CLI'
  },
  'Roo Code': {
    url: 'https://roocode.com',
    description: 'Optimized for Roo Code'
  }
};

export const SUPPORTED_ASSISTANTS = [
  'Cursor',
  'GitHub Copilot',
  'Claude Code',
  'Gemini CLI',
  'Qwen Code',
  'opencode',
  'Windsurf',
  'Kilo Code',
  'Auggie CLI',
  'Roo Code'
];

export const ICON_ASSISTANTS = [
  { name: 'Claude Code', logo: '/img/claude-logo.svg', url: ASSISTANT_DATA['Claude Code'].url },
  { name: 'Cursor', logo: '/img/cursor-logo.svg', url: ASSISTANT_DATA['Cursor'].url },
  { name: 'GitHub Copilot', logo: '/img/github-copilot-logo.svg', url: ASSISTANT_DATA['GitHub Copilot'].url },
  { name: 'Kilo Code', logo: '/img/kilo-code-logo.svg', url: ASSISTANT_DATA['Kilo Code'].url },
  { name: 'Windsurf', logo: '/img/windsurf-logo.svg', url: ASSISTANT_DATA['Windsurf'].url },
  { name: 'Gemini CLI', logo: '/img/gemini-logo.svg', url: ASSISTANT_DATA['Gemini CLI'].url }
];

export const ICONS_TO_DISPLAY = 6;
export const DEFAULT_ASSISTANT = 'Cursor';
export const TERMINAL_BUTTON_COUNT = 3;
