// netlify-functions/suggestions.js
const cors = require('cors');
const { parse } = require('querystring');

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

exports.handler = async function (event, context) {
  const { query } = event.queryStringParameters;

  const suggestions = organs
    .filter((organ) => organ.name.toLowerCase().includes(query.toLowerCase()))
    .map((organ) => organ.name);

  return {
    statusCode: 200,
    body: JSON.stringify({ suggestions }),
  };
};
