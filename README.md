1. 

初步认识：在开发的各个环节中，包括从创建项目，再到编码，预览/测试，再到提交和部署，自动化的为前端工程中完成一些可复制的，可自动化完成的操作，降低人工手动操作的出错率，也提升开发人员的开发体验，提升项目的可靠性

前端微服务：前端微服务的整体架构设计下，必然会出现各个微服务的基础结构类似的情况，这时，可利用脚手架工具，在创建新的前端微服务时，为新的服务搭建一个基础的代码结构和必要的基础代码，有助于开发人员快速熟悉现有微服务开发逻辑和更加专注于业务代码的编写

兼容性问题：通过使用gulp的插件，编译ES6+语法和Sass，提高开发效率又不影响浏览器兼容性

部署：通过gulp的压缩，和文件流打包形式，将开发代码按照开发人员意愿组织打包成为生产环境直接可以运行的代码，简化上线流程

2. 还可以让新的开发人员在接触到项目时，能对项目的基础结构有一个较清晰的认识（业务代码少）；还有利于在开发过程中起到对多人开发的代码约束的作用，基于一定的结构写，大家容易遵循类似的编码逻辑；还有益于项目的长期发展，当有新的特性需要添加修改时，健壮性较好，可以通过一次的修改，做到后续项目的持续优化