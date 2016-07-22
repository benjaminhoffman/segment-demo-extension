export function generateNewFormFields (eventName) {

  console.log('htmlforms')


  const PROD_NAME = '<span class="field"> \
    <label>Prod Name: </label> \
    <input type="text" name="prodName" value="Monopoly" /> \
  </span><br />'

  const PROD_ID =
  '<span class="field"> \
    <label>Product ID: </label> \
    <input type="text" name="prodId" value="507f1f77bcf86cd799439011" /> \
  </span><br />'

  const CAT =
  '<span class="field"> \
    <label>Category: </label> \
    <input type="text" name="cat" value="Games" /> \
  </span><br />'

  const PRICE =
  '<span class="field"> \
    <label>Price: </label> \
    <input type="text" name="price" value="18.99" /> \
  </span><br />'

  const QUANTITY =
  '<span class="field"> \
    <label>Quantity: </label> \
    <input type="text" name="quantity" value="3" /> \
  </span><br />'

  const CART_ID =
  '<span class="field"> \
    <label>Cart Id: </label> \
    <input type="text" name="cartId" value="d92jd29jd92jd29j92d92jd" /> \
  </span><br />'

  const PRODUCTS =
  '<span class="field"> \
    <label>Products: </label> \
    <input type="text" name="products" value="Monopoly,Chess,Checkers" /> \
  </span><br />'

  const SKU =
  '<span class="field"> \
    <label>SKU: </label> \
    <input type="text" name="sku" value="G-32" /> \
  </span><br />'


  const TOTAL =
  '<span class="field"> \
    <label>Total: </label> \
    <input type="text" name="total" value="64.49" /> \
  </span><br />'

  const CUSTOM =
  '<span class="field" id="customEvent"> \
    <label>Event Name:</label> \
    <input type="text" name="customTrack" id="customTrackName" value="Button Clicked" /><br /> \
  </span> \
  <span class="field"> \
    <label>Custom Prop1:</label> \
    <input type="text" name="customKey1" value="price" class="label-custom" /> : \
    <input type="text" name="customVal1" value="8.99" class="input-custom" /> \
  </span><br /> \
  <span class="field"> \
    <label>Custom Prop2:</label> \
    <input type="text" name="customKey2" value="size" class="label-custom" /> : \
    <input type="text" name="customVal2" value="large" class="input-custom" /> \
  </span><br /> \
  <span class="field"> \
    <label>Custom Prop3:</label> \
    <input type="text" name="customKey3" value="color" class="label-custom" /> : \
    <input type="text" name="customVal3" value="blue" class="input-custom" /> \
  </span><br />'


  let innerHtml = '';
  switch (eventName) {
    case '*Custom*':
      innerHtml = CUSTOM;
      break;
    case 'Product List Viewed':
      innerHtml = CAT + PRODUCTS;
      break;
    case 'Product Clicked':
      innerHtml = PROD_NAME + PROD_ID + SKU + CAT + PRICE + QUANTITY;
      break;
    case 'Product Added':
      innerHtml = PROD_NAME + PROD_ID + SKU + CAT + PRICE + QUANTITY;
      break;
    case 'Checkout Started':
      innerHtml = CART_ID + PRODUCTS + TOTAL;
      break;
    default:
      break;
  }
  return innerHtml;
}











