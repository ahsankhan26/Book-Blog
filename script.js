
var key = config.API_KEY;
var id = config.userID;

var apiUrl = "https://www.goodreads.com/review/list/" + id + ".xml?key=" + key + "&v=2&shelf=read&per_page=200&page=1";
var cors = "https://cors-anywhere.herokuapp.com/";


var printXML = document.getElementById("xmlResponse");

console.log("Starting fetch Call");
const bookPromise = fetch(cors + apiUrl);
console.log("after fetch call");
console.log(bookPromise);
console.log("after program has run");

//------PROMISE-------
bookPromise
	.then(data => data.text())	//XMLresponse to txt
	.then(data => {

		let parser = new DOMParser();
		let xml = parser.parseFromString(data, "application/xml");
		console.log(xml);
		
		//function Call
		buildBookList(xml);
	});

// function that does everything	
// need to refactor it

function buildBookList(xmlObj){
	console.log("function");
	
	// index.html div	
	// everything will eventually fall here
	let books = document.getElementById("books");
	
	//Things that we're fetching now	
	//Title - Author - ImageUrl - Rating - Review
	let xmlTitle = xmlObj.getElementsByTagName("title_without_series");
	let xmlAuthor = xmlObj.getElementsByTagName("name");
	let xmlImg = xmlObj.getElementsByTagName("image_url");
	let xmlRating = xmlObj.getElementsByTagName("rating");

	let xmlReview = xmlObj.getElementsByTagName("body");

	// for some reason, imageUrl comes double
	// every other index is empty	
	// only image url is iterated using 'count' variable	
	// count variable increments by 2
	
	let count = 0;
	for(var i=0; i<xmlTitle.length; i++){

		// internal tags
		let book = document.createElement("div");	//everything goes in book, book appends to 'books'

		let column = document.createElement("div");

		//Image
		let imgATag = document.createElement("a");
		let img = document.createElement("img");

		//card that holds title, author and rating
		let card = document.createElement("div");

		let title = document.createElement("h6");
		let author = document.createElement("p");
		let rating = document.createElement("p");

		star = document.createElement("i");
		
		// couldn't make a loop working within this loop.	
		// so i made these variables	
		// and depending on the rating, the variable appends	
		// not the most efficient way	
		// not DRY
		let noStar = "<i class='fa fa-star-o' aria-hidden='true'></i><i class='fa fa-star-o' aria-hidden='true'></i><i class='fa fa-star-o' aria-hidden='true'></i><i class='fa fa-star-o' aria-hidden='true'></i><i class='fa fa-star-o' aria-hidden='true'></i>";
		let oneStar = "<i class='fa fa-star' aria-hidden='true'></i><i class='fa fa-star-o' aria-hidden='true'></i><i class='fa fa-star-o' aria-hidden='true'></i><i class='fa fa-star-o' aria-hidden='true'></i><i class='fa fa-star-o' aria-hidden='true'></i>";
		let twoStar = "<i class='fa fa-star' aria-hidden='true'></i><i class='fa fa-star' aria-hidden='true'></i><i class='fa fa-star-o' aria-hidden='true'></i><i class='fa fa-star-o' aria-hidden='true'></i><i class='fa fa-star-o' aria-hidden='true'></i>";
		let threeStar = "<i class='fa fa-star' aria-hidden='true'></i><i class='fa fa-star' aria-hidden='true'></i><i class='fa fa-star' aria-hidden='true'></i><i class='fa fa-star-o' aria-hidden='true'></i><i class='fa fa-star-o' aria-hidden='true'></i>";
		let fourStar = "<i class='fa fa-star' aria-hidden='true'></i><i class='fa fa-star' aria-hidden='true'></i><i class='fa fa-star' aria-hidden='true'></i><i class='fa fa-star' aria-hidden='true'></i><i class='fa fa-star-o' aria-hidden='true'></i>";
		let fiveStar = "<i class='fa fa-star' aria-hidden='true'></i><i class='fa fa-star' aria-hidden='true'></i><i class='fa fa-star' aria-hidden='true'></i><i class='fa fa-star' aria-hidden='true'></i><i class='fa fa-star' aria-hidden='true'></i>";


		let titleName = xmlTitle[i].firstChild.nodeValue;
		let authorName = xmlAuthor[i].firstChild.nodeValue;
		let imgUrl = xmlImg[count].firstChild.nodeValue;
		let ratingNum = xmlRating[i].firstChild.nodeValue;

		let review = xmlReview[i].childNodes;
		
		// regex to get high quality images
		let cleanString = imgUrl.replace(/\.\_(.*?)\_\./g, ".");
		
		// ------------class names----------------
		var id = titleName.replace(/\s/g, '');
		id = id.replace(/[^a-zA-Z0-9 ]/g , '');

		book.setAttribute("class", "card border-0 transform-on-hover");
		book.setAttribute("data-toggle", "modal")
		book.setAttribute("data-target", "#" + id);

		// book.className = "card border-0 transform-on-hover";
		// book.dataset.target = "#" + i;

		column.className = "col-md-6 col-lg-3";
		// column.id = titleName.replace(/\s/g, '')
		
		imgATag.className = "lightbox";
		
		img.className = "card-img-top";

		card.className = "card-body";
		author.className = "text-muted card-text";
		// starOne.innerHTML = "<i class='fa fa-star' aria-hidden='true'></i>";
		// starTwo.innerHTML = "<i class='fa fa-star-o' aria-hidden='true'></i>";
		//-------------class names----------------

		// imgATag.href = cleanString;
		img.src = cleanString;

		title.textContent = titleName;
		author.textContent = authorName;	

		rating.textContent = "My Rating : ";
		if(parseInt(ratingNum) === 1){
			rating.innerHTML += oneStar;
		} else if(parseInt(ratingNum) === 2){
			rating.innerHTML += twoStar;
		}else if(parseInt(ratingNum) === 3){
			rating.innerHTML += threeStar;
		}else if(parseInt(ratingNum) === 4){
			rating.innerHTML += fourStar;
		}else if(parseInt(ratingNum) === 5){
			rating.innerHTML += fiveStar;
		} else{
			rating.innerHTML += noStar;
		}
		

		// rating.appendChild(starOne);
				

		card.appendChild(title);
		card.appendChild(author);
		card.appendChild(rating);

		imgATag.appendChild(img);

		book.appendChild(imgATag);
		book.appendChild(card);

		column.appendChild(book);

		books.appendChild(column);

		count+=2;

		var modelObj = {
			title: titleName,
			author: authorName,
			img: cleanString,
			review: review[0].wholeText,
			rating: rating
		}

		buildModelList(modelObj);


	}
	let loader = document.querySelector(".loader-wrapper");
	loader.remove();
	console.log("outside loop");
}

