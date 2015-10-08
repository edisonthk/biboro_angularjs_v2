import FluxController from "../flux/flux.controller";
import KeyCode from "../shortcut/shortcut.config";
import ShortcutTask from "../shortcut/shortcut.task";

class EditorController extends FluxController {
    constructor ($window, $scope, Markdown, Dispatcher) {
        'ngInject';
        
        super.constructor($scope,Dispatcher);
        this.scope = $scope;
        this.markdown = Markdown;
        this.scope.$watch("content", this.contentChangeCallback.bind(this));  

        this.dragDrop = document.getElementById('dragDrop');
        this.dragDrop.ondragover = this.preventer1;
        this.dragDrop.dragenter = this.preventer2;
        this.dragDrop.ondrop = this.droppingCallback.bind(this);

        this.textarea = document.querySelector("editor .editor-textarea");

        // this.scope.$watch("selectedWorkbook", function(newVal) {
        //     console.log(newVal);
        // });
        // console.log(this.scope.selectedWorkbook);

        
        this.scope.$watch("ngIf", function(newVal, oldVal) {
            
        });

        var el_fo = document.getElementsByClassName("editor-ready-focus");
        if(el_fo.length > 0) {
            el_fo[0].focus();
        }

        this._shortcutTaskToken = ShortcutTask.setTask(this.keyupTask.bind(this));
    }

    keyupTask(e) {
        
        var ctrlKey = (e.ctrlKey || e.metaKey);
        if(ctrlKey && e.keyCode === KeyCode.KEY_S) {
            e.preventDefault();
            this.scope.savedCallback();
        }else if(e.keyCode === KeyCode.KEY_ESC) {
            e.preventDefault();
            this.scope.cancelCallback();
        }else{

            if(ctrlKey && e.target.className.indexOf("editor-textarea") >= 0) {
                // editor textarea shortcut
                if(e.keyCode === KeyCode.KEY_B) {
                    e.preventDefault();
                    this.boldEvent();
                }else if(e.keyCode === KeyCode.KEY_I) {
                    e.preventDefault();
                    this.italicEvent();
                }else if(e.keyCode === KeyCode.KEY_L) {
                    e.preventDefault();
                    this.anchorEvent();
                }else if(e.keyCode === KeyCode.KEY_K) {
                    e.preventDefault();
                    this.codeEvent()
                }
                return;
            }
        }
    }

    contentChangeCallback() {
        this.htmlContent = this.markdown.parseMd(this.scope.content);
    }

    boldEvent() {
        var end = this.textarea.selectionEnd;
        var lastTop = this.textarea.scrollTop;

        this.scope.content = this.replaceSelectedText(this.textarea, function(selectedText) {
            return "**" + selectedText + "**";
        });
        
        this.restoreCursorPositionAndScrollTop(lastTop,end + 4);
    }

    italicEvent() {
        var end = this.textarea.selectionEnd;
        var lastTop = this.textarea.scrollTop;

        this.scope.content = this.replaceSelectedText(this.textarea, function(selectedText) {
            return "*" + selectedText + "*";
        });

        this.restoreCursorPositionAndScrollTop(lastTop,end + 2);
    }

    strikethroughEvent() {
        var end = this.textarea.selectionEnd;
        var lastTop = this.textarea.scrollTop;

        this.scope.content = this.replaceSelectedText(this.textarea, function(selectedText) {
            return "~~" + selectedText + "~~";
        });
        
        this.restoreCursorPositionAndScrollTop(lastTop, end + 4);
    }

