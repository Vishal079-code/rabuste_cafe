const moodToStrength = {
  calm: 'medium',
  cozy: 'medium',
  bold: 'strong',
  creative: 'medium',
  focused: 'strong',
  energetic: 'strong',
  mellow: 'light',
};

const timeToProfile = {
  morning: 'bright',
  afternoon: 'balanced',
  evening: 'comfort',
  night: 'decaf',
};

const suggestCoffee = ({ mood = 'calm', timeOfDay = 'morning', prefersMilk = false }) => {
  const strength = moodToStrength[mood] || 'medium';
  const timeProfile = timeToProfile[timeOfDay] || 'balanced';
  const tags = [];
  if (prefersMilk) tags.push('creamy');
  if (timeProfile === 'decaf') tags.push('low-caf');
  if (strength === 'strong') tags.push('bold');

  const suggestion = {
    title: strength === 'strong' ? 'Thunderbolt Robusta' : strength === 'light' ? 'Silk Drift' : 'Amber Bloom',
    strength,
    tags,
    reasoning: `Mood hints ${strength} intensity; ${timeProfile} profile keeps it ${timeProfile}.`,
  };
  return suggestion;
};

const suggestArt = ({ mood = 'calm' }) => {
  const palette = {
    calm: 'deep blues with copper sheen',
    bold: 'charcoal strokes with neon vermilion',
    creative: 'textured mixed media with gold leaf',
    cozy: 'sepia ink on warm fiber paper',
  }[mood] || 'layered textures with warm undertones';

  return {
    title: `${mood.charAt(0).toUpperCase() + mood.slice(1)} Reverie`,
    palette,
    reasoning: `Palette mirrors ${mood} energy with Robusta-inspired warmth.`,
  };
};

const suggestWorkshop = ({ timeOfDay = 'afternoon', vibe = 'creative' }) => {
  const option =
    vibe === 'creative'
      ? 'Latte Art x Ink'
      : vibe === 'focused'
      ? 'Precision Brew Lab'
      : 'Origin Stories & Cupping';
  return {
    title: option,
    bestDuring: timeOfDay === 'morning' ? 'morning freshness' : 'golden hour',
    reasoning: `Pairs ${vibe} mood with ${timeOfDay} attention span for better immersion.`,
  };
};

module.exports = { suggestCoffee, suggestArt, suggestWorkshop };


