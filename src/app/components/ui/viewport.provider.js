class ViewportProvider {
    
    constructor () {

        var self = this;
        self.els = [];

        self.$get = function() {
            return {
                setOnViewport: function(el, handler) {
                    self.els.push({
                        element: el,
                        handler: handler
                    });
                }
            };
        };

        if (window.addEventListener) {
            window.addEventListener('DOMContentLoaded', self.onReady.bind(self), false); 
            window.addEventListener('load', self.onReady.bind(self), false); 
            window.addEventListener('scroll', self.onReady.bind(self), false); 
            window.addEventListener('resize', self.onReady.bind(self), false); 
        } else if (window.attachEvent)  {
            window.attachEvent('onDOMContentLoaded', self.onReady.bind(self)); // IE9+ :(
            window.attachEvent('onload', self.onReady.bind(self));
            window.attachEvent('onscroll', self.onReady.bind(self));
            window.attachEvent('onresize', self.onReady.bind(self));
        }

        self.readyFlag = false;
        setInterval(self.searchViewportElements.bind(self), 1000);
    }

    searchViewportElements() {
        var self = this;
        if(!self.readyFlag) {
            return;
        }
        self.readyFlag = false;

        for (var i = 0; i < self.els.length; i++) {
            var el = self.els[i].element;

            if(self.isElementInViewport(el)) {
                if(typeof self.els[i].handler === 'function') {
                    self.els[i].handler(el);
                }
            }
        };
    }

    isElementInViewport(el) {

        var rect = el.getBoundingClientRect();

        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
        );
    }

    onReady(e) {
        var self = this;
        self.readyFlag = true;
    }
}

export default ViewportProvider;