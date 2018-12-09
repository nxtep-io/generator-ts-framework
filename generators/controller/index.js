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

  prompting() {
    const prompts = [{
      type: 'input',
      name: 'basePath',
      message: 'What\'s the controller base path?',
      default: `/${slugify(this.options.name)}`
    }];

    return this.prompt(prompts).then(props => {
      this.options.basePath = props.basePath;
    });
  }

  writing() {
    const ctrlName = `${toPascalCase(this.options.name)}Controller`;

    // Copy Docker files
    this.fs.copyTpl(
      this.templatePath('BaseController.ts.ejs'),
      this.destinationPath(`./api/controllers/${ctrlName}.ts`), {
        ctrlName,
        basePath: this.options.basePath,
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
