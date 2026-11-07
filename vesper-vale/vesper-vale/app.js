const PRODUCTS = [
  {id:'scorpio',name:'SCORPIO',family:'Drop 01',type:'Hoodie',price:69,launch:true,color:'Noir obsidienne',hex:'#090909',ink:'#B7B1A6',design:'SCORPIO',description:'Un glyphe propriétaire, brodé au cœur dans un fil d’argent vieilli. À l’intérieur, la constellation du Scorpion, comme un secret de maison.',motif:'scorpio',view:'scorpio'},
  {id:'nocturne',name:'NOCTURNE',family:'Drop 01',type:'Sweatshirt',price:59,launch:true,color:'Noir obsidienne',hex:'#090909',ink:'#B5A7A0',design:'NOCTURNE',description:'Une rose noire gravée en fil fin, réduite à quelques lignes sur la poitrine. Romantique sans ostentation, pensée pour se porter au quotidien.',motif:'rose',view:'rose'},
  {id:'obsidian',name:'OBSIDIAN',family:'Édition spéciale',type:'Hoodie',price:79,launch:true,color:'Noir obsidienne · détail bordeaux',hex:'#090909',ink:'#551D2B',design:'OBSIDIAN',description:'Un sceau de maison original, brodé ton sur ton bordeaux profond. Édition spéciale à confirmer selon les coûts de fabrication réels.',motif:'seal',view:'seal'},
  {id:'velvet',name:'VELVET',family:'Capsule',type:'Sweatshirt',price:59,launch:false,color:'Anthracite',hex:'#242124',ink:'#B5A7A0',design:'VELVET',description:'Un emblème floral brodé en gris pierre, inspiré des gravures botaniques anciennes. Six pétales retenus, silhouette nette.',motif:'floral',view:'rose'},
  {id:'eclipse',name:'ECLIPSE',family:'Capsule',type:'Hoodie',price:69,launch:false,color:'Noir obsidienne',hex:'#090909',ink:'#B7B1A6',design:'ECLIPSE',description:'La constellation du Scorpion, réduite à quelques points brodés à l’intérieur de la capuche. Le devant demeure presque silencieux.',motif:'constellation',view:'stars'},
  {id:'devotion',name:'DEVOTION',family:'Capsule',type:'Sweatshirt',price:59,launch:false,color:'Anthracite · monogramme argent',hex:'#242124',ink:'#B7B1A6',design:'VV',description:'Le monogramme de maison, discret au cœur et répété en micro-détail sur l’étiquette intérieure. Un signe de reconnaissance sans logo surdimensionné.',motif:'monogram',view:'crest'}
];

const SIZES = ['XS','S','M','L','XL','XXL'];
let cart = loadCart();
let activeProduct = null;
let selectedSize = 'M';
let toastTimeout;

function loadCart() {
  try { return JSON.parse(localStorage.getItem('vv-cart') || '[]').filter(item => PRODUCTS.some(product => product.id === item.id && product.launch) && SIZES.includes(item.size) && Number.isInteger(item.qty) && item.qty > 0); }
  catch { return []; }
}

function saveCart() {
  localStorage.setItem('vv-cart', JSON.stringify(cart));
}

