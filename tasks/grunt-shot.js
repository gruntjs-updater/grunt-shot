/*
 * shot
 * https://github.com/davidbielik/grunt-shot
 *
 * Copyright (c) 2015 David Bielik
 * Licensed under the MIT license.
 */
(function() {
    /* global module ,require, __dirname */
    'use strict';
    var P = require('bluebird');
    var phantom = require('phantom');
    module.exports = function(grunt) {

        // Please see the Grunt documentation for more information regarding task
        // creation: http://gruntjs.com/creating-tasks

        grunt.registerMultiTask('shot', 'Automate screenshots for specified pages.', function() {
            // var options = this.options({
            //     punctuation: '.',
            //     separator: ', '
            // });
            // Iterate over all specified file groups.
            var done = this.async();
            var options = this.data.options || {};
            var url = (options.protocol || 'http') + '://' + (options.host || 'localhost');
            var files = this.files[0].orig.src;
            var promises = [];
            for (var i = 0, l = files.length; i < l; i++) {
                var file = files[i];
                if (!/^\//.test(file)) {
                    grunt.log.warn('file paths should be relative urls (ex: /login). You provided: "' + file + '"');
                    continue;
                }
                console.log('pushing ' + url + file);


                promises.push(screenshot(url + file, options.output));

                // Concat specified files.
                // var src = f.src.filter(function(filepath) {
                //     // Warn on and remove invalid source files (if nonull was set).
                //     if (!grunt.file.exists(filepath)) {
                //         grunt.log.warn('Source file "' + filepath + '" not found.');
                //         return false;
                //     } else {
                //         return true;
                //     }
                // }).map(function(filepath) {
                //     // 
                //     return filepath;
                // }).join(grunt.util.normalizelf(options.separator));

                // // Handle options.
                // src += options.punctuation;

                // // Write the destination file.
                // console.log(src);

                // Print a success message.
                //dgrunt.log.writeln('File "' + f.dest + '" created.');
            }
            P.all(promises).then(onSuccess).catch(onError).done(done);
        });

        function screenshot(url, output) {
            var defer = P.defer();
            var timeout = 10000;
            output = output || __dirname + '/screenshots/';

            phantom.create({
                parameters: {
                    'load-images': 'yes',
                    'ignore-ssl-errors': 'yes'
                }
            }, function(ph) {
                ph.createPage(function(page) {
                    page.set('settings.loadImages', true);
                    page.open(url, function(status) {
                        console.log('opened ' + url + ': ', status);
                        setTimeout(function() {
                            var file = output + encodeURIComponent(url.replace(/^https?:\/\//,'')) + '.png';
                            page.render(file, function(status){
                                console.log('saved to ' + file, status);
                                defer.resolve(url);
                            });
                        }, timeout);
                    });
                });
            });
            return defer.promise;
        }

        function onSuccess(data) {
            console.log('# On success: ', data);
        }

        function onError(error) {
            console.log('# On error: ', error);
        }

    };
})();