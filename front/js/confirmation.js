//récupération de l'URL de la page//
let url= new URL(window.location);
//récupération de l'identifiant de commande depuis le lien de l'URL//
let order_id= url.searchParams.get("orderId");
//injecter l'identifiant de commande dans le DOM pour l'afficher sur la page confirmation//
let confirmation_order=document.querySelector("#orderId");
confirmation_order.textContent=order_id;