export const STAGES = ['New', 'Contacted', 'Conversation', 'Proposal', 'Won', 'Archived'];
export const today = () => new Intl.DateTimeFormat('en-CA', {timeZone: 'Asia/Qatar', year:'numeric', month:'2-digit', day:'2-digit'}).format(new Date());
export const money = value => new Intl.NumberFormat('en-GB', {style:'currency', currency:'GBP', maximumFractionDigits:0}).format(value);
export function active(row) { return !row.suppressed && !['Won','Archived'].includes(row.stage); }
export function due(row, date = today()) { return active(row) && !!row.nextFollowUp && row.nextFollowUp <= date; }
export function metrics(rows, date = today()) {
  return {active: rows.filter(active).length, value: rows.filter(active).reduce((n,r)=>n+r.value,0), due: rows.filter(r=>due(r,date)).length, won:rows.filter(r=>r.stage==='Won').length};
}
export function validated(input) {
  const output = {};
  for (const [key,max] of Object.entries({business:120,contact:120,email:254,nextFollowUp:10,conceptUrl:2048,notes:4000,draftSubject:200,draftBody:8000})) {
    output[key] = String(input[key] ?? '').trim();
    if (output[key].length > max) throw new Error(`${key} is too long.`);
  }
  if (!output.business) throw new Error('Add a business name.');
  if (output.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(output.email)) throw new Error('Check the email address.');
  if (output.conceptUrl && !/^https:\/\//i.test(output.conceptUrl)) throw new Error('Concept links must start with https://.');
  if (output.nextFollowUp && (!/^\d{4}-\d{2}-\d{2}$/.test(output.nextFollowUp) || new Date(output.nextFollowUp+'T00:00:00Z').toISOString().slice(0,10)!==output.nextFollowUp)) throw new Error('Check the follow-up date.');
  output.stage = input.stage;
  if (!STAGES.includes(output.stage)) throw new Error('Choose a valid pipeline stage.');
  output.value = Number(input.value);
  if (!Number.isFinite(output.value) || output.value < 0 || output.value > 1000000) throw new Error('Value must be between £0 and £1,000,000.');
  output.suppressed = Boolean(input.suppressed);
  return output;
}
export function csv(rows) {
  const keys = ['business','contact','email','stage','value','nextFollowUp','conceptUrl','notes','suppressed','draftSubject','draftBody'];
  const cell = v => '"'+String(v??'').replace(/^[=+@\-\t\r]/,"'$&").replaceAll('"','""')+'"';
  return [keys.join(','),...rows.map(r=>keys.map(k=>cell(r[k])).join(','))].join('\r\n');
}
export function demoRows(date=today()) {
  const base={contact:'Demo contact',email:'',nextFollowUp:date,conceptUrl:'',notes:'Fictional sample for the pilot. No outreach has been sent.',suppressed:false,draftSubject:'',draftBody:''};
  return [
    {business:'Fern & Field Studio',stage:'Proposal',value:1800},
    {business:'Meadow Plumbing',stage:'Conversation',value:1200},
    {business:'The Little Coast Café',stage:'Contacted',value:950},
    {business:'Willow Garden Care',stage:'New',value:800,nextFollowUp:''},
    {business:'Juniper Travel',stage:'Won',value:2200},
    {business:'Oak Workshop',stage:'New',value:1400,suppressed:true}
  ].map((r,i)=>({...base,...r,id:'demo-'+i}));
}
