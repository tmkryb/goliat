var projectDir = __dirname;

module.exports = GLOBAL.projRequire = function(module) {
  console.log(projectDir + module);
  return require(projectDir + module);
}