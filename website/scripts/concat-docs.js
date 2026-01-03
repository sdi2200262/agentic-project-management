#!/usr/bin/env node

/**
 * concat-docs.js
 * 
 * This script concatenates all markdown documentation files from the /docs directory
 * into a single file (all_docs.md) in the website/static directory.
 * This enables users to copy all documentation at once via the website.
 */

const fs = require('fs');
const path = require('path');

// Define the logical order for documentation files
const DOC_ORDER = [
  'README.md',
  'Introduction.md',
  'Getting_Started.md',
  'Workflow_Overview.md',
  'Agent_Types.md',
  'CLI.md',
  'Context_and_Memory_Management.md',
  'Context_and_Prompt_Engineering.md',
  'Token_Consumption_Tips.md',
  'Modifying_APM.md',
  'Troubleshooting_Guide.md',
];

// Paths
const DOCS_DIR = path.resolve(__dirname, '../../docs');
const STATIC_DIR = path.resolve(__dirname, '../static');
const OUTPUT_FILE = path.join(STATIC_DIR, 'apm_full_docs.md');

function main() {
  console.log('📚 Concatenating documentation files...');
  
  // Ensure static directory exists
  if (!fs.existsSync(STATIC_DIR)) {
    fs.mkdirSync(STATIC_DIR, { recursive: true });
  }

  let allContent = [];
  
  // Add header
  allContent.push('# Agentic Project Management - Complete Documentation\n');
  allContent.push(`> Generated: ${new Date().toISOString()}\n`);
  allContent.push('---\n\n');

  // Process each file in the defined order
  for (const filename of DOC_ORDER) {
    const filePath = path.join(DOCS_DIR, filename);
    
    if (fs.existsSync(filePath)) {
      console.log(`  ✓ Adding ${filename}`);
      
      // Add file separator
      allContent.push(`\n\n## File: ${filename}\n\n`);
      allContent.push('---\n\n');
      
      // Read and add file content
      const content = fs.readFileSync(filePath, 'utf-8');
      allContent.push(content);
      allContent.push('\n\n');
    } else {
      console.log(`  ⚠ Skipping ${filename} (not found)`);
    }
  }

  // Write the concatenated content
  fs.writeFileSync(OUTPUT_FILE, allContent.join(''), 'utf-8');
  
  console.log(`✅ Documentation concatenated successfully!`);
  console.log(`   Output: ${OUTPUT_FILE}`);
  console.log(`   Total files: ${DOC_ORDER.length}`);
}

// Run the script
try {
  main();
} catch (error) {
  console.error('❌ Error concatenating documentation:', error);
  process.exit(1);
}
