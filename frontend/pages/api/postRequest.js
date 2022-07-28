const shelljs = require("shelljs");
export default async function handler(req, res){
    //make sure there is a query
    if(!req.body.sequences[0]){
        return res.status(400).json({data: "query not found"});
    }
    let queries = [];
    console.log("length is: ", req.body.sequences.length);
    const shellScriptPath = `${process.env.defaultPath}/backend/db/blastnAllDbs.sh`;
    for(let i = 0; i < req.body.sequences.length; i++){
        queries[i] = req.body.sequences[i];
        console.log(`what's being executed ${shellScriptPath} ${queries[i]}`);
        shelljs.exec(`${shellScriptPath} ${queries[i]}`);
    }
    res.status(200).json({});
}
