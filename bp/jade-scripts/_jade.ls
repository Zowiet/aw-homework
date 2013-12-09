# !!! 注意，此文件不是运行时代码，是开发时代码。
# 给Jade用，根据template中的定义，动态编译出Views，以便BP Router加载。

require! [fs, './_view'.View, './Names']

module.exports =
  get-view: (doc-name, view-name, template-name, template-type)->
    View.get-view.apply View, &

  set-main-nav: (template-names)->
    template-names = template-names.split ',' if typeof template-names is 'string'
    for name in template-names
      name = name.trim!
      View.registry[name].is-main-nav = true

  set-list-class-name: (@list-class-name) -> console.log "class-name: ", @list-class-name

  save-view: (view)!->
    fs.write-file-sync 'bp/main.ls', code + (JSON.stringify View.registry) +  
      if @list-class-name then ", '#{@list-class-name.camelize!}', 'list'" else ''

  get-ref-name: (ref)->
    switch ref
    case 'detail' then @names.detail-template-name
    case 'list' then @names.list-template-name
    default ref

  get-names: (doc-name)-> 
    @names = new Names doc-name 


code = ''' 
# ********************************************************
# *                                                      *
# *        IT IS AUTO GENERATED DON'T EDIT               *
# *                                                      *
# ********************************************************

# if module?
#   require! [fs, sugar, './Component'] 

# BP ||= {}
# BP.Component ||= Component

# debugger
BP.Component.create-components-from-jade-views jade-views = 
'''



