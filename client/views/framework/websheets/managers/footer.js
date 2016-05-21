Template.footer.onCreated(function () {
  this.subscribe('workhours', 					websheets.public.generic.ORG_NAME);	       
  //console.log(appUUID + ':done subscribing to workHours at footer template level...');		
});