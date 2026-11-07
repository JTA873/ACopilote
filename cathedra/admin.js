import { configured, auth, db, storage, onAuthStateChanged, signInWithEmailAndPassword, signOut, collection, doc, getDoc, setDoc, addDoc, deleteDoc, onSnapshot, serverTimestamp, ref, uploadBytes, getDownloadURL } from './firebase-client.js';

const find = (selector) => document.querySelector(selector);
const status = (message) => { find('#status').textContent = message; };
const login = find('#login');
const dashboard = find('#dashboard');
const form = find('#productForm');
let subscriptions = [];

function item(container, text, buttons = []) {
  const row = document.createElement('div');
  row.className = 'item-row';
  const label = document.createElement('span');
  label.textContent = text;
  row.append(label);
  buttons.forEach(([title, action]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = title;
    button.addEventListener('click', action);
    row.append(button);
  });
  container.append(row);
}

function resetProduct() {
  form.reset();
  form.elements.id.value = '';
  form.elements.image.value = '';
  find('#productTitle').textContent = 'Nouveau produit';
}

function listen(path, callback) {
  subscriptions.push(onSnapshot(collection(db, path), callback, () => status('Impossible de charger les données. Vérifie les règles Firebase.')));
}

function startDashboard() {
  subscriptions.push(onSnapshot(doc(db, 'site', 'settings'), (entry) => {
    const data = entry.data() || {};
    find('#siteForm').elements.headline.value = data.headline || "L'amour en clair-obscur.";
    find('#siteForm').elements.intro.value = data.intro || 'Des sweats imprimés inspirés des passions indociles, des pierres anciennes et des nuits sans fin.';
  }, () => status('Impossible de charger les textes du site.')));
  listen('products', (snapshot) => {
    const list = find('#productList');
    list.replaceChildren();
    if (snapshot.empty) item(list, 'Aucun produit pour le moment.');
    snapshot.forEach((entry) => {
      const data = entry.data();
      item(list, `${data.name} · ${data.price} € · ${data.color}`, [
        ['Modifier', () => {
          form.elements.id.value = entry.id;
          form.elements.name.value = data.name || '';
          form.elements.desc.value = data.desc || '';
          form.elements.color.value = data.color || 'Noir';
          form.elements.price.value = data.price || '';
          form.elements.image.value = data.image || '';
          form.elements.photo.value = '';
          find('#productTitle').textContent = 'Modifier le produit';
          form.scrollIntoView({ behavior: 'smooth' });
        }],
        ['Supprimer', async () => {
          if (!confirm('Supprimer ce produit ?')) return;
          try { await deleteDoc(doc(db, 'products', entry.id)); status('Produit supprimé.'); } catch (error) { status('Suppression impossible.'); }
        }]
      ]);
    });
  });
  listen('drafts', (snapshot) => {
    const list = find('#draftList');
    list.replaceChildren();
    if (snapshot.empty) item(list, 'Aucun brouillon.');
    snapshot.forEach((entry) => item(list, `${entry.data().channel}\n${entry.data().text}`, [['Supprimer', async () => {
      if (!confirm('Supprimer ce brouillon ?')) return;
      try { await deleteDoc(doc(db, 'drafts', entry.id)); } catch (error) { status('Suppression impossible.'); }
    }]]));
  });
  listen('customers', (snapshot) => {
    const list = find('#customerList');
    list.replaceChildren();
    if (snapshot.empty) item(list, 'Aucun profil client.');
    snapshot.forEach((entry) => item(list, entry.data().email || entry.id));
  });
}

if (!configured) {
  status('Firebase n’est pas encore configuré. Renseigne la configuration Web dans firebase-config.js.');
} else {
  onAuthStateChanged(auth, async (user) => {
    subscriptions.forEach((unsubscribe) => unsubscribe());
    subscriptions = [];
    dashboard.hidden = true;
    login.hidden = !!user;
    find('#logout').hidden = !user;
    if (!user) { status('Connecte-toi avec ton compte administrateur.'); return; }
    try {
      const role = await getDoc(doc(db, 'admins', user.uid));
      if (!role.exists()) { status('Ce compte ne possède pas les droits administrateur.'); return; }
      status(`Connecté : ${user.email}`);
      dashboard.hidden = false;
      startDashboard();
    } catch (error) { status('Accès administrateur impossible. Vérifie les règles Firebase.'); }
  });
}
login.addEventListener('submit', async (event) => {
  event.preventDefault();
  try { await signInWithEmailAndPassword(auth, login.elements.email.value, login.elements.password.value); login.reset(); }
  catch (error) { status('Connexion impossible. Vérifie tes identifiants et la configuration Firebase.'); }
});
find('#logout').addEventListener('click', () => signOut(auth));
find('#productReset').addEventListener('click', resetProduct);
find('#siteForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const site = event.currentTarget;
  const headline = site.elements.headline.value.trim();
  const intro = site.elements.intro.value.trim();
  if (!headline || !intro) { status('Les deux textes sont obligatoires.'); return; }
  try { await setDoc(doc(db, 'site', 'settings'), { headline, intro }); status('Accueil enregistré.'); }
  catch (error) { status('Enregistrement impossible.'); }
});
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = form.querySelector('button[type="submit"], button:not([type])');
  button.disabled = true;
  try {
    let image = form.elements.image.value;
    const file = form.elements.photo.files[0];
    if (file) {
      if (file.size >= 5 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Choisis une image JPEG, PNG ou WebP de moins de 5 Mo.');
      const imageRef = ref(storage, `products/${crypto.randomUUID()}`);
      await uploadBytes(imageRef, file, { contentType: file.type });
      image = await getDownloadURL(imageRef);
    }
    const product = { name: form.elements.name.value.trim(), desc: form.elements.desc.value.trim(), color: form.elements.color.value, price: Number(form.elements.price.value), image };
    if (!product.name || !product.desc) throw new Error('Le nom et la description sont obligatoires.');
    if (form.elements.id.value) await setDoc(doc(db, 'products', form.elements.id.value), product);
    else await addDoc(collection(db, 'products'), product);
    resetProduct();
    status('Produit enregistré.');
  } catch (error) { status(error.message || 'Enregistrement impossible.'); }
  finally { button.disabled = false; }
});
find('#draftForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const draft = event.currentTarget;
  try {
    const text = draft.elements.text.value.trim();
    if (!text) throw new Error('Le texte est obligatoire.');
    await addDoc(collection(db, 'drafts'), { channel: draft.elements.channel.value, text, createdAt: serverTimestamp() });
    draft.reset();
    status('Brouillon enregistré.');
  } catch (error) { status(error.message || 'Enregistrement impossible.'); }
});