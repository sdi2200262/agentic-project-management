import { replacePlaceholders } from './build.js';

/**
 * Unit test for the replacePlaceholders function
 * @returns {boolean} True if all tests pass
 */
function testReplacePlaceholders() {
  const testContent = `
# APM {VERSION} - Test Guide
This is a test with {TIMESTAMP}.
See {GUIDE_PATH:some-guide.md} for more info.
And {COMMAND_PATH:some-command.md} for commands.
`;

  const targetDirectories = {
    guides: 'guides',
    commands: '.cursor/commands'
  };

  const result = replacePlaceholders(testContent, '0.5.0', targetDirectories);

  // Check if VERSION and paths are replaced (TIMESTAMP will vary)
  const versionReplaced = result.includes('APM 0.5.0');
  const guideReplaced = result.includes('guides/some-guide.md');
  const commandReplaced = result.includes('.cursor/commands/some-command.md');
  const timestampPresent = result.includes(new Date().toISOString().split('T')[0]); // Check date part

  console.log('Placeholder replacement test:');
  console.log('VERSION replaced:', versionReplaced);
  console.log('GUIDE_PATH replaced:', guideReplaced);
  console.log('COMMAND_PATH replaced:', commandReplaced);
  console.log('TIMESTAMP present:', timestampPresent);

  return versionReplaced && guideReplaced && commandReplaced && timestampPresent;
}

/**
 * Run all tests
 */
function runTests() {
  console.log('Running build script tests...\n');

  const testPassed = testReplacePlaceholders();

  console.log(`\nAll tests passed: ${testPassed}`);

  if (!testPassed) {
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}

export { testReplacePlaceholders, runTests };