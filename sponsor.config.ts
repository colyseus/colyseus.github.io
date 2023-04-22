import { defineConfig, presets } from 'sponsorkit';

export default defineConfig({
  // includePrivate: true,
  tiers: [
    {
      title: 'Past Sponsors',
      monthlyDollars: -1,
      preset: presets.xs,
    },

    {
      title: 'Backers',
      // to replace the entire tier rendering
      // compose: (composer, tierSponsors, config) => {
      //   composer.addRaw(
      //     '<-- custom svg -->',
      //   )
      // },
    },

    {
      title: '',
      monthlyDollars: 30,
      preset: presets.base,
      // to insert custom elements after the tier block
      // composeAfter: (composer, _tierSponsors, _config) => {
      //   composer.addSpan(10)
      // },
    },

    {
      title: 'Sponsors',
      monthlyDollars: 100,
      preset: presets.base,
      // to insert custom elements after the tier block
      composeAfter: (composer, _tierSponsors, _config) => {
        composer.addSpan(10)
      },
    },

    {
      title: 'Silver Sponsors',
      monthlyDollars: 250,
      preset: presets.medium,
    },

    {
      title: 'Gold Sponsors',
      monthlyDollars: 500,
      preset: presets.large,
    },

    {
      title: 'Platinum Sponsors',
      monthlyDollars: 1000,
      preset: presets.xl,
    },
  ],
});
