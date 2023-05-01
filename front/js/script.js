//fonction permettant d'insérer les éléments récupérés depuis le serveur sur la page d'accueil//
function inject_elements(href, imgalt, imgsrc, title, description){
	
	let items= document.getElementById("items");

	let link= document.createElement("a");
	link.href=href;
	items.appendChild(link);

	let article= document.createElement("article");
	link.appendChild(article);

	let img= document.createElement("img");
	img.src= imgsrc;
	img.alt=imgalt;
	article.appendChild(img);

	let h3= document.createElement("h3");
	h3.textContent=title;
	h3.className="productName";
	article.appendChild(h3);

	let p= document.createElement("p");
	p.className="productDescription";
	p.textContent= description;
	article.appendChild(p);
}
//appel à fetch à l'aide de l'URL où sont placer les produits à récupérer depuis le serveur//
fetch("http://localhost:3000/api/products")
	.then(function(res){
		if (res.ok){
			return res.json();
		}
	})
	.then(function(result){
		//récupération de tous les produits//
		result.forEach(function(product){
			//appel de la fonction inject_elements//
			inject_elements("./product.html?id="+product._id,product.altTxt,product.imageUrl,product.name,product.description);
		});
	});