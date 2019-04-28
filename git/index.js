const { execSync } = require('child_process');

const remoteRegex = /[/|:]([A-Za-z0-9-]+)\/([A-Za-z0-9-]+)/;

const getCurrentBranch = () => execSync('git rev-parse --abbrev-ref HEAD', {
  encoding: 'utf8',
})
  .split('\n')
  .join('');

const getRepositoryInfo = () => {
  const url = execSync('git config --get remote.origin.url', {
    encoding: 'utf8',
  });
  // eslint-disable-next-line no-unused-vars
  const [_, owner, project] = url.match(remoteRegex);
  return {
    owner,
    project,
  };
};

module.exports = {
  getCurrentBranch,
  getRepositoryInfo,
};
