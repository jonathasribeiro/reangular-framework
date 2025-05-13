import path from 'path';
import { existsSync } from 'fs';

/**
 * Dynamically imports the routes.ts file from the project root
 * and executes the Route definitions inside it.
 *
 * @param appRoot Absolute path to the app root (e.g., process.cwd())
 */
export async function loadRoutes(appRoot: string) {
  const routeFile = path.join(appRoot, 'routes.ts');

  if (existsSync(routeFile)) {
    try {
      await import(routeFile);
      console.log('✅ routes.ts loaded successfully.');
    } catch (err) {
      console.error('❌ Failed to load routes.ts:', err);
    }
  } else {
    console.warn('⚠️ No routes.ts file found in project root.');
  }
}
