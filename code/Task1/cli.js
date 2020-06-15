#!/usr/bin/env node

const fs = require('fs');
let stat=fs.stat;
const path = require('path');

const inquirer = require('inquirer');
const fsEstra = require('fs-extra');
const ejs = require('ejs')

const tempPath = path.join(__dirname,'template');
const destDir = process.cwd();

inquirer.prompt([
  {
    type: 'input',
    name: 'name',
    message: 'Project Name?'
  },
  {
    type: 'input',
    name: 'port',
    message: 'Port Number?'
  }
]).then((answers) => {
  readAllFile(tempPath,destDir,copy,answers)
})

// const readAllFile = (answers,filePath) => {
//   fs.readdir(filePath, (err,files)=> {
//     if(err) {
//       console.log(`files read error: ${err}`)
//     }
//     else {
//       files.forEach((file)=> {
//         const fileDir = path.join(filePath,file);
//         fs.stat(fileDir,(err,stats)=> {
//           if(err) {
//             conosle.log(`${fileDir} read error`);
//           }
//           else {
//             const isFile =stats.isFile(); // is File, not Dir
//             const isDir = stats.isDirectory();
//             if(isFile) {
//               const fileContent = fs.readFileSync(fileDir)
//               console.log(fileDir)
//               fs.writeFileSync(path.join(destDir,file),fileContent)
//             }
//             if(isDir) {
//               readAllFile(answers,fileDir)
//             }
//           }
//         })
//       })
//     }
//   })
// }

//直接拷贝,无法用模板引擎编译
// const readAllFile = (answers) => {
//   fsEstra.copy(tempPath,destDir);
// }

var copy=function(src,dst,answers){
  //读取目录
  fs.readdir(src,function(err,paths){
      console.log(paths)
      if(err){
          throw err;
      }
      paths.forEach(function(path){
          var _src=src+'/'+path;
          var _dst=dst+'/'+path;
          var readable;
          var writable;
          stat(_src,function(err,st){
              if(err){
                  throw err;
              }
              
              if(st.isFile()){
                ejs.renderFile(_src,answers,(err,results) => {
                  fs.writeFileSync(_dst,results);
                })
                  // readable=fs.createReadStream(_src);//创建读取流
                  // writable=fs.createWriteStream(_dst);//创建写入流
                  // readable.pipe(writable);
              }else if(st.isDirectory()){
                readAllFile(_src,_dst,copy,answers);
              }
          });
      });
  });
}

var readAllFile=function(src,dst,callback,answers){
  //测试某个路径下文件是否存在
  fs.exists(dst,function(exists){
      if(exists){//不存在
          callback(src,dst,answers);
      }else{//存在
          fs.mkdir(dst,function(){//创建目录
              callback(src,dst,answers)
          })
      }
  })
}

// exists('../from','../to',copy)