const shelljs = require("shelljs");
export default async function handler(req, res){
    const numberOfSequences = req.body.numberOfSequences;
    let tempNumberOfSequences = numberOfSequences;
    let files = [];
    let start, tempi = 0;
    let filesIndex = 0;
    let status = false;
    const pathToSearch = `${process.env.defaultPath}frontend/`;
    //get one more than number of sequences incase there is .next
    let fileNames = shelljs.exec(`cd ${pathToSearch} ; ls -Art | tail -n ${++tempNumberOfSequences}`);
    console.log("filenames: ", fileNames);
    for(let i = 0; i < fileNames.length; i++){
        if(fileNames.charAt(i) === "\n"){
            files[filesIndex] = fileNames.slice(start, i)
            filesIndex++;
            tempi = i;
            start = ++tempi;
        }
    }
    //look for .next and if it is there remove it
    for(let i = 0; i < numberOfSequences; i++){
        if(files[i] === ".next"){
            files.splice(i, 1);
            status = true;
        }
    }
    //if there wasn't .next remove the extra file
    if(!status){
        files.pop();
    }
    console.log(files);
    const validity = checkValidity(files);
    if(!validity){
        res.status(500)
    }
    res.status(200).json(files);
}

export function checkValidity(files){
    let validity = true;
    for(let i = 0; i < files.length; i++){
        if(files[i].charAt(0) !== "2" || files[i].charAt(1) !== "0"){
            validity = false;
        }
    }
    return validity;
}