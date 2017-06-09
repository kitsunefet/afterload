((shell,os,cheerio,api)=>{
      api.phantomPath=`${__dirname}/lib/phantom_${os.platform()}/bin/phantomjs`;
      api.cmd=(url)=> `${api.phantomPath} ${__dirname}/bin/script-phantom.js ${url}`;

    api.getHTMLAsync=function(cmd,fn){

        //sec check
        var decoded_url = unescape(cmd);
        var check = new RegExp("^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$","i");
        if(!check.test(decoded_url)){
          cmd="";
         // console.log("Async query filtered");
        }

        shell.exec(cmd,function (error, stdout, stderr) {
               fn.call(null,stdout,api.getHTML.$(stdout));
        });
    };
     api.getHTML=function(url,fn){

        //sec check
        var decoded_url = unescape(url);
        var check = new RegExp("^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$","i");
        if(!check.test(decoded_url)){
          url="";
         //  console.log("Sync query filtered");
        }

        if(typeof fn==='function'){
           api.getHTMLAsync(api.cmd(url),fn);
        }else{
           return shell.execSync(api.cmd(url),{ encoding: 'utf8' });
        }

     };

     api.getHTML.$=function(html){
        return cheerio.load(html);
     };
   module.exports=api.getHTML;

})(require('child_process'),require('os'),require('cheerio'),{})
