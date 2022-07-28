
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const csvWriterPath = `${process.env.defaultPath}frontend/test.csv`;

const csvWriter = createCsvWriter({
    path: csvWriterPath,
    header: [
        {id: "query", title: "QUERY"},
        {id: "sequenceID", title: "SEQUENCE_ID"},
        {id: "totalScore", title: "TOTAL_SCORE"},
        {id: "queryCoverage", title: "QUERY_COVERAGE"},
        {id: "eValue", title: "E_VALUE"},
        {id: "identityValue", title: "IDENTITY_VALUE"},
    ],
})

const data = [{
    sequenceID: 'Annnit1_173039',
    totalScore: 3950,
    queryCoverage: 100,
    eValue: 0,
    identityValue: 729
  },
  {
    sequenceID: 'Annsty1_26608',
    totalScore: 3948,
    queryCoverage: 100,
    eValue: 0,
    identityValue: 728
  },
  {
    sequenceID: 'Annmor1_343559',
    totalScore: 3935,
    queryCoverage: 100,
    eValue: 0,
    identityValue: 725
  }];

  export default async function handler(req, res){
    try{
        await csvWriter.writeRecords(data);
        res.status(200).json({"test": "test"});
    }
    catch(err){
        res.status(500).json(err);
    }
  }