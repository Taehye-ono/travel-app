export default function CityArt({ city = 'London', hero = false }) {
  const colors = { London: '#d9d5c4', Edinburgh: '#cad4ca', Glasgow: '#d7cbbc', Cardiff: '#ced8d9' };
  return <svg className={hero ? 'city-art hero-art' : 'city-art'} viewBox="0 0 480 320" fill="none" aria-hidden="true">
    <rect width="480" height="320" fill={colors[city]} />
    <circle cx="354" cy="91" r="42" fill="#f8f2df" />
    <path d="M0 205Q90 174 171 204T335 200T480 194V320H0Z" fill="#a4b2a8" opacity=".5" />
    <g stroke="#243d47" strokeWidth="2.5" strokeLinejoin="round">
      {city === 'London' ? <>
        <path d="M23 225v-55h24v-19h43v17h30v57M51 225v-43h10v43m14 0v-43h10v43" fill="#839894" />
        <path d="M93 237v-91h14v-17h14v17h13v91M119 237h142v-77H119" fill="#ddd9c5" />
        <path d="M142 237v-58m19 58v-58m19 58v-58m19 58v-58m19 58v-58m19 58v-58M128 169h125" />
        <path d="M273 237V99h47v138M268 99h57V78h-57zM274 78l23-41 23 41M292 40V24h10v16M279 134h36M279 149h36M279 166h36M283 180v46m13-46v46m13-46v46" fill="#e7d8b5" />
        <circle cx="297" cy="116" r="14" fill="#f6f2e7" /><path d="M297 106v10l8 5" />
        <circle cx="383" cy="158" r="59" stroke="#657c7b" /><circle cx="383" cy="158" r="53" stroke="#657c7b" strokeWidth="1" />
        <path d="M383 99v118m-59-59h118m-101-42 84 84m-84 0 84-84M363 237l20-79 22 79" stroke="#657c7b" />
        <path d="M0 248Q125 231 240 251T480 246V320H0" fill="#77959a" stroke="none" />
        <path d="M0 273q80-16 172 0m81 12q84-13 183-2m-327 14h83m132-32h59" stroke="#d2ddcf" opacity=".75" />
        <path d="M78 248v-24h48v24z" fill="#af4838" /><path d="M84 229h13v8H84zm20 0h15v8h-15z" fill="#e7e3cc" /><circle cx="89" cy="248" r="5" fill="#243d47" /><circle cx="117" cy="248" r="5" fill="#243d47" />
      </> : city === 'Edinburgh' ? <>
        <path d="M42 275 88 213l46-10 46-58 103-11 38 37 29 48 89 56Z" fill="#758d80" />
        <path d="M123 200V117h41v30h41v-43h39v37h31V90h42v110z" fill="#d7ccb0" />
        <path d="M118 117V98h12v8h12v-8h12v8h14v11m32-13V85h12v8h12v-8h12v8h12v11m22-14V70h13v8h12v-8h12v8h13v12M140 152h9v18h-9zm79-27h9v18h-9zm67-11h9v18h-9zM229 200v-26a14 14 0 0 1 28 0v26" fill="#d7ccb0" />
        <path d="M36 282V241l23-24 24 24v41m277 0v-46l26-29 25 29v46M3 284h474" fill="#b5b29a" />
      </> : city === 'Glasgow' ? <>
        <path d="M53 266V172h121v-37h42V98h49v37h40v37h123v94Z" fill="#cebda0" />
        <path d="M205 98h70l-35-40zM231 58V41h17v17M49 172l18-24h87l20 24m131 0 18-24h85l24 24M73 195h15v32H73zm34 0h15v32h-15zm34 0h15v32h-15zm184 0h15v32h-15zm34 0h15v32h-15zm34 0h15v32h-15zM224 266v-51a17 17 0 0 1 34 0v51" />
        <circle cx="241" cy="150" r="18" fill="#e9e1cb" /><path d="M241 138v12l9 5M20 280h441" />
        <path d="M24 260v-41m-12 13 12-31 15 31m402 28v-41m-12 13 12-31 15 31" stroke="#6d8273" strokeWidth="9" />
      </> : <>
        <path d="M53 267v-95h71v-39h61v39h113v-57h68v57h61v95Z" fill="#dbcfb0" />
        <path d="M48 172v-22h15v10h16v-10h16v10h17v-10h16v22m-9-39v-22h15v10h16v-10h16v10h15v-10h10v22m101-18V93h17v10h15V93h16v10h16V93h15v22m-2 57v-22h15v10h16v-10h16v10h17v-10h13v22" fill="#dbcfb0" />
        <path d="M144 156h15v24h-15zm176-21h15v24h-15zM216 267v-46a25 25 0 0 1 50 0v46M83 195v29m67-9v30m180-60v29m65-19v29M24 281h432" />
        <path d="M331 91V55l36 11-36 12" fill="#b24937" />
      </>}
    </g>
    <g stroke="#f7f3e9" opacity=".4"><path d="M0 308h480M15 0v320M465 0v320" /></g>
  </svg>;
}
