import { existsSync, writeFileSync } from 'fs'

if (!existsSync('next.user-config.mjs')) {
  writeFileSync('next.user-config.mjs', 'const nextConfig = {};\nexport default nextConfig;\n')
  console.log('Created next.user-config.mjs')
}
