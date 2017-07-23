((shell,os,cheerio,api)=>{
      api.phantomPath=`${__dirname}/lib/phantom_${os.platform()}/bin/phantomjs`;
      api.cmd=(url,timeout,ua,operation)=> `${api.phantomPath} ${__dirname}/bin/script-phantom.js ${url} ${timeout} ${ua} ${operation}`;

    api.getHTMLAsync=function(cmd,fn){
        shell.exec(cmd,function (error, stdout, stderr) {
               fn.call(null,stdout,api.getHTML.$(stdout));
        });
    };
     api.getHTML=function(url,timeout,ua,operation,fn){
        if(typeof fn==='function'){
           api.getHTMLAsync(api.cmd(url,timeout,ua,operation),fn);
        }else{
           return shell.execSync(api.cmd(url,timeout,ua,operation),{ encoding: 'utf8' });
        }

     };

     api.getHTML.$=function(html){
        return cheerio.load(html);
     };
   module.exports=api.getHTML;

})(require('child_process'),require('os'),require('cheerio'),{})
