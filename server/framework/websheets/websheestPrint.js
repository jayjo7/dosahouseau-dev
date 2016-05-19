Meteor.methods({


	postWebsheetsPrint:function(doc)
	{
		var response ={};
    var printerUrl = websheetsprintApiUrl(doc.orgname);
    console.log(doc.sessionId + ": postWebsheetsPrint:printerUrl: " + printerUrl);
    var paramsObject = buildParamsObject(doc)
    console.log(doc.sessionId + ": postWebsheetsPrint:paramsObject: " + JSON.stringify(paramsObject, null, 4));

		 try{
  				
  			response = HTTP.get(printerUrl,
  			  	{
  					params: paramsObject,
  					followAllRedirects: true
  				});


  			console.log(doc.sessionId + ": postWebsheetsPrint:Done invoking HTTP.Post to websheets");

  			if(response.statusCode != 200)
  			{
  				console.log('postWebsheetsPrint-Failed', 'Order posting to websheets failed with http status code [' + response.statusCode  + ']', e);
  			}
       // else
       //{
       //     console.log(doc.sessionId +": postWebsheetsPrint:response.content:: " +JSON.stringify(response.content, null, 4));
       //
       // }

							
		}catch (e)
		{
			console.log(doc.sessionId + ': postWebsheetsPrint-Failed', 'Could not post the order to Websheets Printer', e);
      response.paramsObject         = paramsObject;
      response.printerUrl           = printerUrl;
			response.websheetsPrintError  = e;
      response.websheetsPrint       = false;
		}
    console.log(doc.sessionId +": postWebsheetsPrint:response:: " +JSON.stringify(response, null, 4));

		return response;

	}

});

var buildParamsObject = function(doc)
{
  var params =
  {
      op      : websheetsprintOperation(doc.orgname),
      unm     : websheetsprintUserName(doc.orgname),
      dno     : websheetsprintDeviceName(doc.orgname),
      key     : websheetsprintApiKey(doc.orgname),
      mode    : websheetsprintMode(doc.orgname),
      msgno   : doc.OrderNumber,
      content : buildContentString(doc)
  }
  console.log(doc.sessionId  + ": buildParamsObject : params: " +JSON.stringify(params, null, 4));


  return params;
}


//8 :  12 - Characters
//7 :  16 - Characters 
//6 :  24 - Characters
//5 :  32 - Characters
//4 :  42 - Characters

var fontEightCharCount  = 12;
var fontSevenCharCount  = 16;
var fontSixCharCount    = 24;
var fontFiveCharCount   = 32;
var fontFourCharCount   = 42;

var buildContentString =function(doc)
{

    var content="";


  //Start Org Name Sizing
  var orgnameLength = getStoreName(doc.orgname).length;

  var diffWithFontSevenSize = fontSevenCharCount - orgnameLength;

  console.log(doc.sessionId + ": buildContentString : diffWithFontSevenSize   : " + diffWithFontSevenSize);

  if(diffWithFontSevenSize == 0)
  {
      content =  "|7" + doc.orgname.toUpperCase();
  }
  else if(diffWithFontSevenSize > 0)
  {
    content =  "|7";
    var preSpace = diffWithFontSevenSize/2;
    for( var i = 0; i<preSpace; i++)
    {
      content = content + " ";
    }
     content = content+doc.orgname.toUpperCase();
  }
  else
  {
      content =  "|6";
      var diffWithFontSixCharCount = fontSixCharCount - orgnameLength;
      var preSpace = diffWithFontSixCharCount/2;
      for( var i = 0; i<preSpace; i++)
      {
        content = content + " ";
      }
       content = content+doc.orgname.toUpperCase();
  }
  console.log(doc.sessionId + ": buildContentString : content (partial)  : " + content);


  var content = content + "|5********************************" ;
  var content = content + "|7" + "   Order# " +  doc.OrderNumber;
  var content = content + "|5********************************" ;
  var content = content + "|5  " ;
  for (key in doc.itemsObject)
  {
      console.log(doc.sessionId +  ": buildContentString : Key   : " + key);

      var item = doc.itemsObject[key];
      var content = content + "|5 " ; 

        if(item.itemCode && isPrintItemCode(doc.orgname))
        {

          content = content + item.qty  + "  -  " + item.name; 

        }
        else
        {

          content = content + item.qty  + "  -  " + item.itemCode; 

        }

        content = content + item.totalItemPrice;

        if(item.itemSize)
        {
          content = content + "|5 " + '       [Size - ' + item.itemSize + ']';

          //itemString += ' [Size - ' + cartitems.itemSize + ']';
        }
        if(item.spiceLevel)
        {

          content = content + "|5 " + '       [SpiceLevel - ' + item.spiceLevel + ']';

          //itemString += '[SpiceLevel - ' + cartitems.spiceLevel + ']';
        }
        if(item.messageToKitchenByItem)
        {

          content = content + "|5 " + '       [Message - ' + item.messageToKitchenByItem + ']';

          //itemString += '[Message - ' + cartitems.messageToKitchenByItem + ']';
        }
        content  = content + "|5  ";
      //console.log( "item.name :  " + item.name);
      //console.log( "item.qty  :  " + item.qty);
      //console.log( "item.itemSize  : " + item.itemSize);
      //console.log( "item.spiceLevel  : " + item.spiceLevel);
      //console.log( "item.messageToKitchenByItem  : " + item.messageToKitchenByItem);
      //console.log( "tem.price  : " + item.price);

  }


  //var content = content + "|"+  doc.Items ;
  //var content = content + "|"; //Adding a empty line
  //var content = content + "|5*********************************" 
  var content  = content + "|5  ";
  if(doc.MessageToKitchen)
  {
    content  = content + "|5" + 'Message to Kitchen - ' + doc.MessageToKitchen ;
  }
  var content  = content + "|5  ";

  var content  = content + "|6" + "Total Items: "   + doc.TotalItem;
  var content  = content + "|5  "; 


  var content  = content + "|5" + "Sub Total :    "   + doc.SubTotal;
  var content  = content + "|5" + "Tax       :    "   + doc.tax;

  if (doc.discount)
  {
     content  = content + "|5" + "Doscount  :    "   + doc.discount;
  }

  var content  = content + "|5" + "Total     :    "   + doc.Total;
  var content  = content + "|5  ";

  var content  = content + "|4" + "Customer Name: " + "|7"  + doc.CustomerName;
  var content  = content + "|5  ";

  var content  = content + "|4" + "Customer Phone: " + "|7"  + doc.CustomerPhone;
  var content  = content + "|5  ";

  var content  = content + "|5********** Thank you! **********";

  console.log(doc.sessionId +  ":buildContentString : content: " + content);

  return content

}