#!/usr/bin/env node
const opn = require('opn');
const { argv } = require('yargs');
const { getCurrentBranch, getRepositoryInfo } = require('./git');

const getGithubUrl = (template, target) => {
  const branch = getCurrentBranch();
  const { owner, project } = getRepositoryInfo();
  console.log({
    owner,
    project,
    branch,
  });
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
};

(async () => {
  try {
    const url = getGithubUrl(argv.template, argv.target);
    // Bug when sometimes opn never resolves
    setTimeout(() => process.exit(), 2000);
    // Open in default browser
    await opn(url);
  } catch (e) {
    console.error(e);
  }
})();
