/* jshint browser: true */
/* global malarkey:false, toastr:false, moment:false */

import Dispatcher from './base/dispatcher';

import AccountService from '../app/components/account/account.service';
import SnippetService from '../app/components/snippet/snippet.service';
import WorkbookService from '../app/components/workbook/workbook.service';

import MainController from './main/main.controller';
import WebDevTecService from '../app/components/webDevTec/webDevTec.service';
import NavbarDirective from '../app/components/navbar/navbar.directive';
import MalarkeyDirective from '../app/components/malarkey/malarkey.directive';
import WorkbooksDirective from '../app/components/workbookt/workbooks.directive';

import routeConfig from './routes';

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

    .config(routeConfig)
    .service('SnippetService', SnippetService)
    .service('WorkbookService', WorkbookService)
    .service('AccountService', AccountService)
    .factory('Dispatcher', () => new Dispatcher())
    .service('webDevTec', WebDevTecService)
    .controller('MainController', MainController)
    .directive('acmeNavbar', () => new NavbarDirective())
    .directive('workbookList', () => new WorkbooksDirective())
    .directive('acmeMalarkey', () => new MalarkeyDirective(malarkey));
