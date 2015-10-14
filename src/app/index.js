/* jshint browser: true */

import Dispatcher from './base/dispatcher';

// service
import AccountService  from '../app/components/account/account.service';
import SnippetService  from '../app/components/snippet/snippet.service';
import WorkbookService from '../app/components/workbook/workbook.service';
import RouteService    from '../app/components/route/route.service';
import CommentService  from '../app/components/comment/comment.service';
import NewsService  from '../app/components/news/news.service';
import FeedbackService from '../app/components/feedback/feedback.service';
import MarkdownHelper from '../app/components/markdown/markdown.factory';
import FileUploader from '../app/components/fileupload/fileupload.service';

// directives
import CommentDirective        from '../app/components/comment/comment.directive';
import DialogDirective         from '../app/components/dialog/dialog.directive';
import NavbarDirective         from '../app/components/navbar/navbar.directive';
import EditorDirective         from '../app/components/editor/editor.directive';
import TerminalDirective       from '../app/components/terminal/terminal.directive';
import TabsDirective           from '../app/components/tabs/tabs.directive';
import FloatLayoutDirective    from '../app/components/float_layout/float_layout.directive';
import CellDirective           from '../app/components/float_layout/cell.directive';

// constant
import apiConstant from '../app/components/api/api.filter';

// config
import routeConfig from '../app/components/route/route.config';
import toastrConfig from '../app/components/toastr/toastr.config';

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
    .service('FeedbackService', FeedbackService)
    .service('FileUploader', FileUploader)

    .factory('Dispatcher', () => new Dispatcher())
    .factory('Markdown', () => new MarkdownHelper())

    
        
    .directive('comment',   () => new CommentDirective())
    .directive('editor',   () => new EditorDirective())
    .directive('terminal', () => new TerminalDirective())
    .directive('dialog',   () => new DialogDirective())
    .directive('navbar',   () => new NavbarDirective())
    .directive('tabs',     () => new TabsDirective())
    .directive('cellsWrapper', () => new FloatLayoutDirective())
    .directive('cell', () => new CellDirective())

;
    