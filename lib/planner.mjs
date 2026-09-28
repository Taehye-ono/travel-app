export const CITIES = [
  { id: 'London', name: '런던', caption: '익숙한 풍경, 새로운 발견', number: '01' },
  { id: 'Edinburgh', name: '에든버러', caption: '오래된 골목 속 이야기', number: '02' },
  { id: 'Glasgow', name: '글래스고', caption: '예술과 일상이 만나는 곳', number: '03' },
  { id: 'Cardiff', name: '카디프', caption: '성에서 시작되는 산책', number: '04' },
];
export const INTERESTS = [
  { id: 'sightseeing', label: '관광', icon: 'camera' },
  { id: 'history_culture', label: '역사·문화', icon: 'landmark' },
  { id: 'nature', label: '자연', icon: 'leaf' },
  { id: 'food_cafe', label: '음식·카페', icon: 'coffee' },
  { id: 'shopping', label: '쇼핑', icon: 'bag' },
];
export const PACES = [
  { id: 'relaxed', label: '여유롭게', limit: 3, description: '천천히, 오래 기억할 수 있게', icon: 'coffee' },
  { id: 'balanced', label: '보통', limit: 4, description: '구경도 쉬는 시간도 알맞게', icon: 'walk' },
  { id: 'packed', label: '빡빡하게', limit: 5, description: '하루를 조금 더 풍성하게', icon: 'sparkles' },
];
export const INITIAL_CONDITIONS = { city: '', days: 2, interests: [], pace: 'balanced', mustVisitPlaceIds: [] };
export const getCapacity = (conditions) => (PACES.find((p) => p.id === conditions.pace)?.limit || 0) * conditions.days;
const compareName = (a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
const score = (place, interests) => place.category.filter((category) => interests.includes(category)).length;

export function getCandidates(places, conditions) {
  return places.filter((place) => place.city === conditions.city && (conditions.mustVisitPlaceIds.includes(place.id) || score(place, conditions.interests) > 0));
}

export function validateConditions(places, conditions) {
  if (!CITIES.some((city) => city.id === conditions.city)) return { field: 'city', message: '먼저 여행할 도시를 선택해 주세요.' };
  if (![1, 2, 3].includes(conditions.days)) return { field: 'days', message: '여행 일수는 1~3일 중 선택해 주세요.' };
  if (!conditions.interests.length || conditions.interests.some((id) => !INTERESTS.some((item) => item.id === id))) return { field: 'interests', message: '관심사를 하나 이상 선택해 주세요.' };
  if (!PACES.some((pace) => pace.id === conditions.pace)) return { field: 'pace', message: '여행 강도를 선택해 주세요.' };
  const mandatory = new Set(conditions.mustVisitPlaceIds);
  if ([...mandatory].some((id) => !places.some((place) => place.id === id && place.city === conditions.city))) return { field: 'must-visit', message: '선택한 도시의 등록 장소를 골라 주세요.' };
  if (mandatory.size > getCapacity(conditions)) return { field: 'must-visit', message: `필수 방문 장소가 ${mandatory.size - getCapacity(conditions)}곳 많아요. 장소를 줄이거나 일수·여행 강도를 바꿔 주세요.` };
  if (!getCandidates(places, conditions).length) return { field: 'interests', message: '이 조건에 맞는 장소가 없어요. 다른 관심사를 선택해 주세요.' };
  return null;
}

export function generateItinerary(places, conditions) {
  const error = validateConditions(places, conditions);
  if (error) throw new Error(error.message);
  const mandatory = new Set(conditions.mustVisitPlaceIds);
  const priority = (a, b) => Number(mandatory.has(b.id)) - Number(mandatory.has(a.id)) || score(b, conditions.interests) - score(a, conditions.interests) || compareName(a, b);
  const candidates = getCandidates(places, conditions).sort(priority);
  const remaining = candidates.slice(0, getCapacity(conditions));
  const total = remaining.length;
  const days = Array.from({ length: conditions.days }, (_, dayIndex) => {
    const count = Math.floor(total / conditions.days) + Number(dayIndex < total % conditions.days);
    const entries = [];
    for (let index = 0; index < count; index++) {
      const previous = entries.at(-1);
      const sameArea = previous ? remaining.findIndex((place) => place.area === previous.area) : -1;
      const [place] = remaining.splice(sameArea < 0 ? 0 : sameArea, 1);
      const matched = INTERESTS.filter((interest) => conditions.interests.includes(interest.id) && place.category.includes(interest.id));
      entries.push({ ...place, isMustVisit: mandatory.has(place.id), reason: mandatory.has(place.id) ? '꼭 가고 싶은 곳으로 선택했어요' : `선택한 ${matched.map((interest) => interest.label).join(' · ')} 관심사와 맞아요` });
    }
    return { day: dayIndex + 1, places: entries };
  });
  return { conditions: structuredClone(conditions), days, total, available: candidates.length, shortage: total < getCapacity(conditions) };
}
