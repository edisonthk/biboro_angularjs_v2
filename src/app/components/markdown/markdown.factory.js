import Markdown from "../../../../bower_components/marked/lib/marked";
import "prettyprint";

class MarkdownFactory {

    constructor () {
        this.renderer = new Markdown.Renderer();
        this.renderer.code = function(code, language) {
            var langCode = "";
            if(language) {
                langCode = " lang-"+language;
            }
            return '<pre class="prettyprint '+langCode+'">'+prettyPrintOne(code)+'</pre>';
        };

    }

    parseMd(md) {

        md = md.replace(/<(script|style|form|input|textarea|button)>/g, this.replaceRegisterHtml);

        md = md.replace(/(    (.*?)\r?\n|```((.|\r?\n)*?)```)/g,this.replaceRegisterHtml);

        return Markdown(md, {renderer: this.renderer});
    }

    replaceRegisterHtml(match) {
        return match.replace(/[<>]/g, function(match) {
            if(match === "<") {
                return "&lt;";
            }
            return "&gt;";
        });
    }
}

export default MarkdownFactory;