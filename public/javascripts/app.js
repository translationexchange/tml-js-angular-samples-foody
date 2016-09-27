angular.module('foody', ['tml', 'ui.router'])
    .config(/*@ngInject*/ function ($urlRouterProvider, $stateProvider)
    {
        $urlRouterProvider.otherwise('/');
        $urlRouterProvider.when('', '/');
        
        $stateProvider
            .state('root', {
                url: "",
                resolve: {
                    data: function ($http)
                    {
                        return $http.get('/api/data.json')
                            .then(function (response)
                            {
                                return response.data;
                            });
                    }  
                },
                template: "<ui-view></ui-view>"
            })
            .state('recipe', {
                url: "/recipe/:id",
                parent: 'root',
                resolve: {
                    recipe: function ($stateParams, data)
                    {
                        return _.find(data.recipes, { id: $stateParams.id });
                    }  
                },
                controller: function ($scope, recipe)
                {
                    $scope.recipe = recipe;
                },
                templateUrl: "/includes/recipe.html"
            })
            .state('index', {
                parent: 'root',
                url: "/",
                resolve: {
                    //Imagine there's a nice API returning these bits of data
                    categories: function (data)
                    {
                        return data.categories;
                    },
                    recipes: function (data)
                    {
                        var recipes = data.recipes;

                        return _.groupBy(recipes, 'category');
                    }
                },
                controller: function ($scope, categories, recipes)
                {
                    $scope.categories = categories;  
                    $scope.recipes = recipes;  
                },
                templateUrl: '/includes/main.html'
            });
    });


//Initialize TML after DOM ready
angular.element(document).ready(function() {
    tml.init({
        key: "befb50d68c8708a494e6fcdbda98ecc520cf26a58e7dcbe3f5798916593ae00a",
        host: "http://localhost:3000",
        cdn_host: 'https://trex-snapshots-dev.s3-us-west-1.amazonaws.com',
        debug: true,
		current_source: 'foody',
        agent: {
            host: "http://localhost:8282/dist/agent.js"
        },
        version_check_interval: 30,
        language_selector: true,
        onLoad: function(app) {
            //bootstrap angular app after tml starts
            angular.bootstrap(document, ['foody']);
        }
    });
});