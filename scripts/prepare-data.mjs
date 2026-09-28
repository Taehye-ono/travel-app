import { readFileSync, writeFileSync } from 'node:fs';

const places = JSON.parse(readFileSync('britroute_places.json', 'utf8').replace(/^\uFEFF/, ''));
const slug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const rows = places.map((place) => ({ ...place, id: place.id || slug(`${place.city}-${place.name}`) }));
if (new Set(rows.map((place) => place.id)).size !== rows.length) throw new Error('Duplicate place ID');
writeFileSync('britroute_places.json', `${JSON.stringify(rows, null, 2)}\n`);
const escape = (value) => /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
writeFileSync('britroute_places.csv', 'id,name,city,category,area\n' + rows.map((p) => [p.id, p.name, p.city, p.category.join(', '), p.area].map(escape).join(',')).join('\n') + '\n');
console.log(`Prepared ${rows.length} places with stable IDs in JSON and CSV.`);
