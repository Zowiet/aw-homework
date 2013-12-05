// Generated by LiveScript 1.2.0
(function(){
  var fs, View, Names, code;
  fs = require('fs');
  View = require('./_view').View;
  Names = require('./Names');
  module.exports = {
    getView: function(docName, viewName, templateName, templateType){
      return View.getView.apply(View, arguments);
    },
    setMainNav: function(templateNames){
      var i$, len$, name, results$ = [];
      if (typeof templateNames === 'string') {
        templateNames = templateNames.split(',');
      }
      for (i$ = 0, len$ = templateNames.length; i$ < len$; ++i$) {
        name = templateNames[i$];
        name = name.trim();
        results$.push(View.registry[name].isMainNav = true);
      }
      return results$;
    },
    saveView: function(view){
      fs.writeFileSync('bp/main.ls', code + JSON.stringify(View.registry));
    },
    getRef: function(ref){
      switch (ref) {
      case 'detail':
        return this.names.detailTemplateName;
      case 'list':
        return this.names.listTemplateName;
      default:
        return ref;
      }
    },
    getNames: function(docName){
      return this.names = new Names(docName);
    }
  };
  code = ' \n# if module?\n#   require! [fs, sugar, \'./Component\'] \n\n# BP ||= {}\n# BP.Component ||= Component\n\n# debugger\nBP.Component.create-components-from-jade-views jade-views = ';
}).call(this);
