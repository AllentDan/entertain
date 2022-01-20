// const fs = require("fs");
import * as fs from 'fs';
import * as path from 'path';

// const path = require("path");
const ignore = ['node_modules'];
var DEPTH = 0;
var MAX_DEPTH = 1;

export const treePath = function(dir: string, num_deep: number = -1) {
    DEPTH = num_deep;
    if (DEPTH <0){
        DEPTH = DEPTH + MAX_DEPTH;
    }
    MAX_DEPTH = 1;

    const treeArr = [{
        name: path.basename(dir),
        str: path.basename(dir)
    }];
    
    const render = function(name: string, isLast: boolean, deep: Array<boolean>){
        const line = deep.map(el=>`${el?'│':' '}  `).join('');
        const text = `${line}${isLast?'└─':'├─'} ${name}`;
        return {
            name: name,
            str: text
        }; 
    }

    const tree = function(target: string,deep:Array<boolean> = []){
        const child = fs.readdirSync(target).filter(el=>!el.startsWith('.'));
        var direct: Array<string> = [];
        let file: Array<string> = [];
        child.forEach(function(el){
            const dir = path.join(target,el);
            const stat = fs.statSync(dir);
            const flag = ignore.every(function(reg){
                return !dir.includes(reg);
            })
            if(flag){
                if(stat.isFile()){ 
                    file.push(el);
                }else{
                    direct.push(el);
                }
            }
            
        })
        direct.forEach(function(el,i){
            const dir = path.join(target,el);
            const isLast = (i === direct.length -1) && (file.length === 0);
            treeArr.push(render(el,isLast,deep));
            if (deep.length +1 != DEPTH){
                tree(dir, [...deep,!isLast]);
            }
        })
        file.forEach(function(el,i){
            const isLast = i === file.length -1;
            treeArr.push(render(el,isLast,deep));
        })
    }
    
    tree(dir);
    return treeArr;
}

export const treeDepth = function(dir: string):Number {
    
    const render = function(name: string, isLast: boolean, deep: Array<boolean>){
        const line = deep.map(el=>`${el?'│':' '}  `).join('');
        const text = `${line}${isLast?'└─':'├─'} ${name}`;
        return {
            name: name,
            str: text
        }; 
    }

    const tree = function(target: string,deep:Array<boolean> = []){
        const child = fs.readdirSync(target).filter(el=>!el.startsWith('.'));
        var direct: Array<string> = [];
        let file: Array<string> = [];
        child.forEach(function(el){
            const dir = path.join(target,el);
            const stat = fs.statSync(dir);
            const flag = ignore.every(function(reg){
                return !dir.includes(reg);
            })
            if(flag){
                if(stat.isDirectory()){ 
                    direct.push(el);
                }
            }
        })
        direct.forEach(function(el,i){
            const dir = path.join(target,el);
            const isLast = (i === direct.length -1) && (file.length === 0);
            MAX_DEPTH = MAX_DEPTH<=deep.length + 2? deep.length +2: MAX_DEPTH;
            tree(dir, [...deep,!isLast]);
        })
    }
    
    tree(dir);
    return MAX_DEPTH;
}
