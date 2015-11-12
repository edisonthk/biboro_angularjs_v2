

class ChromeExtensionFactory {

    constructor () {
        'ngInject';
    }

    isInstalled() {
        return document.body.hasAttribute("biboro-plugin-version");
    }

    getVersion() {
        return document.body.getAttribute("biboro-plugin-version");
    }

}

export default ChromeExtensionFactory;
