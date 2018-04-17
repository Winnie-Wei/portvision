require.config({
        paths: {
            'underscore': '../../../app/src/js/plugin/underscore/underscore.1.8.3.min',
            'gradientColor': '../../../app/src/js/plugin/gradientColor/index',
        },
        shim: {
            'underscore': {
                exports: '_'
            },
            /*'backbone': {
        　　　　　　　　deps: ['underscore', 'jquery'],
        　　　　　　　　exports: 'Backbone'
        　　　　　　}*/
            
        },
        packages: [
            {
                name: 'zrender',
                location: '../../../app/src/js/lib/zrender/src',
                main: 'zrender'
            },
            {
                name: 'lib',
                location: '../../../app/src/js/lib',
                main: 'lib'
            },
            {
                name: 'plugin',
                location: '../../../app/src/js/plugin',
                main: 'plugin'
            },
            {
                name: 'mod',
                location: '../../../app/src/js/mod',
                main: 'mod'
            },
            {
                name: 'widget',
                location: '../../../app/src/js/widget',
                main: 'widget'
            },
            {
                name: 'layer',
                location: '../../../app/src/js/layer',
                main: 'layer'
            },
            {
                name: 'controllers',
                location: '../../../app/src/js/controllers',
                main: 'controllers'
            },
            {
                name: 'base',
                location: '../../../app/src/js/base',
                main: 'base'
            }
        ]
    });
