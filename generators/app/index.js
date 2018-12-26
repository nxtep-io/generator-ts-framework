const Generator = require('yeoman-generator');
const slugify = require('underscore.string/slugify');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    // This makes `appname` an optional argument.
    this.argument('appname', {
      type: String,
      required: false
    });

    // add option to skip install
    this.option('skip-install');

    // Prepare context utils
    this.slugify = slugify;
  }

  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the ${chalk.red('TS Framework')} project generator!`)
    );

    const prompts = [{
      type: 'input',
      name: 'name',
      message: 'How should your project be called?',
      default: this.options.appname || this.appname // Default to current folder name
    }];

    return this.prompt(prompts).then(props => {
      this.options.name = props.name;
    });
  }

  dir() {
    if (this.options.createDirectory !== undefined) {
      return true;
    }

    const prompt = [{
      type: 'confirm',
      name: 'createDirectory',
      message: 'Would you like to create a new directory for your project?',
    }];

    return this.prompt(prompt).then((props) => {
      this.options.createDirectory = props.createDirectory;
    });
  }

  dirname() {
    if (!this.options.createDirectory || this.options.dirname) {
      return true;
    }

    const prompt = [{
      type: 'input',
      name: 'dirname',
      message: 'Enter directory name',
      default: this.options.name,
    }];

    return this.prompt(prompt).then((response) => {
      this.options.dirname = response.dirname;
    });
  }

  writing() {
    // create directory
    if (this.options.createDirectory) {
      this.destinationRoot(this.options.dirname);
      this.appname = this.options.dirname;
    }

    // Prepare JSON configuration files
    this.fs.copyTpl(
      this.templatePath('*.json'),
      this.destinationRoot(), {
        name: this.options.name,
        slugify: this.slugify,
      }
    );

    // Prepare dot configuration files
    this.fs.copyTpl(this.templatePath('_gitignore'), this.destinationPath('.gitignore'), null, {
      globOptions: {
        dot: true
      }
    });
    this.fs.copyTpl(this.templatePath('.*'), this.destinationRoot(), null, {
      globOptions: {
        dot: true
      }
    });

    // Copy Docker files
    this.fs.copyTpl(
      this.templatePath('Dockerfile'),
      this.destinationPath('Dockerfile'), {
        name: this.options.name,
        slugify: this.slugify,
      }, {
        globOptions: {
          extension: false,
        }
      }
    );

    // Copy typescript files
    this.fs.copyTpl(
      this.templatePath('**/*.ts'),
      this.destinationRoot()
    );

    // VSCode config files
    this.fs.copyTpl(
      this.templatePath('.vscode/*.json'),
      this.destinationPath('.vscode'),
      null, {
        dot: true
      }
    );
  }

  install() {
    if (!this.options['skip-install']) {
      this.installDependencies({
        npm: false,
        bower: false,
        yarn: true,
      }).then(() => {
        if (!this.options['skip-install']) {
          // Run automated tests to ensure everything went well
          this.spawnCommandSync('yarn', ['test'])

          // Log completion
          this.log('\n\n--\n');
          this.log('Project generated successfully, all unit tests passing');
          this.log(`You can start the server with: cd ./${this.options.dirname || 'example'} && yarn start`);
        }
      });
    } else {
      this.log('\n\n--\n');
      this.log('Project generated successfully');
    }
  }
};