    anchorEvent() {
        var begin = this.textarea.selectionStart;
        var end = this.textarea.selectionEnd;
        var lastTop = this.textarea.scrollTop;
        var linkFlag = false;
        this.scope.content = this.replaceSelectedText(this.textarea, function(selectedText) {
            if(selectedText.match(/\[(.*?|TITLE)\]\((https?:\/\/(.*?)|LINK_HERE)\)/)) {
                return selectedText;
            }
            if(selectedText.match(/https?:\/\//)) {
                linkFlag = true;
                return "[TITLE]("+selectedText+")";
            }

            return "[" + selectedText + "](LINK_HERE)";
        });
        
        if(linkFlag) {
            this.restoreCursorPositionAndScrollTop(lastTop, begin + 1, begin + 6);       
        }else {
            this.restoreCursorPositionAndScrollTop(lastTop, end + 3, end + 12);
        }
        
    }

    headingEvent() {
        var self = this;
        var end = self.textarea.selectionEnd;
        var headingText = this.textarea.value;
        var lastTop = self.textarea.scrollTop;
        this.scope.content = this.replaceSelectedText(this.textarea, function(selectedText, start, end) {
            var lines = self.textarea.value.split("\n");
            var beginPosition = 0;
            for(var i = 0; i < lines.length; i ++) {
                if(beginPosition < start && start <= beginPosition + lines[i].length) {
                    headingText = headingText.substring(0,beginPosition) + "# " + headingText.substring(beginPosition, headingText.length);
                    return selectedText;
                }
                beginPosition += lines[i].length + 1;
            }
            return selectedText;
        });

        this.scope.content = headingText;
        this.restoreCursorPositionAndScrollTop(lastTop,end + 2);
    }

    codeEvent() {
        var self = this;
        var end = self.textarea.selectionEnd;
        var lines = self.textarea.value.split("\n");
        var lastTop = self.textarea.scrollTop;
        this.scope.content = this.replaceSelectedText(this.textarea, function(selectedText, start, end) {
            
            var beginPosition = 0;
            for(var i = 0; i < lines.length; i ++) {
                
                if(beginPosition <= start && start <= beginPosition + lines[i].length) {
                    lines[i] = "```\n" + lines[i];

                }

                if(beginPosition <= (end + 4) && (end + 4) <= beginPosition + lines[i].length) {
                    lines[i] = lines[i] + "\n```";
                }
                beginPosition += lines[i].length + 1;
            }
            return selectedText;
        });

        this.scope.content = lines.join("\n");
        this.restoreCursorPositionAndScrollTop(lastTop,end + 8);

    }

    restoreCursorPositionAndScrollTop(lastTop, beginPosition, endPosition ) {
        var self = this;
        setTimeout(function() {
            if(typeof endPosition === 'undefined') {
                self.setSelectionRange(self.textarea, beginPosition, beginPosition);    
            } else {
                self.setSelectionRange(self.textarea, beginPosition, endPosition);
            }
            self.textarea.scrollTop = lastTop;
        },30);
    }

    setSelectionRange(input, selectionStart, selectionEnd) {
        if(input.selectionStart) {
            input.focus();
            input.selectionStart = selectionStart;
            input.selectionEnd = selectionEnd;
        } else if (input.setSelectionRange) {
            input.focus();
            input.setSelectionRange(selectionStart, selectionEnd);
        } else if (input.createTextRange) {
            var range = input.createTextRange();
            range.collapse(true);
            range.moveEnd('character', selectionEnd);
            range.moveStart('character', selectionStart);
            range.select();
        }
    }

    replaceSelectedText(el,handler) {
        var readyBoldText = el.value;
        var selectedText = readyBoldText.substring(el.selectionStart, el.selectionEnd) ;
        var handlerText = handler(selectedText, el.selectionStart, el.selectionEnd) || selectedText;
        return readyBoldText.substring(0,el.selectionStart) + handlerText + readyBoldText.substring(el.selectionEnd, readyBoldText.length);
    }


    //add-----------------------------------------
    preventer1(e){
        console.log("ondragover");
        e.preventDefault();
    }
    preventer2(e){
        console.log("ondragenter")
        e.preventDefault();
    }
    droppingCallback(e){
        e.preventDefault();

        var self = this;

        var files = e.dataTransfer.files;

        if(typeof FileReader != "undefined"){
            //I.E.はFileReader未実装
            var reader = new FileReader();
            reader.onload = function(evt) {
                self.scope.content = "```\n"+evt.target.result+"\n```";
                self.scope.$apply();
            };
            reader.readAsText(files[0]);
            console.log("![alt text](/upload/img/" + files[0].name + ")");
        } 
        else {
            alert("本ブラウザではFileReader未実装");
        }
    }


}   

export default EditorController;