import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'
import { useState } from 'react'
import Searching from './searching';
import Link from 'next/link';
const defaultQuery = "MKNGTIRFVKHTKDALCYSWINLLLVFVPIGIASHLAHLGPEIVFAMNAVAIIPLAGLLSHATEAVAARLGDTLGALLNVSFGNAVELILFIILLAGDQIRVVQAALLGSILANLLLILGMAFLLGGLRFQEQVYNSTVTQMSACMLSLAVMSLLLPTAFHSAFSNYDTADRETLYVSRGTSVVLLLVYILYLLFQLKSHSYMYASTPQHIIDEESHPGHVMSRTAAVVMLMISTALVAVCADFMSDAIEPMVEKTNVSAAFIGLIILPIVGNAAEHVTAVTVAAKNKMDLAIGVAVGSSIQIAIFITPFIVILGWIMNKEMSLYFNIFETVALFVTAFVVNFLVLDGRSNYLEGSLLIAAYVIIALSSFFYPDGCDASPIGGQEGTC";

export default function BlastSearch() {
    const [searchStatus, setSearchStatus] = useState(false);
    const router = useRouter();
    const handleSubmit = async (event) => {
        // Stop the form from submitting and refreshing the page.
        event.preventDefault()    

        setSearchStatus(true);

        // Get data from the form.
        const data = {
          query: event.target.query.value,
        }
        console.log("data is: ", data);

        //validate data
        let validatedData = await validateData(data);
        console.log("validatedData is: ", validatedData);

        const numberOfSequences = validatedData.sequences.length;
        
        const queries = getQueries(validatedData);
        console.log("queries are: ", queries);
    
        //converts data from form from Object to String
        const stringData = JSON.stringify(validatedData)    
        const endpoint = '/api/postRequest'    
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: stringData,
        }
        
        try{
          const response = await fetch(endpoint, options)
          const result = await response.json()
          router.push({
            pathname: "/blast/blastResults",
            query: {
              "numberOfSequences": numberOfSequences,
              "queries": queries,
            }
          });
        }
        catch(err){
          console.error(err);
          router.push({
            pathname: "/searchError",
          });
        }
      }

    return(
        <div>
            {!searchStatus && <form className={styles.searchForm} onSubmit={handleSubmit}>
              <div className={styles.searchHeaderWrapper}>
                <h4 className={styles.searchFieldHeader}>Enter your FASTA sequence&#40;s&#41; below:</h4>
                <h4 className={styles.searchHelp}><Link href="/searchError/exampleSearch">Help</Link></h4>
              </div>
                <textarea name="query"  id="blastQuery" placeholder="Enter FASTA sequence..." className={styles.formInput} />
                <button type="submit" className={styles.searchButton}>Search</button>
            </form>}
            {searchStatus && <Searching/>}
        </div>
    );
}

export async function validateData(data){
  let query = data.query;
  let headers = [];
  let sequences = [];
  let sequencesIndex = 0;
  let headersIndex = 0;
  let sequenceStart = 0;
  let sequenceEnd;
  let tempi, tempj;
  //loop through the whole query
  for(let i = 0; i < query.length; i++){
    //when start of header is encountered
    if(query.charAt(i) === ">"){
      tempi = i;
      sequenceEnd = --tempi;
      //if it's not the first sequence
      if(sequenceEnd !== -1){
        sequences[sequencesIndex] = query.slice(sequenceStart, sequenceEnd);
        sequencesIndex++;
      }
      //iterate along the header
      for(let j = i; j < query.length; j++){
        if(query.charAt(j) === "\n"){
          headers[headersIndex] = query.slice(i, j);
          headersIndex++;
          tempj = j;
          sequenceStart = ++tempj;
          break;
        }
      }
    }
  }
  //assign last sequence
  sequences[sequencesIndex] = query.slice(sequenceStart, query.length);

  let sequencesNoBreaks = [];
  for(let i = 0; i < sequences.length; i++){
    let sequenceWithoutBreaks = sequences[i].replace(/[\r\n]/gm, '');
    sequencesNoBreaks.push(sequenceWithoutBreaks);
  }
  console.log("after: ", sequencesNoBreaks);

  const results = {
    "headers": headers,
    "sequences": sequencesNoBreaks,
  }
  return results;
}

export function getQueries(data){
  try{
    const headers = data.headers
    let queryStart, tempj, query, queryEnd;
    let queries = [];
    let encountered = 0;
    for(let i = 0; i < headers.length; i++){
      for(let j = 0; j < headers[i].length; j++){
        if(headers[i].charAt(j) === ">"){
          tempj = j;
          queryStart = ++tempj;
        }
        else if(headers[i].charAt(j) === "|"){
          tempj = j;
          queryEnd = --tempj;
          query = headers[i].slice(queryStart, queryEnd);
          console.log("query:: ", query);
          queries.push(query);
          encountered++;
        }
        tempj = j;
      }
      if(encountered === 0){
        query = headers[i].slice(1, headers[i].length);
        queries.push(query);
      }
    }
    return queries;  
  }
  catch(err){
    console.log("error in getting queries: ", err);
    return;
  }
  
}