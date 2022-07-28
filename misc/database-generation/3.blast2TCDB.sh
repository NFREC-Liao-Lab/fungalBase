#Part4 run blastp to TCDB database

database_dir=/home/microbiome/data_storage/SATA1/database/transporterDB/blast_db/blast_db
if [ ! -s $database_dir/tcdb.phr ]; then
makeblastdb -in  /home/microbiome/data_storage/SATA1/database/transporterDB/blast_db/database_seq/TCDB/tcdb.fasta \
            -dbtype prot \
            -out $database_dir/tcdb 
            #-parse_seqids
fi

blastp_run () {
    genome_id=$1
    genome=$genome_dir/$genome_id
    protein=$genome/*_GeneCatalog_proteins_*
    genes=$genome/*_GeneCatalog_CDS_*
    result_dir=/home/microbiome/data_storage/SATA1/Database_blast/${genome_id}_result
    FunDB_prot_dir=/home/microbiome/data_storage/SATA1/Database/prot
    FunDB_nucl_dir=/home/microbiome/data_storage/SATA1/Database/nucl
    TMH=$result_dir/${genome_id}.TMHs_clean.fasta
    database_dir=/home/microbiome/data_storage/SATA1/database/transporterDB/blast_db/blast_db
    db="$database_dir/tcdb"
    
    
    if [ ! -s  $result_dir/${genome_id}.tcdb.blastp.out ]; then
        blastp \
         -query $TMH \
         -db $db \
         -out $result_dir/${genome_id}.tcdb.blastp.out  \
         -evalue 1e-5 \
         -num_threads 20 \
         -max_target_seqs 5 \
         -outfmt 6
   fi
   }

export -f blastp_run

Updated_genome_list=/home/microbiome/data_storage/SATA1/FunDB/Updated_genome_list
time parallel -j 10 --eta --load 95% --noswap  blastp_run ::: $(cat $Updated_genome_list)
