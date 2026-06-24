// Type-check the project, preferring the native TypeScript compiler (tsgo, TS 7)
// and falling back to the classic JavaScript-based tsc (TS 6) when it is unavailable.
//
// "Unavailable" means the binary is missing or cannot start — NOT that it found
// type errors. Real type errors are reported as-is, with the correct exit code,
// so this script is safe to use in CI.
import { spawnSync } from 'node:child_process'

const canRun = (cmd) =>
  spawnSync(cmd, ['--version'], { shell: true }).status === 0

const typecheck = (cmd) =>
  spawnSync(cmd, ['--noEmit'], { stdio: 'inherit', shell: true }).status ?? 1

if (canRun('tsgo')) {
  console.log('▶ Type-checking with the native compiler (tsgo / TypeScript 7)')
  process.exit(typecheck('tsgo'))
} else {
  console.log('▶ tsgo unavailable — falling back to classic tsc (TypeScript 6)')
  process.exit(typecheck('tsc'))
}
