/* jshint browser: true */
/* global malarkey:false, toastr:false, moment:false */

import Dispatcher from './base/dispatcher';

import MainController from './main/main.controller';
import WebDevTecService from '../app/components/webDevTec/webDevTec.service';
import NavbarDirective from '../app/components/navbar/navbar.directive';
import MalarkeyDirective from '../app/components/malarkey/malarkey.directive';
import PlaygroundController from '../app/components/myplayground/playground.controller';

console.log(Dispatcher);

angular.module('biboroAngular', [
        'ngAnimate', 
        'ngCookies', 
        'ngSanitize', 
        'ngResource', 
        'ui.router',
    ])
    .constant('malarkey', malarkey)
    .constant('toastr', toastr)
    .constant('moment', moment)

    .config(function ($stateProvider, $urlRouterProvider) {
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
                template:     '<div ng-bind="p.hello"></div><div ng-bind="myscope"></div>',
            });

        $urlRouterProvider.otherwise('/');
    })
    .factory('Dispatcher', () => new Dispatcher())
    .service('EventEmitter', EventEmitterService)
    .service('webDevTec', WebDevTecService)
    .controller('MainController', MainController)
    .directive('acmeNavbar', () => new NavbarDirective())
    .directive('acmeMalarkey', () => new MalarkeyDirective(malarkey));
