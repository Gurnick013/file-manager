import { stat } from 'fs/promises';
import { resolve } from 'path';
import { Writable } from 'stream';
import { up, cd, list, read, create, rename, copy, move, remove, os, hashFile, compress, decompress } from '../handlers/index.js';
import { endManager } from "../handleOutput/index.js";

export const events = async (data) => {
  const [command, path, newPath] = data.toString().trim().split(' ');

  switch (command) {
    case 'up': up(path)
      break
    case 'cd': cd(path)
      break
    case 'ls': await list(path)
      break
    case 'cat': await read(path)
      break
    case 'add': await create(path)
      break
    case 'rn': await rename(path, newPath)
      break
    case 'cp': await copy(path, newPath)
      break
    case 'mv': await move(path, newPath)
      break
    case 'rm': await remove(path)
      break
    case 'os': os(path)
      break
    case 'hash': await hashFile(path)
      break
    case 'compress': await compress(path, newPath)
      break
    case 'decompress': await decompress(path, newPath)
      break
    case '.exit': path ? console.log('Invalid input') : endManager()
      break
    default: console.log('Invalid input')
      break
  }
}

export const output = () => {
  return new Writable({
    decodeStrings: false,
    write(chunk, encoding, callback) {
      console.log(chunk);
      callback();
    }
  });
}

export const isDirectory = async (path) => {
  try {
    const src = resolve(path);
    const stats = await stat(src);
    return stats.isDirectory();
  } catch {
    return false;
  }
};

export const isFile = async (path) => {
  try {
    const src = resolve(path);
    const stats = await stat(src);
    return stats.isFile();
  } catch {
    return false;
  }
}
