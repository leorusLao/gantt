Gantt
===========

在 jQueryGantt 的基础上做了如下修改
- 统一由boot。js进行js加载管理
- 允许多个顶层task存在
- 增加task序号
- 使用layer作为弹窗，封装window类作为弹窗统一父类
- 增加task window作为编辑弹窗，模仿project界面
- 允许设置多个前置
- 增加多个前置关系 SS(开始-开始) FS(完成-开始) SF(开始-完成) FF(完成-完成)



These are some key features:
* jQuery based 3.2
* MIT licensed: you can reuse everywhere
* JSON import-export
* internationalizable
* manage task status –> project workflow
* manage dependencies
* manage assignments (resources, roles efforts)
* server synchronization ready
* full undo-redo support
* cross browser (at least for recent versions)
* keyboard editing support
* SVG visual editor
* print friendly
* collapsible branches
* critical path
* milestones, progress etc.
* zoom




