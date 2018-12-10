'use strict';
const Path = require('path');
const Generator = require('yeoman-generator');
const slugify = require('underscore.string/slugify');

const BASE_PATH = './api/controllers';

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
      description: 'The name of the entity'
    });

    // Adds support for custom path
    this.option('path', {
      type: String,
      required: false,
      default: BASE_PATH,
      description: 'Specify a custom path for script generation'
    });

    // Adds support for custom path
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
    this.log('\n\n--\n');
    this.log('Controller generated successfully');
  }
};
