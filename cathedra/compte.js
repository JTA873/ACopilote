import { configured, auth, db, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, doc, setDoc, serverTimestamp } from './firebase-client.js';

const find = (selector) => document.querySelector(selector);
const form = find('#accountForm');
const status = (message) => { find('#status').textContent = message; };

if (!configured) {
  status('Les comptes clients ne sont pas encore configurés.');
} else {
  onAuthStateChanged(auth, (user) => {
    form.hidden = !!user;
    find('#connected').hidden = !user;
    find('#accountEmail').textContent = user ? user.email : '';
    status(user ? 'Vous êtes connecté.' : 'Connectez-vous ou créez votre compte.');
  });
}
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  try { await signInWithEmailAndPassword(auth, form.elements.email.value, form.elements.password.value); form.reset(); }
  catch (error) { status('Connexion impossible. Vérifiez vos identifiants.'); }
});
find('#register').addEventListener('click', async () => {
  if (!form.reportValidity()) return;
  try {
    const result = await createUserWithEmailAndPassword(auth, form.elements.email.value, form.elements.password.value);
    try { await setDoc(doc(db, 'customers', result.user.uid), { email: result.user.email, createdAt: serverTimestamp() }); }
    catch (error) { status('Compte créé, mais profil client non enregistré.'); return; }
    form.reset();
    status('Compte créé.');
  } catch (error) { status('Création impossible. Vérifiez l’adresse, le mot de passe et la configuration Firebase.'); }
});
find('#logout').addEventListener('click', () => signOut(auth));