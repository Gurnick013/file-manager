import { chdir } from 'node:process';
import { homedir } from 'node:os';

const user = process.argv[2];
const userName = user && user.startsWith('--username=') ? user.replace('--username=', '') : 'visitor';

const startManager = () => {
  console.log(`Welcome to the File Manager, ${userName}!`);
};

const endManager = () => {
  console.log(`Thank you for using File Manager, ${userName}, goodbye!`);
  process.exit();
};

const currentDir = () => {
  console.log(`You are currently in ${process.cwd()}`);
}

chdir(homedir());
startManager();
currentDir();

process.on('SIGINT', () => {
  endManager();
})
