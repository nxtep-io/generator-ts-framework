'use strict';
const chalk = require('chalk');
const yosay = require('yosay');
const Generator = require('yeoman-generator');
const slugify = require('underscore.string/slugify');

const toPascalCase = (input) => {
  return input.match(/[a-z]+/gi)
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
    })
    .join('');
}

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    // This makes `appname` a required argument.
    this.argument('name', {
      type: String,
      required: true,
    });

    // Prepare context utils
    this.slugify = slugify;
    this.camel = toPascalCase;
  }

  writing() {
    const serviceName = `${toPascalCase(this.options.name)}Service`;

    // Copy Docker files
    this.fs.copyTpl(
      this.templatePath('BaseService.ts.ejs'),
      this.destinationPath(`./api/services/${serviceName}.ts`), {
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
    this.log('\n\n--\n');
    this.log('Controller generated successfully');
  }
};