function garmentSvg(product, back = false) {
  const fill = product.hex;
  const detail = product.ink;
  let artwork = '';
  if (!back) {
    if (product.motif === 'scorpio') artwork = `<g fill="none" stroke="${detail}" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="177" cy="143" r="2" fill="${detail}"/><path d="M177 145c-13 9-14 26-4 31 9 5 17-5 19-16 3 12 13 19 20 13 8-7 1-19-9-24l8-8 9 3 2-8-10-4-10 10M210 132l8-10 8 8m-7-8 13-1"/><circle cx="173" cy="163" r="1" fill="${detail}"/><circle cx="205" cy="164" r="1" fill="${detail}"/></g>`;
    else if (product.motif === 'rose') artwork = `<g fill="none" stroke="${detail}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M194 150c-12-10-4-20 4-14 8-11 18 0 9 8 13 3 8 16-3 12 3 12-10 15-13 5-10 7-18-4-8-11-9-9 1-17 11-8Z"/><path d="M194 161c-1 14-7 22-15 28m17-18c8 2 14 8 18 15m-30-10-9-2 4 8m36-8 9-4-2 9"/><circle cx="195" cy="150" r="3"/></g>`;
    else if (product.motif === 'seal') artwork = `<g fill="none" stroke="${detail}" stroke-width="1.4"><circle cx="195" cy="151" r="27"/><circle cx="195" cy="151" r="22"/><path d="m195 132 5 13 13 6-13 5-5 14-5-14-13-5 13-6 5-13Z"/><path d="M181 175 195 191l14-16"/></g>`;
    else if (product.motif === 'floral') artwork = `<g fill="none" stroke="${detail}" stroke-width="1.5" stroke-linecap="round"><path d="M195 150c-5-16-18-13-12-2-14-5-16 8-3 10-10 11 2 19 11 8 5 13 18 8 11-4 13 2 15-11 1-12 8-12-4-20-10-4Z"/><path d="M195 153v39m0-16c-9-7-17-5-20-1m20 9c8-8 15-8 20-5"/></g>`;
    else if (product.motif === 'stars') artwork = `<g fill="${detail}"><circle cx="176" cy="143" r="2.4"/><circle cx="193" cy="154" r="2.1"/><circle cx="212" cy="140" r="2.6"/><circle cx="222" cy="162" r="1.7"/></g><path d="M176 143l17 11 19-14 10 22" fill="none" stroke="${detail}" stroke-width="1" opacity=".8"/>`;
    else if (product.motif === 'tail') artwork = `<path d="M177 167c-3-17 2-30 15-31 13-1 16 15 7 19-8 4-16-3-10-9 5-6 15-3 18 5m0-14 8-9 7 8m-6-8 12-2" fill="none" stroke="${detail}" stroke-width="2" stroke-linecap="round"/><text x="184" y="188" font-family="Georgia" font-size="7" letter-spacing="1.5" fill="${detail}">STAY, SOFTLY</text>`;
    else if (product.motif === 'crescent'||product.motif==='moon') artwork = `<path d="M181 138a15 15 0 1 0 20 21 13 13 0 0 1-20-21Z" fill="none" stroke="${detail}" stroke-width="1.5"/><circle cx="208" cy="140" r="1.5" fill="${detail}"/><circle cx="216" cy="154" r="1" fill="${detail}"/><text x="179" y="178" font-family="Georgia" font-size="6" letter-spacing="1">${product.design}</text>`;
    else if(product.motif==='type') artwork=`<text x="173" y="147" font-family="Georgia" font-size="8" letter-spacing="1.2" fill="${detail}">TENDER</text><text x="173" y="160" font-family="Georgia" font-style="italic" font-size="10" fill="${detail}">Ruin.</text>`;
    else if(product.motif==='sleeve') artwork=`<text transform="translate(295 175) rotate(90)" font-family="Georgia" font-size="6" letter-spacing="1.4" fill="${detail}">BETWEEN US</text>`;
    else if(product.motif==='sunset') artwork=`<path d="M176 154a18 18 0 0 1 36 0M172 158h44m-37 5h30m-24 5h18" fill="none" stroke="${detail}" stroke-width="1.4"/><circle cx="194" cy="153" r="17" fill="none" stroke="${detail}" stroke-width=".8"/>`;
    else if(product.motif==='constellation') artwork=`<g fill="none" stroke="${detail}" stroke-width="1"><path d="M183 144l16-9 10 18 19-7-4 21-23 4-18-14Z"/><circle cx="183" cy="144" r="2" fill="${detail}"/><circle cx="199" cy="135" r="2" fill="${detail}"/><circle cx="209" cy="153" r="2" fill="${detail}"/><circle cx="228" cy="146" r="2" fill="${detail}"/><circle cx="224" cy="167" r="2" fill="${detail}"/><circle cx="201" cy="171" r="2" fill="${detail}"/></g>`;
    else artwork=`<text x="180" y="154" font-family="Georgia" font-size="8" letter-spacing="1.5" fill="${detail}">V·V</text><path d="M188 163h13" stroke="${detail}" stroke-width="1"/>`;
  } else {
    if(product.view==='stars'||product.view==='veil') artwork=`<g fill="none" stroke="${detail}" stroke-width="1.5"><path d="M146 173l28-28 25 21 27-35 25 25"/><circle cx="146" cy="173" r="2" fill="${detail}"/><circle cx="174" cy="145" r="2" fill="${detail}"/><circle cx="199" cy="166" r="2" fill="${detail}"/><circle cx="226" cy="131" r="2" fill="${detail}"/><circle cx="251" cy="156" r="2" fill="${detail}"/></g><text x="165" y="202" font-family="Georgia" font-size="7" letter-spacing="2" fill="${detail}">SCORPIO · 01</text>`;
    else artwork=`<text x="169" y="162" font-family="Georgia" font-size="8" letter-spacing="2" fill="${detail}">${product.design}</text><path d="M177 174h34" stroke="${detail}" stroke-width="1"/>`;
  }
  const body = `<path d="M127 53 89 69 55 130l38 20 17-25v169q0 11 12 11h151q12 0 12-11V125l17 25 38-20-34-61-38-16q-11 27-57 27t-57-27Z" fill="${fill}" stroke="#B7B1A6" stroke-opacity=".45" stroke-width="1.5"/><path d="M112 124v162m174-162v162M129 302q66 8 132 0" fill="none" stroke="#B7B1A6" stroke-opacity=".25" stroke-width="2"/>`;
  const hood = product.type === 'Hoodie' ? `<path d="M157 61q-8-43 33-50 41 7 33 50l-12 13q-21 11-42 0Z" fill="#151315" stroke="#B7B1A6" stroke-opacity=".45" stroke-width="1.5"/><path d="M177 70v38m26-38v38" stroke="#B7B1A6" stroke-opacity=".55" stroke-width="1.4"/>` : `<path d="M165 58q18 24 48 0" fill="none" stroke="#B7B1A6" stroke-opacity=".5" stroke-width="2"/>`;
  return `<svg viewBox="0 0 380 330" role="img" aria-label="Maquette graphique du ${product.type} ${product.name}, ${back?'vue arrière':'vue avant'}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="shade-${product.id}-${back?'b':'f'}" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#fff" stop-opacity=".12"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".1"/></linearGradient></defs><ellipse cx="190" cy="311" rx="125" ry="9" fill="#000" opacity=".6"/>${body}${hood}<path d="M127 53 89 69 55 130l38 20 17-25v169q0 11 12 11h151q12 0 12-11V125l17 25 38-20-34-61-38-16q-11 27-57 27t-57-27Z" fill="url(#shade-${product.id}-${back?'b':'f'})"/>${artwork}</svg>`;
}

