'use strict';
const Path = require('path');
const Generator = require('yeoman-generator');
const pluralize = require('pluralize');
const slugify = require('underscore.string/slugify');
const {
  toPascalCase
} = require('../utils');

const BASE_PATH = './api/migrations';

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
    this.pluralize = pluralize;
  }

  writing() {
    const timestamp = new Date().getTime();
    const fullName = `${toPascalCase(this.options.name)}${timestamp}`;

    this.fs.copyTpl(
      this.templatePath('BaseMigration.ts.ejs'),
      this.destinationPath(
        Path.resolve(process.cwd(), this.options.path, `${fullName}.ts`)
      ), {
        fullName,
        name: this.options.name,
        slugify: this.slugify,
      }, {
        globOptions: {
          extension: false,
        }
      }
    );
  }

  install() {
    this.log('\n--\n');
    this.log('Migration generated successfully');
  }
};
