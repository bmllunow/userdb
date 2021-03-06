'use strict';

var Hapi = require('hapi'),
    //path = require('path'),
    fs = require('fs'),
    swig = require('swig'),
    admin = require('./admin'),
    apis = require('./apis'),
    templates = require('./templates');

swig.setDefaults({ cache: false }); /* must be turned of when in production*/
var pack = new Hapi.Pack();

var serverOptions = {
  views: {
    engines: {
      html: swig,
      plain: swig
    },
    path: 'src/templates',
    isCached: false /* must be turned of when in production*/
  },
  router: {
    stripTrailingSlash: false
  }
  // ,labels: ['admin', 'apis', 'templates']
};

var redirectRootToAdmin = {
  register: function (plugin, options, next) {
    plugin.route({
      method: 'GET',
      path: '/',
      handler: function (request, reply) {
        reply.redirect('/admin');
      }
    });

    next();
  }
};

redirectRootToAdmin.register.attributes = {
  name: 'redirectRootToAdmin',
  version: '1.0.0'
};

pack.server(8000, serverOptions);

pack.register(admin, { route: { prefix: '/admin' } }, cb);
pack.register(apis, { route: { prefix: '/apis' } }, cb);
pack.register(templates, { route: { prefix: '/templates' } }, cb);
pack.register(redirectRootToAdmin, cb);


if (!module.parent) {
  pack.start(function() {
    console.log("Pack started.");
  });
}

function cb (err) {
  if (err) {
    console.log('Error when loading plugin', err);
    pack.stop();
  }
}


module.exports = pack;
