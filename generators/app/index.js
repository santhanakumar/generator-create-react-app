var Generator = require("yeoman-generator");
var to = require("to-case");

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);
  }
  async prompting() {
    const answers = await this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your project name",
        default: this.appname // Default to current folder name
      },
      {
        type: "list",
        name: "packageManager",
        message: "Your package manager",
        choices: [
          {
            name: "Npm",
            value: "npm"
          },
          {
            name: "Yarn",
            value: "yarn"
          }
        ]
      }
    ]);
    this.packageName = to.slug(answers.name);
    this.projectName = to.title(answers.name);
    this.packageManager = answers.packageManager;
  }

  copyFiles() {
    this.fs.copyTpl(
      this.templatePath("public/index.html.ejs"),
      this.destinationPath("public/index.html"),
      {
        projectName: this.projectName
      }
    );
    this.fs.copyTpl(
      this.templatePath("public/manifest.json.ejs"),
      this.destinationPath("public/manifest.json"),
      {
        packageName: this.packageName,
        projectName: this.projectName
      }
    );
    this.fs.copy(
      this.templatePath("public/favicon.ico"),
      this.destinationPath("public/favicon.ico")
    );
    this.fs.copyTpl(
      this.templatePath("README.md.ejs"),
      this.destinationPath("README.md"),
      {
        projectName: this.projectName
      }
    );
    this.fs.copy(
      this.templatePath("gitignore"),
      this.destinationPath(".gitignore")
    );
    this.fs.copy(this.templatePath("src"), this.destinationPath("src"));
    this.fs.copyTpl(
      this.templatePath("package.json.ejs"),
      this.destinationPath("package.json"),
      {
        packageName: this.packageName,
        projectName: this.projectName,
        projectDescription: this.projectDescription,
        projectVersion: this.projectVersion,
        authorName: this.authorName
      }
    );
  }

  install() {
    this.installDependencies({
      npm: this.packageManager === "npm",
      bower: false,
      yarn: this.packageManager === "yarn"
    });
  }
};
