'use strict';

// Photos attendues dans assets/products/ : <id>-1.jpg, <id>-2.jpg ... et hero.jpg. Sans photo, un visuel de repli s'affiche.
const PRODUCTS = [
  { id: 'nef', name: 'Nef', color: 'Noir', hex: '#161618', ink: '#f4f1ea', price: 69, print: 'chest', badge: 'Best-seller', desc: 'Le classique noir, logo sérigraphié sur la poitrine.', imgs: 2, sp: 'Logo poitrine, 1 couleur' },
  { id: 'vitrail', name: 'Vitrail', color: 'Bordeaux', hex: '#5a1424', ink: '#f4f1ea', price: 79, print: 'big', badge: 'Nouveau', desc: 'Bordeaux profond, grand texte sérigraphié sur le devant.', imgs: 2, sp: 'Grand texte devant, 1 couleur' },
  { id: 'pierre', name: 'Pierre', color: 'Gris', hex: '#6b6c70', ink: '#141414', price: 69, print: 'arch', badge: '', desc: 'Gris chiné, petit motif d\'arche imprimé au centre.', imgs: 2, sp: 'Motif arche, 1 couleur' },
  { id: 'clocher', name: 'Clocher', color: 'Écru', hex: '#d9d2c1', ink: '#141414', price: 79, print: 'chest', badge: '', desc: 'Écru clair, logo noir sur la poitrine.', imgs: 2, sp: 'Logo poitrine, 1 couleur' },
];
const SIZES = { S: [56, 68, 62], M: [59, 70, 63], L: [62, 72, 64], XL: [65, 74, 65] };
const FREE_FROM = 100, SHIPPING = 6.9;

const $ = (s, r = document) => r.querySelector(s);
const eur = (n) => n.toLocaleString('fr-FR', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }) + ' €';
const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const byId = (id) => PRODUCTS.find((p) => p.id === id);

/* Visuel de repli : sweat à plat avec impression simple */
function hoodie(p) {
  let art = '';
  const f = p.ink;
  if (p.print === 'chest') art = `<text x="190" y="190" text-anchor="middle" font-family="Georgia,serif" font-size="15" font-weight="700" letter-spacing="4" fill="${f}">CATHEDRA</text>`;
  if (p.print === 'big') art = `<text x="190" y="205" text-anchor="middle" font-family="Georgia,serif" font-size="30" font-weight="700" letter-spacing="3" fill="${f}">CATHE</text><text x="190" y="238" text-anchor="middle" font-family="Georgia,serif" font-size="30" font-weight="700" letter-spacing="3" fill="${f}">DRA</text>`;
  if (p.print === 'arch') art = `<path d="M172 235V195a18 18 0 0 1 36 0v40zM190 177v58M172 205h36" fill="none" stroke="${f}" stroke-width="2.5"/>`;
  return `<svg viewBox="0 0 380 400" role="img" aria-label="${p.name}">
    <path d="M140 40Q190 5 240 40L262 92Q190 122 118 92Z" fill="${p.hex}" stroke="#000" stroke-opacity=".25"/>
    <path d="M118 92Q190 122 262 92L322 118L366 300L316 316L296 214L292 372H88L84 214L64 316L14 300L58 118Z" fill="${p.hex}" stroke="#000" stroke-opacity=".25"/>
    <path d="M158 56Q190 36 222 56Q214 96 190 100Q166 96 158 56Z" fill="#000" fill-opacity=".55"/>
    <path d="M176 100L172 160M204 100L208 160" stroke="${p.ink}" stroke-opacity=".7" stroke-width="2" fill="none"/>
    <path d="M122 288H258L274 342H106Z" fill="none" stroke="#000" stroke-opacity=".3" stroke-dasharray="4 4"/>
    <path d="M88 350H292V372H88Z M14 300L64 316L58 336L8 320Z M366 300L316 316L322 336L372 320Z" fill="#000" fill-opacity=".22"/>
    ${art}</svg>`;
}
const fallback = (p) => `<div class="fb">${hoodie(p)}</div>`;
const illustrations = { nef: 'imprime.jpg', vitrail: 'illustration-bleu.jpg', pierre: 'nef-1.jpg', clocher: 'illustration-blanc.jpg' };
const imgSrc = (p) => p.image || `assets/products/${illustrations[p.id] || 'imprime.jpg'}`;
const photo = (p, i, cls = '') => `<img class="${cls}" src="${imgSrc(p)}" alt="${p.image ? p.name : 'Photo d’illustration d’un sweat à capuche'}" loading="lazy" data-id="${p.id}">`;

