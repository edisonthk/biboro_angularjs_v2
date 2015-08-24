/* jshint browser: true */
/* global  */

import Dispatcher from './base/dispatcher';

// service
import AccountService from '../app/components/account/account.service';
import SnippetService from '../app/components/snippet/snippet.service';
import WorkbookService from '../app/components/workbook/workbook.service';
import RouteService from './components/route/route.service';

// directives
import DialogDirective from '../app/components/dialog/dialog.directive';
import NavbarDirective from '../app/components/navbar/navbar.directive';

// constant
import apiConstant from './components/api/api.filter';

// config
import routeConfig from './components/route/route.config';

angular.module('biboroAngular', [
        'ngAnimate',
        'ngCookies',
        'ngSanitize',
        'ngResource',
        'ui.router',
        'ngTagsInput',
    ])
    .constant('Api', apiConstant)

    .config(routeConfig)

    .service('RouteService', RouteService)
    .service('SnippetService', SnippetService)
    .service('WorkbookService', WorkbookService)
    .service('AccountService', AccountService)
    .factory('Dispatcher', () => new Dispatcher())
    
    .directive('dialog', () => new DialogDirective())
    .directive('navbar', () => new NavbarDirective())

;
    