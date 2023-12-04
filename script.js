const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
const shoppingCart = document.querySelector('.shop-cart');
const cartArray = [];
const filterList = document.querySelector('select[name="filter-list"]');
const filterListCategories = document.querySelector('select[name="filter-category"]');


filterList.addEventListener('change', () => {
    filterProducts(filterList.value)
});


function filterProducts (filter_value) {
    const allProductsDOM = document.querySelectorAll('.product');
    const productList = document.querySelector('.product-list');
    let productsArray = [];

    allProductsDOM.forEach((product) => {
        const ratings = product.querySelectorAll('.fa');

        const productObject = {
            element: product,
            name: product.querySelector('h3').innerText,
            rating: returnTotalRating(ratings),
            price: parseInt(product.querySelector('.product-price').innerText, 10,)
        }
        
        productsArray.push(productObject);

    })

    if (filter_value === "filter-name") {
        productList.innerHTML = "";
        sortPropertyAlphabetically(productsArray);
        productsArray.forEach((obj) => {
            productList.appendChild(obj.element);
        })
    }

    else if (filter_value === "filter-price-down") {
        productList.innerHTML = "";
        productsArray.sort((a, b) => b.price - a.price);
        
        productsArray.forEach((obj) => {
            productList.appendChild(obj.element);
        })
    }

    else if (filter_value === "filter-price-up") {
        productList.innerHTML = "";
        productsArray.sort((a, b) => a.price - b.price);
        
        productsArray.forEach((obj) => {
            productList.appendChild(obj.element);
        })
    }

    else if (filter_value === "filter-rating") {
        productList.innerHTML = "";
        productsArray.sort((a, b) => b.rating - a.rating);
        
        productsArray.forEach((obj) => {
            productList.appendChild(obj.element);
        })
    }
}


function sortPropertyAlphabetically (property) {
    property.sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
      
        return 0;
      });
}




filterListCategories.addEventListener('change', () => {
    hideProducts(filterListCategories.value);
});

function hideProducts(filter_value) {
    const allProductsDOM = document.querySelectorAll('.product');

    allProductsDOM.forEach((product) => {
        const category = product.querySelector('.product-category');

        if (filter_value !== category.dataset.value) {
            product.style.display = "none";
        }

        else {
            product.style.display = "block";
        }
    })
    
}



addToCartButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const isItemInCartArray = isItemInArray(btn);

    if (!isItemInCartArray) {
    resetCart();
    fetchItemInfo(btn);
    updateCartDOM();
    }
    
  });
});

function isItemInArray(e) {
    const productName = e.closest('.product').querySelector('h3').innerText;
    
    for (let i = 0; i < cartArray.length; i++) {
        if (cartArray[i].name === productName) {
            return true;
        }
    }
    return false;
}

function fetchItemInfo(e) {
  const product = e.closest('.product');
  const productImg = product.querySelector('img');
  const productName = product.querySelector('h3').innerText;
  const productPrice = parseInt(
    product.querySelector('.product-price').innerText,
    10,
  );
  const productRating = product.querySelectorAll('.fa');
  const productCategory = product.querySelector('.product-category').innerText;

  const cartItem = {
    name: productName,
    img: productImg,
    price: productPrice,
    rating: returnTotalRating(productRating),
    category: productCategory,
    amount: 1,
  };

  
  cartArray.push(cartItem);
}

function returnTotalRating(element) {
  let checkedStars = 0;
  let halfStars = 0;

  element.forEach((star) => {
    if (star.classList.contains('checked')) {
      checkedStars++;
    } else if (star.classList.contains('fa-star-half-o')) {
      halfStars++;
    }
  });

  const totalRating = checkedStars + 0.5 * halfStars;
  return totalRating;
}

function resetCart() {
  const allCartItems = document.querySelectorAll('.cart-item');
  allCartItems.forEach((item) => item.remove());
}

