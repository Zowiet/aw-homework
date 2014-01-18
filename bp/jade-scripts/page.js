// Generated by LiveScript 1.2.0
(function(){
  var Page, slice$ = [].slice;
  this.BP || (this.BP = {});
  Page = (function(){
    Page.displayName = 'Page';
    var prototype = Page.prototype, constructor = Page;
    Page.currentPage = Page.lastPage = null;
    Page.registry = {};
    Page.createPages = function(pages){
      var i$, len$, page;
      for (i$ = 0, len$ = pages.length; i$ < len$; ++i$) {
        page = pages[i$];
        this.resume(page);
      }
      if (Meteor.isClient) {
        return this.addMeteorHelpers();
      }
    };
    Page.resume = function(pageConfig){
      var page, ref$, key$, i$, len$, viewConfig;
      page = new Page(pageConfig);
      page.faces = [];
      page.pathName = page.templateName;
      (ref$ = this.registry)[key$ = page.namespace] || (ref$[key$] = {});
      this.registry[page.namespace][page.name] = page;
      for (i$ = 0, len$ = (ref$ = pageConfig.views).length; i$ < len$; ++i$) {
        viewConfig = ref$[i$];
        page.addComponentView(viewConfig);
      }
      return page.init();
    };
    Page.addMeteorHelpers = function(){
      var this$ = this;
      Handlebars.registerHelper('bp-is-page', function(namespace, name){
        return this$.currentPage && namespace === this$.currentPage.namespace && name === this$.currentPage.name;
      });
      Handlebars.registerHelper('bp-is-shown-list-relation', function(){
        if (BP.MODE !== 'DEVELOPMENT') {
          if (this$.currentPage) {
            return this$.currentPage.showListRelations;
          } else {
            return !this$.lastPage || this$.lastPage.showListRelations;
          }
        } else {
          return true;
        }
      });
      Handlebars.registerHelper('bp-is-shown-detail-relation', function(){
        if (BP.MODE !== 'DEVELOPMENT') {
          if (this$.currentPage) {
            return this$.currentPage.showDetailRelations;
          } else {
            return !this$.lastPage || this$.lastPage.showDetailRelations;
          }
        } else {
          return true;
        }
      });
    };
    Page.trackPage = function(newPage){
      if (this.currentPage !== null) {
        this.lastPage = this.currentPage;
      }
      this.currentPage = newPage;
    };
    Page.pathFor = function(namespace, pageName, docName, doc){
      var page;
      page = Page.registry[namespace][pageName];
      return page.getPath(docName, doc);
    };
    Page.isPagePermit = function(doc, action, namespace, pageName){
      this.permission || (this.permission = BP.Permission.getInstance());
      return this.permission.checkPageActionPermission(namespace, pageName, doc, action);
    };
    Page.getJointPageName = function(namespace, name){
      return namespace + ":" + name;
    };
    Page.parseNamespaceAndNameFromJointPageName = function(jointPageName){
      var tokens;
      tokens = jointPageName.split(':');
      return {
        namespace: tokens[0],
        name: slice$.call(tokens, 1, -1 + 1 || 9e9).join(':')
      };
    };
    function Page(arg$){
      this.namespace = arg$.namespace, this.name = arg$.name, this.mainNav = arg$.mainNav, this.showListRelations = arg$.showListRelations, this.showDetailRelations = arg$.showDetailRelations;
      if (this.showListRelations !== false) {
        this.showListRelations = true;
      }
      if (this.showDetailRelations !== false) {
        this.showDetailRelations = true;
      }
      this.templateName = [this.namespace, this.name].join('-');
      this.displayName = this.mainNav || this.templateName;
      this.views = [];
      this;
    }
    prototype.addView = function(namespace, docName, viewName, faceName, query){
      return this.views.push({
        namespace: namespace,
        docName: docName,
        viewName: viewName,
        faceName: faceName,
        query: query
      });
    };
    prototype.addComponentView = function(viewConfig){
      var vc, component, view;
      vc = viewConfig;
      component = BP.Component.registry[vc.namespace][vc.docName];
      view = component[vc.viewName];
      view.pageQuery = vc.query;
      this.faces.push({
        view: view,
        faceName: vc.faceName
      });
    };
    prototype.init = function(){
      this.route();
      if (this.mainNav) {
        BP.Nav.addMainNav({
          name: this.displayName,
          path: this.pathName,
          page: this
        });
      }
      if (this.secondNav) {
        BP.Nav.addSecondNav({
          name: this.displayName,
          path: this.pathName,
          page: this
        });
      }
    };
    prototype.getJointPageName = function(){
      return constructor.getJointPageName(this.namespace, this.name);
    };
    prototype.route = function(){
      var self;
      self = this;
      Router.map(function(){
        this.route(self.pathName, {
          path: self.getPathPattern(),
          template: self.templateName,
          before: function(){
            if (!self.isPermit()) {
              alert("没有权限访问");
              this.redirect('default');
            } else {
              BP.Page.trackPage(self);
              self.configViews(this.params);
            }
          },
          waitOn: function(){
            return self.subscribe(this.params);
          }
        });
      });
    };
    prototype.getPathPattern = function(){
      var pattern, i$, ref$, len$, face;
      pattern = "/" + this.pathName;
      for (i$ = 0, len$ = (ref$ = this.faces).length; i$ < len$; ++i$) {
        face = ref$[i$];
        pattern += face.view.faces[face.faceName];
      }
      return pattern;
    };
    prototype.getPath = function(docName, doc){
      var path, i$, ref$, len$, face, id;
      path = "/" + this.pathName;
      for (i$ = 0, len$ = (ref$ = this.faces).length; i$ < len$; ++i$) {
        face = ref$[i$];
        id = this.getFaceId(face, docName, doc);
        path += face.view.facesManager.getPath(face.view.faces[face.faceName], id);
      }
      return path;
    };
    prototype.getFaceId = function(face, docName, doc){
      var id;
      return id = face.view.docName === docName
        ? doc._id
        : doc[docName + 'Id'];
    };
    prototype.isPermit = function(){
      var i$, ref$, len$, face;
      if (!constructor.isPagePermit('', 'go', this.namespace, this.name)) {
        return false;
      }
      for (i$ = 0, len$ = (ref$ = this.faces).length; i$ < len$; ++i$) {
        face = ref$[i$];
        if (!face.view.isPermit(face.view.dataManager.doc, face.faceName, face.view.dataManager)) {
          return flase;
        }
      }
      return true;
    };
    prototype.configViews = function(params){
      this.setViewsCurrentFaces();
      this.filterListViewsData(params);
      this.storeDataInState();
    };
    prototype.setViewsCurrentFaces = function(){
      var i$, ref$, len$, face;
      for (i$ = 0, len$ = (ref$ = this.faces).length; i$ < len$; ++i$) {
        face = ref$[i$];
        face.view.currentFaceName = face.faceName;
      }
    };
    prototype.filterListViewsData = function(params){
      var i$, ref$, len$, face;
      for (i$ = 0, len$ = (ref$ = this.faces).length; i$ < len$; ++i$) {
        face = ref$[i$];
        if (face.view.type === 'list' && face.view.pageQuery) {
          face.view.dataManager.query = this.applyQueryOnParams(face.view.pageQuery, params);
        }
      }
    };
    prototype.storeDataInState = function(){
      var i$, ref$, len$, face;
      for (i$ = 0, len$ = (ref$ = this.faces).length; i$ < len$; ++i$) {
        face = ref$[i$];
        face.view.dataManager.storeDataInState();
      }
    };
    prototype.applyQueryOnParams = function(query, params){
      eval('query = ' + query);
      return query;
    };
    prototype.subscribe = function(params){
      var i$, ref$, len$, face;
      for (i$ = 0, len$ = (ref$ = this.faces).length; i$ < len$; ++i$) {
        face = ref$[i$];
        face.view.dataManager.subscribe(params);
      }
    };
    return Page;
  }());
  if (typeof module != 'undefined' && module !== null) {
    module.exports = Page;
  } else {
    BP.Page = Page;
  }
}).call(this);
