// src/tools/toolLoader.js


const toolRegistry = new Map();

/**
 * Registers a tool with a given name and loader function.
 */
export function registerTool(name, loaderFn) {
  toolRegistry.set(name, loaderFn);
}

/**
 * Launches a tool by name.
 */
export async function launchTool(name, arg = undefined) {
  const loader = toolRegistry.get(name);
  if (!loader) {
    console.warn(`Tool '${name}' not registered.`);
    return;
  }

  try {
    const mod = await loader(arg); // ✅ Pass arg to the tool
    if (mod && typeof mod.init === 'function') {
      mod.init(arg);               // ✅ Optional: pass to init if needed
    } else {
      console.warn(`Tool '${name}' loaded but has no init()`);
    }
  } catch (err) {
    console.error(`Failed to launch tool '${name}':`, err);
  }
}







