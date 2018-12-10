'use strict';
const Path = require('path');
const Generator = require('yeoman-generator');
const slugify = require('underscore.string/slugify');
const {
  toPascalCase
} = require('../utils');

const BASE_PATH = './api/services';

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    // This makes `appname` a required argument.
    this.argument('name', {
      type: String,
      required: true,
      description: 'The name of the entity'
    });

    // Adds support for custom path
    this.option('path', {
      type: String,
      required: false,
      default: BASE_PATH,
      description: 'Specify a custom path for script generation'
    });

    // Prepare context utils
    this.slugify = slugify;
  }

  writing() {
    const serviceName = `${toPascalCase(this.options.name)}Service`;

    this.fs.copyTpl(
      this.templatePath('BaseService.ts.ejs'),
      this.destinationPath(
        Path.resolve(process.cwd(), this.options.path, `${serviceName}.ts`)
      ), {
        serviceName,
        name: this.options.name,
      }, {
        globOptions: {
          extension: false,
        }
      }
    );
  }

  install() {
    this.log('\n--\n');
    this.log('Service generated successfully');
  }
};
