//récupération de l'URL de la page produit sélectionnée//
let url= new URL(window.location);
//récupération de l'id du lien de l'URL du produit sélectionnée//
let id= url.searchParams.get("id");

//fonction permettant d'insérer les éléments récupérés depuis le serveur dans le DOM//
function inject_element(imgsrc, imgalt, title, cost, description){
	
	let get_img= document.querySelector(".item__img");
	let item= document.querySelector(".item__content__titlePrice");
	
	let img= document.createElement("img");
	img.src= imgsrc;
	img.alt= imgalt;
	get_img.appendChild(img);
	
	let h1= document.querySelector("h1");
	h1.textContent= title;
	h1.id="title";
	item.appendChild(h1);
	
	let conteneur_price= document.querySelector("p")
	let price_product= document.querySelector("#price");
	price_product.textContent= cost;
	price_product.id="price";
	item.appendChild(conteneur_price);
	
	let entitled= document.querySelector("#description");
	entitled.textContent= description;
	entitled.id="description";
}
//fonction permettant d'insérer les éléments de couleur récupérés depuis le serveur dans le DOM//
function select_colors(optioncolors){
	let option= document.createElement("option");
	option.value= optioncolors;
	option.textContent= optioncolors;
	let colors= document.querySelector("#colors");
	colors.appendChild(option);		
}
//appel à fetch à l'aide de l'URL pour récupérer les informations de chaque produit avec l'id depuis le serveur//
fetch("http://localhost:3000/api/products/"+id)
	.then(function(res){
		if (res.ok){
			return res.json();
		}
	})
	.then(function(product){
		//insérer les couleurs de chaque produit dans le DOM//	
		product.colors.forEach(function(colors){
			select_colors(colors);
		});
		//appel de la fonction inject_element permettant d'insérer les éléments dans le DOM récupéré depuis le serveur//
		inject_element(product.imageUrl,product.altTxt,product.name,product.price,product.description);
	});
	
//récupération du panier depuis le localStorage//
let panier=(localStorage.getItem("product_panier"));

//si panier égale null le tableau est vide//
if (panier==null){
		panier=[];			
//sinon il transforme la chaine en objet//
}else{
	panier=JSON.parse(panier);
}
		
//ajouter les éléments au panier en écoutant l'évènement au clic//
let button= document.querySelector("#addToCart")

button.addEventListener("click", function (event){
	//récupérer les valeurs depuis le DOM de la quantité et et de la couleur à envoyé au panier//
	let quantity_product= document.querySelector("#quantity").value;
	let color_select= document.querySelector("#colors").value;
		
	//création du produit envoyé au panier// 
	let product_kanap={
	id: id,
	quantity: Number (quantity_product),
	color: color_select,
	}
	
	//messages d'erreurs en cas de manque d'action nécessaire par l'utilisateur//
	if ( quantity_product <1 && color_select==""){	
		alert("Erreur : Veuillez sélectionner une couleur ainsi qu'une quantité SVP !");
		return;
	}
	else if (quantity_product>100 ){
		alert("Erreur : Veuillez sélectionner une quantité comprise entre 1 et 100 SVP !");
		return;
	}
	else if(quantity_product >0 && color_select==""){
		alert("Erreur : Veuillez sélectionner une couleur SVP !");
		return;
	}
		
	else if(quantity_product <1 && color_select==color_select){
		alert("Erreur : Veuillez sélectionner une quantité SVP !");
		return;
	}
	else{
		alert("Votre produit va être ajouté au panier");
	}
		
	//si on ajoute un produit au panier et qu'il est déjà présent dans le panier (même id + même couleur)// 
	//on incrémente (ajoute) la quantité du produit//
	let kanap_find =panier.find(element => element.id==product_kanap.id && element.color==product_kanap.color);	
	if(kanap_find){
		kanap_find.quantity= product_kanap.quantity + kanap_find.quantity;
		//mise à jour du localStorage//
		localStorage.setItem("product_panier",JSON.stringify(panier));
	}
	//si un produit est ajouté au panier et qu'il n'est pas déjà présent dans le panier on ajoute un nouvel élément dans le tableau//
	else {
		panier.push(product_kanap);
		//mise à jour du localStorage//
		localStorage.setItem("product_panier",JSON.stringify(panier));
	}
});