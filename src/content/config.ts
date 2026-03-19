import { defineCollection, z } from 'astro:content';
import type { ImageMetadata } from 'astro';

const blog = defineCollection({
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// Transform string to Date object
		pubDate: z
			.string()
			.or(z.date())
			.transform((val) => new Date(val)),
		updatedDate: z
			.string()
			.optional()
			.transform((str) => (str ? new Date(str) : undefined)),
		heroImage: z.string().optional(),
	}),
});

const showcaseImages = import.meta.glob<{ default: ImageMetadata }>(
  '/assets/showcase/*.{jpeg,jpg,png,webp}',
  { eager: true }
);

function resolveShowcaseImage(filename: string): ImageMetadata {
  const mod = showcaseImages[`/assets/showcase/${filename}`];
  if (!mod) throw new Error(`Showcase image not found: ${filename}`);
  return mod.default;
}

const showcase = [
  { platform: "javascript", name: "Pixels.xyz", image: resolveShowcaseImage("pixels.jpeg"), url: "https://pixels.xyz/", author_link: "https://www.linkedin.com/in/lbarwiko/", author: "Banger Inc", },
  { platform: "javascript", name: "Bloxd.io", image: resolveShowcaseImage("bloxdio.jpeg"), url: "https://bloxd.io/", author_link: "https://www.linkedin.com/in/arthurbbaker/", author: "Arthur Baker", },
  { platform: "javascript", name: "Sword Masters", image: resolveShowcaseImage("swordmasters.png"), url: "https://swordmasters.io/", author_link: "https://emolingo.games/", author: "Emolingo Games", },

  { platform: "javascript", name: "Cryzen.io", image: resolveShowcaseImage("cryzen-io.jpeg"), url: "https://cryzen.io/", author_link: "https://twitter.com/norberg_adel", author: "Adel Norberg" },
  { platform: "javascript", name: "Make it Meme", image: resolveShowcaseImage("makeitmeme.webp"), url: "https://makeitmeme.com/", author_link: "https://prealpha.dev/", author: "prealpha", },
  { platform: "javascript", name: "SongTrivia2", image: resolveShowcaseImage("songtrivia2.jpeg"), url: "https://songtrivia2.io/", author_link: "https://songtrivia2.io/", author: "SongTrivia", },

  { platform: "javascript", name: "Kirka.io", image: resolveShowcaseImage("kirka-io.jpeg"), url: "https://kirka.io/", author_link: "https://twitter.com/development", author: "xip", },
  { platform: "javascript", name: "Rainbow Obby", image: resolveShowcaseImage("rainbow-obby.png"), url: "https://poki.com/en/g/rainbow-obby", author_link: "https://emolingo.games/", author: "Emolingo Games", },

  { platform: "unity", name: "Unboxing the Cryptic Killer", image: resolveShowcaseImage("elevenpuzzles-unboxing-the-cryptic-killer.jpeg"), url: "https://store.steampowered.com/app/2069040/Unboxing_the_Cryptic_Killer/", author_link: "https://elevenpuzzles.com/", author: "Eleven Puzzles", },
  { platform: "unity", name: "Knight's Edge", image: resolveShowcaseImage("lightfox-games-knights-edge.jpeg"), url: "https://www.lightfoxgames.com/knights-edge", author_link: "https://www.lightfoxgames.com", author: "Lightfox Games", },
  { platform: "unity", name: "Seep King", image: resolveShowcaseImage("seepking.png"), url: "https://apps.apple.com/in/app/seep-king/id1603821493", author_link: "https://apps.apple.com/in/developer/jaspreet-singh/id1521881770", author: "Jaspreet Singh", },
  { platform: "javascript", name: "Exploder.io", image: resolveShowcaseImage("masterexploder-exploder.jpeg"), url: "https://exploder.io/", author_link: "https://github.com/pdaw", author: "Piotr Dawidiuk", },
  { platform: "unity", name: "The Kraken Wakes", image: resolveShowcaseImage("charismaai-the-kraken-wakes.png"), url: "https://store.steampowered.com/app/2100380/The_Kraken_Wakes/", author_link: "https://charisma.ai/", author: "Charisma Entertainment", },
  { platform: "unity", name: "Exposed - Who's Most Likely To", image: resolveShowcaseImage("vys-games-exposed.png"), url: "https://apps.apple.com/us/app/exposed-whos-most-likely-to/id1553777064", author_link: "https://www.vysgames.com/", author: "VYS Games", },
  { platform: "defold", name: "Raft Wars Multiplayer", image: resolveShowcaseImage("raftwars.png"), url: "https://poki.com/en/g/raft-wars-multiplayer", author_link: "http://www.tinydobbins.com/", author: "TinyDobbins", },
];

export const collections = { blog, showcase, };
