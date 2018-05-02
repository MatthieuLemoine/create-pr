#!/usr/bin/env node
const { Repository, Remote, Branch } = require('nodegit');
const opn = require('opn');
const { argv } = require('yargs');

const remoteRegex = /[/|:]([A-Za-z0-9-]+)\/([A-Za-z0-9-]+)/;

const getGithubUrl = async (directory, template, target) => {
  const repository = await Repository.open(directory);
  const ref = await repository.getCurrentBranch();
  const branch = ref.name().split('/').slice(-1);
  const remote = await repository.getRemote('origin');
  const [_, owner, project] = remote.url().match(remoteRegex);
  repository.cleanup();
  let url = `https://github.com/${owner}/${project}/compare`;
  if (target) {
    url = `${url}/${target}...${branch}`;
  } else {
    url = `${url}/${branch}`;
  }
  if (template) {
    return `${url}?template=${template}`;
  }
  return url;
}

(async () => {
  try {
    const url = await getGithubUrl(process.cwd(), argv.template, argv.target);
    // Bug when sometimes opn never resolves
    setTimeout(() => process.exit(), 2000);
    // Open in default browser
    await opn(url);
  } catch(e) {
    console.error(e);
  }
})();
