const userArg= process.argv[2];
const userParams = process.argv[3];
const userName = userArg && userArg.startsWith('--') && userParams && userParams.startsWith('--username=')
    ? userParams.replace('--username=', '')
    : 'visitor';

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
