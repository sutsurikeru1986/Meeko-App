//functions

function loadMobileHome() {
    $.ajax({
      url: 'http://localhost/meeko/meekomobilehome/',
      type: "get",
      dataType: 'html', 

      beforeSend: function() {
        //$('.ajax-loader-mobile').show();

      },

      success: function(response) {

        $('<div class="mobileMeekoHome"></div>')
        .appendTo('#meekoRequest')
        .html(response);

      },

      error: function(xhr) {
        alert('something went wrong :(');
      },

      complete: function(){
          //$('.ajax-loader-mobile').hide();
     }  
    });
}   

//functions ends

//click events

$(".promos").unbind('click').bind('click', function (e) {

   //e.preventDefault(); 
   $('.mobileMeekoHome').remove(); 
   loadMobileHome();

}); 

$(document).on('click', '.latestmeekomobile, .latestmeekomag', function (e) {

   e.preventDefault(); 
   $('#mobilemeekohome .mobilequicktab .mobiletab p a').removeClass('activetab');

}); 


//click events ends

//document ready

$(document).ready(function() {
		    

    $(".showfooter").click(function(e) {
        $(this).find('i').toggleClass('fa-chevron-up fa-chevron-down');
        $(".hiddenfooter").slideToggle();
        e.preventDefault();
    });    
    
});

//document ready ends

