const allRepos = [ 'colyseus', 'colyseus.js', 'schema', 'colyseus-unity-sdk', 'colyseus-haxe', 'colyseus-construct3', 'colyseus-defold', 'colyseus-examples', 'create-colyseus-app' ];

export const githubStars = await fetch('https://api.github.com/repos/colyseus/colyseus')
  .then(res => res.json())
  .then((data) => data.stargazers_count);

export const discordMemberCount = await fetch('https://discord.com/api/v9/invites/RY8rRS7?with_counts=true&with_expiration=true')
  .then(res => res.json())
  .then((data) => data.approximate_member_count);

export const allContributors: string[] = Array(60);
// const allContributors: string[] = [];
// const ignoreContributors = ['greenkeeperio-bot', 'greenkeeper[bot]']
// await Promise.all(allRepos.map((repo) => `https://api.github.com/repos/colyseus/${repo}/contributors`).map((url) => (
//   fetch(url).then(res => res.json()).then((data) => {
//     console.log({url, data});
//     data.forEach((contributor) => {
//       if (
//         !ignoreContributors.includes(contributor.login) &&
//         !allContributors.includes(contributor.login)
//       ) {
//         allContributors.push(contributor.login);
//       }
//     });
//   })
// )));

export const today = new Date().toISOString().split("T")[0];
export const npmDownloadCount = await fetch(`https://npm-stat.com/api/download-counts?package=colyseus&from=2015-11-22&until=${today}`)
  .then(res => res.json())
  .then((data) => Object.values<number>(data.colyseus).reduce((a, b) => a + b, 0));
