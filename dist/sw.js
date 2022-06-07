try{self["workbox:precaching:5.1.4"]&&_()}catch{}const C=[],N={get(){return C},add(e){C.push(...e)}};try{self["workbox:core:5.1.4"]&&_()}catch{}const f={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:typeof registration!="undefined"?registration.scope:""},w=e=>[f.prefix,e,f.suffix].filter(t=>t&&t.length>0).join("-"),P=e=>{for(const t of Object.keys(f))e(t)},R={updateDetails:e=>{P(t=>{typeof e[t]=="string"&&(f[t]=e[t])})},getGoogleAnalyticsName:e=>e||w(f.googleAnalytics),getPrecacheName:e=>e||w(f.precache),getPrefix:()=>f.prefix,getRuntimeName:e=>e||w(f.runtime),getSuffix:()=>f.suffix},W=e=>new URL(String(e),location.href).href.replace(new RegExp(`^${location.origin}`),"");const x=(e,...t)=>{let c=e;return t.length>0&&(c+=` :: ${JSON.stringify(t)}`),c},E=x;class d extends Error{constructor(t,c){const s=E(t,c);super(s),this.name=t,this.details=c}}const q=new Set;async function F(){for(const e of q)await e()}const m={filter:(e,t)=>e.filter(c=>t in c)},L=async({request:e,mode:t,plugins:c=[]})=>{const s=m.filter(c,"cacheKeyWillBeUsed");let n=e;for(const a of s)n=await a.cacheKeyWillBeUsed.call(a,{mode:t,request:n}),typeof n=="string"&&(n=new Request(n));return n},S=async({request:e,response:t,event:c,plugins:s=[]})=>{let n=t,a=!1;for(const i of s)if("cacheWillUpdate"in i&&(a=!0,n=await i.cacheWillUpdate.call(i,{request:e,response:n,event:c}),!n))break;return a||(n=n&&n.status===200?n:void 0),n||null},T=async({cacheName:e,request:t,event:c,matchOptions:s,plugins:n=[]})=>{const a=await self.caches.open(e),i=await L({plugins:n,request:t,mode:"read"});let o=await a.match(i,s);for(const r of n)"cachedResponseWillBeUsed"in r&&(o=await r.cachedResponseWillBeUsed.call(r,{cacheName:e,event:c,matchOptions:s,cachedResponse:o,request:i}));return o},k=async({cacheName:e,request:t,response:c,event:s,plugins:n=[],matchOptions:a})=>{const i=await L({plugins:n,request:t,mode:"write"});if(!c)throw new d("cache-put-with-no-response",{url:W(i.url)});const o=await S({event:s,plugins:n,response:c,request:i});if(!o)return;const r=await self.caches.open(e),u=m.filter(n,"cacheDidUpdate"),l=u.length>0?await T({cacheName:e,matchOptions:a,request:i}):null;try{await r.put(i,o)}catch(h){throw h.name==="QuotaExceededError"&&await F(),h}for(const h of u)await h.cacheDidUpdate.call(h,{cacheName:e,event:s,oldResponse:l,newResponse:o,request:i})},M={put:k,match:T},A=async({request:e,fetchOptions:t,event:c,plugins:s=[]})=>{if(typeof e=="string"&&(e=new Request(e)),c instanceof FetchEvent&&c.preloadResponse){const o=await c.preloadResponse;if(o)return o}const n=m.filter(s,"fetchDidFail"),a=n.length>0?e.clone():null;try{for(const o of s)if("requestWillFetch"in o){const r=o.requestWillFetch,u=e.clone();e=await r.call(o,{request:u,event:c})}}catch(o){throw new d("plugin-error-request-will-fetch",{thrownError:o})}const i=e.clone();try{let o;e.mode==="navigate"?o=await fetch(e):o=await fetch(e,t);for(const r of s)"fetchDidSucceed"in r&&(o=await r.fetchDidSucceed.call(r,{event:c,request:i,response:o}));return o}catch(o){for(const r of n)await r.fetchDidFail.call(r,{error:o,event:c,originalRequest:a.clone(),request:i.clone()});throw o}},v={fetch:A};let p;function I(){if(p===void 0){const e=new Response("");if("body"in e)try{new Response(e.body),p=!0}catch{p=!1}p=!1}return p}async function O(e,t){const c=e.clone(),s={headers:new Headers(c.headers),status:c.status,statusText:c.statusText},n=t?t(s):s,a=I()?c.body:await c.blob();return new Response(a,n)}const D="__WB_REVISION__";function H(e){if(!e)throw new d("add-to-cache-list-unexpected-type",{entry:e});if(typeof e=="string"){const a=new URL(e,location.href);return{cacheKey:a.href,url:a.href}}const{revision:t,url:c}=e;if(!c)throw new d("add-to-cache-list-unexpected-type",{entry:e});if(!t){const a=new URL(c,location.href);return{cacheKey:a.href,url:a.href}}const s=new URL(c,location.href),n=new URL(c,location.href);return s.searchParams.set(D,t),{cacheKey:s.href,url:n.href}}class B{constructor(t){this._cacheName=R.getPrecacheName(t),this._urlsToCacheKeys=new Map,this._urlsToCacheModes=new Map,this._cacheKeysToIntegrities=new Map}addToCacheList(t){const c=[];for(const s of t){typeof s=="string"?c.push(s):s&&s.revision===void 0&&c.push(s.url);const{cacheKey:n,url:a}=H(s),i=typeof s!="string"&&s.revision?"reload":"default";if(this._urlsToCacheKeys.has(a)&&this._urlsToCacheKeys.get(a)!==n)throw new d("add-to-cache-list-conflicting-entries",{firstEntry:this._urlsToCacheKeys.get(a),secondEntry:n});if(typeof s!="string"&&s.integrity){if(this._cacheKeysToIntegrities.has(n)&&this._cacheKeysToIntegrities.get(n)!==s.integrity)throw new d("add-to-cache-list-conflicting-integrities",{url:a});this._cacheKeysToIntegrities.set(n,s.integrity)}if(this._urlsToCacheKeys.set(a,n),this._urlsToCacheModes.set(a,i),c.length>0){const o=`Workbox is precaching URLs without revision info: ${c.join(", ")}
This is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(o)}}}async install({event:t,plugins:c}={}){const s=[],n=[],i=await(await self.caches.open(this._cacheName)).keys(),o=new Set(i.map(l=>l.url));for(const[l,h]of this._urlsToCacheKeys)o.has(h)?n.push(l):s.push({cacheKey:h,url:l});const r=s.map(({cacheKey:l,url:h})=>{const K=this._cacheKeysToIntegrities.get(l),b=this._urlsToCacheModes.get(h);return this._addURLToCache({cacheKey:l,cacheMode:b,event:t,integrity:K,plugins:c,url:h})});return await Promise.all(r),{updatedURLs:s.map(l=>l.url),notUpdatedURLs:n}}async activate(){const t=await self.caches.open(this._cacheName),c=await t.keys(),s=new Set(this._urlsToCacheKeys.values()),n=[];for(const a of c)s.has(a.url)||(await t.delete(a),n.push(a.url));return{deletedURLs:n}}async _addURLToCache({cacheKey:t,url:c,cacheMode:s,event:n,plugins:a,integrity:i}){const o=new Request(c,{integrity:i,cache:s,credentials:"same-origin"});let r=await v.fetch({event:n,plugins:a,request:o}),u;for(const h of a||[])"cacheWillUpdate"in h&&(u=h);if(!(u?await u.cacheWillUpdate({event:n,request:o,response:r}):r.status<400))throw new d("bad-precaching-response",{url:c,status:r.status});r.redirected&&(r=await O(r)),await M.put({event:n,plugins:a,response:r,request:t===c?o:new Request(t),cacheName:this._cacheName,matchOptions:{ignoreSearch:!0}})}getURLsToCacheKeys(){return this._urlsToCacheKeys}getCachedURLs(){return[...this._urlsToCacheKeys.keys()]}getCacheKeyForURL(t){const c=new URL(t,location.href);return this._urlsToCacheKeys.get(c.href)}async matchPrecache(t){const c=t instanceof Request?t.url:t,s=this.getCacheKeyForURL(c);if(s)return(await self.caches.open(this._cacheName)).match(s)}createHandler(t=!0){return async({request:c})=>{try{const s=await this.matchPrecache(c);if(s)return s;throw new d("missing-precache-entry",{cacheName:this._cacheName,url:c instanceof Request?c.url:c})}catch(s){if(t)return fetch(c);throw s}}}createHandlerBoundToURL(t,c=!0){if(!this.getCacheKeyForURL(t))throw new d("non-precached-url",{url:t});const n=this.createHandler(c),a=new Request(t);return()=>n({request:a})}}let y;const g=()=>(y||(y=new B),y);function j(e,t=[]){for(const c of[...e.searchParams.keys()])t.some(s=>s.test(c))&&e.searchParams.delete(c);return e}function*V(e,{ignoreURLParametersMatching:t,directoryIndex:c,cleanURLs:s,urlManipulation:n}={}){const a=new URL(e,location.href);a.hash="",yield a.href;const i=j(a,t);if(yield i.href,c&&i.pathname.endsWith("/")){const o=new URL(i.href);o.pathname+=c,yield o.href}if(s){const o=new URL(i.href);o.pathname+=".html",yield o.href}if(n){const o=n({url:a});for(const r of o)yield r.href}}const G=(e,t)=>{const s=g().getURLsToCacheKeys();for(const n of V(e,t)){const a=s.get(n);if(a)return a}},Z=({ignoreURLParametersMatching:e=[/^utm_/],directoryIndex:t="index.html",cleanURLs:c=!0,urlManipulation:s}={})=>{const n=R.getPrecacheName();self.addEventListener("fetch",a=>{const i=G(a.request.url,{cleanURLs:c,directoryIndex:t,ignoreURLParametersMatching:e,urlManipulation:s});if(!i)return;let o=self.caches.open(n).then(r=>r.match(i)).then(r=>r||fetch(i));a.respondWith(o)})};let U=!1;function $(e){U||(Z(e),U=!0)}const Q="-precache-",J=async(e,t=Q)=>{const s=(await self.caches.keys()).filter(n=>n.includes(t)&&n.includes(self.registration.scope)&&n!==e);return await Promise.all(s.map(n=>self.caches.delete(n))),s};function z(){self.addEventListener("activate",e=>{const t=R.getPrecacheName();e.waitUntil(J(t).then(c=>{}))})}const X=e=>{const t=g(),c=N.get();e.waitUntil(t.install({event:e,plugins:c}).catch(s=>{throw s}))},Y=e=>{const t=g();e.waitUntil(t.activate())};function ee(e){g().addToCacheList(e),e.length>0&&(self.addEventListener("install",X),self.addEventListener("activate",Y))}function te(e,t){ee(e),$(t)}const ce="v1",se="v2",ne=["/","/Home","/Home/MyGoals","/Home/MyFeelings","/Home/AddFeelings","/Home/Explore","/Home/ZinZen","/Home/ZinZen/Feedback"];self.addEventListener("install",e=>{e.waitUntil(caches.open(se).then(t=>{t.addAll(ne)}).then(()=>self.skipWaiting()))});self.addEventListener("fetch",e=>{e.respondWith(fetch(e.request).then(t=>{const c=t.clone();return caches.open(ce).then(s=>{s.put(e.request,c)}),t}).catch(t=>caches.match(e.request).then(c=>c)))});z();te([{"revision":null,"url":"assets/index.588f0052.css"},{"revision":null,"url":"assets/index.73c81d2c.js"},{"revision":"1f547497995788848020437a9c756069","url":"index.html"},{"revision":"1872c500de691dce40960bb85481de07","url":"registerSW.js"},{"revision":"1d1f24753eaedb1d539048307309dc96","url":"manifest.webmanifest"}]);