function conceptVisual(product, extraClass = '') {
  const rose = ['rose','floral'].includes(product.motif);
  const source = rose ? 'assets/stock/redoute-rose.jpg' : 'assets/stock/gothic-interior.jpg';
  const visualClass = rose ? 'concept-rose' : 'concept-architecture';
  return `<figure class="concept-visual ${visualClass} ${extraClass}"><img src="${source}" alt="Image d'inspiration pour le concept ${product.name}" loading="lazy"><figcaption>IMAGE D'INSPIRATION · PAS UNE PHOTO PRODUIT</figcaption></figure>`;
}

function renderProducts(filter = 'all') {
  const visible=filter==='launch'?PRODUCTS.filter(p=>p.launch):filter==='upcoming'?PRODUCTS.filter(p=>!p.launch):PRODUCTS;
  document.querySelector('#product-grid').innerHTML=visible.map((p,index)=>`<article class="product-card ${p.launch?'':'is-upcoming'}" style="animation-delay:${Math.min(index*35,180)}ms"><div class="product-image-wrap" data-product="${p.id}" role="button" tabindex="0" aria-label="Voir le concept ${p.name}"><span class="product-tag">${p.launch?'Drop 01':'Chapitre à venir'} · ${p.type}</span><div class="product-image">${conceptVisual(p)}</div><button class="quick-view" type="button" data-view="${p.id}" aria-label="Voir ${p.name}">↗</button></div><div class="product-info"><div><h3 class="product-name">${p.name}</h3><p class="product-category">${p.color} · coupe oversize unisexe</p></div><span class="product-price">${p.price} €</span><button class="product-quick-add" type="button" ${p.launch?`data-add="${p.id}"`:'disabled'}>${p.launch?'Choisir une taille':'Concept à venir'} <span>${p.launch?'+':'·'}</span></button></div></article>`).join('');
}

function openProduct(id) {
  activeProduct = PRODUCTS.find(p => p.id === id);
  selectedSize = 'M';
  const p = activeProduct;
  document.querySelector('#modal-content').innerHTML=`<div class="modal-product"><div class="modal-product-art">${conceptVisual(p,'concept-modal')}</div><div class="modal-product-copy"><p class="eyebrow">${p.type.toUpperCase()} · ${p.family.toUpperCase()}</p><h2 id="modal-title">${p.name}</h2><p>${p.description}</p><div class="modal-product-price">${p.price} €</div>${p.launch?`<label>Choisir une taille</label><div class="size-options">${SIZES.map(s=>`<button type="button" class="${s===selectedSize?'selected':''}" data-size="${s}" aria-pressed="${s===selectedSize}">${s}</button>`).join('')}</div><button class="button modal-add" type="button" data-modal-add>Ajouter au panier <span>+</span></button>`:'<p class="product-detail-note">Concept de collection à venir. Pas disponible à la vente.</p>'}<p class="product-detail-note">Image de référence uniquement. Photos produit à créer après validation des prototypes.</p></div></div>`;
  document.querySelector('#product-modal').hidden = false;
  document.body.classList.add('modal-open');
}

