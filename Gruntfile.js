module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      core: {
        src: ['source/js/zepto/zepto.js', 'source/js/zepto/event.js','source/js/utils.js', 'source/js/*.js'],
        dest: 'source/merged/js/iotboard.js'
      },
      css: {
        src: ['source/css/*.css'],
        dest: 'source/merged/css/iotboard.css'
      },
      dummy: {
        src: ['source/models/dummy/*.js'],
        dest: 'source/merged/js/dummy.model.js'
      },
      freeiot: {
        src: ['source/models/freeiot/bridge.js', 'source/models/freeiot/freeiot.model.js'],
        dest: 'source/merged/js/freeiot.model.js'
      }
    },
    copy: {
      widgets: {
        files: [{
          expand: true, 
          src: ['source/widgets/led/img/*'], 
          filter:'isFile',
          flatten: true,
          dest: 'public/iotboard/widgets/led/img/'
        }]
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      my_target: {
        files: {
          'public/iotboard/js/iotboard.min.js': ['source/merged/js/iotboard.js'],
          'public/iotboard/models/wechat.model.min.js': ['source/models/wechat/wechat.model.js'],
          'public/iotboard/models/freeiot.model.min.js': ['source/merged/js/freeiot.model.js'],
          'public/iotboard/models/dummy.model.min.js': ['source/merged/js/dummy.model.js'],
          'public/iotboard/widgets/led/led.widget.min.js': ['source/widgets/led/led.widget.js'],
          'public/iotboard/widgets/motor/motor.widget.min.js': ['source/widgets/motor/motor.widget.js'],
          'public/iotboard/widgets/thermohygrometer/thermohygrometer.widget.min.js': ['source/widgets/thermohygrometer/thermohygrometer.widget.js'],
          'public/iotboard/widgets/temperature/temperature.widget.min.js': ['source/widgets/temperature/temperature.widget.js'],
          'public/iotboard/widgets/humiture/humiture.widget.min.js': ['source/widgets/humiture/humiture.widget.js'],
          'public/iotboard/widgets/pm25/pm25.widget.min.js': ['source/widgets/pm25/pm25.widget.js'],
          'public/iotboard/widgets/air/air.widget.min.js': ['source/widgets/air/air.widget.js'],
          'public/iotboard/widgets/plug/plug.widget.min.js': ['source/widgets/plug/plug.widget.js'],
          'public/iotboard/widgets/text/text.widget.min.js': ['source/widgets/text/text.widget.js'],
          'public/iotboard/widgets/default/default.widget.min.js': ['source/widgets/default/default.widget.js']
        }
      }
    },
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'source/merged/css/',
          src: ['*.css', '!*.min.css'],
          dest: 'public/iotboard/css/',
          ext: '.min.css'
        },{
          expand: true,
          cwd: 'source/widgets/air',
          src: ['*.css', '!*.min.css'],
          dest: 'public/iotboard/widgets/air',
          ext: '.widget.min.css'
        },{
          expand: true,
          cwd: 'source/widgets/pm25',
          src: ['*.css', '!*.min.css'],
          dest: 'public/iotboard/widgets/pm25',
          ext: '.widget.min.css'
        },{
          expand: true,
          cwd: 'source/widgets/led',
          src: ['*.css', '!*.min.css'],
          dest: 'public/iotboard/widgets/led',
          ext: '.widget.min.css'
        },{
          expand: true,
          cwd: 'source/widgets/humiture',
          src: ['*.css', '!*.min.css'],
          dest: 'public/iotboard/widgets/humiture',
          ext: '.widget.min.css'
        },{
          expand: true,
          cwd: 'source/widgets/temperature',
          src: ['*.css', '!*.min.css'],
          dest: 'public/iotboard/widgets/temperature',
          ext: '.widget.min.css'
        },{
          expand: true,
          cwd: 'source/widgets/thermohygrometer',
          src: ['*.css', '!*.min.css'],
          dest: 'public/iotboard/widgets/thermohygrometer',
          ext: '.widget.min.css'
        },{
          expand: true,
          cwd: 'source/widgets/motor',
          src: ['*.css', '!*.min.css'],
          dest: 'public/iotboard/widgets/motor',
          ext: '.widget.min.css'
        },{
          expand: true,
          cwd: 'source/widgets/plug',
          src: ['*.css', '!*.min.css'],
          dest: 'public/iotboard/widgets/plug',
          ext: '.widget.min.css'
        },{
          expand: true,
          cwd: 'source/widgets/default',
          src: ['*.css', '!*.min.css'],
          dest: 'public/iotboard/widgets/default',
          ext: '.widget.min.css'
        },{
          expand: true,
          cwd: 'source/widgets/text',
          src: ['*.css', '!*.min.css'],
          dest: 'public/iotboard/widgets/text',
          ext: '.widget.min.css'
        },{
          expand: true,
          cwd: 'source/widgets/atmosphere',
          src: ['*.css', '!*.min.css'],
          dest:'public/iotboard/widgets/atmosphere',
          ext: '.widget.min.css'
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('default', ['concat','copy',"uglify", "cssmin"]);

};
