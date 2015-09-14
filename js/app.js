var meekoApp = angular.module('meekoApp', ['ngRoute', 'ngAnimate', 'ngResource', 'ngSanitize'])

var meekoApi = 'http://localhost/meeko';

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

/**
 *
 *	Configure our app
 *
 */
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider)
{
	/**
	 *	Configure routes
	 */
    $routeProvider
    .when('/', {
        templateUrl: '/partials/index.html'
        //controller: 'GetPage'
    })
    .when('/magazine', {
        templateUrl: '/partials/blog.html',
        controller: 'BlogList'
    })
    .when('/magazine/page/:page', {
        templateUrl: '/partials/blog.html',
        controller: 'BlogList'
    })
    .when('/magazine/:category', {
        templateUrl: '/partials/blog.html',
        controller: 'BlogList'
    })
    .when('/magazine/:category/:post', {
        templateUrl: '/partials/post.html',
        controller: 'BlogPost'
    })
    .when('/search', {
        templateUrl: '/partials/searchresults.html',
        controller: 'searchResults'
    })    
    .when('/search/page/:page', {
        templateUrl: '/partials/searchresults.html',
        controller: 'searchResults'
    })    
    .when('/product/', {
        templateUrl: '/partials/productList.html',
        controller: 'ProductList'
    })
    .when('/product/page/:page', {
        templateUrl: '/partials/productList.html',
        controller: 'ProductList'
    })    
    .when('/product/:productcategory', {
        templateUrl: '/partials/blog.html',
        controller: 'ProductList'
    })
    .when('/product/:productcategory/:post', {
        templateUrl: '/partials/ProductDetails.html',
        controller: 'ProductDetails'
    });        

    /**
     *	Remove # from the URL with $locationProvider
     */
     $locationProvider.html5Mode(true).hashPrefix('!');
}])

/**
 *
 *	On runtime define the page titles for injecting into the page <title> tag
 *
 */

.controller('MenuController', function($scope, $location){
    $scope.isActive = function(route) {
       return route === $location.url();
    }
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
        var url = $http.get(meekoApi + '/api/get_category_posts/?post_type=magazine&custom_fields=all&slug=' + $routeParams.category);
        
        $rootScope.title = 'Magazine | Meeko';
    }
    
    else
    {
        if($routeParams.page)
        {
            /**
             *  If a page parameter has been passed, send this to the API
             */
            var url = $http.get(meekoApi + '/api/get_posts/?post_type=magazine&custom_fields=all&page=' + $routeParams.page);
        }
        else
        {
            /**
             *  If no parameter supplied, just get all posts
             */
            var url = $http.get(meekoApi + '/api/get_posts/?post_type=magazine&custom_fields=all');

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
        window.alert("No magazine posts found on Meeko");
    })

})

.controller('ProductList', function($scope, $rootScope, $http, $routeParams){

    /** 
     *  Get the parameter passed into the controller (if it exists)
     *  and then construct the GET URL. If parameter exists, the user
     *  is looking at a specific category.
     */
    if($routeParams.productcategory)
    {
        /**
         *  Get posts from a specific category by passing in the slug
         */
        var url = $http.get(meekoApi + '/api/get_category_posts/?custom_fields=all&slug=' + $routeParams.productcategory);
    }
    else
    {
        if($routeParams.page)
        {
            /**
             *  If a page parameter has been passed, send this to the API
             */
            var url = $http.get(meekoApi + '/api/get_posts/?post_type=product&custom_fields=all&page=' + $routeParams.page);
        }
        else
        {
            /**
             *  If no parameter supplied, just get all posts
             */
            var url = $http.get(meekoApi + '/api/get_posts/?post_type=product&custom_fields=all');

            // Set a default paging value
            $scope.page = 1;
            // Set a default next value
            $scope.next = 2;

            // Inject the title into the rootScope
            $rootScope.title = 'Dresses | Meeko';
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
        //console.log(data);

        // Inject the title into the rootScope
        // $rootScope.title = data.category.title;

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
        window.alert("no posts");
    })

})

.controller('BlogPost', function($scope, $rootScope, $http, $routeParams){

    /**
     *  Call the get_post method from the API and pass to it the 
     *  value of $routeParams.post, which is actually the post slug
     */
    $http.get(meekoApi + '/api/get_post/?post_type=magazine&custom_fields=all&slug=' + $routeParams.post)
    .success(function(data, status, headers, config){
        $scope.post = data;
        $scope.comments = data.post.comments;

        // Inject the title into the rootScope
        $rootScope.title = data.post.title;
    })
    .error(function(data, status, headers, config){
        window.alert("Unable to get magazine posts from Meeko");
    })

})

.controller('ProductDetails', function($scope, $rootScope, $http, $routeParams){

    /**
     *  Call the get_post method from the API and pass to it the 
     *  value of $routeParams.post, which is actually the post slug
     */
    $http.get(meekoApi + '/api/get_post/?post_type=product&custom_fields=all&slug=' + $routeParams.post)
    .success(function(data, status, headers, config){
        $scope.post = data;
        $scope.comments = data.post.comments;   

        // Inject the title into the rootScope
        $rootScope.title = data.post.title;
    })
    .error(function(data, status, headers, config){
        window.alert("Unable to get dress details from Meeko");
    })

})

.controller('CategoryList', function($scope, $http){

    /**
     *  This method just gets the categories available to us and 
     *  makes them available through CategoryList controller
     */
    $http.get(meekoApi + '/api/get_category_index/')
    .success(function(data, status, headers, config){
        $scope.categories = data.categories;
    })
    .error(function(data, status, headers, config){
        window.alert("Unable to get categories from Meeko");
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
        window.alert("We have been unable to access the feed :-(");
    })

})

.controller('searchResults', function($scope, $rootScope, $http, $routeParams) {
    $scope.filter = {
        s: ''
    };
    
    $rootScope.title = 'Search | Dresses | Meeko';
    
    $scope.search = function() { 
        if($routeParams.page)
        {
            /**
             *  If a page parameter has been passed, send this to the API
             */
            var url = $http.get(meekoApi + '/api/get_posts/?post_type=product&custom_fields=all&s=' + $scope.filter.s+'&page='+$routeParams.page);
        }
        else
        {
            /**
             *  If no parameter supplied, just get all posts with the search string
             */
            var url = $http.get(meekoApi + '/api/get_posts/?custom_fields=all&post_type=product&s='+$scope.filter.s);
            
                // Set a default paging value
                $scope.page = 1;
                // Set a default next value
                $scope.next = 2;
            
                // Inject the title into the rootScope
                $rootScope.title =  'Search | Dresses | Meeko';
        }

       url.success(function(data, status, headers, config){
           
        console.log(data);
        console.log($scope.filter);
           
        $rootScope.title =  $scope.filter.s + ' | Search | Dresses | Meeko';   
           
        /**
         *  Pass data from the feed to the view.
         *  $scope.posts will pass exclusively post data
         *  $scope.paging will pass the whole feed and will be used to work out paging
         */
        $scope.posts = data.posts;
        $scope.paging = data;
        //console.log(data);

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
        window.alert("no posts");
    })

}
})

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

.directive('searchForm', function() {
	return {
		restrict: 'EA',
		templateUrl: '/partials/searchForm.html'
	};
})