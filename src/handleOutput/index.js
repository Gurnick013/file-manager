const user = process.argv[2];
const userName = user && user.startsWith('--username=') ? user.replace('--username=', '') : 'visitor';

export const startManager = () => {
  console.log(`Welcome to the File Manager, ${userName}!`);
};

export const endManager = () => {
  console.log(`Thank you for using File Manager, ${userName}, goodbye!`);
  process.exit();
};

export const currentDir = () => {
  console.log(`You are currently in ${process.cwd()}`);
}
