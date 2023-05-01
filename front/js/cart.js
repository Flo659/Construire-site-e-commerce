//fonction permettant de récupérer le panier//
function get_panier(){
	//récupération du panier depuis le localStorage//
	let panier=(localStorage.getItem("product_panier"));
	
	//si panier égale null le tableau est vide//
	if (panier==null){
		panier=[];	
	//sinon il transforme la chaine en objet//
	}else{
		panier=JSON.parse(panier);
	}
	return panier;
}
//fonction permettant d'insérer les éléments récupérés depuis le panier et le serveur dans le DOM//
function inject_product_panier(id, color, imgsrc, imgalt, nameproduct, dyedproduct, price, quantity, article_delete, products){
	
	//récupération de l'id et de la couleur depuis le panier et le reste depuis le serveur//
	let section= document.querySelector("#cart__items");
	let article= document.createElement("article");
	article.className="cart__item";
	article.dataset.id= id;
	article.dataset.color= color;
	section.appendChild(article);
	
	let div_cart_item_img= document.createElement("div");
	let img= document.createElement("img");
	div_cart_item_img.className="cart__item__img";
	img.src= imgsrc;
	img.alt= imgalt;
	article.appendChild(div_cart_item_img);
	div_cart_item_img.appendChild(img);
	
	let div_cart_item_content=document.createElement("div");
	div_cart_item_content.className="cart__item__content";
	let div_cart_item_class= document.createElement("div");
	div_cart_item_class.className="cart__item__content__description";
	let h2= document.createElement("h2");
	h2.textContent=nameproduct;
	let p_color= document.createElement("p");
	p_color.textContent="Couleur : "+dyedproduct;
	let p_price= document.createElement("p");
	p_price.textContent="Prix: "+price+" €";
	article.appendChild(div_cart_item_content);
	div_cart_item_content.appendChild(div_cart_item_class);
	div_cart_item_class.appendChild(h2);
	div_cart_item_class.appendChild(p_color);
	div_cart_item_class.appendChild(p_price);
	
	let div_settings= document.createElement("div");
	div_settings.className="cart__item__content__settings";
	let div_settings_quantity= document.createElement("div");
	div_settings_quantity.className="cart__item_content__settings__quantity";
	let p_quantity= document.createElement("p");
	p_quantity.textContent="Qte :";
	let input= document.createElement("input");
	input.type="number";
	input.className="itemQuantity";
	input.name="itemQuantity";
	input.min="1";
	input.max="100";
	input.value=quantity;
	div_cart_item_content.appendChild(div_settings);
	div_settings.appendChild(div_settings_quantity);
	div_settings_quantity.appendChild(p_quantity);
	div_settings_quantity.appendChild(input);
	
	let div_settings_delete= document.createElement("div");
	let product_delete= document.createElement("p");
	div_settings_delete.className="cart__item__content__settings__delete";
	product_delete.className="deleteItem";
	product_delete.textContent=article_delete;
	div_cart_item_content.appendChild(div_settings_delete);
	div_settings_delete.appendChild(product_delete);
	
	//ajouter une quantité au produit du panier en écoutant l'évènement change//
	input.addEventListener("change", function(event){
		//récupération du panier//
		let panier= get_panier();
		//rechercher dans le panier tout les id avec les couleurs qui sont identiques//
		let panier_find= panier.find(element=>element.id==id && element.color==color);
		//récupération des valeurs de l'utilisateur//
		let select_quantity_modified= Number(input.value);
		
		//message d'erreur indiquant un manque d'action de l'utilisateur//
		if (select_quantity_modified>100){
			alert("Erreur : Veuiller sélectionner une quantité comprise entre 1 et 100 SVP !");
			input.value=panier_find.quantity;
			return;
		}
		else if(select_quantity_modified==0){
			alert("Erreur : Veuiller au moins sélectionner une quantité d'un des produits ci dessous comprise entre 1 et 100 ou bien de le supprimer du panier SVP !")
			input.value=panier_find.quantity;
			return;			
		}
		//mise à jour de la quantité des produits du panier ayant le même id et la même couleur//
		panier_find.quantity=select_quantity_modified;
		//mise à jour du localStorage//
		localStorage.setItem("product_panier",JSON.stringify(panier));
		//recalcul du prix et de la quantité des produits du panier//
		quantity_and_price_display(products);	
	});
	//supprimer des éléments du panier en écoutant l'évènement au clic//
	product_delete.addEventListener("click", function(event){
		let panier= get_panier();
		//variable permettant de sélectionner le plus haut parent avec tous ce qu'il contient//
		let select_article=product_delete.closest("article");
		//rechercher dans le panier les id et les couleurs différent de ceux qui ont été sélectionné//
		let products_filter= panier.filter(element=>element.id!==select_article.dataset.id || element.color!==select_article.dataset.color);
		//envoi de la mise à jour des produits pour garder ceux non sélectionnée au localStorage//
		localStorage.setItem("product_panier",JSON.stringify(products_filter));	
		//appel de la variable avec la fonction pour la suppression du produit sélectionné//
		select_article.remove();
		//recalcul du prix et de la quantité des produits du panier//
		quantity_and_price_display(products);
	});
}
//appel à fetch à l'aide de l'URL où sont placés les éléments de chaque produit avec l'id à récupérer depuis le serveur//
fetch("http://localhost:3000/api/products/")
	.then(function(res){
		if (res.ok){
			return res.json();
		}
	})
	.then(function(products){
	//appel de la fonction get_panier pour récupérer le panier depuis le localStorage//
		let panier= get_panier();
		//si chaque id des produits du panier correspond à ceux du tableau envoyé par l'API les récupérer//
		panier.forEach(function(individual_selected_product){
			let product_find=products.find(element=> element._id==individual_selected_product.id);
			//appel de la fonction inject_product//
			inject_product_panier(individual_selected_product.id, individual_selected_product.color, product_find.imageUrl, product_find.altTxt, product_find.name, individual_selected_product.color, product_find.price,individual_selected_product.quantity,"Supprimer", products);
		});
		//appel de la fonction quantity_and_price_display//
		quantity_and_price_display(products);
	});
	
