import axios from 'axios';
import chalk from 'chalk';
import { createReadStream, createWriteStream, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Fetches the asset URL for the specified AI assistant
 * @param {string} assistant - The AI assistant name (e.g., "Cursor", "GitHub Copilot")
 * @returns {Promise<string>} The URL or file path to the asset bundle
 */
export async function fetchReleaseAssetUrl(assistant) {
  // TODO: In Phase 3, this will integrate with GitHub API to fetch real release assets
  // For now, we use hardcoded test bundle paths for development
  
  const testAssetsPath = join(__dirname, '..', 'test-assets');
  
  switch (assistant.toLowerCase()) {
    case 'cursor':
      return join(testAssetsPath, 'apm-cursor-bundle.zip');
    case 'github copilot':
    case 'copilot':
      return join(testAssetsPath, 'apm-copilot-bundle.zip');
    default:
      throw new Error(`Unsupported AI assistant: ${assistant}`);
  }
}

/**
 * Downloads and extracts a zip file to the specified destination
 * @param {string} url - URL or file path to the zip file
 * @param {string} destinationPath - Path where the contents should be extracted
 * @returns {Promise<void>}
 */
export async function downloadAndExtract(url, destinationPath) {
  try {
    console.log(chalk.blue('📦 Downloading assets...'));
    
    let zipPath;
    
    // Check if it's a local file path or URL
    if (url.startsWith('http://') || url.startsWith('https://')) {
      // Handle URL downloads
      const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream'
      });
      
      // Create a temporary file for the download
      const tempPath = join(destinationPath, 'temp-bundle.zip');
      const writer = createWriteStream(tempPath);
      
      response.data.pipe(writer);
      
      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });
      
      zipPath = tempPath;
    } else {
      // Handle local file paths (for testing)
      zipPath = url;
    }
    
    console.log(chalk.yellow('📂 Extracting files...'));
    
    // Use unzip command to extract (more reliable than unzipper package)
    try {
      await execAsync(`unzip -o "${zipPath}" -d "${destinationPath}"`);
    } catch (unzipError) {
      // Fallback: try with ditto on macOS
      try {
        await execAsync(`ditto -xk "${zipPath}" "${destinationPath}"`);
      } catch (dittoError) {
        throw new Error(`Failed to extract zip file: ${unzipError.message}`);
      }
    }
    
    // Clean up temporary file if it was downloaded
    if (url.startsWith('http://') || url.startsWith('https://')) {
      try {
        await execAsync(`rm "${zipPath}"`);
      } catch (cleanupError) {
        // Ignore cleanup errors
      }
    }
    
    console.log(chalk.green('✅ Scaffolding complete!'));
    console.log(chalk.green(`📁 APM project structure created in: ${destinationPath}`));
    
  } catch (error) {
    console.error(chalk.red('❌ Error during download/extraction:'));
    console.error(chalk.red(error.message));
    throw error;
  }
}