// Une photo manquante est remplacée par le visuel de repli (ou retirée si c'est une miniature).
document.addEventListener('error', (e) => {
  const img = e.target;
  if (!(img instanceof HTMLImageElement)) return;
  if (img.dataset.hero !== undefined) { img.parentElement.innerHTML = '<div class="fb">' + hoodie(PRODUCTS[0]) + '</div>'; return; }
  const p = byId(img.dataset.id);
  if (!p) return;
  const thumb = img.closest('.thumbs button');
  if (thumb) { thumb.remove(); return; }
  img.replaceWith(Object.assign(document.createElement('div'), { className: 'fb', innerHTML: hoodie(p) }));
}, true);

/* Panier */
let cart = [];
try { cart = JSON.parse(localStorage.getItem('cathedra-cart') || '[]').filter((i) => byId(i.id) && SIZES[i.size] && i.qty > 0); } catch (e) { cart = []; }
const subtotal = () => cart.reduce((s, i) => s + i.qty * byId(i.id).price, 0);
const saveCart = () => { try { localStorage.setItem('cathedra-cart', JSON.stringify(cart)); } catch (e) { /* stockage indisponible */ } renderCart(); };

function renderCart() {
  $('#cartCount').textContent = cart.reduce((n, i) => n + i.qty, 0);
  $('#cartList').innerHTML = cart.length
    ? cart.map((i, k) => {
        const p = byId(i.id);
        return `<li class="cart-item"><div class="cart-thumb">${photo(p, 1)}</div>
          <div><h3>${p.name}</h3><small>${p.color} · Taille ${i.size}</small>
          <div class="qty"><button type="button" data-q="-1" data-k="${k}" aria-label="Retirer un">−</button><span>${i.qty}</span><button type="button" data-q="1" data-k="${k}" aria-label="Ajouter un">+</button></div></div>
          <strong>${eur(p.price * i.qty)}</strong></li>`;
      }).join('')
    : '<li class="cart-empty">Votre panier est vide.</li>';
  const sub = subtotal(), ship = !cart.length || sub >= FREE_FROM ? 0 : SHIPPING;
  $('#sumSub').textContent = eur(sub);
  $('#sumShip').textContent = cart.length ? (ship ? eur(ship) : 'Offerte') : '—';
  $('#sumTotal').textContent = eur(sub + ship);
  $('#shipBar').style.width = Math.min(100, (sub / FREE_FROM) * 100) + '%';
  $('#shipText').textContent = sub >= FREE_FROM ? 'Livraison offerte.' : `Plus que ${eur(FREE_FROM - sub)} pour la livraison offerte.`;
  $('#checkout').disabled = !cart.length;
}
$('#cartList').addEventListener('click', (e) => {
  const b = e.target.closest('[data-q]');
  if (!b) return;
  const it = cart[+b.dataset.k];
  it.qty += +b.dataset.q;
  if (it.qty <= 0) cart.splice(+b.dataset.k, 1);
  saveCart();
});

/* Tiroir et menu */
const drawer = $('#drawer'), overlay = $('#overlay'), nav = $('#mainNav');
function setDrawer(on) {
  drawer.classList.toggle('on', on); overlay.classList.toggle('on', on);
  drawer.setAttribute('aria-hidden', String(!on));
  document.body.classList.toggle('lock', on);
  if (on) $('#cartClose').focus();
}
function setMenu(on) {
  nav.classList.toggle('is-open', on);
  $('#menuToggle').setAttribute('aria-expanded', String(on));
  document.body.classList.toggle('lock', on);
}
$('#cartOpen').onclick = () => setDrawer(true);
$('#cartClose').onclick = overlay.onclick = () => setDrawer(false);
$('#menuToggle').onclick = () => setMenu(true);
$('#navClose').onclick = () => setMenu(false);
nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { setDrawer(false); setMenu(false); } });

