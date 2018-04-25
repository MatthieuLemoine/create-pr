#!/usr/bin/env node
const { Repository, Remote, Branch } = require('nodegit');
const opn = require('opn');

const remoteRegex = /[/|:]([A-Za-z0-9-]+)\/([A-Za-z0-9-]+)/;

const getGithubUrl = async directory => {
  const repository = await Repository.open(directory);
  const ref = await repository.getCurrentBranch();
  const branch = ref.name().split('/').slice(-1);
  const remote = await repository.getRemote('origin');
  const [_, owner, project] = remote.url().match(remoteRegex);
  repository.cleanup();
  return `https://github.com/${owner}/${project}/compare/${branch}`;
}

(async () => {
  try {
    const url = await getGithubUrl(process.cwd());
    // Bug when sometimes opn never resolves
    setTimeout(() => process.exit(), 2000);
    // Open in default browser
    await opn(url);
  } catch(e) {
    console.error(e);
  }
})();
