import { postData } from "../frontend_utils/fetch_api.js";
function createNotification(message,type) {
  const notification = document.createElement('div');
  notification.classList.add(type);
  notification.textContent = message;

  document.getElementById('notificationContainer').appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 1500);
}
var productCategory;


function add_to_cart(id){
  return async()=>{
    const quantity = document.getElementById(`${id}quantity`).value
    const result = await postData('/add_to_cart',{"items" : [{"productId" : id,"quantity" :quantity} ]})
    if(result.validate != null && result.validate==0){
      createNotification('Authenticate Yourself',"alert_notification");
    }
    else{
      createNotification("Product Added","success_notification");
    }
  }
}
function buy_now(id){
  return ()=>{
   const quantity = document.getElementById(`${id}quantity`).value
   location.href = `/checkout?source=product&productId=${id}&quantity=${quantity}`
  }
}
async function fetch_product() {
  const response = await fetch(`/products/${productId}`);
  const result = await response.json();
  const product = result.product;
  productCategory = product.Category
  console.log(typeof product.Attributes);
  document.getElementById("prodetails").innerHTML = `
  <div class="single-pro-image">
        <img src="../../${product.Image[0]}" width="100%" id="MainImg" alt="">
   <div class="small-img-group">
    <div class="small-img-col">
        <img src="../../${product.Image[0]}" width="100%" class="small-img" alt="">
    </div>
    <div class="small-img-col">
        <img src="../../${product.Image[1]}" width="100%" class="small-img" alt="">
    </div>
    <div class="small-img-col">
        <img src="../../${product.Image[2]}" width="100%" class="small-img" alt="">
    </div>
    <div class="small-img-col">
        <img src="../../${product.Image[3]}" width="100%" class="small-img" alt="">
    </div>
   </div>
    </div>
    <div class="single-pro-details">
        <h6>${product.Attributes.Brand}</h6>
        <h4>${product.Name}</h4>
        <h2>$${product.Price}</h2>
        <select>
            <option>Select Size</option>
            <option>XL</option>
            <option>XXL</option>
            <option>Small</option>
            <option>Large</option>
        </select>
        <input type="number" class="styled-input" id="${product._id}quantity" min="1" value="1">
        <button class="normal" id="${product._id}cart">Add To Cart</button>
        <button class="normal" id="${product._id}buy">Buy Now</button>
        <h4>Products details</h4>
        <ul>
        ${(() => {
            let output = '';
            Object.entries(product.Attributes).forEach(([key, value]) => {
              output += `<li class="product_details"><strong>${key}</strong>: ${value}</li>`;
            });
            return output;
          })()}
        </ul>
    </div>
  `;
  document.getElementById(`${product._id}cart`).addEventListener('click',add_to_cart(product._id))
  document.getElementById(`${product._id}buy`).addEventListener('click',buy_now(product._id))
  var MainImg = document.getElementById("MainImg");
  var smallimg = document.getElementsByClassName("small-img");

  smallimg[0].onclick = function () {
    MainImg.src = smallimg[0].src;
  };
  smallimg[1].onclick = function () {
    MainImg.src = smallimg[1].src;
  };
  smallimg[2].onclick = function () {
    MainImg.src = smallimg[2].src;
  };
  smallimg[3].onclick = function () {
    MainImg.src = smallimg[3].src;
  };
}

async function fetch_similar_product(){
    await fetch_product();
    const response = await fetch(`/products/category/${productCategory}`);
    const result = await response.json();
    const products = result.products;
    const star = `<i class="fas fa-star"></i>`;
    let s="";
    for(let i=0;i<products.length;i++)
    {
        if(products[i]._id == productId)
        continue;
      s+=
      `
      <div class="pro">
      <img src="../../${products[i].Image[0]}" alt="">
      <div class="des">
          <span>${products[i].Brand}</span>
          <h5>${products[i].Name}</h5>
          <div class="star">
          ${star.repeat(products[i].Rating)}
          </div>
          <h4>$${products[i].Price}</h4>
      </div  >
      <i class="fa-sharp fa-solid fa-cart-shopping cart" style="width: 40px;height: 20px;"></i>
  </div>
      `
    }
    if(s=="")
    s= "No more products in this category"
    document.getElementById("similarProduct").innerHTML=s;
}

fetch_similar_product()