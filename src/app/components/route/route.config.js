
import PlaygroundController from '../myplayground/playground.controller';
import SnippetController    from '../snippet/snippet.controller';
import WorkbookController   from '../workbook/workbook.controller';
import NewsController       from '../news/news.controller';
import MainController       from '../../main/main.controller';
import AccountController    from '../account/account.controller';


export default function ($httpProvider, $stateProvider, $urlRouterProvider) {
        'ngInject';

        $httpProvider.defaults.withCredentials = true;
        $httpProvider.defaults.xsrfHeaderName = "XSRF-TOKEN";

        $stateProvider
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
            .state('account', {
                 // 両方のurlにも対応するように、 /account と /account/:action  <-に対応できるようにurlを書き換えて
                url: '/account/{action}?currentPath',
                templateUrl: '../app/components/account/account.login.html',
                controller: AccountController,
                controllerAs: 'accountCtrl'

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