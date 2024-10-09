import * as fs from "fs/promises";
import path, { join } from "path";
import yargs from "yargs";

async function printTree(dir, maxDepth = Infinity) {
  console.log("Tree of directory");
  console.log(dir);

  const tree = {
    total: 0,
    directories: 0,
    files: 0,
  };

  async function printBranch(path, indent = 1) {
    try {
      const data = await fs.readdir(path, { withFileTypes: true });

      for (const item of data) {
        if (indent > maxDepth) return;

        console.log(`${"  ".repeat(indent)}${item.isDirectory() ? "📁" : "📄"} ${item.name}`);

        if (item.isDirectory()) {
          tree.directories += 1;
          tree.total += 1;
          await printBranch(join(path, item.name), indent + 1, maxDepth);
        } else {
          tree.files += 1;
          tree.total += 1;
        }
      }
    } catch (err) {
      console.error(`Error reading directory: ${path}`, err.message);
    }
  }

  await printBranch(dir);
  console.log(`total: ${tree.total}, directories: ${tree.directories}, files: ${tree.files}`);
}

(async () => {
  const argv = yargs(process.argv).option("depth", {
    alias: "d",
    describe: "Directory depth to traverse",
    type: "number",
    default: Infinity,
  }).argv;

  await printTree(path.resolve(process.argv[2]), argv.depth);
})();
