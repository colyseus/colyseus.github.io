import ogs from 'open-graph-scraper';

export async function getOpenGraph(url, options: any = {}) {
  const response = await ogs({ url });

  return {
    url,
    title: response.result.ogTitle,
    description: response.result.ogDescription?.replace(/\. Contribute to[^$]+/g, ""),
    image: response.result.ogImage?.[0].url,

    // allow to override any of the above
    ...options,
  }
}
