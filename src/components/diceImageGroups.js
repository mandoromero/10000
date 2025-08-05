const diceModules = import.meta.glob(
  "../../../assets/10000_imgs/*.png",
  { eager: true }
);

const diceImagesGroups = Array.from({ length: 6 }, () => []);

for (const [path, mod] of Object.entries(diceModules)) {
  const match = path.match(/Die(\d)_([a-d])\.png$/i);
  if (!match) continue;

  const faceValue = parseInt(match[1], 10);  // 1–6
  const variant = match[2];                  // a–d

  diceImagesGroups[faceValue - 1].push({
    image: mod.default,
    variant
  });
}


diceImagesGroups.forEach(group =>
  group.sort((a, b) => a.variant.localeCompare(b.variant))
);

const sortedDiceImagesGroups = diceImagesGroups.map(group =>
  group.map(entry => entry.image)
);

export default sortedDiceImagesGroups;
