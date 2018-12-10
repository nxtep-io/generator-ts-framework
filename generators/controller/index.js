'use strict';
const Path = require('path');
const Generator = require('yeoman-generator');
const slugify = require('underscore.string/slugify');
const {toPascalCase} = require('../utils');

const BASE_PATH = './api/controllers';

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

    // Adds support for custom base URL
    this.option('base-url', {
      type: String,
      required: false,
      description: 'Specify the controller base URL for requests'
    });

    // Prepare context utils
    this.slugify = slugify;
  }

  writing() {
    const ctrlName = `${toPascalCase(this.options.name)}Controller`;

    this.fs.copyTpl(
      this.templatePath('BaseController.ts.ejs'),
      this.destinationPath(
        Path.resolve(process.cwd(), this.options.path, `${ctrlName}.ts`)
      ), {
        ctrlName,
        baseUrl: this.options.baseUrl || `/${slugify(this.options.name)}`,
      }, {
        globOptions: {
          extension: false,
        }
      }
    );
  }

  install() {
    this.log('\n--\n');
    this.log('Controlller generated successfully');
  }
};
