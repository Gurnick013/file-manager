import { chdir } from 'process';
import { pipeline } from 'stream/promises';
import { open, readFile, rm, readdir } from 'fs/promises';
import { rename as createNewName } from 'fs/promises';
import { EOL, cpus, userInfo, arch } from 'os';
import { createHash } from 'crypto';
import { resolve, parse, dirname } from 'path';
import { createReadStream, createWriteStream } from 'fs';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';
import { currentDir } from "../handleOutput/index.js";
import {isDirectory, isFile, output} from "../events/index.js";

export const read = async (path) => {
  try {
    if (path) {
      const readStream = createReadStream(resolve(path), { encoding: 'utf8' });
      await pipeline(readStream, output());
      currentDir();
    } else {
      console.log('Invalid input');
    }
  } catch (error) {
    console.log('Operation failed');
  }
}

export const create = async (path) => {
  let file;
  try {
    if (path) {
      file = await open(resolve(process.cwd(), path), 'w');
      currentDir();
    } else {
      console.log('Invalid input');
    }
  } catch (error) {
    console.log('Operation failed');
  } finally {
    file?.close();
  }
};

export const copy = async (path, newPath) => {
  if (path && newPath) {
    const srcFiles = resolve(path);
    const { base } = parse(srcFiles);
    const srcFilesCopy = resolve(newPath, base);
    try {
      const readStream = createReadStream(srcFiles);
      const writeStream = createWriteStream(srcFilesCopy);
      await pipeline(readStream, writeStream);
      currentDir();
    } catch (error) {
      console.log('Operation failed');
    }
  } else {
    console.log('Invalid input');
  }
};

export const hashFile = async (path) => {
  if (path) {
    try {
      const content = await readFile(resolve(path));
      const hash = createHash('sha256').update(content).digest('hex');
      console.log(hash);
      currentDir();
    } catch (error) {
      console.log('Operation failed');
    }
  } else {
    console.log('Invalid input');
  }
}

export const move = async (path, newPath) => {
  if (path && newPath) {
    const srcFiles = resolve(path);
    const { base } = parse(srcFiles);
    const srcFilesCopy = resolve(newPath, base);
    try {
      const readStream = createReadStream(srcFiles);
      const writeStream = createWriteStream(srcFilesCopy);
      await pipeline(readStream, writeStream);
      await rm(srcFiles);
      currentDir();
    } catch (error) {
      console.log('Operation failed');
    }
  } else {
    console.log('Invalid input');
  }
};

export const remove = async (path) => {
  if (path) {
    try {
      await rm(resolve(path));
      currentDir();
    } catch (error) {
      console.log('Operation failed');
    }
  } else {
    console.log('Invalid input');
  }
};

export const rename = async (path, newPath) => {
  if (path && newPath) {
    if (newPath.includes('/') || newPath.includes('\\') || newPath.includes(':') || newPath.includes('*') || newPath.includes('?') || newPath.includes('<') || newPath.includes('>') || newPath.includes('|') || newPath.includes('"')) {
      console.log('Operation failed');
      return
    }
    const srcWrongFile = resolve(path);
    const srcProperFile = resolve(dirname(srcWrongFile), newPath);
    try {
      await createNewName(srcWrongFile, srcProperFile);
      currentDir();
    } catch (error) {
      console.log('Operation failed');
    }
  } else {
    console.log('Invalid input');
  }
}

export const os = (arg) => {
  if (arg) {
    switch (arg) {
      case '--EOL': console.log(JSON.stringify(EOL))
        currentDir();
        break
      case '--cpus': {
        const arrayCpus = cpus().map(({ model, speed }) => {
          return { model, frequency: `${(speed / 1000).toFixed(1)} GHz` };
        });
        console.table(arrayCpus);
        currentDir();
      }
        break
      case '--homedir': console.log(userInfo().homedir)
        currentDir();
        break
      case '--username': console.log(userInfo().username)
        currentDir();
        break
      case '--architecture': console.log(arch())
        currentDir();
        break
      default:
        console.log('Invalid input');
        break
    }
  } else {
    console.log('Invalid input');
  }
}

export const up = (path) => {
  try {
    if (path) {
      console.log('Invalid input');
    } else {
      chdir('..');
      currentDir();
    }
  } catch {
    console.log('Operation failed');
  }
};

export const cd = (path) => {
  try {
    if (path) {
      chdir(resolve(path));
      currentDir();
    } else {
      console.log('Invalid input');
    }
  } catch {
    console.log('Operation failed');
  }
}

export const list = async (path) => {
  if (path) {
    console.log('Invalid input');
  } else {
    try {
      const dirFiles = await readdir(process.cwd());
      const arrayIsDirectory = await Promise.all(dirFiles.map(name => {
        return isDirectory(resolve(process.cwd(), name))
      }));

      const arrayFolders = arrayIsDirectory.reduce((ac, boolean, index) => {
        if (boolean) {
          ac.push({ name: dirFiles[index], type: 'directory' })
        }
        return ac;
      }, []).sort(({ name }) => name);

      const arrayFiles = arrayIsDirectory.reduce((ac, boolean, index) => {
        if (!boolean) {
          ac.push({ name: dirFiles[index], type: 'file' })
        }
        return ac;
      }, []).sort(({ name }) => name);

      const arrayDir = arrayFolders.concat(arrayFiles);
      console.table(arrayDir);
      currentDir();
    } catch (error) {
      console.log('Invalid input');
    }
  }
}


export const compress = async (path, newPath) => {
  if (path && newPath) {
    try {
      const pathIsFile = await isFile(path);
      const newPathIsDirectory = await isDirectory(newPath);
      if(!pathIsFile) {
        console.log(`${path} is not a file`);
        return
      }
      if(!newPathIsDirectory) {
        console.log(`${newPath} is not a directory`);
        return
      }
      const srcFile = resolve(path);
      const { base } = parse(srcFile);
      const srcFileZip = resolve(newPath, `${base}.br`);
      const readableStream = createReadStream(srcFile);
      const writeableStream = createWriteStream(srcFileZip);
      const brotliCompress = createBrotliCompress();
      await pipeline(readableStream, brotliCompress, writeableStream);
      currentDir();
    } catch (error) {
      console.log('Operation failed');
    }
  } else {
    console.log('Invalid input');
  }
};

export const decompress = async (path, newPath) => {
  if (path && newPath) {
    try {
      const pathIsFile = await isFile(path);
      const newPathIsDirectory = await isDirectory(newPath);
      if(!pathIsFile) {
        console.log(`${path} is not a file`);
        return
      }
      if(!newPathIsDirectory) {
        console.log(`${newPath} is not a directory`);
        return
      }
      const srcFile = resolve(path);
      const { name } = parse(srcFile);
      const srcFileZip = resolve(newPath, name);
      const readableStream = createReadStream(srcFile);
      const writeableStream = createWriteStream(srcFileZip);
      const brotliDecompress = createBrotliDecompress();
      await pipeline(readableStream, brotliDecompress, writeableStream);
      currentDir();
    } catch {
      console.log('Operation failed');
    }
  } else {
    console.log('Invalid input');
  }
}
