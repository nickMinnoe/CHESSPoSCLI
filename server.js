// STILL TO DO:

//   Formatting object/array outputs: DONE
//   Help Documentation onLoad and on help DONE
//   Comment stuff better DONE
//   Price range finding DONE
//   Make 10 items with all constraints DONE
//   unique number identifiers DONE


"use strict"

var cart = {
  "items": [],
  "cost": 0
  };
// have a unique id, name, price(without tax) and three categories to group them by
var allWares = [{"name":"dog", "categories":["animal", "fluffy"], "price":150, "SKU":"dog-alfy150"},
                {"name":"monkey", "categories":["animal", "fluffy"], "price":400, "SKU":"monkey-alfy400"},
                {"name":"dog", "categories":["animal", "fluffy"], "price":100, "SKU":"dog-alfy100"},
                {"name":"llama", "categories":["animal", "fluffy"], "price":1000, "SKU":"llama-alfy1000"},
                {"name":"Batman figurine", "categories":["toy"], "price":40, "SKU":"batmanaf-ty40"},
                {"name":"stuffed alpaca", "categories":["toy", "fluffy"], "price":300, "SKU":"alpacas-tyfy300"},
                {"name":"llama keychain", "categories":["toy", "fluffy"], "price":20, "SKU":"llamak-tyfy20"},
                {"name":"hippo", "categories":["toy", "animal"], "price":890, "SKU":"hippo-tyal890"},
                {"name":"hedgehog", "categories":["animal"], "price":250.50, "SKU":"hedgehog-al250"},
                {"name":"Green Arrow figurine", "categories":["toy"], "price":45.25, "SKU":"grnarrowaf-ty45"}];

console.log("You enter shaggy looking tent with a cart attached to it.\nYou pull the tent open you're greeted with a plump man wearing a wide grin,\n\"What can I help you with?\"\n");
console.log("Acceptable commands are: \nWARES: display all available wares \nWARES ABOVE/BELOW <#>: display all wares above/below specified price \nWARES BETWEEN <#> AND <#>: display all wares between prices \nPICK-UP <str>: pick-up first matching item \nDROP <str>: drop first matching item \nHOLDING: display what's currently in your cart \nCHECKOUT <#>: buy items in cart with money \nHELP: display this menu again \nLEAVE: exit shop if your hands are empty\n");

process.stdin.resume();
process.stdin.setEncoding('utf8');

// user input please?
process.stdin.on('data', function (text) {
  console.log(' ');
  
  // grab the first word, the base command to test
  // everything else gets saved for use
  var firstWord = "";
  var words = null;
  if(text.indexOf(' ') > -1){
    words = text.trim().substring(text.indexOf(' ')+1);
    firstWord = text.substring(0, text.indexOf(' '));
  } else{
    firstWord = text.trim();
  }
  
  switch(firstWord) {
    case "wares":
      // list wares - need an array for this method
      if(words) words = words.split(' ');
      availableWares(words);
      break;
    case "pick-up":
      // add items to your cart
      addToCart(words);
      break;
    case "drop":
      // remove items from your cart
      removeFromCart(words);
      break;
    case "holding":
      // check items in your cart
      checkCart();
      break;
    case "checkout":
      // buy items in your cart
      purchase(words);
      break;
    case "help":
      // diplay help "menu"
      displayHelp();
      break;
    case "leave":
      // leave the store
      leaveStore();
      break;
    default:
        console.log("The old man says, \"Speak up sonny, I'm not sure I understood you.\"\nIf you need help, say HELP.\n");
  }
});

// search through the wares by Price range, name, or SKU  ~~~~~~~~~~~~~~~~~~~~
// accepts an array to change comparison and fill out comparison
function availableWares(args) {
  if(args){
    // cmd tests for the compare test to be set
    var items = [];
    var cmd = args[0];
    var compare = "";

    if(cmd == "below"){
      compare = "product['price'] < parseInt(args[1])";
    } else if(cmd == "above"){
      compare = "product['price'] > parseInt(args[1])";
    } else if(cmd == "between"){
      compare = "parseInt(args[1]) < product['price'] && product['price'] < parseInt(args[3])";
    }else{
      compare = "product['name'].indexOf(cmd)>-1||product['categories'].indexOf(cmd)>-1||product['SKU'].indexOf(cmd)>-1";
    }
    // cycle through all wares for the ones that fit
    allWares.forEach(function(product){
        if(eval(compare)){
          items.push(product);
        }
    });
    // format output : GDTOP
    items.length > 0 ? displayObj(items) : console.log("\"Looks like I don't have any of those.\"");
  } else{
    // format output: GDTOP
    displayObj(allWares);
  }
}  // end availableWares

