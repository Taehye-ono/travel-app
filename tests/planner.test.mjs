import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { CITIES, INTERESTS, PACES, INITIAL_CONDITIONS, generateItinerary, validateConditions } from '../lib/planner.mjs';

const places = JSON.parse(readFileSync(new URL('../britroute_places.json', import.meta.url), 'utf8'));
const options = (extra = {}) => ({ ...INITIAL_CONDITIONS, city: 'London', interests: ['nature'], ...extra });
const all = (result) => result.days.flatMap((day) => day.places);

test('catalog has 40 unique, valid places and 10 per city', () => {
  assert.equal(places.length, 40);
  assert.equal(new Set(places.map((place) => place.id)).size, 40);
  for (const city of CITIES) assert.equal(places.filter((place) => place.city === city.id).length, 10);
  for (const place of places) {
    assert.ok(place.id && place.name && place.area);
    assert.ok(place.category.length);
    assert.ok(place.category.every((id) => INTERESTS.some((interest) => interest.id === id)));
  }
});
test('London nature produces Hyde Park and a free day without duplicates', () => {
  const result = generateItinerary(places, options({ pace: 'relaxed' }));
  assert.deepEqual(result.days.map((day) => day.places.map((place) => place.name)), [['Hyde Park'], []]);
  assert.equal(result.shortage, true);
});
test('mandatory museum overrides nature interest and retains explanation', () => {
  const museum = places.find((place) => place.name === 'British Museum');
  const result = generateItinerary(places, options({ days: 1, mustVisitPlaceIds: [museum.id] }));
  assert.deepEqual(all(result).map((place) => place.name), ['British Museum', 'Hyde Park']);
  assert.equal(all(result)[0].isMustVisit, true);
  assert.match(all(result)[0].reason, /꼭 가고 싶은/);
});
test('invalid inputs and over-capacity mandatory selections are rejected', () => {
  const london = places.filter((place) => place.city === 'London');
  for (const condition of [options({ city: '' }), options({ days: 4 }), options({ interests: [] }), options({ interests: ['invalid'] }), options({ pace: 'invalid' }), options({ mustVisitPlaceIds: ['unknown'] }), options({ mustVisitPlaceIds: [places.find((place) => place.city === 'Cardiff').id] }), options({ days: 1, pace: 'relaxed', mustVisitPlaceIds: london.slice(0, 4).map((place) => place.id) })]) {
    assert.ok(validateConditions(places, condition));
    assert.throws(() => generateItinerary(places, condition));
  }
  assert.equal(validateConditions([], options()).field, 'interests');
});
test('Edinburgh includes all 10 places over two days with nearby area labels together', () => {
  const result = generateItinerary(places, options({ city: 'Edinburgh', days: 2, pace: 'packed', interests: INTERESTS.map((item) => item.id) }));
  assert.deepEqual(result.days.map((day) => day.places.length), [5, 5]);
  const oldTown = result.days[0].places.filter((place) => place.area === 'Old Town');
  assert.equal(oldTown.length, 4);
});
test('all city/day/pace/interest combinations respect limits, filters, determinism, and mandatory inclusion', () => {
  for (const city of CITIES) for (const days of [1, 2, 3]) for (const pace of PACES) for (let mask = 1; mask < 32; mask++) {
    const interests = INTERESTS.filter((_, index) => mask & (1 << index)).map((item) => item.id);
    const mandatory = places.filter((place) => place.city === city.id).slice(0, 2).map((place) => place.id);
    const conditions = options({ city: city.id, days, pace: pace.id, interests, mustVisitPlaceIds: mandatory });
    const before = JSON.stringify(places);
    const result = generateItinerary(places, conditions);
    const selected = all(result);
    assert.equal(result.days.length, days);
    assert.equal(new Set(selected.map((place) => place.id)).size, selected.length);
    assert.ok(result.days.every((day) => day.places.length <= pace.limit));
    assert.ok(selected.every((place) => place.city === city.id && (mandatory.includes(place.id) || place.category.some((category) => interests.includes(category)))));
    assert.ok(mandatory.every((id) => selected.some((place) => place.id === id)));
    assert.deepEqual(generateItinerary(places, conditions), result);
    assert.equal(JSON.stringify(places), before);
  }
});
