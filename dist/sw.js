try{self["workbox:precaching:5.1.4"]&&_()}catch{}const U=[],N={get(){return U},add(e){U.push(...e)}};try{self["workbox:core:5.1.4"]&&_()}catch{}const f={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:typeof registration!="undefined"?registration.scope:""},w=e=>[f.prefix,e,f.suffix].filter(t=>t&&t.length>0).join("-"),P=e=>{for(const t of Object.keys(f))e(t)},R={updateDetails:e=>{P(t=>{typeof e[t]=="string"&&(f[t]=e[t])})},getGoogleAnalyticsName:e=>e||w(f.googleAnalytics),getPrecacheName:e=>e||w(f.precache),getPrefix:()=>f.prefix,getRuntimeName:e=>e||w(f.runtime),getSuffix:()=>f.suffix},W=e=>new URL(String(e),location.href).href.replace(new RegExp(`^${location.origin}`),"");const x=(e,...t)=>{let c=e;return t.length>0&&(c+=` :: ${JSON.stringify(t)}`),c},q=x;class d extends Error{constructor(t,c){const s=q(t,c);super(s),this.name=t,this.details=c}}const E=new Set;async function F(){for(const e of E)await e()}const m={filter:(e,t)=>e.filter(c=>t in c)},L=async({request:e,mode:t,plugins:c=[]})=>{const s=m.filter(c,"cacheKeyWillBeUsed");let n=e;for(const a of s)n=await a.cacheKeyWillBeUsed.call(a,{mode:t,request:n}),typeof n=="string"&&(n=new Request(n));return n},S=async({request:e,response:t,event:c,plugins:s=[]})=>{let n=t,a=!1;for(const i of s)if("cacheWillUpdate"in i&&(a=!0,n=await i.cacheWillUpdate.call(i,{request:e,response:n,event:c}),!n))break;return a||(n=n&&n.status===200?n:void 0),n||null},T=async({cacheName:e,request:t,event:c,matchOptions:s,plugins:n=[]})=>{const a=await self.caches.open(e),i=await L({plugins:n,request:t,mode:"read"});let r=await a.match(i,s);for(const o of n)"cachedResponseWillBeUsed"in o&&(r=await o.cachedResponseWillBeUsed.call(o,{cacheName:e,event:c,matchOptions:s,cachedResponse:r,request:i}));return r},k=async({cacheName:e,request:t,response:c,event:s,plugins:n=[],matchOptions:a})=>{const i=await L({plugins:n,request:t,mode:"write"});if(!c)throw new d("cache-put-with-no-response",{url:W(i.url)});const r=await S({event:s,plugins:n,response:c,request:i});if(!r)return;const o=await self.caches.open(e),u=m.filter(n,"cacheDidUpdate"),h=u.length>0?await T({cacheName:e,matchOptions:a,request:i}):null;try{await o.put(i,r)}catch(l){throw l.name==="QuotaExceededError"&&await F(),l}for(const l of u)await l.cacheDidUpdate.call(l,{cacheName:e,event:s,oldResponse:h,newResponse:r,request:i})},A={put:k,match:T},M=async({request:e,fetchOptions:t,event:c,plugins:s=[]})=>{if(typeof e=="string"&&(e=new Request(e)),c instanceof FetchEvent&&c.preloadResponse){const r=await c.preloadResponse;if(r)return r}const n=m.filter(s,"fetchDidFail"),a=n.length>0?e.clone():null;try{for(const r of s)if("requestWillFetch"in r){const o=r.requestWillFetch,u=e.clone();e=await o.call(r,{request:u,event:c})}}catch(r){throw new d("plugin-error-request-will-fetch",{thrownError:r})}const i=e.clone();try{let r;e.mode==="navigate"?r=await fetch(e):r=await fetch(e,t);for(const o of s)"fetchDidSucceed"in o&&(r=await o.fetchDidSucceed.call(o,{event:c,request:i,response:r}));return r}catch(r){for(const o of n)await o.fetchDidFail.call(o,{error:r,event:c,originalRequest:a.clone(),request:i.clone()});throw r}},v={fetch:M};let p;function I(){if(p===void 0){const e=new Response("");if("body"in e)try{new Response(e.body),p=!0}catch{p=!1}p=!1}return p}async function O(e,t){const c=e.clone(),s={headers:new Headers(c.headers),status:c.status,statusText:c.statusText},n=t?t(s):s,a=I()?c.body:await c.blob();return new Response(a,n)}const D="__WB_REVISION__";function H(e){if(!e)throw new d("add-to-cache-list-unexpected-type",{entry:e});if(typeof e=="string"){const a=new URL(e,location.href);return{cacheKey:a.href,url:a.href}}const{revision:t,url:c}=e;if(!c)throw new d("add-to-cache-list-unexpected-type",{entry:e});if(!t){const a=new URL(c,location.href);return{cacheKey:a.href,url:a.href}}const s=new URL(c,location.href),n=new URL(c,location.href);return s.searchParams.set(D,t),{cacheKey:s.href,url:n.href}}class B{constructor(t){this._cacheName=R.getPrecacheName(t),this._urlsToCacheKeys=new Map,this._urlsToCacheModes=new Map,this._cacheKeysToIntegrities=new Map}addToCacheList(t){const c=[];for(const s of t){typeof s=="string"?c.push(s):s&&s.revision===void 0&&c.push(s.url);const{cacheKey:n,url:a}=H(s),i=typeof s!="string"&&s.revision?"reload":"default";if(this._urlsToCacheKeys.has(a)&&this._urlsToCacheKeys.get(a)!==n)throw new d("add-to-cache-list-conflicting-entries",{firstEntry:this._urlsToCacheKeys.get(a),secondEntry:n});if(typeof s!="string"&&s.integrity){if(this._cacheKeysToIntegrities.has(n)&&this._cacheKeysToIntegrities.get(n)!==s.integrity)throw new d("add-to-cache-list-conflicting-integrities",{url:a});this._cacheKeysToIntegrities.set(n,s.integrity)}if(this._urlsToCacheKeys.set(a,n),this._urlsToCacheModes.set(a,i),c.length>0){const r=`Workbox is precaching URLs without revision info: ${c.join(", ")}
This is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(r)}}}async install({event:t,plugins:c}={}){const s=[],n=[],i=await(await self.caches.open(this._cacheName)).keys(),r=new Set(i.map(h=>h.url));for(const[h,l]of this._urlsToCacheKeys)r.has(l)?n.push(h):s.push({cacheKey:l,url:h});const o=s.map(({cacheKey:h,url:l})=>{const K=this._cacheKeysToIntegrities.get(h),b=this._urlsToCacheModes.get(l);return this._addURLToCache({cacheKey:h,cacheMode:b,event:t,integrity:K,plugins:c,url:l})});return await Promise.all(o),{updatedURLs:s.map(h=>h.url),notUpdatedURLs:n}}async activate(){const t=await self.caches.open(this._cacheName),c=await t.keys(),s=new Set(this._urlsToCacheKeys.values()),n=[];for(const a of c)s.has(a.url)||(await t.delete(a),n.push(a.url));return{deletedURLs:n}}async _addURLToCache({cacheKey:t,url:c,cacheMode:s,event:n,plugins:a,integrity:i}){const r=new Request(c,{integrity:i,cache:s,credentials:"same-origin"});let o=await v.fetch({event:n,plugins:a,request:r}),u;for(const l of a||[])"cacheWillUpdate"in l&&(u=l);if(!(u?await u.cacheWillUpdate({event:n,request:r,response:o}):o.status<400))throw new d("bad-precaching-response",{url:c,status:o.status});o.redirected&&(o=await O(o)),await A.put({event:n,plugins:a,response:o,request:t===c?r:new Request(t),cacheName:this._cacheName,matchOptions:{ignoreSearch:!0}})}getURLsToCacheKeys(){return this._urlsToCacheKeys}getCachedURLs(){return[...this._urlsToCacheKeys.keys()]}getCacheKeyForURL(t){const c=new URL(t,location.href);return this._urlsToCacheKeys.get(c.href)}async matchPrecache(t){const c=t instanceof Request?t.url:t,s=this.getCacheKeyForURL(c);if(s)return(await self.caches.open(this._cacheName)).match(s)}createHandler(t=!0){return async({request:c})=>{try{const s=await this.matchPrecache(c);if(s)return s;throw new d("missing-precache-entry",{cacheName:this._cacheName,url:c instanceof Request?c.url:c})}catch(s){if(t)return fetch(c);throw s}}}createHandlerBoundToURL(t,c=!0){if(!this.getCacheKeyForURL(t))throw new d("non-precached-url",{url:t});const n=this.createHandler(c),a=new Request(t);return()=>n({request:a})}}let y;const g=()=>(y||(y=new B),y);function Z(e,t=[]){for(const c of[...e.searchParams.keys()])t.some(s=>s.test(c))&&e.searchParams.delete(c);return e}function*j(e,{ignoreURLParametersMatching:t,directoryIndex:c,cleanURLs:s,urlManipulation:n}={}){const a=new URL(e,location.href);a.hash="",yield a.href;const i=Z(a,t);if(yield i.href,c&&i.pathname.endsWith("/")){const r=new URL(i.href);r.pathname+=c,yield r.href}if(s){const r=new URL(i.href);r.pathname+=".html",yield r.href}if(n){const r=n({url:a});for(const o of r)yield o.href}}const V=(e,t)=>{const s=g().getURLsToCacheKeys();for(const n of j(e,t)){const a=s.get(n);if(a)return a}},G=({ignoreURLParametersMatching:e=[/^utm_/],directoryIndex:t="index.html",cleanURLs:c=!0,urlManipulation:s}={})=>{const n=R.getPrecacheName();self.addEventListener("fetch",a=>{const i=V(a.request.url,{cleanURLs:c,directoryIndex:t,ignoreURLParametersMatching:e,urlManipulation:s});if(!i)return;let r=self.caches.open(n).then(o=>o.match(i)).then(o=>o||fetch(i));a.respondWith(r)})};let C=!1;function Q(e){C||(G(e),C=!0)}const $="-precache-",J=async(e,t=$)=>{const s=(await self.caches.keys()).filter(n=>n.includes(t)&&n.includes(self.registration.scope)&&n!==e);return await Promise.all(s.map(n=>self.caches.delete(n))),s};function z(){self.addEventListener("activate",e=>{const t=R.getPrecacheName();e.waitUntil(J(t).then(c=>{}))})}const X=e=>{const t=g(),c=N.get();e.waitUntil(t.install({event:e,plugins:c}).catch(s=>{throw s}))},Y=e=>{const t=g();e.waitUntil(t.activate())};function ee(e){g().addToCacheList(e),e.length>0&&(self.addEventListener("install",X),self.addEventListener("activate",Y))}function te(e,t){ee(e),Q(t)}const ce="v1",se="v2",ne=["/","/Home","/Home/MyGoals","/Home/MyFeelings","/Home/AddFeelings","/Home/Explore","/Home/ZinZen","/Home/ZinZen/Feedback","/QueryZinZen","/ZinZenFAQ"];self.addEventListener("install",e=>{e.waitUntil(caches.open(se).then(t=>{t.addAll(ne)}).then(()=>self.skipWaiting()))});self.addEventListener("fetch",e=>{if(e.request.mode==="navigate")e.respondWith(caches.open(ce).then(t=>fetch(e.request.url).then(c=>(t.put(e.request,c.clone()),c)).catch(()=>t.match(e.request.url))));else return"error"});z();te([{"revision":null,"url":"assets/index.ee6102df.css"},{"revision":null,"url":"assets/index.f77215ff.js"},{"revision":"c92f60c9bfda46e3c611da5eafdc072d","url":"index.html"},{"revision":"1872c500de691dce40960bb85481de07","url":"registerSW.js"},{"revision":"2ba1b5ef67ce553858e0f9e5bf2905e6","url":"manifest.webmanifest"}]);
