/**
 * Safari Xcode project post-processing script
 * - Configures automatic signing with Development Team
 * - Adds ITSAppUsesNonExemptEncryption declaration for TestFlight
 */
import path from 'node:path'
import process from 'node:process'

import fs from 'fs-extra'

const DEVELOPMENT_TEAM = '47GJJ2S5J8'

const XCODE_PROJECT_DIR = './extension-safari-xcode/BewlyCat'
const PBXPROJ_PATH = path.join(XCODE_PROJECT_DIR, 'BewlyCat.xcodeproj/project.pbxproj')

// Info.plist paths (actual structure from safari-web-extension-converter)
const PLIST_PATHS = [
  path.join(XCODE_PROJECT_DIR, 'macOS (App)/Info.plist'),
  path.join(XCODE_PROJECT_DIR, 'macOS (Extension)/Info.plist'),
  path.join(XCODE_PROJECT_DIR, 'iOS (App)/Info.plist'),
  path.join(XCODE_PROJECT_DIR, 'iOS (Extension)/Info.plist'),
]

/**
 * Add ITSAppUsesNonExemptEncryption to Info.plist
 * This declares that the app does not use encryption requiring export compliance
 */
async function addEncryptionExemption(plistPath: string): Promise<boolean> {
  if (!await fs.pathExists(plistPath)) {
    console.log(`⚠️  File not found: ${plistPath}`)
    return false
  }

  let content = await fs.readFile(plistPath, 'utf-8')

  // Check if already added
  if (content.includes('ITSAppUsesNonExemptEncryption')) {
    console.log(`⚠️  Already configured: ${plistPath}`)
    return true
  }

  // Add before the closing </dict> tag
  content = content.replace(
    /<\/dict>\s*<\/plist>/,
    `\t<key>ITSAppUsesNonExemptEncryption</key>\n\t<false/>\n</dict>\n</plist>`,
  )

  await fs.writeFile(plistPath, content, 'utf-8')
  console.log(`✅ Added encryption exemption: ${plistPath}`)
  return true
}

async function updateInfoPlists() {
  console.log('📝 Adding encryption exemption declarations...\n')

  for (const plistPath of PLIST_PATHS) {
    await addEncryptionExemption(plistPath)
  }
}

async function updatePbxproj() {
  console.log('\n🔧 Configuring automatic signing...\n')

  let content = await fs.readFile(PBXPROJ_PATH, 'utf-8')

  // Check if already configured
  if (content.includes(`DEVELOPMENT_TEAM = ${DEVELOPMENT_TEAM}`)) {
    console.log('⚠️  Automatic signing already configured')
    return
  }

  // Add CODE_SIGN_STYLE and DEVELOPMENT_TEAM before each PRODUCT_BUNDLE_IDENTIFIER
  // This handles all targets (iOS App, iOS Extension, macOS App, macOS Extension)
  content = content.replace(
    /(\t+)(PRODUCT_BUNDLE_IDENTIFIER = com\.hankun\.BewlyCat(?:\.Extension)?;)/g,
    `$1CODE_SIGN_STYLE = Automatic;\n$1DEVELOPMENT_TEAM = ${DEVELOPMENT_TEAM};\n$1$2`,
  )

  await fs.writeFile(PBXPROJ_PATH, content, 'utf-8')
  console.log(`✅ Configured automatic signing with Team ID: ${DEVELOPMENT_TEAM}`)
}

async function main() {
  console.log('🔧 Safari post-convert: Configuring project settings...\n')

  // Check if Xcode project exists
  if (!await fs.pathExists(PBXPROJ_PATH)) {
    console.error(`❌ Xcode project not found at ${XCODE_PROJECT_DIR}`)
    console.error('   Run "pnpm convert-safari" first.')
    process.exit(1)
  }

  try {
    await updateInfoPlists()
    await updatePbxproj()

    console.log('\n✅ Safari post-convert completed!')
    console.log(`   Development Team: ${DEVELOPMENT_TEAM}`)
    console.log(`   Code Sign Style: Automatic`)
    console.log(`   Encryption Exemption: ITSAppUsesNonExemptEncryption = false`)
    console.log('\n📋 Next steps:')
    console.log('   1. Open: extension-safari-xcode/BewlyCat/BewlyCat.xcodeproj')
    console.log('   2. Build and archive for TestFlight')
  }
  catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

main()