/* Collection */
let filter = 'all', sort = 'def';
function renderGrid() {
  let list = PRODUCTS.filter((p) => filter === 'all' || p.color === filter);
  if (sort === 'asc') list = [...list].sort((a, b) => a.price - b.price);
  if (sort === 'desc') list = [...list].sort((a, b) => b.price - a.price);
  $('#grid').innerHTML = list.length ? list.map((p) => `
    <button class="product-card" type="button" data-open="${p.id}">
      <span class="product-media">${photo(p, 1)}${p.image ? '' : '<span class="badge">Illustration</span>'}</span>
      <span class="product-info"><span><h3>${p.name}</h3><small>${p.color}</small></span><span class="price">${eur(p.price)}</span></span>
    </button>`).join('') : '<p class="empty">Aucun modèle dans cette couleur.</p>';
}
$('#chips').addEventListener('click', (e) => {
  const c = e.target.closest('.chip');
  if (!c) return;
  filter = c.dataset.f;
  document.querySelectorAll('.chip').forEach((x) => x.setAttribute('aria-pressed', String(x === c)));
  renderGrid();
});
$('#sort').onchange = (e) => { sort = e.target.value; renderGrid(); };

/* Fiche produit */
const pDialog = $('#productDialog');
function openProduct(id) {
  const p = byId(id);
  let size = null, idx = 1;
  const body = $('#productBody');
  const draw = () => {
    body.innerHTML = `
      <div>
        <div class="gallery-main">${photo(p, idx)}</div>
        ${p.image ? '' : '<p class="photo-notice">Photo d’illustration, différente du modèle présenté.</p>'}
      </div>
      <div class="dialog-info">
        <h2 id="pdName">${p.name}</h2><span class="price">${eur(p.price)}</span>
        <p>${p.desc}</p>
        <span class="label">Couleur : ${p.color}</span>
        <span class="label">Taille</span>
        <div class="sizes">${Object.keys(SIZES).map((s) => `<button class="size" type="button" data-s="${s}" aria-pressed="${s === size}">${s}</button>`).join('')}</div>
        <span class="label">Mesures à plat (cm)</span>
        <table class="table"><thead><tr><th>Taille</th><th>Largeur</th><th>Longueur</th><th>Manche</th></tr></thead>
        <tbody>${Object.entries(SIZES).map(([s, m]) => `<tr class="${s === size ? 'hl' : ''}"><td>${s}</td><td>${m[0]}</td><td>${m[1]}</td><td>${m[2]}</td></tr>`).join('')}</tbody></table>
        <span class="label">Détails</span>
        <dl class="specs">
          <div><dt>Matière</dt><dd>Coton, molleton 400 g/m²</dd></div>
          <div><dt>Impression</dt><dd>${p.sp}</dd></div>
          <div><dt>Coupe</dt><dd>Droite</dd></div>
        </dl>
        <button class="button full" type="button" id="addBtn" ${size ? '' : 'disabled'}>${size ? 'Ajouter au panier' : 'Choisissez une taille'}</button>
      </div>`;
  };
  draw();
  body.onclick = (e) => {
    const th = e.target.closest('.thumbs button');
    if (th) { idx = +th.dataset.i; draw(); return; }
    const sz = e.target.closest('.size');
    if (sz) { size = sz.dataset.s; draw(); return; }
    if (e.target.closest('#addBtn') && size) {
      const it = cart.find((i) => i.id === id && i.size === size);
      it ? it.qty++ : cart.push({ id, size, qty: 1 });
      saveCart();
      pDialog.close();
      const c = $('#cartCount'); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
      toast(`${p.name} (${size}) ajouté au panier`);
    }
  };
  pDialog.showModal();
}
$('#grid').addEventListener('click', (e) => { const b = e.target.closest('[data-open]'); if (b) openProduct(b.dataset.open); });

const coDialog = $('#checkoutDialog');
[pDialog, coDialog].forEach((d) => {
  d.addEventListener('click', (e) => { if (e.target === d || e.target.closest('[data-close]')) d.close(); });
  d.addEventListener('close', () => document.body.classList.remove('lock'));
  new MutationObserver(() => d.open && document.body.classList.add('lock')).observe(d, { attributes: true, attributeFilter: ['open'] });
});