// add an item to your cart   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// accepts a string to compare against wares
function addToCart(args) {
  // list wares left
  if(args){
    var search = args;
    var item = null;
    var index;
    // search for the first item matching your result
    for(var i=0;i<allWares.length;i++){
      if(allWares[i]["name"].indexOf(search)>-1||allWares[i]["SKU"].indexOf(search)>-1){
        item = allWares[i];
        index = i;
        break;
      }
    }
    // if your item was found, put it in your cart
    // the taxed price added to total cost
    if(item){
      var taxedPrice = item["price"] * 1.08;
      cart["cost"] = Math.round((cart["cost"]+taxedPrice)*100)/100;
      allWares.splice(index, 1);
      cart["items"].push(item);
      
      console.log("In your hands you carry:");
      displayObj(cart);
    } else{
      console.log("What were you looking for?");
    }
  } else{
    console.log("You need to specify what you want.");
  }
} // end addToCart

// remove an item from your cart  ~~~~~~~~~~~~~~~~~~~~~~~~~~~
// accepts a string to compare items against
function removeFromCart(args){
  if(args){
    var search = args;
    var item = null;
    var index;
    // search for the item you want to drop
    for(var i=0;i<cart["items"].length;i++){
      if(cart["items"][i]["name"].indexOf(search)>-1||cart["items"][i]["SKU"].indexOf(search)>-1){
        item = cart["items"][i];
        index = i;
        break;
      }
    }
    // remove the item from your cart
    // remove the taxed value from the carts price
    if(item){
      var taxedPrice = item["price"] * 1.08;
      cart["cost"] = Math.round((cart["cost"]-taxedPrice)*100)/100;
      cart["items"].splice(index, 1);
      allWares.push(item);
      console.log("In your hands you hold:");
      displayObj(cart);
    } else{
      console.log("You're not holding that.");
    }
  } else{
    console.log("You need to say what you want to drop.");
  }
} // end removeCart

// What's in your cart?   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function checkCart(){
  // format output of cart: GDTOP
  displayObj(cart);
}

// Buy whatever is in your cart, assuming enough payment   ~~~~~~~~~~~~~~~~~~~~
// Accepts stringafied number
function purchase(args){
  if(args){
    // must provide a payment, make sure it's valid
    var argInt = parseInt(args);
    if(!isNaN(argInt)){
      if(argInt >= cart["cost"]){
        console.log("The final price is $"+cart["cost"]+". Out of $"+args[0]+"?");
        var diff = parseInt(cart["cost"])-argInt;
        console.log("\"Wonderful!\" *The old man gives you your change $"+diff+".*");
        console.log("You store the items in your pack and forget about them");
        cart = {
          "items": [],
          "cost": 0
        };
      } else{
        // didn't pay enough
        console.log("\"Looks like this isn't enough.\"\n*The old man returns your money*");
      }
    } else{
      // not a number
      console.log("What is this?");
    }
  } else {
    // didn't provide argument
    console.log("I won't just hand these over, checkout with some money.");
  }
} // end purchase

// Display the usable commands   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function displayHelp(){
  console.log("Acceptable commands are: \nWARES: display all available wares \nWARES ABOVE/BELOW <#>: display all wares above/below specified price \nWARES BETWEEN <#> AND <#>: display all wares between prices \nPICK-UP <str>: pick-up first matching item \nDROP <str>: drop first matching item \nHOLDING: display what's currently in your cart \nCHECKOUT <#>: buy items in cart with money \nHELP: display this menu again \nLEAVE: exit shop if your hands are empty\n");
}

// accepts an array to loop over to print
function displayObj(things){
  var arr = "";
  things["cost"] ? arr = "things['items']" : arr = "things";
  if(eval(arr).length){
    eval(arr).forEach(function(item){
      var tabs = "\t";
      if(item["name"].length < 7) tabs+="\t";
      if(item["name"].length < 16) tabs+="\t";
      console.log(item["SKU"]+"\t"+item["name"]+tabs+"price before tax: "+item["price"]);
    });
  }
  
  if(!isNaN(things["cost"])) console.log("\nTotal cost: "+things["cost"]);
  console.log("");
}

// Leave the store if you're cart is empty ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function leaveStore() {
  if(cart["items"].length > 0){
    console.log("You can't just walk out with things in your hands!");
  } else{
    console.log("You turn and leave the store, nothing left you want to buy.");
    process.exit();
  }
}