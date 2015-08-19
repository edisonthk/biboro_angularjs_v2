import PlaygroundController from '../app/components/myplayground/playground.controller';
import SnippetController from '../app/components/snippet/snippet.controller';


export default function ($stateProvider, $urlRouterProvider) {
        'ngInject';
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl:  'app/main/main.html',
                controller:   'MainController',
                controllerAs: 'main',
            })
            .state('test', {
                url: '/test',
                controller:   PlaygroundController,
                controllerAs: 'p',
                template:     '<acme-navbar /><div ng-bind="p.hello"></div><div ng-bind="myscope"></div>',
            })
            .state('snippet', {
                url: '/snippet',
                controller:   SnippetController,
                controllerAs: 'p',
                template:     '<acme-navbar /><div ng-bind="p.hello"></div><div ng-bind="myscope"></div>',
            })
            .state('snippet.detail', {
                url: '/:snippetId',
                controller:   SnippetController,
                controllerAs: 'p',
                template:     '<acme-navbar /><div ng-bind="p.hello"></div><div ng-bind="myscope"></div>',
            });

        $urlRouterProvider.otherwise('/');
    }