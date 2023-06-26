import { chdir } from 'node:process';
import { homedir } from 'node:os';
import { events } from "./events/index.js";
import { currentDir, endManager, startManager } from "./handleOutput/index.js";

chdir(homedir());
startManager();
currentDir();

process.stdin.on('data', events);

process.on('SIGINT', () => {
  endManager();
})
