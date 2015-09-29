export default function(toastrConfig) {
    'ngInject';

    angular.extend(toastrConfig, {
        allowHtml: true,
        positionClass: 'toast-top-center',
        messageClass: 'toast-message',
        // timeOut: 600000,
    });
}