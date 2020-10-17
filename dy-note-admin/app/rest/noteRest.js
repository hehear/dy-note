const express = require('express');
const logger = require('../../config/log4js');
const router = express.Router();
const resMsg = require('../model/resMsg');
const fs = require('fs');
const path = require('path');

const docPath = "/Users/runningcoder/git/dy-note/dy-note-web/docs";
const sideBar = "/Users/runningcoder/git/dy-note/dy-note-web/_sidebar.md";


function readFileList(dir, resultMap=new Map(),filesList = []) {
    const files = fs.readdirSync(dir);
    filesList = [];
    //resultList=[];
    files.forEach((item, index) => {
        let fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            //console.log('dir:'+fullPath);
            if(item!="note-images"){
                resultMap.set(item,filesList)
                readFileList(path.join(dir, item), resultMap,filesList);  //递归读取文件
            }
        } else {
            let file = {}
            file.name = item.substring(0,item.lastIndexOf('.'));
            file.path = fullPath;

            let content = fs.readFileSync(fullPath, 'utf-8');
            file.content = content;

            filesList.push(file);
            let name = dir.substring(dir.lastIndexOf("/")+1);
            resultMap.set(name,filesList)
        }
    });
    return resultMap;
}


router.get('/queryNoteTypelist', function (req, res) {

    logger.info('查询笔记类型');

    var filePath = path.resolve(docPath);

    let rows = [];

    let resultMap = new Map();

    let rlt = readFileList(filePath,resultMap,rows);

    let resultList = [];
    rlt.forEach(function(value,key){
        let item = {name:key,path:filePath+'/'+key,notes:value};
        resultList.push(item);
    });

    res.json(resMsg.getSuccess(resultList));

});

function saveToDocsifySideBar(){

    let rows = [];
    var filePath = path.resolve(docPath);
    let resultMap = new Map();
    let rlt = readFileList(filePath,resultMap,rows);

    var mdContent="";
    rlt.forEach(function(value,key){
        let notes = value;
        mdContent += "* "+key+"\n" +
            "\n" ;
        for(let i=0;i<notes.length;i++){
            let note = notes[i];
            //console.log(note.name);
            let pathStr = note.path.substring(note.path.lastIndexOf("docs"));
            //console.log(pathStr);
            mdContent+="  * ["+note.name+"]("+pathStr+")\n";
        }
    });

    fs.writeFile(sideBar,mdContent,function(error) {
        if (error) {
            console.log('写入失败')
        } else {
            console.log('写入成功')
        }
    });


}

router.post('/addNoteType', function (req, res) {

    logger.info('新增笔记类型');
    var filter=req.body;
    let name = filter.name;

    var filePath = path.resolve(docPath);

    fs.mkdirSync(filePath+"/"+name);

    let rows = [];

    res.json(resMsg.getSuccess("success"));

});



router.post('/save', function (req, res) {

    logger.info('保存笔记');
    var filter=req.body;
    let name = filter.name;
    let content = filter.content;
    let pathTmp = filter.path;

    var filePath = path.resolve(docPath);

    if(pathTmp==''){
        pathTmp = filePath;
    }

    fs.writeFile(pathTmp+'/'+name+'.md',content,function(error) {
        if (error) {
            console.log('写入失败')
        } else {
            saveToDocsifySideBar();
            console.log('写入成功')
        }
    });

    res.json(resMsg.getSuccess("success"));

});


function deleteFolder(path) {
    let files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            let curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) {
                deleteFolder(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}
router.get('/delete', function (req, res) {

    var path=req.query.path;

    logger.info('删除文件，path：'+path);

    if(fs.statSync(path).isDirectory()){
        deleteFolder(path);
    }else{
        fs.unlinkSync(path);
    }

    saveToDocsifySideBar();
    res.json(resMsg.getSuccess("success"));

});


//必须
module.exports = router;