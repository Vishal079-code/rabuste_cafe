export const moodToStrength = {
  calm: 'medium',
  cozy: 'medium',
  bold: 'strong',
  creative: 'medium',
  focused: 'strong',
  energetic: 'strong',
  mellow: 'light',
};

export const timeToProfile = {
  morning: 'bright',
  afternoon: 'balanced',
  evening: 'comfort',
  night: 'decaf',
};

export const explainableCoffee = ({ mood, timeOfDay, prefersMilk }) => {
  const strength = moodToStrength[mood] || 'medium';
  const timeProfile = timeToProfile[timeOfDay] || 'balanced';
  const title = strength === 'strong' ? 'Thunderbolt Robusta' : strength === 'light' ? 'Silk Drift' : 'Amber Bloom';
  const reasoning = [
    `Mood points to a ${strength} cup.`,
    `Time of day favors a ${timeProfile} profile to keep you balanced.`,
    prefersMilk ? 'Adding creamy notes for comfort.' : 'Keeping it pure for clarity.',
  ].join(' ');
  return { title, strength, timeProfile, reasoning };
};

export const explainableArt = ({ mood }) => {
  const palette = {
    calm: 'deep blues with copper sheen',
    bold: 'charcoal strokes with neon vermilion',
    creative: 'textured mixed media with gold leaf',
    cozy: 'sepia ink on warm fiber paper',
  }[mood] || 'layered textures with warm undertones';
  const reasoning = `Palette mirrors ${mood || 'mixed'} energy through tactile warmth.`;
  return { title: `${mood || 'Warm'} Reverie`, palette, reasoning };
};

export const explainableWorkshop = ({ mood, timeOfDay }) => {
  const title =
    mood === 'creative'
      ? 'Latte Art x Ink'
      : mood === 'focused'
      ? 'Precision Brew Lab'
      : 'Origin Stories & Cupping';
  const reasoning = `Pairs ${mood || 'your'} vibe with ${timeOfDay || 'day'} attention spans for flow.`;
  return { title, reasoning };
};





