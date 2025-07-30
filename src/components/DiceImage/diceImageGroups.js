const diceModules = import.meta.glob('../../../assets/10000_imgs/*.png', { eager: true});

const diceImagesGroups = Array.from({ length: 6 }, () => []);

Object.entries(diceModules).forEach(([path, mod]) => {
    const match = path.match(/Die(\d)_([a-d])\.png$/i);
    if (match) {
        const value = parseInt(match[1], 10);
        const variant = match[2];

        if (value >= 1 && value <= 6) {
            diceImagesGroups[value - 1].push({
                image: mod.default,
                variant,
            });
        }
    }
});

diceImagesGroups.forEach(group =>
    group.sort((a, b) => a.variant.localeCompare(b.variant))
);

const sortedImagesGroups = diceImagesGroups.map(group =>
    group.map(entry => entry.image)
);


export default sortedImagesGroups;