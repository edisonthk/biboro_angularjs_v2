

class ChromeExtensionFactory {

    constructor () {
        'ngInject';
    }

    isInstalled() {
        return document.body.hasAttribute("biboro-plugin-version");
    }

    getVersion() {
        console.log(document.body.getAttribute("biboro-plugin-version"));
        return document.body.getAttribute("biboro-plugin-version");
    }

}

export default ChromeExtensionFactory;
