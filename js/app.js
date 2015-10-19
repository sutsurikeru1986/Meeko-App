$(window).bind("load", function () {
    $(document).foundation();
});

var meekoApi = 'http://localhost/meeko';
var partialLocation = 'http://localhost/partials/';
var environmentUrl = '/';

var meekoApp = angular.module('meekoApp', ['ngRoute', 'ngAnimate', 'ngResource', 'ngSanitize', 'ngTouch'])



/**
 *
 *	Configure our app
 *
 */


.config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider, $rootScope, $scope)
{
	/**
	 *	Configure routes
	 */
    $routeProvider
    .when(environmentUrl , {
        templateUrl: partialLocation + 'index.html'
        //controller: 'GetPage'
    })
    .when(environmentUrl + 'styles/', {
        templateUrl: partialLocation + 'dressTypes.html',
        controller: 'dressTypes',
        animate: 'slideLeft'
    })    
    .when(environmentUrl + 'magazine/', {
        templateUrl: partialLocation + 'blog.html',
        controller: 'BlogList',
        animate: 'slideLeft'
    })
    .when(environmentUrl + 'magazine/page/:page', {
        templateUrl: partialLocation + 'blog.html',
        controller: 'BlogList',
        animate: 'slideRight'
    })
    .when(environmentUrl + 'magazine/:category', {
        templateUrl: partialLocation + 'blog.html',
        controller: 'BlogList',
        animate: 'slideLeft'
    })
    .when(environmentUrl + 'magazine/:category/:post', {
        templateUrl: partialLocation + 'post.html',
        controller: 'BlogPost',
        animate: 'slideright'
    })
    .when(environmentUrl + 'search', {
        templateUrl: partialLocation + 'productList.html',
        controller: 'ProductList',
        animate: 'slideRight'
    })    
   .when(environmentUrl + 'search/:searchedDress', {
        templateUrl: partialLocation + 'searchresults.html',
        controller: 'searchResults',
        animate: 'slideRight'
    })     
    .when(environmentUrl + 'search/:searchedDress/page/:page', {
        templateUrl: partialLocation + 'searchresults.html',
        controller: 'searchResults',
        animate: 'slideRight'
    })        
    .when(environmentUrl + 'product/', {
        templateUrl: partialLocation + 'productList.html',
        controller: 'ProductList',
        animate: 'slideLeft'
    })
    .when(environmentUrl + 'product/page/:page', {
        templateUrl: partialLocation + 'productList.html',
        controller: 'ProductList',
        animate: 'slideLeft'
    })    
    .when(environmentUrl + 'product/:productcategory', {
        templateUrl: partialLocation + 'productListCat.html',
        controller: 'ProductList',
        animate: 'slideLeft'
    })
    .when(environmentUrl + 'product/:productcategory/page/:page', {
        templateUrl: partialLocation + 'productListCat.html',
        controller: 'ProductList',
        animate: 'slideLeft'
    })    
    .when(environmentUrl + 'product/:productcategory/:post', {
        templateUrl: partialLocation + 'ProductDetails.html',
        controller: 'ProductDetails',
        animate: 'slideLeft'
    })
    .when(environmentUrl + 'product/prev/:postnocat', {
        templateUrl: partialLocation + 'ProductDetails.html',
        controller: 'ProductDetails'
    })   
    .when(environmentUrl + 'product/next/:postnocat', {
        templateUrl: partialLocation + 'ProductDetails.html',
        controller: 'ProductDetails'
    })    
    .when(environmentUrl + 'about/', {
        templateUrl: partialLocation + 'index.html',
        animate: 'slideLeft'
        
    })         
    .otherwise({
        redirectTo: environmentUrl
    });   
    
     /**
     *	Sampling caching everything to see how the performance is impacted
     */   
     $httpProvider.defaults.cache = true;
    
    /**
     *	Remove # from the URL with $locationProvider
     */
     $locationProvider.html5Mode(true).hashPrefix('!');
    
    
    var focusSearch = angular.element('.searchiconmobile');
    
    focusSearch.click(function() {
        $('#search').focus();
        console.log('focused input');
    });
    
}])


/**
 *
 *	Filters to be applied in controllers
 *
 */