function buildModelList(modelObj){
	// console.log(modelObj.i, modelObj.title, modelObj.author, modelObj.img, modelObj.rating, modelObj.review);
	// console.log(modelObj.rating);

	let modal = document.getElementById("modal");

	// ------- TOP MODAL -------
	var modal_first = document.createElement("div");
	modalFirstAttributes(modal_first, modelObj.title);

	var modal_second = document.createElement("div");
	modalSecondAttributes(modal_second);

	var modal_content = document.createElement("div");
	modalContentAttributes(modal_content);
	
	// ------- MODAL HEADER -------
	var header_first = document.createElement("div");
	headerFirstAttributes(header_first);
	
	var header_title = document.createElement("h3");
	headerTitleAttributes(header_title, modelObj.title, modelObj.author);

	var header_button = document.createElement("button");
	headerButtonAttributes(header_button);

	// ------- MODAL BODY -------
	var body_first = document.createElement("div");
	bodyFirstAttributes(body_first);

	var body_img = document.createElement("img");
	bodyImgAttributes(body_img, modelObj.img);

	var modal_footer = document.createElement("div");
	modalFooterAttributes(modal_footer);
	

	var body_review = document.createElement("p");
	bodyReviewAttributes(body_review, modelObj.review);

	var body_rating = document.createElement("p");
	bodyRatingAttributes(body_rating, modelObj.rating);

	// ------- APPENDING -------

	header_first.appendChild(header_title);
	header_first.appendChild(header_button);
	modal_content.appendChild(header_first);

	body_first.appendChild(body_img);
	body_first.appendChild(body_review);
	body_first.appendChild(body_rating);

	modal_content.appendChild(body_first);

	modal_content.appendChild(modal_footer);

	modal_second.appendChild(modal_content);
	modal_first.appendChild(modal_second);
	modal.appendChild(modal_first);

}

	// ------- MODAL FUNCTION -------

