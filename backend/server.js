const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Organ data
const organs = [
  { name: 'Heart', type: 'Circulatory', size: 12, coordinates: [-5, 40] },
  { name: 'Lungs', type: 'Respiratory', size: 24, coordinates: [0, 50] },
  { name: 'Kidney', type: 'Excretory', size: 11, coordinates: [0, 20] },
  { name: 'Liver', type: 'Digestive', size: 16, coordinates: [10, 35] },
  { name: 'Stomach', type: 'Digestive', size: 25, coordinates: [-5, 30] },
  { name: 'Pancreas', type: 'Digestive', size: 18, coordinates: [0, 28] },
  { name: 'Spleen', type: 'Lymphatic', size: 12, coordinates: [-12, 32] },
  { name: 'Bladder', type: 'Excretory', size: 8, coordinates: [0, 10] },
  { name: 'Brain', type: 'Nervous', size: 15, coordinates: [0, 80] },
  { name: 'Esophagus', type: 'Digestive', size: 25, coordinates: [0, 60] },
  { name: 'Small Intestine', type: 'Digestive', size: 600, coordinates: [0, 15] },
  { name: 'Large Intestine', type: 'Digestive', size: 150, coordinates: [0, 12] },
  { name: 'Appendix', type: 'Digestive', size: 9, coordinates: [8, 10] },
  { name: 'Gallbladder', type: 'Digestive', size: 10, coordinates: [5, 33] },
  { name: 'Thymus', type: 'Lymphatic', size: 5, coordinates: [0, 55] },
  { name: 'Thyroid', type: 'Endocrine', size: 5, coordinates: [0, 65] },
  { name: 'Rectum', type: 'Digestive', size: 15, coordinates: [0, 5] },
  { name: 'Anus', type: 'Digestive', size: 4, coordinates: [0, 0] }
];

// Function to determine today's organ
const getDailyOrgan = () => {
  const today = new Date();
  const index = today.getFullYear() * 1000 + today.getMonth() * 100 + today.getDate();
  return organs[index % organs.length];
};

let guessedOrgans = [];

// Function to determine arrow direction
const getArrowDirection = (guessedValue, targetValue) => {
  if (guessedValue > targetValue) return 'up'; // higher
  if (guessedValue < targetValue) return 'down'; // lower
  return ''; // equal, no arrow
};

// Function to calculate the size difference
const calculateSizeDifference = (guessedSize, targetSize) => {
  const diff = guessedSize - targetSize;
  if (diff === 0) return 'green';
  if (Math.abs(diff) <= 5) return 'yellow';
  return 'gray';
};

// Function to calculate the distance difference
const calculateDistanceDifference = (guessedCoords, targetCoords) => {
  const distance = Math.sqrt(
    Math.pow(guessedCoords[0] - targetCoords[0], 2) +
    Math.pow(guessedCoords[1] - targetCoords[1], 2)
  );
  if (distance === 0) return 'green';
  if (distance <= 5) return 'yellow';
  return 'gray';
};

// Function to check type match
const calculateTypeMatch = (guessedType, targetType) => {
  return guessedType === targetType ? 'green' : 'gray';
};

app.get('/api/suggestions', (req, res) => {
  const query = req.query.query.toLowerCase();
  const suggestions = organs
    .filter((organ) => organ.name.toLowerCase().includes(query) && !guessedOrgans.includes(organ.name))
    .map((organ) => organ.name);
  res.json({ suggestions });
});

app.get('/api/todays-organ', (req, res) => {
  res.json({ organ: getDailyOrgan().name });
});

app.post('/api/guess', (req, res) => {
  const { guess } = req.body;

  if (guessedOrgans.includes(guess)) {
    return res.json({
      message: 'You have already guessed this organ!',
      sizeTileColor: 'gray',
      distanceTileColor: 'gray',
      typeTileColor: 'gray',
    });
  }

  const match = organs.find((o) => o.name.toLowerCase() === guess.toLowerCase());
  if (!match) {
    return res.json({
      message: 'Not a valid organ!',
      sizeTileColor: 'gray',
      distanceTileColor: 'gray',
      typeTileColor: 'gray',
    });
  }

  const targetOrganData = getDailyOrgan();

  // If correct guess, return "Correct!"
  if (match.name === targetOrganData.name) {
    guessedOrgans.push(guess);
    return res.json({
      message: "Correct!",
      size: match.size,
      distance: 0,
      type: match.type,
      sizeTileColor: "green",
      distanceTileColor: "green",
      typeTileColor: "green",
      sizeArrow: '',
      distanceArrow: ''
    });
  }

  const sizeTileColor = calculateSizeDifference(match.size, targetOrganData.size);
  const distanceTileColor = calculateDistanceDifference(match.coordinates, targetOrganData.coordinates);
  const typeTileColor = calculateTypeMatch(match.type, targetOrganData.type);

  guessedOrgans.push(guess);

  res.json({
    message: `Organ guess: ${match.name}`,
    size: match.size,
    distance: Math.sqrt(
      Math.pow(match.coordinates[0] - targetOrganData.coordinates[0], 2) +
      Math.pow(match.coordinates[1] - targetOrganData.coordinates[1], 2)
    ).toFixed(1),
    type: match.type,
    sizeTileColor,
    distanceTileColor,
    typeTileColor,
    sizeArrow: getArrowDirection(match.size, targetOrganData.size),
    distanceArrow: getArrowDirection(match.distance, targetOrganData.distance)
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