// sorts currency and removes [" "] around the number, then adds £
angular.module('meekoApp').filter('myCurrency', ['$filter', function ($filter) {
  return function(input) {
    input = parseFloat(input);

    if(input % 1 === 0) {
      input = input.toFixed(0);
    }
    else {
      input = input.toFixed(2);
    }

    return '£' + input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
}])

meekoApp.filter('prevDress', function () {
    return function (text) {
        return escape(text).replace("http%3A//localhost/meeko/product/", "product/prev/");
    };
})

meekoApp.filter('nextDress', function () {
    return function (text) {
        return escape(text).replace("http%3A//localhost/meeko/product/", "product/next/");
    };
})


.controller('goBack', function ($scope, $rootScope, $location) {

    var history = [];

    $rootScope.$on('$routeChangeSuccess', function () {
        
        history.push($location.$$path);
        
        $rootScope.currentPath = $location.path();

        //console.log($rootScope.currentPath);

        //check to see current path, if the page equals '/' don't show a back button
        var hideBack = '/';
        var hidebtn = angular.element('.gobackmobile');

        if ($rootScope.currentPath === hideBack) {
            
            hidebtn.addClass('testerino');

        // when the path changes, show the back button
        } else if ($rootScope.currentPath != hideBack) {
            
            hidebtn.removeClass('testerino');

        }        
    });

    $rootScope.back = function () {
        var prevUrl = history.length > 1 ? history.splice(-2)[0] : "/";
        $location.path(prevUrl);
    };

})

/**
 *
 *	Pass search terms
 *
 */


//search controller to pass the search term into the url - this then calls another controller called searchResults

.controller('searchController', function($scope, $rootScope, $http, $routeParams, $location) {  
    // this field is bound to ng-model="search" in your HTML 
    $scope.search = '';

    $scope.fetchResults = function(search) {

        console.log(search);
        $location.url('search/' + search);
        
        //clear search once submitted
        $scope.search = '';
    };      

    // this line will be called once when controller is initialized
})

/**
 *
 *	On runtime define the page titles for injecting into the page <title> tag
 *
 */

.controller('MenuController', function($scope, $location, $rootScope){
    $scope.isActive = function(route) {
       return route === $location.url();
    }
    
    $rootScope.urlLocation = 'http://localhost/';
})



/**
 *
 *	Set up a controller called GetPage which is referenced by the
 *	routing set up above. We are passing a URL (using $location.url()) 
 *	to the API in order to retrieve information for the specific page
 *
 */
.controller('GetPage', function($scope, $rootScope, $http, $location){

	/**
	 *	Perform a GET request on the API and pass the slug to it using $location.url()
	 *	On success, pass the data to the view through $scope.page
	 */
	$http.get(meekoApi + '/api/get_page/?custom_fields=all&slug=' + $location.url())
    .success(function(data, status, headers, config){
        $scope.page = data.page;

        // Inject the title into the rootScope
        $rootScope.title = data.page.title;
    })
    .error(function(data, status, headers, config){
        //window.alert("no page");
    })

})



.controller('BlogList', function($scope, $rootScope, $http, $routeParams){
    
    $scope.loader = { 
        loading: true,
    };

    /** 
     *  Get the parameter passed into the controller (if it exists)
     *  and then construct the GET URL. If parameter exists, the user
     *  is looking at a specific category.
     */
    if($routeParams.category)
    {
        /**
         *  Get posts from a specific category by passing in the slug
         */
        var url = $http.get(meekoApi + '/api/get_category_posts/?post_type=magazine&custom_fields=all&slug=' + $routeParams.category, { cache: true });
        
        $rootScope.title = 'Magazine | Meeko';
    }
    
    else
    {
        if($routeParams.page)
        {
            /**
             *  If a page parameter has been passed, send this to the API
             */
            var url = $http.get(meekoApi + '/api/get_posts/?post_type=magazine&custom_fields=all&page=' + $routeParams.page, { cache: true });
        }
        else
        {
            /**
             *  If no parameter supplied, just get all posts
             */
            
            var url = $http.get(meekoApi + '/api/get_posts/?post_type=magazine&custom_fields=all', { cache: true });

            // Set a default paging value
            $scope.page = 1;
            // Set a default next value
            $scope.next = 2;

            // Inject the title into the rootScope
            $rootScope.title = 'Magazine | Meeko';
        }
    }
    url
    .success(function(data, status, headers, config){
        console.log(data);
        
        /**
         *  Pass data from the feed to the view.
         *  $scope.posts will pass exclusively post data
         *  $scope.paging will pass the whole feed and will be used to work out paging
         */
        $scope.posts = data.posts;
        $scope.paging = data;
         $scope.loader.loading = false;
        //console.log(data);

        // Inject the title into the rootScope
        $rootScope.title = 'Magazine | Meeko';

        if($routeParams.page)
        {
            // Get current page
            $scope.page = $routeParams.page;
            // Caluculate next/previous values
            $scope.next = parseInt($routeParams.page)+1;
            $scope.prev = parseInt($routeParams.page)-1;
        };
    })
    .error(function(data, status, headers, config){
        //window.alert("No magazine posts found on Meeko");
    })

})

/**
 *  Get Dress Types
 */


.controller('dressTypes', function($scope, $rootScope, $http, $routeParams) {
  
     $scope.loader = { 

      loading : true ,

     };    

    /**
     *  Get posts from a specific category by passing in the slug
     */

$http.get(meekoApi + '/api/taxonomy/get_taxonomy_index/?taxonomy=product_cat', { cache: true })
    .success(function(data, status, headers, config){
    
        $scope.terms = data.terms;
    
        //$scope.terms = data.terms;
        $scope.loader.loading = false ; 
        //console.log(data);
        $rootScope.title = ' Dress Types | Meeko.me';

    })
    .error(function(data, status, headers, config){
        //window.alert("no posts");
    })
    
})



.controller('ProductList', function($scope, $rootScope, $http, $routeParams){

     $scope.loader = { 

      loading : true ,

     };

    if($routeParams.productcategory)
    {
        /**
         *  Get posts from a specific category by passing in the slug
         */
        $scope.loader.loading = true;
        
        var url = $http.get(meekoApi + '/api/korkmaz/get_taxonomy_posts/?taxonomy=product_cat&post_type=product&custom_fields=all&slug=' + $routeParams.productcategory, { cache: true });
        
            var capsdresscategory = $routeParams.productcategory
            
            var CapsDressCategoryup = capsdresscategory.replace(/^[a-z]/, function(m){ return m.toUpperCase() });
        
            // Set a default paging value
            $scope.page = 1;
            // Set a default next value
            $scope.next = 2;        
    
            // Inject the title into the rootScope
            $rootScope.title = CapsDressCategoryup + ' Dresses | Meeko.me';
        
            $rootScope.categorytitledresses = CapsDressCategoryup;
        
            if($routeParams.page)
            {
                var url = $http.get(meekoApi + '/api/korkmaz/get_taxonomy_posts/?taxonomy=product_cat&post_type=product&custom_fields=all&slug=' + $routeParams.productcategory + '&page=' + $routeParams.page, { cache: true });

                // Get current page
                $scope.page = $routeParams.page;
                // Caluculate next/previous values
                $scope.next = parseInt($routeParams.page)+1;
                $scope.prev = parseInt($routeParams.page)-1;
            };
        
        
    }
    else
    {
        if($routeParams.page)
        {
            /**
             *  If a page parameter has been passed, send this to the API
             */
            $scope.loader.loading = true;
            var url = $http.get(meekoApi + '/api/get_posts/?post_type=product&custom_fields=all&page=' + $routeParams.page, { cache: true });
        }
        else
        {
            /**
             *  If no parameter supplied, just get all posts
             */
            $scope.loader.loading = true ;
            var url = $http.get(meekoApi + '/api/get_posts/?post_type=product&custom_fields=all', { cache: true });

            // Set a default paging value
            $scope.page = 1;
            // Set a default next value
            $scope.next = 2;

            // Inject the title into the rootScope
            $rootScope.title = 'Newest Work & Party Dresses | Meeko.me';
        }
    }
    url
    .success(function(data, status, headers, config){
        console.log(data);

        $scope.posts = data.posts;
        $scope.paging = data;
        $scope.loader.loading = false;
            
        if($routeParams.page)
        {
            
            $rootScope.categorytitledresses = $routeParams.productcategory;
            
            // Get current page
            $scope.page = $routeParams.page;
            // Caluculate next/previous values
            $scope.next = parseInt($routeParams.page)+1;
            $scope.prev = parseInt($routeParams.page)-1;
        };   
        
    })
    .error(function(data, status, headers, config){
        //window.alert("no posts");
    })

})



.controller('BlogPost', function($scope, $rootScope, $http, $routeParams){

    $scope.loader = { 
        loading: true,
    };
    /**
     *  Call the get_post method from the API and pass to it the 
     *  value of $routeParams.post, which is actually the post slug
     */
    
    $http.get(meekoApi + '/api/get_post/?post_type=magazine&custom_fields=all&slug=' + $routeParams.post, { cache: true })
    
    .success(function(data, status, headers, config){
        $scope.post = data;
        $scope.comments = data.post.comments;

        // Inject the title into the rootScope
        $rootScope.title = data.post.title;
        $scope.loader.loading = false;
    })
    
    .error(function(data, status, headers, config){
        //window.alert("Unable to get magazine posts from Meeko");
    })

})



.controller('ProductDetails', function($scope, $rootScope, $http, $routeParams, $filter, $location){

    $scope.loader = { 
        loading: true,
    };
    /**
     *  Call the get_post method from the API and pass to it the 
     *  value of $routeParams.post, which is actually the post slug
     */

    if($routeParams.postnocat)
    {
        /**
         *  Get posts from a specific category by passing in the slug
         */
        var url = $http.get(meekoApi + '/api/get_post/?post_type=product&custom_fields=all&slug=' + $routeParams.postnocat);
        
    }
    
     else
        {
            /**
             *  If no parameter supplied, just get all posts
             */
            $scope.loader.loading = true ;
            var url =  $http.get(meekoApi + '/api/get_post/?post_type=product&custom_fields=all&slug=' + $routeParams.post, { cache: true });

            // Set a default paging value
            $scope.page = 1;
            // Set a default next value
            $scope.next = 2;

            // Inject the title into the rootScope
            $rootScope.title = 'Dresses | Meeko';
        }
    url
    .success(function(data, status, headers, config){
        $scope.post = data;

        // Inject the title into the rootScope
        $rootScope.title = data.post.title;
        $scope.loader.loading = false;   
        
        
        $scope.buyDress = function () {

            var reveal = angular.element('#buyNow');
            reveal.foundation();
            reveal.foundation('reveal', 'open');

        }
        
        
        $scope.swipeProductLeft = function () {
            console.log('swipe left triggered');
                                  
            $rootScope.leftDress = data.next_url;
            console.log($rootScope.leftDres);
            
            var leftDressUrl = $rootScope.leftDress;
            
            if(leftDressUrl == undefined) {
                //alert('no products to scroll to');

                 var reveal = angular.element('#noMoreDressesFound');
                 reveal.foundation();
                 reveal.foundation('reveal', 'open');
                
            }
                else 
            {
                var filterleftDressUrl = $filter('nextDress')(leftDressUrl);

                console.log(filterleftDressUrl);
                $location.url(filterleftDressUrl);
                
            }
        }; 
        
        $scope.swipeProductright = function () {
            console.log('swipe right triggered');

            $rootScope.rightDress = data.previous_url;
            
            var rightDressUrl = $rootScope.rightDress;
            
            if(rightDressUrl == undefined) {
                
                 var reveal = angular.element('#noMoreDressesFound');
                 reveal.foundation();
                 reveal.foundation('reveal', 'open');
                
            }
                else 
            {            
                var filterRightDressUrl = $filter('prevDress')(rightDressUrl);

                console.log(filterRightDressUrl);
                $location.url(filterRightDressUrl);
            }
        };          
                
        
        //list sizes using custom field 'sizes' - data has to be entered like this: 8 10 12 14 16 18 
            var sizes = data.post.custom_fields.sizes;
        
            if(sizes == undefined) {

                console.log('sizes undifiend - needs data setting in woocommerce');  

            } else {

            var sizestest = data.post.custom_fields.sizes;

            sizes = sizes.split(" "); 

            console.log(typeof sizes);  
            console.log(sizes);  
            console.log(sizestest);
            $rootScope.sizes = sizes;

        }
        
        //list sizes ends
        
        //list colours using custom field 'colours' = data has to entered like this: Navy Cream
        
            var colours = data.post.custom_fields.colours;
        
            if(colours == undefined) {
                
                console.log('colour undifiend - needs data setting in woocommerce'); 
                
            } else {        

                colours = colours.split(" "); 
                console.log(typeof colours);  
                console.log(colours);  
                $rootScope.colours = colours;  
            
            }
        
        //list colours ends
        
        
        
    })
    .error(function(data, status, headers, config){
        //window.alert("Unable to get dress details from Meeko");
    })

})



.controller('RandomProducts', function($scope, $http){
    
    $scope.loader = { 
        loading: true,
    };

    /**
     *  This method just gets the categories available to us and 
     *  makes them available through CategoryList controller
     */
    $http.get(meekoApi + '/api/get_posts/?post_type=product&custom_fields=all&count=10&orderby=rand')
    .success(function(data, status, headers, config){
        $scope.posts = data.posts;
        console.log ( $scope.posts );
        
        $scope.loader.loading = false;
    })
    .error(function(data, status, headers, config){
        //window.alert("Unable to get categories from Meeko");
    })

})



.controller('CategoryList', function($scope, $http){

    
    $scope.loader = { 
        loading: true,
    };
    /**
     *  This method just gets the categories available to us and 
     *  makes them available through CategoryList controller
     */
    $http.get(meekoApi + '/api/get_category_index/')
    .success(function(data, status, headers, config){
        $scope.categories = data.categories;
        $scope.loader.loading = false;
    })
    .error(function(data, status, headers, config){
        //window.alert("Unable to get categories from Meeko");
    })

})



.controller('CategoryListProduct', function($scope, $http){

    /**
     *  This method just gets the categories available to us and 
     *  makes them available through CategoryList controller
     */
    $http.get(meekoApi + '/api/get_posts/?post_type=product&custom_fields=all')
    .success(function(data, status, headers, config){
        $scope.data = data.posts;
        //console.log(data.posts.id);
    })
    .error(function(data, status, headers, config){
        //window.alert("We have been unable to access the feed :-(");
    })

})

.controller('searchResults', function($scope, $rootScope, $http, $routeParams) {  
    
    $scope.loader = { 
        loading: true,
    };    
    
    $rootScope.title = 'Search | Dresses | Meeko';
    /** 
     *  Get the parameter passed into the controller (if it exists)
     *  and then construct the GET URL. If parameter exists, the user
     *  is looking at a specific category.
     */
    if($routeParams.searchedDress)
    {
        /**
         *  Get posts from a specific category by passing in the slug
         */
        var url = $http.get(meekoApi + '/api/get_posts/?post_type=product&custom_fields=all&s=' + $routeParams.searchedDress);
                
            $scope.loader.loading = true ;
            // Set a default paging value
            $scope.page = 1;
            // Set a default next value
            $scope.next = 2;        
    
            // Inject the title into the rootScope
        
            $rootScope.searchedDress = $routeParams.searchedDress;

            if($routeParams.page)
            {
                $scope.loader.loading = true ;
                
                var url = $http.get(meekoApi + '/api/get_posts/?post_type=product&custom_fields=all&s=' + $routeParams.searchedDress + '&page=' + $routeParams.page);
                
                $rootScope.searchedDress = $routeParams.searchedDress;

                // Get current page
                $scope.page = $routeParams.page;
                // Caluculate next/previous values
                $scope.next = parseInt($routeParams.page)+1;
                $scope.prev = parseInt($routeParams.page)-1;
            };

    }
    url
    .success(function(data, status, headers, config){
        
        
        $scope.loader.loading = false;
        $scope.posts = data.posts;
        $scope.paging = data; 
        
        // Set a default paging value
        
        $scope.page = 1;
        // Set a default next value
        $scope.next = 2;        

        //toggle open search input - need to revisit this
        
        //var removeSearch = angular.element('#searchDresses').addClass('ng-hide');

        if($routeParams.page)
        {
            
            $rootScope.categorytitledresses = $routeParams.productcategory;
            
            // Get current page
            $scope.page = $routeParams.page;
            // Caluculate next/previous values
            $scope.next = parseInt($routeParams.page)+1;
            $scope.prev = parseInt($routeParams.page)-1;
        };   
        
    })
    .error(function(data, status, headers, config){
        //window.alert("no posts");
    })
    
})


/**
 *  Owl Carousel Main Directive
 */

//owl carousel directive to work with ng-repeat - the issue was without this the page would load before the ng-repeat and wouldnt build owl-carousel
.directive("owlCarousel", function() {
	return {
		restrict: 'E',
		transclude: false,
		link: function (scope) {
			scope.initCarousel = function(element) {
			  // provide any default options you want
				var defaultOptions = {
				};
				var customOptions = scope.$eval($(element).attr('data-options'));
				// combine the two options objects
				for(var key in customOptions) {
					defaultOptions[key] = customOptions[key];
				}
				// init carousel
				$(element).owlCarousel(defaultOptions);
			};
		}
	};
})


/**
 *  Owl Carousel item Directive
 */

.directive('owlCarouselItem', [function() {
	return {
		restrict: 'A',
		transclude: false,
		link: function(scope, element) {
		  // wait for the last item in the ng-repeat then call init
			if(scope.$last) {
				scope.initCarousel(element.parent());
			}
		}
	};
}])


/**
 *  Search form partial
 */

.directive('searchForm', function() {
    
	return {
        
		restrict: 'EA',
		templateUrl: partialLocation + 'searchForm.html'
        
	};
    
})


/**
 *  Slideleft/Slideright transitions for route changes
 */

.directive('animClass', function ($route) {
    
    return {
        
        link: function (scope, elm, attrs) {
            
            var enterClass = $route.current.animate;
            elm.addClass(enterClass);
            
            scope.$on('$destroy', function () {
                
                elm.removeClass(enterClass);
                elm.addClass($route.current.animate);
                
            })
            
        }
        
    }
})