//fonction permettant de calculer et d'afficher le prix et la quantité des produits sur la page//
function quantity_and_price_display(products){	
	//récupération du panier//
	let panier=get_panier();
	
	//variable contenant la valeur de la quantité globale du panier//
	let total_products= 0;

	//variable contenant la valeur du prix globale du panier//
	let total_price= 0;

	//sélectionner tous les produits du panier//
	panier.forEach(function(articles){
		//appel de la variable pour stocker la quantité totale du panier//
		total_products= total_products+articles.quantity;
		//rechercher dans le tableau products de l'API si les id correspondent à ceux du panier//
		let products_search= products.find(element=> element._id==articles.id);
		//appel de la variable pour stocker le prix de tous les produits du panier//
		total_price= total_price+products_search.price*articles.quantity;
	});
	//récupération de la quantité globale du panier//
	let selector_total_quantity= document.querySelector("#totalQuantity");
	//insertion de la mise à jour de la quantité globale du panier//
	selector_total_quantity.textContent=total_products;
	
	//récupération du prix global du panier//
	let selector_total_price= document.querySelector("#totalPrice");
	//insertion de la mise à jour du prix global du panier//
	selector_total_price.textContent= total_price;
}
//création des expressions régulières//
let text_name_and_lastname_regex= /[a-zA-ZÂÊÎÔÛÊÀÉÈÇÙàâêîôûêëéèçàù\- ]+$/gi;
let adress_regex= /[0-9]+[ a-zA-ZÂÊÎÔÛÊÀÉÈÇÙàâêîôûêëéèçàù\-,\.-_\/:]+$/gi;
let city_regex= /[a-zA-ZÂÊÎÔÛÊÀÉÈÇÙàâêîôûêëéèçàù\- ]+$/gi;
let email_regex= /[a-bA-Z0-9ÂÊÎÔÛÊÀÉÈÇÙàâêîôûêëéèçàù,\.;?:!\/_&-+]+@[a-zA-Z0-9ÂÊÎÔÛÊÀÉÈÇÙàâêîôûêëéèçàù,\.;?:!\/_&-+]+[\.]+[a-z n]+$/gi;

//récupération du bouton pour l'envoi du formulaire//
let button_order=document.querySelector("#order");

