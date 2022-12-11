const { constants } = require('buffer');
const newman = require('newman'); 
const fs=require('fs')
const dayjs = require('dayjs');
// require newman in your project->npm link newman

// call newman.run to pass `options` object and wait for callbackc

function loadJSON(fileName=''){

    return JSON.parse( fs.existsSync(fileName)

    ? fs.readFileSync('daata.json').toString()
    :  '""'

    )
}

function saveJson(fileName="",json='""'){

    return fs.writeFileSync(fileName,JSON.stringify(json))

    
}

function getDate(){

    let date=dayjs()

    return date.format("YYYY_MM_DD_HH_mm_ss")

}
    newman.run({
        collection: "https://api.postman.com/collections/24554143-a162e9b6-a421-42a2-8753-adc99759dfc4?access_key=PMAT-01GM0Y08TK4XZ9262MAGRRVFM9",
        reporters: 'cli',
        iterationData:'./testData.json',
        reporters: 'htmlextra',
        reporter: {
            htmlextra: {
                export: './htmlResults2.html', // If not specified, the file will be written to `newman/` in the current working directory.
                //template: './customTemplate.hbs' // optional, this will be picked up relative to the directory that Newman runs in.
            }
        }
        
        
    }).on('beforeRequest', (error, data) => {
        if (error) {
            console.log(error);       
            return;
        }
        
        var test_case=data.item.name
    
        if (data.request.body) {
           const resquestBody={}
            const content = data.request.body.raw.replace(/^\s+|\s+$/gm,'').toString();
            var method=data.request.method
            resquestBody[method +"- Request"]=content.trim()
           //const jsonFileData=loadJSON('daata.json')
          // jsonFileData.push(resquestBody)
          // saveJson('daata.json',jsonFileData)  
           
           fs.writeFile( test_case+'_'+method+'_Req'+getDate()+'.json', content, function (err) {
            if (err) throw err;
            console.log('Saved!');
          });
        }else{
           // console.log(data)
           console.log("No Request Body is there for this Request")
        }
    })
    .on('request', (error, data) => {
        if (error) {
            console.log(error);
            return;
        }
        var test_case=data.item.name
        const responseBody={}
    
        const content = data.response.stream.toString().replace(/^\s+|\s+$/gm,'');
        var method=data.request.method
        responseBody[method+"- Response"]=content.trim()
        //const jsonFileData=loadJSON('daata.json')
        //jsonFileData.push(responseBody)
        //saveJson('daata.json',jsonFileData)
        fs.writeFile(test_case+'_'+method+'_Res_'+getDate()+'.json', content, function (err) {
            if (err) throw err;
            console.log('Saved!');
          });
          console.log('saved')
     //console.log(summary)
    })

    

//https://api.postman.com/collections/24554143-afb9e896-6ec0-4135-bc15-5d8a33269688?access_key=PMAT-01GKA25WP8VXZX8KZB4RGFNRQ6