function updateCartDOM() {
    cartArray.forEach((obj) => {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');

    cartItem.appendChild(
      createItemLeftSection(obj.img, obj.name, obj.category),
    );

    cartItem.appendChild(createItemRightSection(obj.price, obj.rating, obj.amount));

    updateTotalPrice();

    shoppingCart.appendChild(cartItem);
  });
}

function updateTotalPrice() {
    let cartSumDOM = document.querySelector('.cart-total-sum');
    let cartSum = 0;
    cartArray.forEach((item) => cartSum += item.price);

    cartSumDOM.innerText = `Your Total is: ${cartSum}kr`;
}

function createItemLeftSection(img, name, category) {
  const itemLeftSection = document.createElement('div');
  itemLeftSection.classList.add('item-left-section');

  const itemImg = img.cloneNode(true);

  const itemInfo = document.createElement('div');
  itemInfo.classList.add('item-info');

  const itemName = document.createElement('h4');
  itemName.innerText = name;

  const itemCategory = document.createElement('p');
  itemCategory.innerText = `Category: ${category}`;

  itemInfo.appendChild(itemName);
  itemInfo.appendChild(itemCategory);

  itemLeftSection.appendChild(itemImg);
  itemLeftSection.appendChild(itemInfo);

  return itemLeftSection;
}

function createItemRightSection(price, rating, amount) {
  const itemRightSection = document.createElement('div');
  itemRightSection.classList.add('item-right-section');

  const itemAmountControl = document.createElement('div');
  itemAmountControl.classList.add('item-amount-control');

  const reduceBtn = document.createElement('button');
  reduceBtn.innerText = '-';

  const itemAmountInput = document.createElement('input');
  itemAmountInput.type = 'number';
  itemAmountInput.readOnly = 'true';
  itemAmountInput.value = amount;

  const increaseBtn = document.createElement('button');
  increaseBtn.innerText = '+';

  itemAmountControl.appendChild(reduceBtn);
  itemAmountControl.appendChild(itemAmountInput);
  itemAmountControl.appendChild(increaseBtn);

  const itemPriceContainer = document.createElement('div');
  itemPriceContainer.classList.add('item-price');

  let itemPrice = document.createElement('span');
  itemPrice.classList.add('item-total-price');
  itemPrice.innerText = `${price}kr`;

  reduceBtn.addEventListener("click", (e) => {
    increaseOrDecrease(e, "-", price, itemAmountInput);
    updateTotalPrice();
  })

  increaseBtn.addEventListener("click", (e) => {
    increaseOrDecrease(e, "+", price, itemAmountInput);
    updateTotalPrice();
  })


  itemPriceContainer.appendChild(itemPrice);

  const removeText = document.createElement('span');
  removeText.classList.add('remove-item-from-cart');
  removeText.innerText = 'Remove from cart';

  removeText.addEventListener('click', () => {
    removeText.closest('.cart-item').remove();
    removeFromCartArray(removeText);
  });

  itemRightSection.appendChild(itemAmountControl);
  itemRightSection.appendChild(itemPriceContainer);
  itemRightSection.appendChild(calculate_And_Return_Rating(rating));
  itemRightSection.appendChild(removeText);

  return itemRightSection;
}

function increaseOrDecrease(e, symbol, price, element) {
    const cartItem = e.target.closest('.cart-item');
    const name = cartItem.querySelector('h4').innerText;
    let itemPriceDOM = e.target.closest('.item-right-section').querySelector('.item-total-price');

    cartArray.forEach((obj) => {

        if (name === obj.name && obj.amount >= 1 && symbol === "+") {
            obj.amount += 1;
            element.value = obj.amount;
            obj.price = price * element.value;

            itemPriceDOM.innerText = `${obj.price}kr`;

        }

        else if (name === obj.name && obj.amount >=2  && symbol === "-") {
            obj.amount -= 1;
            obj.price -= price;

            element.value = obj.amount;
            itemPriceDOM.innerText = `${obj.price}kr`;
        }    
    })


}

