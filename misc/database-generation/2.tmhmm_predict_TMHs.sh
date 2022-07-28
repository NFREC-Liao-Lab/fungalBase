#Part 3
cat FunDB_genomes_info_FungalTraits_Last_Update.tsv |sed 1d | awk '{print $2}' > Updated_genome_list


tmhmm_run () {
    genome_id=$1
    #assign the directory of genome files
    genome_dir=/home/microbiome/data_storage/SATA2/fungi_genome/fungal_genomes
    tmhmm=/home/microbiome/data_storage/app/tmhmm/bin/tmhmm
    genome=$genome_dir/$genome_id
    protein=$genome/*_GeneCatalog_proteins_*
    genes=$genome/*_GeneCatalog_CDS_*
    result_dir=/home/microbiome/data_storage/SATA1/Database_blast/${genome_id}_result
    FunDB_prot_dir=/home/microbiome/data_storage/SATA1/Database/prot
    FunDB_nucl_dir=/home/microbiome/data_storage/SATA1/Database/nucl
    
    mkdir $result_dir
    cat $protein |gunzip > $result_dir/${genome_id}.protein.aa.fasta
    cat $genes |gunzip > $result_dir/${genome_id}.CDS.fasta
    if [ ! -s  $result_dir/${genome_id}.TMHs_clean.fasta ]; then
         sed 's/*//g' $result_dir/${genome_id}.protein.aa.fasta > $result_dir/${genome_id}.protein.aa.wo.stop.fasta
         $tmhmm -short $result_dir/${genome_id}.protein.aa.wo.stop.fasta > $result_dir/${genome_id}.protein.tmhmm.tab
         cat $result_dir/${genome_id}.protein.tmhmm.tab |  awk '{split($5,a,"[=]")} {if(a[2]>1) print $1;}' > $result_dir/${genome_id}.tmhmm.result
         faSomeRecords $result_dir/${genome_id}.protein.aa.wo.stop.fasta   $result_dir/${genome_id}.tmhmm.result  $result_dir/${genome_id}.TMHs.fasta
         
         #perl -p -e 's/>jgi\|(\S+)\|(\d+)\|/>$1|$1_$2 /' $result_dir/${genome_id}.TMHs.fasta | sed 's/*//g'  >  $result_dir/${genome_id}.TMHs_clean.fasta
         perl -p -e 's/>jgi\|(\S+)\|(\d+)\|/>$1|$1_$2|$1_$3/' $result_dir/${genome_id}.TMHs.fasta | sed 's/*//g'  >  $result_dir/${genome_id}.TMHs_clean.fasta
         perl -i -p -e 'unless( /^>/ ) {  s/x// }'  $result_dir/${genome_id}.TMHs_clean.fasta
    fi
 }

export -f tmhmm_run

Updated_genome_list=/home/microbiome/data_storage/SATA1/FunDB/Updated_genome_list
time parallel -j 24 --eta --load 95% --noswap  tmhmm_run ::: $(cat $Updated_genome_list)
    
