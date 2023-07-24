import { postData } from "../frontend_utils/fetch_api.js";
const radioContainer = document.getElementById('radio-container');

// Add event listener to the container element
radioContainer.addEventListener('change', handleGenderChange);

async function handleGenderChange(event) {
  const category = event.target.value;
  console.log(`Gender changed to: ${category}`);
  await fetch_products("prod1",`/products/category/${category}`)

}

function createNotification(message,type) {
    const notification = document.createElement('div');
    notification.classList.add(type);
    notification.textContent = message;
  
    document.getElementById('notificationContainer').appendChild(notification);
  
    setTimeout(() => {
      notification.remove();
    }, 1500);
  }
  
function open_product(id){
    return ()=>{
      location.href = `/product/webpage/${id}`
    }
}
function add_to_cart(id){
    return async()=>{
      const result = await postData('/add_to_cart',{"items" : [{"productId" : id,"quantity" :1} ]})
      if(result.validate != null && result.validate==0){
        createNotification('Authenticate Yourself',"alert_notification");
      }
      else{
        createNotification("Product Added","success_notification");
      }
    }
}

async function fetch_products(id,url) {
    const response= await fetch(url)
    const result = await response.json()
    const products = result.products
    console.log(products)
    if(products.length == 0 )
    {
        document.getElementById(id).innerHTML = "No products under this category";
        return;
    }
    document.getElementById(id).innerHTML=""
    for (let i = 0; i < products.length; i++) {
      const star = `<i class="fas fa-star"></i>`;
      document.getElementById(id).innerHTML += `
    <div class="pro" >
    <img src="${products[i].Image[0]}" alt="" id="${products[i]._id}">
    <div class="des">
        <span>${products[i].Attributes.Brand}</span>
        <h3>${products[i].Name}</h3>
        <div class="star">
            ${star.repeat(products[i].Rating)}
        </div>
        <h4>$${products[i].Price}</h4></div>
    <i id="${products[i]._id}cart" class="fa-sharp fa-solid fa-cart-shopping cart" style="width: 40px;height: 20px;"></i>
  </div>`;
    }
    for (let i = 0; i < products.length; i++) {
      if (products.includes(products[i])) {
      let element1 = document.getElementById(`${products[i]._id}`)
      element1.addEventListener("click", open_product(products[i]._id));
      let element2 = document.getElementById(`${products[i]._id}cart`)
      element2.addEventListener("click", add_to_cart(products[i]._id));
      }
    }
  }
fetch_products("prod1",'/products');