const CACHE='tele-tuty-shell-v34';
const ASSETS=['/','/index.html','/tele-tuty-logo.png','/public/images/admin_hero.jpg','/public/images/engineer_hero.jpg','/public/images/technician_hero.jpg','/public/images/street_hero.jpg','/public/images/battery_bank.png','/public/images/earth_pit.png','/public/images/telecom_tower.png','/public/images/wiring_fault.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('tele-tuty-shell-') && k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(u.origin!==location.origin) return;
  if(e.request.method!=='GET') return;
  e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}return r;}).catch(()=>cached)));
});
