// Renders each NN-*.html here to a 1080x1920 PNG in ./png. Usage: node render.cjs [file-prefix]
const {chromium}=require('/home/jpvoogt/.npm-global/node_modules/playwright');
const fs=require('fs'),path=require('path');
(async()=>{const only=process.argv[2]||'';fs.mkdirSync(path.join(__dirname,'png'),{recursive:true});
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
for(const f of fs.readdirSync(__dirname).filter(f=>/^\d\d-.*\.html$/.test(f)&&f.startsWith(only))){
 await p.goto('file://'+path.join(__dirname,f));await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);
 await p.screenshot({path:path.join(__dirname,'png',f.replace('.html','.png'))});console.log('rendered',f);}
await b.close()})();