//envoi des données saisie dans le formulaire en écoutant l'évènement au clic//
button_order.addEventListener("click", function(e){
	
	//fonction évitant le rechargement de la page lors de l'envoi du formulaire//
	e.preventDefault();
	//récupération des valeurs saisies depuis les champs du formulaire//
	let write_name=document.querySelector("#firstName").value;
	let first_name_error_msg=document.querySelector("#firstNameErrorMsg");
	//si les données du formulaire concordent avec les expressions régulières correspondantes ne pas diffuser de message//
	//sinon indiquer un message d'erreur si le champ n'est pas rempli ou s'il est incorrect//
	if(write_name.match(text_name_and_lastname_regex)){
		first_name_error_msg.textContent="";
	}
	else if(write_name==""){
		first_name_error_msg.textContent="Veuillez saisir le champ SVP";
	}
	else if(text_name_and_lastname_regex.test(write_name)==false){
		first_name_error_msg.textContent="Ce champ est incorrect veuillez le corriger svp";
		write_name=false;
	}

	let write_lastname=document.querySelector("#lastName").value;
	let last_name_error_msg=document.querySelector("#lastNameErrorMsg");
	if(write_lastname.match(text_name_and_lastname_regex)){
		last_name_error_msg.textContent="";
	}
	else if(write_lastname==""){
		last_name_error_msg.textContent="Veuillez saisir le champ SVP";
	}
	else if(text_name_and_lastname_regex.test(write_lastname)==false){
		last_name_error_msg.textContent="Ce champ est incorrect veuillez le corriger svp";
		write_lastname=false;
	}

	let write_address=document.querySelector("#address").value;
	let adress_error_msg=document.querySelector("#addressErrorMsg");
	if(write_address.match(adress_regex)){
		adress_error_msg.textContent="";
	}
	else if(write_address==""){
		adress_error_msg.textContent="Veuillez saisir le champ SVP";
	}
	else if(adress_regex.test(write_address)==false){
		adress_error_msg.textContent="Ce champ est incorrect veuillez le corriger svp";
		write_address=false;
	}

	let write_city=document.querySelector("#city").value;
	let city_error_msg=document.querySelector("#cityErrorMsg");
	if(write_city.match(city_regex)){
		city_error_msg.textContent="";
	}
	else if(write_city==""){
		city_error_msg.textContent="Veuillez saisir le champ SVP";
	}
	else if(city_regex.test(write_city)==false){
		city_error_msg.textContent="Ce champ est incorrect veuillez le corriger svp";
		write_city=false;
	}

	let write_email=document.querySelector("#email").value;
	let email_error_msg=document.querySelector("#emailErrorMsg");
	if(write_email.match(email_regex)){
		email_error_msg.textContent="";
	}
	else if(write_email==""){
		email_error_msg.textContent="Veuillez saisir le champ SVP";
	}
	else if(email_regex.test(write_email)==false){
		email_error_msg.textContent="Ce champ est incorrect veuillez le corriger svp";
		write_email=false;
	}
	
	//appel de la fonction get_panier pour récupérer le panier//
	let panier= get_panier();
	//création d'un nouveau tableau pour ajouter tous les id des produits du panier//
	let id_products=[];
	//boucle permettant d'ajouter les id de tous les produits du panier dans un nouveau tableau//
	for(let i=0; i<panier.length; i++){
	id_products.push(panier[i].id);
	};
	
	//création d'une variable contenant un objet avec les informations saisies par l'utilisateur qui ont ensuite été récupéré//
	//et un tableau contenants tous les id des produits du panier//
	let order={
		contact:{
			firstName: write_name,
			lastName: write_lastname,
			address: write_address,
			city: write_city,
			email: write_email,
			},
		products:id_products,
	}
	
	//appel à fetch à l'aide de l'URL en ajoutant l'objet afin de l'envoyer au serveur// 
	//afin de récupérer en réponse l'identifiant de commande//
	fetch("http://localhost:3000/api/products/order",{
		method:"POST",
		headers:{
			"Content-Type": "application/json;charset=utf-8"
		},
		body: JSON.stringify(order)
	})
	
	.then(function(res){
		if (res.ok){
			return res.json();
		}
	})
	.then(function(data_order){
		//récupération du numéro de commande envoyé par l'API//
		let order_number= data_order.orderId;
		//récupération de la page actuelle pour être redirigée vers la page confirmation avec l'identifiant de commande//
		let page_location= document.location;
		page_location.href="./confirmation.html?orderId="+order_number;
		//suppression du panier//
		localStorage.removeItem("product_panier");
	});
});