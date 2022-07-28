#Part6 collect the database sequence id

#FunDB_prot_dir=/home/microbiome/data_storage/SATA1/Database/prot
#FunDB_nucl_dir=/home/microbiome/data_storage/SATA1/Database/nucl
FunDB_dir=/home/microbiome/data_storage/SATA1/Database

echo -e "SeqID\tGenome_id\tGene_id\tprot_id\tTransporter_id\tTransporter_level1\tTransporter_level2\tTransporter_level3\tTransporter_level4\tTransporter_level5" > $FunDB_dir/FunDB_prot_seqID.tmp.tsv
cat  $FunDB_dir/prot/$seq/*.prot2tcdb > $FunDB_dir/prot2tcdb
cat  $FunDB_dir/prot2tcdb |while read line; do
    SeqID=$(echo $line |awk '{print $1}' |cut -d "|" -f 2)
    Genome_id=$(echo $line |awk '{print $1}' |cut -d "|" -f 1)
    prot_id=$(echo $line |awk '{print $1}' |cut -d "|" -f 2 |cut -d"_" -f 2)
    Gene_id=$(echo $line |awk '{print $1}' |cut -d "|" -f 3 |cut -d"_" -f 2,3,4,5,6,7,8,9,10,11,12)
    Transporter_id=$(echo $line |awk '{print $2}')
    Transporter_level1=$(echo $Transporter_id |cut -d"." -f 1)
    Transporter_level2=$(echo $Transporter_id |cut -d"." -f 1,2)
    Transporter_level3=$(echo $Transporter_id |cut -d"." -f 1,2,3)
    Transporter_level4=$(echo $Transporter_id |cut -d"." -f 1,2,3,4)
    Transporter_level5=$(echo $Transporter_id |cut -d"." -f 1,2,3,4,5)
    echo -e "$SeqID\t$Genome_id\t$Gene_id\t$prot_id\t$Transporter_id\t$Transporter_level1\t$Transporter_level2\t$Transporter_level3\t$Transporter_level4\t$Transporter_level5" >> $FunDB_dir/FunDB_prot_seqID.tmp.tsv
done
mv -f $FunDB_dir/FunDB_prot_seqID.tmp.tsv $FunDB_dir/FunDB_prot_seqID.tsv



for seq in $(ls $FunDB_dir/prot); do
    cat $FunDB_dir/prot/$seq |seqkit seq -n |while read line; do
         SeqID=$line
         Genome_id=$(echo $line |cut -d "|" -f 1)
         prot_id=$(echo $line |cut -d "|" -f 2| cut -d "_" -f 2)
         Gene_id=$(echo $line |cut -d "|" -f 3)
         Transporter_id=$(echo $line |cut -d "|" -f 4)
         Transporter_level1=$(echo $Transporter_id |cut -d"." -f 1)
         Transporter_level2=$(echo $Transporter_id |cut -d"." -f 1,2)
         Transporter_level3=$(echo $Transporter_id |cut -d"." -f 1,2,3)
         Transporter_level4=$(echo $Transporter_id |cut -d"." -f 1,2,3,4)
         Transporter_level5=$(echo $Transporter_id |cut -d"." -f 1,2,3,4,5)
         echo -e "$SeqID\t$Genome_id\t$Gene_id\t$prot_id\t$Transporter_id\t$Transporter_level1\t$Transporter_level2\t$Transporter_level3\t$Transporter_level4\t$Transporter_level5" >> $FunDB_dir/FunDB_prot_seqID.tmp.tsv
     done
done
mv -f $FunDB_dir/FunDB_prot_seqID.tmp.tsv $FunDB_dir/FunDB_prot_seqID.tsv













echo -e "SeqID\tGenome_id\tGene_id\tprot_id\tTransporter_id\tTransporter_level1\tTransporter_level2\tTransporter_level3\tTransporter_level4\tTransporter_level5" > $FunDB_dir/FunDB_nucl_seqID.tmp.tsv
for seq in $(ls $FunDB_dir/nucl); do
    cat $FunDB_dir/nucl/$seq |seqkit seq -n |while read line; do
         SeqID=$line
         Genome_id=$(echo $line |cut -d "|" -f 1)
         prot_id=$(echo $line |cut -d "|" -f 2| cut -d "_" -f 2)
         Gene_id=$(echo $line |cut -d "|" -f 3)
         Transporter_id=$(echo $line |cut -d "|" -f 4)
         Transporter_level1=$(echo $Transporter_id |cut -d"." -f 1)
         Transporter_level2=$(echo $Transporter_id |cut -d"." -f 1,2)
         Transporter_level3=$(echo $Transporter_id |cut -d"." -f 1,2,3)
         Transporter_level4=$(echo $Transporter_id |cut -d"." -f 1,2,3,4)
         Transporter_level5=$(echo $Transporter_id |cut -d"." -f 1,2,3,4,5)
         echo -e "$SeqID\t$Genome_id\t$Gene_id\t$prot_id\t$Transporter_id\t$Transporter_level1\t$Transporter_level2\t$Transporter_level3\t$Transporter_level4\t$Transporter_level5" >> $FunDB_dir/FunDB_nucl_seqID.tmp.tsv
     done
done
mv -f $FunDB_dir/FunDB_nucl_seqID.tmp.tsv $FunDB_dir/FunDB_nucl_seqID.tsv