function removeFromCartArray (e) {
    const productName = e.closest('.cart-item').querySelector("h4").innerText;
    const itemIndex = cartArray.findIndex(obj => obj.name === productName);
    cartArray.splice(itemIndex, 1);
}

function calculate_And_Return_Rating(rating) {
  const itemRatingContainer = document.createElement('div');
  itemRatingContainer.classList.add('rating');

  const checkedStars = Math.floor(rating);
  const halfStars = rating % 1 === 0.5;
  const emptyStars = 5 - Math.round(rating);

  for (let i = 0; i < checkedStars; i++) {
    const starSpanElement = document.createElement('span');
    starSpanElement.classList.add('fa', 'fa-star', 'checked');
    itemRatingContainer.appendChild(starSpanElement);
  }

  if (halfStars) {
    const halfStarSpanElement = document.createElement('span');
    halfStarSpanElement.classList.add('fa', 'fa-star-half-o');
    itemRatingContainer.appendChild(halfStarSpanElement);
  }

  for (let i = 0; i < emptyStars; i++) {
    const emptyStarSpanElement = document.createElement('span');
    emptyStarSpanElement.classList.add('fa', 'fa-star-half-o');
    itemRatingContainer.appendChild(emptyStarSpanElement);
  }
  return itemRatingContainer;
}


const submitOrderBtn = document.querySelector('.submit-btn');
const resetOrderBtn = document.querySelector('.reset-btn');
const paymentSelector = document.querySelector(".payment-method");

function validateInputField(negate, regex, input, msg ) {
    const doesInputMatchRegex = regex.test(input.value);

    if ((negate && !doesInputMatchRegex) || (!negate && doesInputMatchRegex)) {
        input.setCustomValidity(msg);
    } else {
        input.setCustomValidity('');
    }
    
}

paymentSelector.addEventListener('change', () => {
    displayPaymentMethod(paymentSelector.value);
});

function removePaymentInfo(element) {
    const allInputs = element.querySelectorAll('input');
    allInputs.forEach((input) => {
        input.value = "";
    })
}

function displayPaymentMethod(method) {
    const invoicePaymentDiv = document.querySelector('#payment-invoice');
    const cardPaymentDiv = document.querySelector('#payment-card');

    if (method === 'invoice') {
        removePaymentInfo(cardPaymentDiv);
        cardPaymentDiv.style.display = "none";
        invoicePaymentDiv.style.display = "flex";
    }
    else if (method === 'card') {
        removePaymentInfo(invoicePaymentDiv);
        invoicePaymentDiv.style.display = "none";
        cardPaymentDiv.style.display = "flex";
    }
}

submitOrderBtn.addEventListener("click", () => {
    validateOrderForm();
}); 


