import { defineConfig, tierPresets } from 'sponsorkit';
import fs from "fs";
import path from "path";

function getFromFile(imgpath: string) {
  return Buffer.from(fs.readFileSync(path.normalize(imgpath)));
}

const POKI_LOGO = getFromFile("logos/poki-svg.svg");
const PIXELS_LOGO = getFromFile("logos/pixels-xyz.jpeg");

export default defineConfig({

  onSponsorsReady: (sponsors) => {
    // pixels.xyz
    const pixels = sponsors.find((sponsor) => sponsor.sponsor?.login?.toLowerCase() === "lukepushlabs");
    if (pixels) {
      pixels.sponsor.linkUrl = "https://pixels.xyz/";
      pixels.sponsor.websiteUrl = "https://pixels.xyz/";
      pixels.sponsor.name = "Pixels";
      pixels.sponsor.avatarUrl = "/images/logos/pixels.jpeg";
      pixels.sponsor.avatarBuffer = PIXELS_LOGO;
    }

    // Poki (manual entry)
    sponsors.unshift({
      sponsor: {
        type: 'Organization',
        login: 'poki',
        name: 'Poki',
        avatarUrl: "/images/logos/poki.svg",
        avatarBuffer: POKI_LOGO,
        websiteUrl: "https://developers.poki.com/",
        linkUrl: "https://developers.poki.com/",
      },
      monthlyDollars: 200,
    });

    // remove
    const bubbleboxIndex = sponsors.findIndex((sponsor) => sponsor.sponsor.login.toLowerCase() === "bubbleboxgames");
    if (bubbleboxIndex !== -1) { sponsors.splice(bubbleboxIndex, 1); }

    return sponsors;
  },

  outputDir: './src/data',

  tiers: [
    {
      title: 'Past Sponsors',
      monthlyDollars: -1,
      preset: tierPresets.xs,
    },
    {
      title: 'Backers',
      preset: tierPresets.base,
    },
    {
      title: 'Generous Backers',
      monthlyDollars: 30,
      preset: tierPresets.base,
    },
    {
      title: 'Sponsors',
      monthlyDollars: 100,
      preset: tierPresets.medium,
    },
    {
      title: 'Silver Sponsors',
      monthlyDollars: 250,
      preset: tierPresets.medium,
    },
    {
      title: 'Gold Sponsors',
      monthlyDollars: 500,
      preset: tierPresets.large,
    },
    {
      title: 'Platinum Sponsors',
      monthlyDollars: 1000,
      preset: tierPresets.xl,
    },
  ],

  renders: [
    {
      name: 'sponsors',
      width: 800,
      formats: ['json'],
    },
  ],
});
