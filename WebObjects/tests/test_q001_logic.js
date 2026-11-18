const fs = require('fs');
const path = require('path');

const distHtmlPath = path.join(__dirname, '../dist/Q001_AccidentPrediction/index.html');
const quizJsonPath = path.join(__dirname, '../dist/Q001_AccidentPrediction/quiz.json');

const html = fs.readFileSync(distHtmlPath, 'utf8');
const quiz = JSON.parse(fs.readFileSync(quizJsonPath, 'utf8'));

console.log('--- Q001 Standalone Package Validation ---');
console.log('Quiz ID:', quiz.quizId);
console.log('Quiz Canvas:', quiz.canvas);
console.log('Number of options:', quiz.options.length);

// Check required assets
const requiredAssets = [
  'thumb_employee_walking.png',
  'thumb_mhe_operator.png',
  'thumb_maintenance_tech.png',
  'thumb_employee_ladder.png'
];

requiredAssets.forEach(asset => {
  const p = path.join(__dirname, '../dist/Q001_AccidentPrediction/assets', asset);
  if (!fs.existsSync(p)) {
    throw new Error(`Missing asset: ${asset}`);
  }
  console.log(`✓ Asset verified: ${asset}`);
});

// Check fonts
const requiredFonts = ['DaimlerCS-Regular.ttf', 'DaimlerCS-Bold.ttf'];
requiredFonts.forEach(font => {
  const p = path.join(__dirname, '../dist/Q001_AccidentPrediction/fonts', font);
  if (!fs.existsSync(p)) {
    throw new Error(`Missing font: ${font}`);
  }
  console.log(`✓ Font verified: ${font}`);
});

// Check bridge script
const bridgePath = path.join(__dirname, '../dist/Q001_AccidentPrediction/storyline-bridge.js');
if (!fs.existsSync(bridgePath)) {
  throw new Error('Missing storyline-bridge.js in dist');
}
console.log('✓ Storyline bridge script verified in dist');

// Check HTML elements
const cardMatches = html.match(/class="answer-card"/g) || [];
if (cardMatches.length !== 4) {
  throw new Error(`Expected 4 answer cards, found ${cardMatches.length}`);
}
console.log('✓ 4 Answer Cards found in HTML');

if (!html.includes('id="btn-reset"') || !html.includes('id="btn-submit"')) {
  throw new Error('Reset or Submit button missing');
}
console.log('✓ Reset and Submit buttons present');

if (!html.includes('Q001_Done') || !html.includes('Q001_Answers') || !html.includes('Q001_Correct')) {
  throw new Error('Missing Storyline variable bindings');
}
console.log('✓ Storyline variables bound correctly');

console.log('ALL Q001 STATIC & BUNDLE CHECKS PASSED!');
