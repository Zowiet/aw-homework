 
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
BP.Component.create-components-from-jade-views jade-views = {"assignments-list":{"docName":"assignment","name":"assignments-list","templateName":"assignments-list","type":"list","isMainNav":true,"referredViews":{},"customClass":"Assignments-list","additionalLinks":[{"label":"开始写作业","path":"create-homework","to":"homework.detail.create","guard":"homework._id","icon":"go-create"},{"label":"更新作业","path":"update-homework","to":"homework.detail.update","context":"homework","guard":"homework._id","icon":"go-update"}]},"assignment":{"docName":"assignment","name":"assignment","templateName":"assignment","type":"detail","isMainNav":false,"referredViews":{},"additionalLinks":[]},"homeworks-list":{"docName":"homework","name":"homeworks-list","templateName":"homeworks-list","type":"list","isMainNav":true,"referredViews":{},"customClass":"Homework-list","additionalLinks":[{"label":"看作业要求列表","path":"go-assignments-list","to":"assignment.list.list","guard":true,"icon":"go"}]},"homework":{"docName":"homework","name":"homework","templateName":"homework","type":"detail","isMainNav":false,"referredViews":{},"customClass":"Homework-detail","additionalLinks":[]}}