function modalFirstAttributes(modal_first, title) {

	title = title.replace(/\s/g, '');
	title = title.replace(/[^a-zA-Z0-9 ]/g , '');

	modal_first.setAttribute("class", "modal fade");
	modal_first.setAttribute("id", title);
	modal_first.setAttribute("tabindex", "-1");
	modal_first.setAttribute("role", "dialog");
	modal_first.setAttribute("aria-labelledby", "exampleModalLabel");
	modal_first.setAttribute("aria-hidden", "true");
}

function modalSecondAttributes(modal_second) {

	modal_second.setAttribute("class", "modal-dialog modal-lg");
	modal_second.setAttribute("role", "document");

}

function modalContentAttributes(modal_content) {

	modal_content.setAttribute("class", "modal-content");	
}
	// ------- MODAL FUNCTION -------


	// ------- MODAL HEADER FUNCTION -------
function headerFirstAttributes(header_first) {
	header_first.setAttribute("class", "modal-header");
}


function headerTitleAttributes(header_title, bookTitle, author) {

	header_title.setAttribute("class", "modal-title");
	header_title.textContent = bookTitle;

	var header_author = document.createElement("p");
	header_author.textContent = author;

	header_title.appendChild(header_author);
}

function headerButtonAttributes(header_button) {

	header_button.setAttribute("type", "button");
	header_button.setAttribute("class", "close ml-0");
	header_button.setAttribute("data-dismiss", "modal");
	header_button.setAttribute("aria-label", "Close");

	var span = document.createElement("span");
	span.setAttribute("aria-hidden", "true");
	span.innerHTML = "&times;"

	header_button.appendChild(span);
}
	// ------- MODAL HEADER FUNCTION -------


	// ------- MODAL BODY FUNCTION -------
function bodyFirstAttributes(body_first) {
	body_first.setAttribute("class", "row modal-body");
}

function bodyImgAttributes(body_img, imgUrl) {
	body_img.style.height = "100%";
	body_img.setAttribute("class", "img=fluid col-4");
	body_img.setAttribute("src", imgUrl);
}

function bodyReviewAttributes(body_review, review) {

	body_review.setAttribute("class", "col-8");
	body_review.innerHTML = review;

}

function bodyRatingAttributes(body_rating, rating) {
	body_rating.setAttribute("class", "rating");
	body_rating.style.margin = "auto";
	body_rating.innerHTML += rating.innerHTML;
}
	// ------- MODAL BODY FUNCTION -------




	// ------- MODAL FOOTER FUNCTION -------
function modalFooterAttributes(modal_footer) {

	modal_footer.setAttribute("class", "modal-footer");
	var button = document.createElement("button");
	button.setAttribute("type", "button");
	button.setAttribute("class", "btn btn-secondary");
	button.setAttribute("data-dismiss", "modal");
	button.textContent = "Close";

	modal_footer.appendChild(button);
}
	// ------- MODAL FOOTER FUNCTION -------