/* Commande (démo) */
$('#checkout').onclick = () => {
  if (!cart.length) return;
  const sub = subtotal(), ship = sub >= FREE_FROM ? 0 : SHIPPING;
  setDrawer(false);
  $('#checkoutBody').innerHTML = `
    <h2 id="coTitle">Commande</h2>
    <p>${cart.reduce((n, i) => n + i.qty, 0)} article(s) · total <strong>${eur(sub + ship)}</strong></p>
    <form id="coForm">
      <label class="field">Nom complet<input name="nom" required autocomplete="name"></label>
      <label class="field">E-mail<input name="email" type="email" required autocomplete="email"></label>
      <label class="field">Adresse<input name="adr" required autocomplete="street-address"></label>
      <div class="field-row"><label class="field">Code postal<input name="cp" required inputmode="numeric" pattern="[0-9]{5}" autocomplete="postal-code"></label>
      <label class="field">Ville<input name="ville" required autocomplete="address-level2"></label></div>
      <button class="button full" type="submit">Valider la commande</button>
      <p class="note">Mode démonstration : aucun paiement n'est demandé.</p>
    </form>`;
  coDialog.showModal();
  $('#coForm').onsubmit = (e) => {
    e.preventDefault();
    const nom = new FormData(e.target).get('nom');
    const ref = 'CTH-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    cart = []; saveCart();
    $('#checkoutBody').innerHTML = '<div class="confirm"><div class="mark">✓</div><h2 id="coTitle">Merci</h2><p class="who"></p><code></code><p class="note">Commande de démonstration.</p><button class="button" type="button" data-close>Fermer</button></div>';
    $('.who', coDialog).textContent = `${nom}, ceci est une simulation : aucune commande n'a été enregistrée.`;
    $('code', coDialog).textContent = ref;
  };
};

$('#newsForm').onsubmit = (e) => {
  e.preventDefault();
  const ok = e.target.checkValidity();
  $('#newsMsg').textContent = ok ? 'Inscription indisponible sur cette démonstration.' : 'Adresse e-mail invalide.';
  if (ok) e.target.reset();
};

let tt;
function toast(m) {
  const t = $('#toast');
  t.textContent = m; t.classList.add('on');
  clearTimeout(tt); tt = setTimeout(() => t.classList.remove('on'), 2400);
}

renderGrid();
renderCart();

import('./firebase-client.js').then(({ db, collection, doc, onSnapshot }) => {
  if (!db) return;
  onSnapshot(doc(db, 'site', 'settings'), (entry) => {
    const data = entry.data();
    if (!data) return;
    if (typeof data.headline === 'string') $('.hero-statement').textContent = data.headline;
    if (typeof data.intro === 'string') $('.hero .lead').textContent = data.intro;
  });
  onSnapshot(collection(db, 'products'), (snapshot) => {
    const products = snapshot.docs.map((entry) => {
      const data = entry.data();
      if (!/^[a-zA-Z0-9_-]+$/.test(entry.id) || typeof data.name !== 'string' || typeof data.desc !== 'string' || !Number.isFinite(data.price) || data.price <= 0) return null;
      let image = '';
      try {
        const url = new URL(data.image);
        if (url.protocol === 'https:' && url.hostname === 'firebasestorage.googleapis.com') image = escapeHTML(url.href);
      } catch (error) { /* Une image invalide utilise le visuel de démonstration. */ }
      return { id: entry.id, name: escapeHTML(data.name), desc: escapeHTML(data.desc), color: ['Noir', 'Bordeaux', 'Gris', 'Écru'].includes(data.color) ? data.color : 'Noir', price: data.price, image, hex: '#161618', ink: '#f4f1ea', print: 'chest', sp: 'Impression classique' };
    }).filter(Boolean);
    PRODUCTS.splice(0, PRODUCTS.length, ...products);
    $('.photo-notice').hidden = products.length > 0 && products.every((product) => product.image);
    cart = cart.filter((item) => byId(item.id));
    renderGrid();
    renderCart();
  }, () => toast('Catalogue Firebase indisponible.'));
}).catch(() => {});
