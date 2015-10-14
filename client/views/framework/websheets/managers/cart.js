Template.cart.helpers({    haveItemMessageToKitchen:function (cartItem)    {        if (cartItem.messageToKitchenByItem)        {            return true;        }        else        {            return false;        }    },     haveItemSize:function (cartItem)    {        if (cartItem.itemSize)        {            return true;        }        else        {            return false;        }    },    haveSpiceLevel:function(cartItem)    {        if (cartItem.spiceLevel)        {            return true;        }        else        {            return false;        }    },	currency: function(num)    {        	return '$' + Number(num).toFixed(2);    },    sessionId:function()    {    	return Session.get('appUUID');    },    shopCart: function()    {        var orgname = Session.get(websheets.public.generic.ORG_NAME_SESSION_KEY);        var tax             = Settings.findOne({$and : [{Key: "tax"}, {orgname:orgname}, {Value : {"$exists" : true, "$ne" : ""}}]});        var sale_discount   = Settings.findOne({$and : [{Key: "sale_discount"}, {orgname:orgname},{Value : {"$exists" : true, "$ne" : ""}}]});        var sessid          = Session.get('appUUID');                    var shopCart    = [];        var cartItems   = CartItems.find({session: sessid});        shopCart.itemCount = cartItems.count();        var total = 0;        cartItems.forEach(function(cartItem)        {            var item = _.extend(cartItem,{});            total += cartItem.totalPrice;            shopCart.push(cartItem);        });                    shopCart.subtotal = total;        var sale_discountValue = 0;        if (sale_discount)        {            sale_discountValue = Number(sale_discount.Value);                    }         var taxValue = Number(tax.Value);            if(sale_discountValue > 0 && taxValue > 0)            {                shopCart.discount               = shopCart.subtotal * sale_discountValue;                shopCart.subtotalAfterDiscount  = shopCart.subtotal - shopCart.discount;                shopCart.tax                    = shopCart.subtotalAfterDiscount  * taxValue;                shopCart.total                  = shopCart.subtotalAfterDiscount + shopCart.tax;                shopCart.message                = "Total (" + sale_discountValue *100 +"% discount & tax)";            }            else            if (sale_discountValue > 0 && taxValue <= 0)            {                shopCart.discount               = shopCart.subtotal * sale_discountValue;                shopCart.subtotalAfterDiscount  = shopCart.subtotal - shopCart.discount;                shopCart.total                  = shopCart.subtotalAfterDiscount;                shopCart.message                = "Total (" + sale_discountValue *100 +"% discount)";            }            else            if (sale_discountValue <=  0 && taxValue > 0)            {                 shopCart.tax = shopCart.subtotal * taxValue;                 shopCart.total = shopCart.subtotal + shopCart.tax;                 shopCart.message= "Total (Including Tax)";            }             else            {                shopCart.total = shopCart.subtotal                 shopCart.message= "Total"                            }            return shopCart;                     }});Template.cart.events({    'click #checkout-modal-close-trigger' : function(evt, tmpl)    {        $("#checkout-modal-modal").fadeToggle('fast');    },    'click #checkout-modal-trigger' : function(evt, tmpl)    {        $("#checkout-modal-modal").fadeToggle('fast');    },    'click #inputRadioPickUp': function(evt, tmpl)    {     $("#creditcarddetails").hide('slow');    },     'click #inputRadioNow': function(evt, tmpl)    {      $("#creditcarddetails").show('slow');      },    'click .removecart': function(evt,tmpl)    {        var currentTarget   = evt.currentTarget        var sessid          = Session.get('appUUID');        var orgname         = Session.get(websheets.public.generic.ORG_NAME_SESSION_KEY);        Meteor.call('removeCartItem', this.product, sessid, orgname, this._id);    },    'click #product_in_cart , focusout  #product_in_cart': function (event, template)     {        event.preventDefault();        var selectedValue   = Number (event.currentTarget.value);        product             = this.product;        sessid              = Session.get('appUUID');        var orgname         = Session.get(websheets.public.generic.ORG_NAME_SESSION_KEY);        console.log('this._id  = ' +  this._id);                        var cartItem={};                        cartItem.qty        = selectedValue;                        cartItem.product    = product;                        cartItem.session    = sessid;                        cartItem.Name       = this.Name;                         cartItem.Category   = this.Category;                        cartItem.Price      = this.Price;                        cartItem.orgname    = orgname;                        cartItem.cartId     = this._id;                        cartItem.messageToKitchenByItem =this.messageToKitchenByItem;            if(selectedValue ===0)            {                if(confirm('Are you sure want to remove the item ?'))                {                    Meteor.call('addToCart', cartItem);                }                else                {                    event.currentTarget.value = this.qty;                }            }            else            {                if(Number.isInteger(selectedValue))                {                    Meteor.call('addToCart', cartItem);                }                else                {                    alert( 'Please enter a valid number.');                    event.currentTarget.value = this.qty;                }            }    },    'keyup #inputPhoneNumber': function (event, template)     {        event.currentTarget.value= Phoneformat.formatLocal(countryCode(Session.get(websheets.public.generic.ORG_NAME_SESSION_KEY)), event.currentTarget.value);    },      'keyup #product_in_cart': function (event, template) {        var isIgnore = false;        var currentTargetValue = event.currentTarget.value;        if(event.keyCode ==='8' || event.keyCode == 8)        {            if(currentTargetValue.length >0)            {                //Intentional            }            else            {                isIgnore = true;            }        }        if( ! isIgnore)        {            var selectedValue   = Number (currentTargetValue);            product             = this.product;            sessid              = Session.get('appUUID');            var orgname         = Session.get(websheets.public.generic.ORG_NAME_SESSION_KEY);                        var cartItem={};                        cartItem.qty        = selectedValue;                        cartItem.product    = product;                        cartItem.session    = sessid;                        cartItem.Name       = this.Name;                         cartItem.Category   = this.Category;                        cartItem.Price      = this.Price;                        cartItem.orgname    = orgname;                        cartItem.cartId     = this._id;                        cartItem.messageToKitchenByItem =this.messageToKitchenByItem;            if(selectedValue === 0)            {                if(confirm('Are you sure to remove the item ?'))                {                    Meteor.call('addToCart', cartItem);                }                else                {                    event.preventDefault();                    event.currentTarget.value = this.qty;                }            }            else            {                if(Number.isInteger(selectedValue))                {                    Meteor.call('addToCart', cartItem);                }                else                {                    alert( 'Please enter a valid number.');                    event.currentTarget.value = this.qty;                }            }        }  },	'click #placeOrder': function(event)    {        event.preventDefault();        $placeOrderButton = $('#placeOrder');        $placeOrderButton.html('processing...');        var orgname = Session.get(websheets.public.generic.ORG_NAME_SESSION_KEY);        console.log('placeOder: ' + orgname);        $contactInfoError = $('#contactInfoError');        $contactInfoError.text('');               var isPayNow = $('#inputRadioNow').prop( "checked" );        $contactName        = $('#inputContactName')        $inputEmail         = $('#inputEmail')        $intputPhoneNumber  = $('#inputPhoneNumber')        //Remove the error class        $contactName.removeClass("error-highlight");        $inputEmail.removeClass("error-highlight");        $intputPhoneNumber.removeClass("error-highlight");        var contactInfo = {};        contactInfo.phoneNumber         = Phoneformat.formatLocal(countryCode(Session.get(websheets.public.generic.ORG_NAME_SESSION_KEY)), $intputPhoneNumber.val());        contactInfo.email               = $inputEmail.val();        contactInfo.messageToKitchen    = $('#inputMessageToKitchen').val();        contactInfo.contactName         = $contactName.val();        var validationResult = true;        if( ! contactInfo.contactName )        {                        $contactName .attr('style', 'border-color: red;')            $contactName .attr('title', 'Please enter a name.')            $contactName. addClass("error-highlight");            $contactInfoError.text('Please fill the above highlighted fileds');                   $placeOrderButton.html('place Order');            validationResult = false;        }        if( ! contactInfo.email )        {                        $inputEmail .attr('style', 'border-color: red;')            $inputEmail. addClass("error-highlight");            $contactInfoError.text('Please fill the above highlighted fileds');              $placeOrderButton.html('place Order');            validationResult = false;                    }        else        if(!contactInfo.email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))        {            $inputEmail .attr('style', 'border-color: red;')            $inputEmail. addClass("error-highlight");            $contactInfoError.text('Please enter a valid email.');              $placeOrderButton.html('place Order');            validationResult = false;        }        if(! contactInfo.phoneNumber)        {            $intputPhoneNumber .attr('style', 'border-color: red;')            $intputPhoneNumber .addClass("error-highlight");            $contactInfoError.text('Please fill the above highlighted fileds');              $placeOrderButton.html('place Order');            validationResult = false;                    }         var paymentInfo;try{        if(isPayNow)        {                   paymentInfo = {};            $inputCardNumber        = $('#inputCardNumber')            $inputCardExpiryMonth   = $('#inputCardExpiryMonth')            $inputCardExpiryYear    = $('#inputCardExpiryYear')            $inputCVC               = $('#inputCVC')            $inputCardNumber.removeClass("error-highlight");            $inputCardExpiryMonth.removeClass("error-highlight");            $inputCardExpiryYear.removeClass("error-highlight");            $inputCVC.removeClass("error-highlight");            paymentInfo.cardNumber      = $inputCardNumber .val();            paymentInfo.cardExpiryMonth = $inputCardExpiryMonth.val();            paymentInfo.cardExpiryYear  = $inputCardExpiryYear.val();            paymentInfo.cardCVC         = $inputCVC .val();            var ccValidateReg  = "^(?:(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$";            if( ! paymentInfo.cardNumber )            {                                $inputCardNumber .attr('style', 'border-color: red;')                $inputCardNumber .addClass("error-highlight");                $contactInfoError.text('Please fill the above highlighted fileds');                  $placeOrderButton.html('place Order');                validationResult = false;                            }            else            if( ! paymentInfo.cardNumber .match(ccValidateReg))            {                          $inputCardNumber .attr('style', 'border-color: red;')                $inputCardNumber .addClass("error-highlight");                $contactInfoError.text('Please enter a valid Credit Card number');                  $placeOrderButton.html('place Order');                validationResult = false;            }            else if( ! Stripe.card.validateCardNumber(paymentInfo.cardNumber))            {                $inputCardNumber .attr('style', 'border-color: red;')                $inputCardNumber .addClass("error-highlight");                $contactInfoError.text('Please enter a valid Credit Card number');                  $placeOrderButton.html('place Order');                validationResult = false;            }            if(! paymentInfo.cardExpiryMonth )            {                $inputCardExpiryMonth.attr('style', 'border-color: red;')                $inputCardExpiryMonth .addClass("error-highlight");                $contactInfoError.text('Please fill the above highlighted fileds');                  $placeOrderButton.html('place Order');                        validationResult = false;                            }            if( ! paymentInfo.cardExpiryYear)            {                $inputCardExpiryYear .attr('style', 'border-color: red;')                $inputCardExpiryYear .addClass("error-highlight");                $contactInfoError.text('Please fill the above highlighted fileds');                  $placeOrderButton.html('place Order');                validationResult = false;                            }            if(validationResult)            {               if( ! Stripe.card.validateExpiry(paymentInfo.cardExpiryMonth, paymentInfo.cardExpiryYear))               {                    validationResult = false;                     $inputCardExpiryMonth.attr('style', 'border-color: red;')                    $inputCardExpiryMonth .addClass("error-highlight");                    $inputCardExpiryYear .attr('style', 'border-color: red;')                    $inputCardExpiryYear .addClass("error-highlight");                    $contactInfoError.text('Please enter a future date.');                    $placeOrderButton.html('place Order');               }                var today = new Date();                var someday = new Date();                someday.setFullYear(paymentInfo.cardExpiryYear, paymentInfo.cardExpiryMonth, 1);                if (someday < today)                 {                    validationResult = false;                     $inputCardExpiryMonth.attr('style', 'border-color: red;')                    $inputCardExpiryMonth .addClass("error-highlight");                    $inputCardExpiryYear .attr('style', 'border-color: red;')                    $inputCardExpiryYear .addClass("error-highlight");                    $contactInfoError.text('Please enter a future date.');                    $placeOrderButton.html('place Order');                }            }            var cvcValidateReg = "^[0-9]{3,4}$";           if(! paymentInfo.cardCVC )            {                $inputCVC .attr('style', 'border-color: red;')                $inputCVC .addClass("error-highlight");                $contactInfoError.text('Please fill the above highlighted fileds');                  $placeOrderButton.html('place Order');                validationResult = false;                            }            else            if( ! paymentInfo.cardCVC .match(cvcValidateReg))            {                          $inputCVC .attr('style', 'border-color: red;')                $inputCVC .addClass("error-highlight");                $contactInfoError.text('Please enter a valid cvc number');                  $placeOrderButton.html('place Order');                validationResult = false;            }             else            if( ! Stripe.card.validateCVC (paymentInfo.cardCVC))            {                          $inputCVC .attr('style', 'border-color: red;')                $inputCVC .addClass("error-highlight");                $contactInfoError.text('Please enter a valid cvc number');                  $placeOrderButton.html('place Order');                validationResult = false;            }          if(validationResult )        {                if(isPaymentStripe(orgname))                {                        Stripe.setPublishableKey(Meteor.settings.public[orgname].stripe.publicKey);                        Stripe.card.createToken(                        {                            number      : paymentInfo.cardNumber,                            cvc         : paymentInfo.cardCVC,                            exp_month   : paymentInfo.cardExpiryMonth,                            exp_year    : paymentInfo.cardExpiryYear                         },                         function(status, response)                         {                                if (response.error)                                 {                                            // Show the errors on the form                                    for(var key in response.error)                                    {                                        console.log( key +' = ' + response.error[key]);                                    }                                    $contactInfoError.text(response.error.message);                                    return false;                                }                                 else                                 {                                    // token contains id, last4, and card type                                    var token   = response.id;                                    var sessid  = Session.get('appUUID');                                    var contact                                    Meteor.call('getNextSequenceValue',function(error, result)                                    {                                        if(error)                                        {                                            console.log("Trouble getting the next sequence number");                                        }                                        else                                        {                                            var sequence = result;                                            Meteor.call('orderItems',sessid, contactInfo, sequence, orgname, response, function(error, result)                                            {                                                if(error)                                                {                                                    if(result)                                                    {                                                        console.log("Could not insert the order for the session  = " + sessid + "Order = " + JSON.stringify(result, null, 4));                                                    }                                                    else                                                    {                                                        console.log("Could not insert the order for the session  = " + sessid );                                                    }                                                }                                                else                                                {                                                    console.log("sessid = " + sessid);                                                    console.log("sequence._id= " + sequence._id);                                                    Router.go('os',  {UniqueId: sequence._id});                                                }                                            });                                        }                                     });                                }                        });                }           }                    }        else        if(validationResult )        {            var sessid = Session.get('appUUID');            var contact            Meteor.call('getNextSequenceValue',function(error, result)            {                if(error)                {                    //Intentional                }                else                {                    var sequence = result;                           Meteor.call('orderItems',sessid, contactInfo, sequence, orgname, function(error, result)                    {                        if(error)                        {                            if(result)                            {                                 console.log(sessid + ": could not insert the order for the session  = " + sessid + "Order = " + JSON.stringify(result, null, 4));                            }                                else                            {                                 console.log(sessid + ": Could not insert the order for the session  = " + sessid );                            }                            }                            else                            {                                console.log(sessid + ": sequence._id       =  " + sequence._id);                            }                    });                }                 Router.go('os',  {UniqueId: sequence._id});            });        }     }catch (e)     {        console.log(e instanceof SyntaxError);          console.log(e.message);                         console.log(e.name);                            console.log(e.fileName);                        console.log(e.lineNumber);                      console.log(e.columnNumber);                    console.log(e.stack);       }          }});