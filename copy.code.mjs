#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import clipboardy from 'clipboardy'
import { globSync } from 'glob'
import { minimatch } from 'minimatch'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

/**
 * Load the JSON configuration file.
 * @param {string} configPath - Path to the copy.config.json file.
 * @returns {Object} - Configuration object containing exclusion patterns and settings.
 */
function loadConfig(configPath) {
  try {
    const configData = fs.readFileSync(configPath, 'utf-8')
    const config = JSON.parse(configData)
    const excludePatterns = config.exclude || []
    const excludeHidden = config.excludeHidden || false
    const excludeDotFiles = config.excludeDotFiles || false
    return { excludePatterns, excludeHidden, excludeDotFiles }
  } catch (err) {
    console.error(`Error loading configuration file at ${configPath}:`, err.message)
    process.exit(1)
  }
}

/**
 * Determine if a file or directory should be excluded based on patterns.
 * @param {string} relativePath - The path relative to the root directory.
 * @param {Array<string>} excludePatterns - Array of glob patterns to exclude.
 * @returns {boolean} - True if the path matches any exclude pattern.
 */
function isExcluded(relativePath, excludePatterns) {
  return excludePatterns.some(pattern => minimatch(relativePath, pattern, { dot: true }))
}

/**
 * Recursively get all files in the directory excluding those that match excludePatterns.
 * @param {string} dir - The root directory to traverse.
 * @param {Array<string>} excludePatterns - Array of glob patterns to exclude.
 * @returns {Array<string>} - Array of file paths.
 */
function getAllFiles(dir, excludePatterns) {
  const files = globSync('**/*', {
    cwd: dir,
    nodir: true,
    dot: true,
    ignore: excludePatterns
  })
  return files.map(file => path.join(dir, file))
}

/**
 * Build the output string with the specified format.
 * @param {Array<string>} files - Array of file paths.
 * @param {string} rootDir - The root directory path.
 * @returns {string} - Concatenated string of file paths and contents.
 */
function buildOutputString(files, rootDir) {
  let output = ''

  files.forEach(filePath => {
    const relativePath = path.relative(rootDir, filePath)
    try {
      const contents = fs.readFileSync(filePath, 'utf-8')
      output += `${relativePath}:\n\n${contents}\n\n`
    } catch (err) {
      console.warn(`Skipping file ${relativePath}: ${err.message}`)
    }
  })

  return output
}

/**
 * Main function to execute the script.
 */
async function main() {
  const rootDir = process.cwd()
  const configPath = path.join(rootDir, 'copy.config.json')

  console.log('Loading configuration...')
  const { excludePatterns, excludeHidden, excludeDotFiles } = loadConfig(configPath)
  console.log('Exclusion Patterns:', excludePatterns)
  console.log('Exclude Hidden Directories:', excludeHidden)
  console.log('Exclude Dotfiles:', excludeDotFiles)

  // Initialize finalExcludePatterns with existing exclude patterns
  let finalExcludePatterns = [...excludePatterns]

  // If excludeHidden is true, add patterns to exclude hidden directories
  if (excludeHidden) {
    // Exclude all hidden directories and their contents
    finalExcludePatterns.push('**/.*/**')
  }

  // If excludeDotFiles is true, add patterns to exclude dotfiles
  if (excludeDotFiles) {
    // Exclude all files that start with a dot
    finalExcludePatterns.push('**/.*')
  }

  console.log('Final Exclusion Patterns:', finalExcludePatterns)

  console.log('Gathering files...')
  const files = getAllFiles(rootDir, finalExcludePatterns)
  console.log(`Found ${files.length} files. Building output string...`)

  const outputString = buildOutputString(files, rootDir)

  console.log('Copying to clipboard...')
  try {
    await clipboardy.write(outputString)
    console.log('Success! The concatenated code has been copied to your clipboard.')
  } catch (err) {
    console.error('Failed to copy to clipboard:', err.message)
    process.exit(1)
  }
}

main()