function addToCart(id, size) {
  const product = PRODUCTS.find(p=>p.id===id);
  if(!product||!product.launch)return;
  const key = `${id}-${size}`;
  const existing = cart.find(item=>item.key===key);
  if(existing) existing.qty += 1;
  else cart.push({key,id,size,qty:1});
  saveCart();
  renderCart();
  showToast(`${product.name} · taille ${size} ajouté`);
}

function getTotals() {
  const qty = cart.reduce((sum,item)=>sum+item.qty,0);
  const total=cart.reduce((sum,item)=>sum+(PRODUCTS.find(product=>product.id===item.id)?.price||0)*item.qty,0);
  return {qty,total};
}

function renderCart() {
  const {qty,total}=getTotals();
  document.querySelector('#cart-count').textContent=qty;
  document.querySelector('#drawer-count').textContent=`(${qty})`;
  document.querySelector('#cart-subtotal').textContent=`${total} €`;
  const lines=document.querySelector('#cart-lines');
  lines.innerHTML=cart.length?cart.map(item=>{const p=PRODUCTS.find(product=>product.id===item.id);return `<article class="cart-line"><div class="cart-thumb">${p.name.slice(0,1)}</div><div><h3 class="cart-item-title">${p.name}</h3><p class="cart-item-meta">${p.type} · Taille ${item.size} · Qté ${item.qty}</p><button class="cart-item-remove" type="button" data-remove="${item.key}">Retirer</button></div><span class="cart-item-price">${p.price*item.qty} €</span></article>`}).join(''):'<p class="cart-empty">Votre sélection commence ici.</p>';
  if(qty<2){
    const suggested=PRODUCTS.find(product=>product.launch&&!cart.some(item=>item.id===product.id));
    if(suggested)lines.innerHTML+=`<article class="cart-suggestion"><p class="eyebrow">À DÉCOUVRIR</p><p><strong>${suggested.name}</strong> · ${suggested.price} €</p><button type="button" data-add="${suggested.id}">Découvrir cette pièce <span>↗</span></button></article>`;
  }
  document.querySelector('.cart-promo').hidden=true;
}

function openCart(){document.querySelector('#cart-backdrop').hidden=false;document.querySelector('#cart-drawer').classList.add('is-open');document.querySelector('#cart-drawer').setAttribute('aria-hidden','false');document.body.style.overflow='hidden';}
function closeCart(){document.querySelector('#cart-drawer').classList.remove('is-open');document.querySelector('#cart-drawer').setAttribute('aria-hidden','true');document.querySelector('#cart-backdrop').hidden=true;document.body.style.overflow='';}
function showToast(message){const toast=document.querySelector('#toast');toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>toast.classList.remove('show'),2100);}

document.addEventListener('click',event=>{
  const filter=event.target.closest('[data-filter]');if(filter){document.querySelectorAll('.filter-button').forEach(button=>button.classList.toggle('is-active',button===filter));renderProducts(filter.dataset.filter);return;}
  const add=event.target.closest('[data-add]');if(add){openProduct(add.dataset.add);return;}
  const view=event.target.closest('[data-view]');if(view){openProduct(view.dataset.view);return;}
  const card=event.target.closest('.product-image-wrap');if(card){openProduct(card.dataset.product);return;}
  const size=event.target.closest('[data-size]');if(size){selectedSize=size.dataset.size;document.querySelectorAll('[data-size]').forEach(button=>{const active=button===size;button.classList.toggle('selected',active);button.setAttribute('aria-pressed',String(active));});return;}
  if(event.target.closest('[data-modal-add]')&&activeProduct){addToCart(activeProduct.id,selectedSize);document.querySelector('#product-modal').hidden=true;document.body.classList.remove('modal-open');return;}
  const remove=event.target.closest('[data-remove]');if(remove){cart=cart.filter(item=>item.key!==remove.dataset.remove);saveCart();renderCart();return;}
  if(event.target.closest('.cart-trigger')){openCart();return;}
  if(event.target.closest('#close-cart')||event.target.closest('#cart-backdrop')){closeCart();return;}
  if(event.target.closest('[data-close-modal]')){document.querySelector('#product-modal').hidden=true;document.body.classList.remove('modal-open');}
});

document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeCart();document.querySelector('#product-modal').hidden=true;document.body.classList.remove('modal-open');}if((event.key==='Enter'||event.key===' ')&&event.target.matches('.product-image-wrap'))openProduct(event.target.dataset.product);});
document.querySelector('#newsletter-form').addEventListener('submit',event=>{event.preventDefault();document.querySelector('#newsletter-message').textContent='Formulaire prêt : connecter un outil d’e-mailing avant de recueillir des adresses.';showToast('Inscription non activée : service e-mail à connecter.');});

renderProducts();
renderCart();