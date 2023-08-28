import { defineCollection, z } from 'astro:content';

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

const showcase = [
  { platform: "javascript", name: "Bloxd.io", image: "/images/showcase/bloxdio.jpeg", url: "https://bloxd.io/", author_link: "https://www.linkedin.com/in/arthurbbaker/", author: "Arthur Baker", },
  { platform: "javascript", name: "SongTrivia2", image: "/images/showcase/songtrivia2.jpeg", url: "https://songtrivia2.io/", author_link: "https://songtrivia2.io/", author: "SongTrivia", },
  { platform: "unity", name: "Unboxing the Cryptic Killer", image: "/images/showcase/elevenpuzzles-unboxing-the-cryptic-killer.jpeg", url: "https://store.steampowered.com/app/2069040/Unboxing_the_Cryptic_Killer/", author_link: "https://elevenpuzzles.com/", author: "Eleven Puzzles", },
  { platform: "javascript", name: "Kirka.io", image: "/images/showcase/kirka-io.jpeg", url: "https://kirka.io/", author_link: "https://twitter.com/development", author: "xip", },
  { platform: "unity", name: "Knight's Edge", image: "/images/showcase/lightfox-games-knights-edge.jpeg", url: "https://www.lightfoxgames.com/knights-edge", author_link: "https://www.lightfoxgames.com", author: "Lightfox Games", },
  { platform: "javascript", name: "Wheat Farming", image: "/images/showcase/volem-games-wheat-farming.png", url: "https://poki.com/en/g/wheat-farming", author_link: "https://twitter.com/emre_sahinn35", author: "Emre Şahin", },
  { platform: "javascript", name: "Make it Meme", image: "/images/showcase/makeitmeme.jpeg", url: "https://makeitmeme.com/", author_link: "https://prealpha.dev/", author: "prealpha", },
  { platform: "unity", name: "Seep King", image: "/images/showcase/seepking.png", url: "https://apps.apple.com/in/app/seep-king/id1603821493", author_link: "https://apps.apple.com/in/developer/jaspreet-singh/id1521881770", author: "Jaspreet Singh", },
  { platform: "javascript", name: "Exploder.io", image: "/images/showcase/masterexploder-exploder.jpeg", url: "https://exploder.io/", author_link: "https://github.com/pdaw", author: "Piotr Dawidiuk", },
  { platform: "unity", name: "The Kraken Wakes", image: "/images/showcase/charismaai-the-kraken-wakes.png", url: "https://store.steampowered.com/app/2100380/The_Kraken_Wakes/", author_link: "https://charisma.ai/", author: "Charisma Entertainment", },
  { platform: "unity", name: "Exposed - Who's Most Likely To", image: "/images/showcase/vys-games-exposed.png", url: "https://apps.apple.com/us/app/exposed-whos-most-likely-to/id1553777064", author_link: "https://www.vysgames.com/", author: "VYS Games", },
  { platform: "javascript", name: "Super Battle Legends", image: "/images/showcase/hammerplay-battle-legends.jpeg", url: "https://www.youtube.com/watch?v=W5I2ZbFJ8Pg", author_link: "https://hammerplay.com/", author: "Hammerplay", },
  { platform: "defold", name: "Raft Wars Multiplayer", image: "images/projects/raftwars.png", url: "https://poki.com/en/g/raft-wars-multiplayer", author_link: "http://www.tinydobbins.com/", author: "TinyDobbins", },
];

export const collections = { blog, showcase, };
