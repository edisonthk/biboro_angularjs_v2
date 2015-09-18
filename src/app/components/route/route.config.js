import WorkbookListController   from '../workbook/workbookList.controller';
import WorkbookShowController   from '../workbook/workbookShow.controller';
import PlaygroundController     from '../myplayground/playground.controller';
import SnippetController        from '../snippet/snippet.controller';
import NewsController           from '../news/news.controller';
import AccountController        from '../account/account.controller';

export default function ($httpProvider, $stateProvider, $urlRouterProvider) {
        'ngInject';

        $httpProvider.defaults.withCredentials = true;
        $httpProvider.defaults.xsrfHeaderName = "XSRF-TOKEN";

        $stateProvider
            .state('home', {
                url: '/',
                controller: function() {
                    
                },
                template: 'fsdfsdfs'
            })
            .state('news', {
                url: '/news',
                controller:   NewsController,
                controllerAs: 'newsCtrl',
                templateUrl:  '../app/components/news/news.list.html',
            })
            .state('workbook', {
                url: '/workbook',
                templateUrl:  '../app/components/workbook/workbookList.html',
                controller:   WorkbookListController,
                controllerAs: 'workbookCtrl',
            })
            .state('workbookShow', {
                url: '/workbook/:workbook',
                templateUrl:  '../app/components/workbook/workbookShow.html',
                controller:   WorkbookShowController,
                controllerAs: 'workbookCtrl',
            })
            .state('workbookShow.snippet', {
                url: '/snippet/:snippet',
                templateUrl:  '../app/components/snippet/snippet.show.html',
                controller:   SnippetController,
                controllerAs: 'snippetCtrl',
            })
            // .state('workbook.news', {
            //     url: '/news',
            //     templateUrl:  'app/main/main.html',
            //     controller:   NewsController,
            //     controllerAs: 'news'
            // })
            // BEGIN: take works
            .state('workbook.show.editor',{
                url:'/editor',
                templateUrl:'../app/components/workbook/workbook.show.edit.html',
                controller:[function(){
                    console.log("goooood");
                }]
            })
            .state('workbook.show.snippet.editor',{
                url:'/editor',
                templateUrl:'../app/components/workbook/'
            })
            .state('preference', {
                url: '/preference'
            })
            // .state('profile')
            // .state('')

            // END: take works
            .state('test', {
                url: '/test',
                controller:   PlaygroundController,
                controllerAs: 'p',
                template:     '<acme-navbar /><div ng-bind="p.hello"></div><div ng-bind="myscope"></div>',
            });

        // $urlRouterProvider.otherwise('/');
    }