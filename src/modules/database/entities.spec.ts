import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { ENTITIES } from './entities';
import { MIGRATIONS } from './migrations';

/** Recursively collect every *.entity.ts under src/. */
function entityFiles(dir: string, found: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) entityFiles(full, found);
    else if (name.endsWith('.entity.ts')) found.push(full);
  }
  return found;
}

describe('entity registration', () => {
  it('registers every @Entity class in ENTITIES', () => {
    const src = join(__dirname, '..', '..');
    const declared = new Set<string>();

    for (const file of entityFiles(src)) {
      const text = readFileSync(file, 'utf8');
      const re = /@Entity\([^)]*\)(?:\s*@\w+\([^)]*\))*\s*export class (\w+)/g;
      let m: RegExpExecArray | null;
      while ((m = re.exec(text))) declared.add(m[1]);
    }

    const registered = new Set(ENTITIES.map((e) => e.name));
    const missing = [...declared].filter((n) => !registered.has(n));

    // An entity that is declared but not registered cannot have a repository
    // injected, and Nest throws during module initialisation rather than at the
    // call site — so this is worth failing the build over.
    expect(missing).toEqual([]);
    expect(registered.size).toBe(declared.size);
  });

  it('registers every migration in MIGRATIONS', () => {
    const dir = join(__dirname, 'migrations');
    const declared = new Set<string>();

    for (const file of readdirSync(dir)) {
      if (!file.endsWith('.ts') || file === 'index.ts' || file.endsWith('.spec.ts')) continue;
      const text = readFileSync(join(dir, file), 'utf8');
      const re = /export class (\w+)\s+implements\s+MigrationInterface/g;
      let m: RegExpExecArray | null;
      while ((m = re.exec(text))) declared.add(m[1]);
    }

    const registered = new Set(MIGRATIONS.map((m) => m.name));
    const missing = [...declared].filter((n) => !registered.has(n));

    // A migration missing from the list is invisible to TypeORM in the bundled
    // build: migrationsRun reports success and the app starts against a schema
    // that was never created.
    expect(missing).toEqual([]);
    expect(registered.size).toBe(declared.size);
  });
});
