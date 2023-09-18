import ogs from 'open-graph-scraper';

export async function getOpenGraph(url, options: any = {}) {
  const response = await ogs({ url });

  const isGitHub = (url.indexOf("github.com") >= 0);

  const title = (isGitHub)
    ? response.result.ogTitle?.match(/- ([^:]+)/)![1] // url.match(/GitHub - [a-zA-Z\-0-9]+\/[a-zA-Z\-0-9]+:([^$]+)/)
    : response.result.ogTitle

  const description = (isGitHub)
    ? (response.result.ogDescription?.match(/(.*) - GitHub - /)?.[1].trim() || response.result.ogDescription)?.replace(/\. Contribute to .* by creating an account on GitHub\./, "")
    : response.result.ogDescription;

  return {
    siteName: response.result.ogSiteName,
    url,
    title,
    description,
    image: response.result.ogImage?.[0].url,

    // allow to override any of the above
    ...options,
  }
}