function validateOrderForm() {
    /*
    if (cartArray.length < 1) {
        alert("Your cart is empty");
    }
    */
    const hasNumbersOrSymbols = /[\d!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/;
    const containsFiveNumbers = /^\d{5}$/;
    const validPhoneNumber = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    const containsSixteenNumbers = /^\d{16}$/;
    const isYearAndMonth = /^\d{4}\/\d{2}$/;
    const containsThreeNumbers = /^\d{3}$/;
    const isAnSSN = /^(\d{10}|\d{12})$/;



    const userFirstAndLastName = document.querySelectorAll('.user-name');
    userFirstAndLastName.forEach(name => validateInputField(false, hasNumbersOrSymbols, name, "Please exclude any numbers or symbols"));

    const userAdress = document.querySelector('.user-adress');

    const userPostalCode = document.querySelector('.user-postalcode');
    validateInputField(true, containsFiveNumbers, userPostalCode, "Invalid Postal Code");


    const userCity = document.querySelector('.user-city');
    validateInputField(false, hasNumbersOrSymbols, userCity, 'Please exclude any numbers/symbols');
    
    const userPhone = document.querySelector('.user-phone');
    validateInputField(true, validPhoneNumber, userPhone, 'Invalid Phone Number');

    const userEmail = document.querySelector('.user-email');

    const userCardNumber = document.querySelector('.user-card-number');
    const userCardExpiryDate = document.querySelector('.user-card-expiry-date');
    const userCardCvc = document.querySelector('.user-card-cvc');

    const userSSN = document.querySelector('.user-ssn');

    if (userCardNumber.value === "" && userCardExpiryDate.value === "" && userCardCvc.value === "") {
        validateInputField(true, isAnSSN, userSSN, 'Please write your SSN with 10 or 12 digits');
    }

    else if (userSSN.value === "") {
        validateInputField(true, containsSixteenNumbers, userCardNumber, 'Invalid Card Number')
        validateInputField(true, isYearAndMonth, userCardExpiryDate, 'Please write in this format: YYYY/MM');
        validateInputField(true, containsThreeNumbers, userCardCvc, 'Please write a three-digit CVC');
    }

    displayOrderConfirmation(userFirstAndLastName, userAdress, userPostalCode, userCity, userEmail, userPhone);
}

function formIsValid() {
  const formRows = document.querySelectorAll('.form-row[style*="display: flex"]');
  const checkbox = document.querySelector('input[type="checkbox"][required]');
  const selectPayment = document.querySelector('.payment-method');
  let empty = 0;


  formRows.forEach((row) => {
    const requiredInputs = row.querySelectorAll('input[type="text"][required]');

    requiredInputs.forEach((input) => {
      if (input.value === "") {
        empty += 1;
      }
    })

 
  })

  if (empty === 0 && checkbox.checked && selectPayment.selectedIndex !== 0 && cartArray.length >= 1) {
    return true;
  }
  
}




function displayOrderConfirmation (names, adress, postalCode, city, email, phone) {
  const sectionCheckout = document.querySelector('.section-checkout');


  if (!sectionCheckout.querySelector('.order-confirmation') && formIsValid()) {
    const orderConfirmationBox = document.createElement("div");
    orderConfirmationBox.classList.add('order-confirmation');

    const confirmationHeader = document.createElement("h5");
    confirmationHeader.innerText = 'Thank you for the order!'

    const orderedItemsContainer = document.createElement("div");
    cartArray.forEach((item) => {
      const itemRow = document.createElement("div");
      itemRow.classList.add("confirmation-row");

      const itemName = document.createElement("span");
      itemName.innerText = item.name;

      const itemAmount = document.createElement("span");
      itemAmount.innerText = `x ${item.amount}`;

      const itemPrice = document.createElement("span");
      itemPrice.innerText = `${item.price}kr`

      itemRow.appendChild(itemName);
      itemRow.appendChild(itemAmount);
      itemRow.appendChild(itemPrice);
      orderedItemsContainer.appendChild(itemRow);
    })

    
    const infoContainer = document.createElement("div");
    infoContainer.classList.add("user-delivery-info");

    const deliveryMessageParagraph = document.createElement("p");
    deliveryMessageParagraph.innerText = 'Delivery Information:'
    infoContainer.appendChild(deliveryMessageParagraph);

    const deliveryName = document.createElement("span");
    deliveryName.innerText = `${names[0].value} ${names[1].value}`;
    infoContainer.appendChild(deliveryName);

    const deliveryAdress = document.createElement("span");
    deliveryAdress.innerText = `${adress.value}, ${postalCode.value}, ${city.value}`;
    infoContainer.appendChild(deliveryAdress);

    const deliveryContactInfo = document.createElement("span");
    deliveryContactInfo.innerText = `${email.value}, ${phone.value}`;
    infoContainer.appendChild(deliveryContactInfo);


    orderConfirmationBox.appendChild(confirmationHeader);
    orderConfirmationBox.appendChild(orderedItemsContainer);
    orderConfirmationBox.appendChild(infoContainer);
    sectionCheckout.appendChild(orderConfirmationBox);
    
  }

  else if (cartArray.length < 1) {
    alert("Please add the desired items to your cart")
  }

  else if (sectionCheckout.querySelector('.order-confirmation')) {
    alert("Please update your page!");
   }
}

