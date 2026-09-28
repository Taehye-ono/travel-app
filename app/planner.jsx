'use client';

import { useRef, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, Check, ChevronRight, Coffee, Compass, Footprints, Heart, Info, Landmark, Leaf, MapPin, Search, ShoppingBag, Sparkles, Camera, SlidersHorizontal, CalendarDays } from 'lucide-react';
import CityArt from '../components/city-art';
import { CITIES, INTERESTS, PACES, INITIAL_CONDITIONS, getCandidates, getCapacity, generateItinerary, validateConditions } from '../lib/planner.mjs';

const icons = { camera: Camera, landmark: Landmark, leaf: Leaf, coffee: Coffee, bag: ShoppingBag, walk: Footprints, sparkles: Sparkles };
const toggle = (items, id) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id];

function StepTitle({ number, title, description, optional }) {
  return <div className="step-title"><span className="step-number">{number}</span><div><h3>{title}{optional && <span className="optional">선택</span>}</h3><p>{description}</p></div></div>;
}

export default function Planner({ places }) {
  const [conditions, setConditions] = useState(INITIAL_CONDITIONS);
  const [result, setResult] = useState(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState('');
  const resultHeading = useRef(null);
  const city = CITIES.find((item) => item.id === conditions.city);
  const pace = PACES.find((item) => item.id === conditions.pace);
  const cityPlaces = places.filter((place) => place.city === conditions.city);
  const candidates = getCandidates(places, conditions);
  const capacity = getCapacity(conditions);
  const selectedLimit = Math.min(cityPlaces.length, capacity);
  const filteredPlaces = cityPlaces.filter((place) => `${place.name} ${place.area}`.toLowerCase().includes(query.toLowerCase().trim()));
  const overLimit = conditions.mustVisitPlaceIds.length > capacity;

  function update(field, value) {
    setConditions((current) => ({ ...current, [field]: value }));
    setError(null);
  }

  function changeCity(id) {
    if (id === conditions.city) return;
    setNotice(conditions.mustVisitPlaceIds.length ? '도시가 바뀌어 필수 방문 장소 선택을 초기화했어요.' : '');
    setConditions((current) => ({ ...current, city: id, mustVisitPlaceIds: [] }));
    setQuery('');
    setError(null);
  }

  function createTrip(event) {
    event.preventDefault();
    const issue = validateConditions(places, conditions);
    setError(issue);
    if (issue) {
      document.getElementById(`field-${issue.field}`)?.focus();
      return;
    }
    setResult(generateItinerary(places, conditions));
    requestAnimationFrame(() => {
      resultHeading.current?.focus();
      document.getElementById('trip-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function editTrip() {
    setResult(null);
    requestAnimationFrame(() => {
      document.getElementById('field-city')?.focus({ preventScroll: true });
      document.getElementById('plan')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  return <>
    <a className="skip-link" href={result ? '#trip-result' : '#plan'}>본문으로 건너뛰기</a>
    <header className="site-header"><div className="header-inner">
      <a className="brand" href="#top" aria-label="BritRoute 처음으로"><Compass size={28} strokeWidth={1.6} /><span>BritRoute<span className="brand-dot">.</span></span></a>
      <nav aria-label="주 메뉴"><a href="#destinations" onClick={result ? editTrip : undefined}>여행 도시</a><a href="#how-it-works">이용 방법</a><a className="nav-cta" href={result ? '#trip-result' : '#plan'}>{result ? '내 일정 보기' : '여행 계획하기'}<ArrowRight size={15} /></a></nav>
    </div></header>

    <main id="top">
      {!result ? <>
        <section className="hero page-width" aria-labelledby="hero-title">
          <div className="hero-copy"><p className="eyebrow"><span /> A JOURNEY, YOUR WAY</p><h1 id="hero-title">영국 여행,<br /><span>나답게</span> 떠나볼까요?</h1><p className="hero-description">마음이 가는 도시, 좋아하는 것, 나만의 속도.<br />당신의 취향으로 채우는 작은 영국 여행.</p><a className="primary-button hero-button" href="#plan">나만의 일정 만들기<ArrowRight size={18} /></a><div className="hero-footnote"><span className="mini-line" />4개의 도시 · 40개의 장소 · 나만의 여행</div></div>
          <div className="hero-visual"><div className="postcard"><div className="postcard-heading"><span>A POSTCARD FROM BRITAIN</span><Compass size={22} /></div><CityArt hero city={conditions.city || 'London'} /><div className="postcard-caption"><span className="serif">{city?.id || 'London'}, with love.</span><span>YOUR NEXT CHAPTER ↗</span></div></div><div className="passport-stamp"><span>LET’S GET</span><strong>lost</strong><span>IN THE RIGHT DIRECTION</span></div><span className="visual-note">A little Britain. A lot of you.</span></div>
        </section>

        <div className="intro-strip"><div className="page-width"><span><MapPin size={17} />도시를 고르고</span><i /><span><Heart size={17} />취향을 담으면</span><i /><span><CalendarDays size={17} />여행의 시작이 완성돼요</span></div></div>

        <section className="planning-section page-width" id="plan" aria-labelledby="plan-title">
          <div className="section-heading"><div><p className="eyebrow">MAKE IT YOURS</p><h2 id="plan-title">어떤 여행을 꿈꾸나요?</h2><p>몇 가지 선택만으로, 여행의 첫 페이지를 채워보세요.</p></div><span className="section-label">YOUR TRAVEL NOTE / 01</span></div>
          <form onSubmit={createTrip} noValidate>
            <fieldset className="city-section" id="field-city" tabIndex={-1} aria-describedby={error?.field === 'city' ? 'form-error' : undefined}>
              <legend className="sr-only">여행 도시</legend><div id="destinations"><StepTitle number="01" title="어느 도시로 떠나나요?" description="이번 여행에서 둘러볼 한 도시를 골라주세요." /></div>
              <div className="city-grid">{CITIES.map((item) => <label className={`city-card ${conditions.city === item.id ? 'selected' : ''}`} key={item.id}>
                <input className="choice-input" type="radio" name="city" value={item.id} checked={conditions.city === item.id} onChange={() => changeCity(item.id)} /><div className="city-picture"><CityArt city={item.id} /><span className="city-index">{item.number}</span><span className="selection-check">{conditions.city === item.id && <Check size={14} />}</span></div><div className="city-details"><span className="city-english serif">{item.id}</span><div className="city-name"><h4>{item.name}</h4><span>{places.filter((place) => place.city === item.id).length}곳</span></div><p>{item.caption}</p></div>
              </label>)}</div>
            </fieldset>

            <div className="form-layout"><div className="form-main">
              <div className="form-panel">
                <fieldset id="field-days" tabIndex={-1}><legend className="sr-only">여행 일수</legend><StepTitle number="02" title="며칠 둘러볼까요?" description="이 도시에서 여행할 일수를 선택해주세요." /><div className="days-options">{[1, 2, 3].map((day) => <label key={day} className={`day-option ${conditions.days === day ? 'active' : ''}`}><input className="choice-input" type="radio" name="days" checked={conditions.days === day} onChange={() => update('days', day)} /><CalendarDays size={18} /><span>{day}일</span>{conditions.days === day && <Check size={15} />}</label>)}</div></fieldset>
                <div className="panel-divider" />
                <fieldset id="field-interests" tabIndex={-1} aria-describedby={error?.field === 'interests' ? 'form-error' : undefined}><legend className="sr-only">관심사</legend><StepTitle number="03" title="무엇을 좋아하나요?" description="마음이 가는 관심사를 모두 골라주세요. (1개 이상)" /><div className="interest-options">{INTERESTS.map((interest) => { const Icon = icons[interest.icon]; const checked = conditions.interests.includes(interest.id); return <label key={interest.id} className={`interest-option ${checked ? 'active' : ''}`}><input className="choice-input" type="checkbox" checked={checked} onChange={() => update('interests', toggle(conditions.interests, interest.id))} /><Icon size={19} strokeWidth={1.6} /><span>{interest.label}</span>{checked && <Check size={14} />}</label>; })}</div></fieldset>
                <div className="panel-divider" />
                <fieldset id="field-pace" tabIndex={-1}><legend className="sr-only">여행 강도</legend><StepTitle number="04" title="어떤 속도로 여행할까요?" description="내게 편안한 여행의 리듬을 찾아보세요." /><div className="pace-options">{PACES.map((item) => { const Icon = icons[item.icon]; return <label className={`pace-option ${conditions.pace === item.id ? 'active' : ''}`} key={item.id}><input className="choice-input" type="radio" name="pace" checked={conditions.pace === item.id} onChange={() => update('pace', item.id)} /><Icon size={22} strokeWidth={1.5} /><strong>{item.label}</strong><span>하루 최대 {item.limit}곳</span><small>{item.description}</small></label>; })}</div></fieldset>
              </div>

              <fieldset className="form-panel must-visit" id="field-must-visit" tabIndex={-1}><legend className="sr-only">필수 방문 장소</legend><StepTitle number="05" title="꼭 가고 싶은 곳이 있나요?" description="선택한 곳은 관심사와 관계없이 일정에 먼저 담아요." optional />
                <p className="status-notice" role="status">{notice}</p>
                {!city ? <div className="empty-selection"><MapPin size={24} strokeWidth={1.3} /><p>도시를 고르면 방문할 수 있는 장소가 보여요.</p></div> : <>
                  <div className="place-search"><Search size={17} /><input type="search" aria-label="필수 방문 장소 검색" placeholder="영문 장소명 또는 지역으로 검색" value={query} onChange={(event) => setQuery(event.target.value)} /><span>{conditions.mustVisitPlaceIds.length} / {selectedLimit}</span></div>
                  <div className="place-options">{filteredPlaces.map((place) => { const checked = conditions.mustVisitPlaceIds.includes(place.id); return <label className={`place-option ${checked ? 'active' : ''}`} key={place.id}><input type="checkbox" checked={checked} onChange={() => update('mustVisitPlaceIds', toggle(conditions.mustVisitPlaceIds, place.id))} /><span><strong>{place.name}</strong><small>{place.area}</small></span><Heart size={16} fill={checked ? 'currentColor' : 'none'} /></label>; })}{!filteredPlaces.length && <p className="search-empty">검색 결과가 없어요. 다른 이름으로 찾아보세요.</p>}</div>
                  {overLimit && <p className="inline-error" role="alert">필수 장소가 {conditions.mustVisitPlaceIds.length - capacity}곳 많아요. 선택을 줄이거나 일수·강도를 늘려주세요.</p>}
                </>}
              </fieldset>
            </div>

            <aside className="trip-summary" aria-label="여행 조건 요약"><div className="summary-top"><span className="eyebrow">MY LITTLE GETAWAY</span><Compass size={22} /></div><h3>나의 여행 노트</h3><p className="summary-subtitle">좋아하는 것으로 채우는 여정</p><div className="summary-route"><span className="route-dot" /><div><small>DESTINATION</small><strong>{city ? `${city.name}, ${city.id}` : '어디로 떠나볼까요?'}</strong></div></div><dl><div><dt>여행 기간</dt><dd>{conditions.days}일</dd></div><div><dt>여행 속도</dt><dd>{pace.label}<small>하루 최대 {pace.limit}곳</small></dd></div><div><dt>나의 관심사</dt><dd>{conditions.interests.length ? INTERESTS.filter((item) => conditions.interests.includes(item.id)).map((item) => item.label).join(' · ') : '아직 고르는 중'}</dd></div><div><dt>꼭 가고 싶은 곳</dt><dd>{conditions.mustVisitPlaceIds.length}곳</dd></div></dl>
              <div className="summary-matching" aria-live="polite"><Sparkles size={17} /><span>{city && conditions.interests.length ? <>조건에 맞는 장소 <strong>{candidates.length}곳</strong></> : '도시와 관심사를 골라주세요'}</span></div>
              {city && conditions.interests.length > 0 && candidates.length < capacity && <p className="shortage-note">추천 장소가 적으면 여유 있는 일정으로 구성해요.</p>}
              {error && <p className="inline-error" id="form-error" role="alert">{error.message}</p>}
              <button className="primary-button generate-button" type="submit">여행 일정 만들기<ArrowRight size={18} /></button><p className="summary-footnote">작은 선택이, 새로운 여행의 시작.</p>
            </aside></div>
          </form>
        </section>
      </> : <section className="result-section page-width" id="trip-result">
        <button type="button" className="back-button" onClick={editTrip}><ArrowLeft size={17} />조건 수정하기</button><div className="result-heading"><div><p className="eyebrow">YOUR NEXT CHAPTER</p><h1 ref={resultHeading} tabIndex={-1}>{city.name},<br /><span>나만의 {conditions.days}일.</span></h1><p>마음에 담은 취향을 따라, 여행을 시작해보세요.</p></div><div className="result-postcard"><CityArt city={city.id} /><span className="serif">Hello, {city.id}.</span></div></div>
        <div className="result-meta"><span><CalendarDays size={17} />{conditions.days}일 여행</span><span><Footprints size={17} />{pace.label}</span><span><MapPin size={17} />총 {result.total}곳</span><span><Heart size={17} />{INTERESTS.filter((item) => conditions.interests.includes(item.id)).map((item) => item.label).join(' · ')}</span></div>
        {result.shortage && <div className="result-notice"><Info size={20} /><p>현재 조건에 맞는 장소는 <strong>{result.total}곳</strong>이에요. 더 다양한 일정을 원하면 관심사를 추가해 보세요.</p><button type="button" onClick={editTrip}>조건 수정<ChevronRight size={16} /></button></div>}
        <div className="result-layout"><div className="itinerary">{result.days.map((day) => <section className="day-section" id={`day-${day.day}`} key={day.day} aria-labelledby={`day-title-${day.day}`}><div className="day-heading"><span className="day-badge">DAY {String(day.day).padStart(2, '0')}</span><h2 id={`day-title-${day.day}`}>{day.places.length ? `${city.name}에서의 ${day.day === 1 ? '첫 번째' : day.day === 2 ? '두 번째' : '세 번째'} 하루` : '조금 더 자유로운 하루'}</h2><span>{day.places.length}곳</span></div>
          {day.places.length ? <ol className="timeline">{day.places.map((place, index) => <li key={place.id}><span className="timeline-number">{index + 1}</span><article className="result-place"><div className="place-card-top"><span className="place-area"><MapPin size={13} />{place.area}</span>{place.isMustVisit && <span className="must-badge"><Heart size={11} fill="currentColor" />필수 방문</span>}</div><h3>{place.name}</h3><div className="category-tags">{INTERESTS.filter((item) => place.category.includes(item.id)).map((item) => <span key={item.id}>{item.label}</span>)}</div><p className="place-reason"><Sparkles size={13} />{place.reason}</p></article></li>)}</ol> : <div className="free-day"><Coffee size={28} strokeWidth={1.3} /><h3>오늘은, 마음 가는 대로.</h3><p>추천 장소가 없는 날이에요.<br />자유 일정으로 활용하거나 조건을 바꿔 보세요.</p></div>}
        </section>)}</div><aside className="result-sidebar"><span className="eyebrow">THE ITINERARY</span><h3>여행 한눈에 보기</h3>{result.days.map((day) => <a href={`#day-${day.day}`} key={day.day}><span>DAY {String(day.day).padStart(2, '0')}</span><small>{day.places.length ? `${day.places.length}곳 둘러보기` : '자유 일정'}</small><ArrowDown size={14} /></a>)}<div className="sidebar-tip"><Info size={18} /><p>날짜별 추천 순서예요. 방문 전 운영시간과 이동 방법을 확인해 주세요.</p></div><button className="secondary-button" type="button" onClick={editTrip}><SlidersHorizontal size={16} />조건 수정하기</button></aside></div>
        <div className="result-ending"><Compass size={28} strokeWidth={1.3} /><span className="serif">Good plans. Great memories.</span><p>완벽한 계획보다, 당신다운 여행이 되기를.</p></div>
      </section>}

      <section className="how-section" id="how-it-works"><div className="page-width"><div><p className="eyebrow">LESS PLANNING, MORE EXPLORING</p><h2>여행 준비는 가볍게,<br />기억은 오래도록.</h2></div><div className="how-steps"><div><span>01</span><h3>도시와 취향 선택</h3><p>여행할 도시와 좋아하는 것들을 골라주세요.</p></div><div><span>02</span><h3>나만의 일정 확인</h3><p>취향과 속도에 맞는 날짜별 장소를 만나보세요.</p></div><div><span>03</span><h3>여행의 시작</h3><p>운영시간과 이동 방법을 확인하고 떠나보세요.</p></div></div></div></section>
    </main>
    <footer className="site-footer page-width"><a className="brand" href="#top"><Compass size={22} strokeWidth={1.5} /><span>BritRoute<span className="brand-dot">.</span></span></a><span>A little Britain. A lot of you.</span><small>당신만의 영국 여행을 위해.</small></footer>
  </>;
}
