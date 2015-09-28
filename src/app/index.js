/* jshint browser: true */

import Dispatcher from './base/dispatcher';

// service
import AccountService  from '../app/components/account/account.service';
import SnippetService  from '../app/components/snippet/snippet.service';
import WorkbookService from '../app/components/workbook/workbook.service';
import RouteService    from './components/route/route.service';
import CommentService  from './components/comment/comment.service';
import NewsService  from './components/news/news.service';
import MarkdownHelper from './components/markdown/markdown.factory';

// directives
import CommentDirective        from '../app/components/comment/comment.directive';
import DialogDirective         from '../app/components/dialog/dialog.directive';
import NavbarDirective         from '../app/components/navbar/navbar.directive';
import EditorDirective         from '../app/components/editor/editor.directive';
import TerminalDirective       from '../app/components/terminal/terminal.directive';
import TabsDirective           from '../app/components/tabs/tabs.directive';
import FloatLayoutDirective    from '../app/components/float_layout/float_layout.directive';

// constant
import apiConstant from './components/api/api.filter';

// config
import routeConfig from './components/route/route.config';
import toastrConfig from './components/toastr/toastr.config';

angular.module('biboroAngular', [
        'ngAnimate',
        'ngCookies',
        'ngSanitize',
        'ngResource',
        'toastr',
        'ui.router',
        'ngTagsInput',

    ])
    .constant('Api', apiConstant)

    .config(routeConfig)
    .config(toastrConfig)

    .service('RouteService', RouteService)
    .service('SnippetService', SnippetService)
    .service('WorkbookService', WorkbookService)
    .service('AccountService', AccountService)
    .service('CommentService', CommentService)
    .service('NewsService', NewsService)

    .factory('Dispatcher', () => new Dispatcher())
    .factory('Markdown', () => new MarkdownHelper())
        
    .directive('comment',   () => new CommentDirective())
    .directive('editor',   () => new EditorDirective())
    .directive('terminal', () => new TerminalDirective())
    .directive('dialog',   () => new DialogDirective())
    .directive('navbar',   () => new NavbarDirective())
    .directive('tabs',     () => new TabsDirective())
    .directive('floatLayout', () => new FloatLayoutDirective())

;
    