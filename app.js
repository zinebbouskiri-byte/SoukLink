/* SoukLink demo storefront. Replace the sample products and WhatsApp number below before launch. */
const WHATSAPP_NUMBER = "212724664082"; // Country code first, no + or spaces.
// The Supabase publishable key is intended for browser use. Database policies are the security boundary.
const SUPABASE_URL = "https://kcueoxrcdhodjenolkjj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_0GCTOA1mtZeRl-YfkJnfxA_CbnjdkTh";
const SUPABASE_ADMIN_UID = "5fa6fa95-8faf-465a-8ad7-7eea347e3026";
const SUPABASE_CONFIGURED = SUPABASE_URL.startsWith("https://") && SUPABASE_PUBLISHABLE_KEY.length > 20 && SUPABASE_ADMIN_UID.length === 36;
const supabaseClient = SUPABASE_CONFIGURED && window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY) : null;
const DEFAULT_PRODUCTS = [
  {id:1,name:"Lampe nomade Lumi",category:"Maison",price:189,oldPrice:null,emoji:"🏮",image:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85",tone:"sage",badge:"Collection maison",rating:"À découvrir",note:"Prix indicatif · disponibilité à confirmer"},
  {id:2,name:"Sac week-end Noya",category:"Accessoires",price:249,oldPrice:null,emoji:"👜",image:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85",tone:"peach",badge:"Voyage",rating:"À découvrir",note:"Prix indicatif · disponibilité à confirmer"},
  {id:3,name:"Mini enceinte Mino",category:"Tech",price:159,oldPrice:null,emoji:"🔊",image:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85",tone:"blue",badge:"Audio",rating:"À découvrir",note:"Prix indicatif · disponibilité à confirmer"},
  {id:4,name:"Organiseur Modu",category:"Maison",price:119,oldPrice:null,emoji:"🧺",image:"https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=900&q=85",tone:"sand",badge:"Rangement",rating:"À découvrir",note:"Prix indicatif · disponibilité à confirmer"},
  {id:5,name:"Pochette Tiss",category:"Accessoires",price:99,oldPrice:null,emoji:"👝",image:"https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85",tone:"lilac",badge:"Accessoires",rating:"À découvrir",note:"Prix indicatif · disponibilité à confirmer"},
  {id:6,name:"Support téléphone Flex",category:"Tech",price:79,oldPrice:null,emoji:"📱",image:"https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=900&q=85",tone:"cream",badge:"Essentiels",rating:"À découvrir",note:"Prix indicatif · disponibilité à confirmer"}
];
let products = supabaseClient ? [] : (JSON.parse(localStorage.getItem("souklink-products") || "null") || DEFAULT_PRODUCTS);
let adminAuthenticated = false;
function saveProducts(){renderProducts();renderAdmin();}
function escapeHTML(value){return String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));}
const money = n => `${Number(n).toLocaleString("fr-MA")} MAD`;
let cart = JSON.parse(localStorage.getItem("souklink-cart") || "[]");
let category = "Tous";
let query = "";
const grid = document.getElementById("product-grid");
const toast = document.getElementById("toast");
function renderProducts(){
  const visible = products.filter(p => (category === "Tous" || p.category === category) && p.name.toLocaleLowerCase("fr").includes(query.toLocaleLowerCase("fr")));
  grid.innerHTML = visible.length ? visible.map(p => `<article class="product-card"><div class="product-image" data-tone="${escapeHTML(p.tone||"sage")}"><span class="product-badge">${escapeHTML(p.badge||"Sélection")}</span><img class="product-photo" src="${escapeHTML(p.image)}" alt="${escapeHTML(p.name)}" loading="lazy"><button class="quick-add" data-add="${Number(p.id)}" aria-label="Ajouter ${escapeHTML(p.name)} au panier">＋</button></div><div class="product-meta"><span class="product-category">${escapeHTML(p.category)}</span><span class="product-rating">${escapeHTML(p.rating||"À découvrir")}</span></div><h3 class="product-title">${escapeHTML(p.name)}</h3><div class="product-price-row"><span class="product-price">${money(p.price)}</span>${p.oldPrice?`<span class="product-old-price">${money(p.oldPrice)}</span>`:""}</div><div class="price-note">${escapeHTML(p.note||"Prix indicatif · disponibilité à confirmer")}</div></article>`).join("") : `<div class="no-results">Aucun produit trouvé. <a href="#service">Demandez-nous de le rechercher →</a></div>`;
}
function saveCart(){localStorage.setItem("souklink-cart",JSON.stringify(cart));renderCart();}
function addToCart(id){const found=cart.find(x=>x.id===id);found?found.qty++:cart.push({id,qty:1});saveCart();showToast("Ajouté à votre panier");}
function renderCart(){
  const count=cart.reduce((sum,item)=>sum+item.qty,0);
  document.getElementById("cart-count").textContent=count;
  document.getElementById("drawer-count").textContent=`(${count})`;
  const items=document.getElementById("cart-items");
  if(!cart.length){items.innerHTML='<div class="empty-cart">Votre panier est encore vide.<br>La prochaine trouvaille vous attend peut-être.</div>';}
  else items.innerHTML=cart.map(item=>{const p=products.find(x=>x.id===item.id);if(!p)return "";return `<div class="cart-row"><div class="cart-thumb" style="background:var(--${p.tone==='blue'?'green':p.tone==='peach'?'orange':p.tone==='lilac'?'line':'green'});">${p.emoji}</div><div><h3>${p.name}</h3><small>${money(p.price)} / unité</small><div class="cart-qty"><button data-qty="${p.id}" data-step="-1" aria-label="Retirer une unité">−</button><span>${item.qty}</span><button data-qty="${p.id}" data-step="1" aria-label="Ajouter une unité">＋</button></div></div><button class="cart-remove" data-remove="${p.id}" aria-label="Supprimer ${p.name}">×</button></div>`}).join("");
  document.getElementById("cart-total").textContent=money(cart.reduce((sum,item)=>sum+(products.find(p=>p.id===item.id)?.price||0)*item.qty,0));
}
function showToast(message){toast.textContent=message;toast.classList.add("show");clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove("show"),2400);}
function setDrawer(open){document.getElementById("cart-drawer").classList.toggle("open",open);document.getElementById("cart-backdrop").classList.toggle("open",open);document.body.classList.toggle("drawer-open",open);document.getElementById("cart-drawer").setAttribute("aria-hidden",String(!open));}
grid.addEventListener("click",e=>{const button=e.target.closest("[data-add]");if(button)addToCart(Number(button.dataset.add));});
document.getElementById("filters").addEventListener("click",e=>{const button=e.target.closest("[data-category]");if(!button)return;category=button.dataset.category;document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b===button));renderProducts();});
document.getElementById("product-search").addEventListener("input",e=>{query=e.target.value;renderProducts();});
document.querySelector(".search-toggle").addEventListener("click",()=>{document.getElementById("product-search").focus();document.getElementById("produits").scrollIntoView({behavior:"smooth"});});
document.addEventListener("keydown",e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();document.getElementById("product-search").focus();document.getElementById("produits").scrollIntoView({behavior:"smooth"});}if(e.key==="Escape")setDrawer(false);});
document.getElementById("cart-open").addEventListener("click",()=>setDrawer(true));
document.getElementById("cart-close").addEventListener("click",()=>setDrawer(false));
document.getElementById("cart-backdrop").addEventListener("click",()=>setDrawer(false));
document.getElementById("cart-items").addEventListener("click",e=>{const q=e.target.closest("[data-qty]");const rm=e.target.closest("[data-remove]");if(q){const id=Number(q.dataset.qty),item=cart.find(x=>x.id===id);item.qty+=Number(q.dataset.step);if(item.qty<=0)cart=cart.filter(x=>x.id!==id);saveCart();}if(rm){cart=cart.filter(x=>x.id!==Number(rm.dataset.remove));saveCart();}});
document.getElementById("order-button").addEventListener("click",()=>{if(!cart.length){showToast("Votre panier est vide pour le moment");return;}const lines=cart.map(item=>{const p=products.find(x=>x.id===item.id);return `• ${p.name} × ${item.qty} — ${money(p.price*item.qty)}`;}).join("\n");const message=`Bonjour SoukLink ! Je souhaite vérifier la disponibilité de ces produits :\n${lines}\nTotal indicatif : ${money(cart.reduce((s,i)=>s+(products.find(p=>p.id===i.id)?.price||0)*i.qty,0))}\nMerci de me confirmer le prix final et la livraison.`;window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,"_blank","noopener");});
document.getElementById("request-form").addEventListener("submit",e=>{e.preventDefault();const data=new FormData(e.currentTarget);const message=`Bonjour SoukLink !\nNom : ${data.get("name")}\nContact : ${data.get("contact")}\nMa recherche : ${data.get("details")}`;window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,"_blank","noopener");document.getElementById("form-note").textContent="WhatsApp s’est ouvert avec votre demande. Envoyez le message pour nous la transmettre.";});
document.getElementById("menu-toggle").addEventListener("click",()=>document.querySelector(".desktop-nav").classList.toggle("open"));
document.querySelectorAll(".desktop-nav a").forEach(a=>a.addEventListener("click",()=>document.querySelector(".desktop-nav").classList.remove("open")));
const adminView=document.getElementById("admin-view");
function renderAdmin(){
  if(!adminView)return;
  const authPanel=document.getElementById("admin-auth-panel");
  const toolsPanel=document.getElementById("admin-tools");
  const setupWarning=document.getElementById("admin-setup-warning");
  const loginForm=document.getElementById("admin-login-form");
  const isAdmin=adminAuthenticated;
  authPanel.hidden=isAdmin;
  toolsPanel.hidden=!isAdmin;
  setupWarning.hidden=Boolean(supabaseClient);
  loginForm.hidden=!supabaseClient;
  if(isAdmin)document.getElementById("admin-account-label").textContent="Accès administrateur actif";
  document.getElementById("admin-count").textContent=products.length;
  const list=document.getElementById("admin-product-list");
  list.innerHTML=products.length?products.map(p=>`<article class="admin-product-row"><img src="${escapeHTML(p.image)}" alt=""><div class="admin-product-info"><strong>${escapeHTML(p.name)}</strong><span>${escapeHTML(p.category)} · ${money(p.price)}</span></div><button class="admin-delete" data-delete-product="${Number(p.id)}" aria-label="Supprimer ${escapeHTML(p.name)}">Supprimer</button></article>`).join(""):`<div class="admin-empty">Votre catalogue est vide. Ajoutez votre premier article avec le formulaire.</div>`;
}
function syncAdminRoute(){
  const isAdmin=location.hash==="#admin";
  document.getElementById("storefront").hidden=isAdmin;
  adminView.hidden=!isAdmin;
  document.querySelector(".site-footer").hidden=isAdmin;
  document.querySelector(".announcement").hidden=isAdmin;
  document.querySelector(".site-header").hidden=isAdmin;
  if(isAdmin)renderAdmin();else{renderProducts();renderCart();}
  window.scrollTo(0,0);
}
document.getElementById("admin-form").addEventListener("submit",e=>{
  e.preventDefault();const form=e.currentTarget;const data=new FormData(form);const image=String(data.get("image")).trim();
  if(!supabaseClient||!adminAuthenticated)return;
  try{const url=new URL(image);if(url.protocol!=="https:")throw new Error("https required");}catch{document.getElementById("admin-feedback").textContent="Ajoutez une adresse d’image valide qui commence par https://";return;}
  const payload={name:String(data.get("name")).trim(),category:String(data.get("category")),price:Number(data.get("price")),old_price:null,emoji:"📦",image,tone:"sage",badge:String(data.get("badge")).trim()||"Sélection",rating:"À découvrir",note:"Prix indicatif · disponibilité à confirmer"};
  (async()=>{const {data:created,error}=await supabaseClient.from("products").insert(payload).select().single();if(error){document.getElementById("admin-feedback").textContent="Ajout impossible. Vérifiez la configuration et les règles d’accès.";return;}products.unshift(created);saveProducts();form.reset();document.getElementById("admin-feedback").textContent="Produit ajouté à la boutique.";})();
});
document.getElementById("admin-product-list").addEventListener("click",e=>{const button=e.target.closest("[data-delete-product]");if(!button||!supabaseClient||!adminAuthenticated)return;const id=Number(button.dataset.deleteProduct);(async()=>{const {error}=await supabaseClient.from("products").delete().eq("id",id);if(error){document.getElementById("admin-feedback").textContent="Suppression impossible. Vérifiez les règles d’accès.";return;}products=products.filter(p=>Number(p.id)!==id);cart=cart.filter(item=>Number(item.id)!==id);localStorage.setItem("souklink-cart",JSON.stringify(cart));saveProducts();})();});
document.getElementById("admin-login-form").addEventListener("submit",e=>{e.preventDefault();const data=new FormData(e.currentTarget);const email=String(data.get("email")).trim();const feedback=document.getElementById("login-feedback");(async()=>{const {data:result,error}=await supabaseClient.auth.signInWithPassword({email,password:String(data.get("password"))});if(error){feedback.textContent="Connexion refusée. Vérifiez votre e-mail et votre mot de passe.";return;}if(result.user?.id!==SUPABASE_ADMIN_UID){await supabaseClient.auth.signOut();feedback.textContent="Ce compte n’est pas autorisé à gérer la boutique.";}})();});
document.getElementById("admin-password-form").addEventListener("submit",e=>{e.preventDefault();if(!supabaseClient||!adminAuthenticated)return;const form=e.currentTarget;const password=String(new FormData(form).get("password"));const feedback=document.getElementById("admin-password-feedback");(async()=>{const {error}=await supabaseClient.auth.updateUser({password});if(error){feedback.textContent="Impossible d’enregistrer le mot de passe. Vérifiez qu’il contient au moins 12 caractères.";return;}form.reset();feedback.textContent="Mot de passe administrateur mis à jour.";})();});document.getElementById("admin-signout").addEventListener("click",async()=>{if(supabaseClient)await supabaseClient.auth.signOut();});
window.addEventListener("hashchange",syncAdminRoute);
renderProducts();renderCart();syncAdminRoute();
async function loadRemoteProducts(){if(!supabaseClient)return;document.querySelector(".catalog-demo").hidden=true;const {data,error}=await supabaseClient.from("products").select("*").order("created_at",{ascending:false});if(error){document.querySelector(".catalog-demo").hidden=false;document.querySelector(".catalog-demo").textContent="Catalogue indisponible : vérifiez la configuration du service.";return;}products=data||[];renderProducts();renderAdmin();}
async function restoreAdminSession(){if(!supabaseClient){renderAdmin();return;}const {data}=await supabaseClient.auth.getSession();const session=data?.session;if(session&&session.user.id===SUPABASE_ADMIN_UID){adminAuthenticated=true;}else{adminAuthenticated=false;if(session)await supabaseClient.auth.signOut();}renderAdmin();supabaseClient.auth.onAuthStateChange((_event,nextSession)=>{setTimeout(async()=>{const valid=nextSession?.user.id===SUPABASE_ADMIN_UID;adminAuthenticated=Boolean(valid);if(nextSession&&!valid)await supabaseClient.auth.signOut();renderAdmin();},0);});}
loadRemoteProducts();restoreAdminSession();
