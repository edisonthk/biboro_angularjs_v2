
import PlaygroundController from '../app/components/myplayground/playground.controller';
import SnippetController    from '../app/components/snippet/snippet.controller';
import WorkbookController   from '../app/components/workbook/workbook.controller';

export default function ($stateProvider, $urlRouterProvider) {
        'ngInject';

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl:  'app/main/main.html',
                controller:   'MainController',
                controllerAs: 'main',
            })
            .state('workbook', {
                url: '/workbook',
                templateUrl:  '../app/components/workbook/workbook.list.html',
                controller:   WorkbookController,
                controllerAs: 'workbookCtrl',
            })
            .state('workbook.show', {
                url: '/:workbook',
                templateUrl:  '../app/components/workbook/workbook.show.html',
                controller:   WorkbookController,
                controllerAs: 'workbookCtrl',
            })
            .state('workbook.show.snippet', {
                url: '/snippet/:snippet',
                templateUrl:  '../app/components/snippet/snippet.show.html',
                controller:   SnippetController,
                controllerAs: 'snippetCtrl',
            })
            // BEGIN: take works
            .state('workbook.editor',{
                url:'/editor',
                templateUrl:'../app/components/workbook/workbook.edit.html',
                controller:[function(){
                    console.log("good");
                }]
            })
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
            .state('workbook.preference', {
                url: '/workbook'
            })
            .state('workbook.account', {
                 // 両方のurlにも対応するように、 /account と /account/:action  <-に対応できるようにurlを書き換えて
                views:{
                    '/account':{
                        template:'This is /account.'
                    }
                    '/account/:action':{
                        template:'This is /account/:action.'
                    }            
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

        $urlRouterProvider.otherwise('/workbook');
    }