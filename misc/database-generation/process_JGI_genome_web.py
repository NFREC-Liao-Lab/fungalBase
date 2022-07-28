# -*- coding: utf-8 -*-
"""
Created on Tue May 31 18:00:58 2022

@author: Haihua Wang
"""
#taxa processing: https://blog.csdn.net/keepaware/article/details/108065237
#html processing: https://blog.csdn.net/qq_44667896/article/details/104793547


from bs4 import BeautifulSoup
import re
from ete3 import NCBITaxa
import urllib.request
import time
import numpy as np
import pandas as pd


ncbi=NCBITaxa()
#ncbi.update_taxonomy_database()
class call_taxonomy:
    def call_taxID (name):
        taxa = ncbi.get_name_translator([name])
        taxID = str(taxa.values()).strip('dict_values([])')
        return(taxID)
    def call_lineage (taxid, desired_ranks):
        lineage = ncbi.get_lineage(taxid)
        taxName = ncbi.get_taxid_translator(lineage)
        tax2rank = ncbi.get_rank(taxName)
        ranks2lineage = dict((rank,taxid) for (taxid, rank) in tax2rank.items())
        ranks_dict = {'{}'.format(rank): ranks2lineage.get(rank, '<not present>') for rank in desired_ranks}
        ranks_filtered = {k:v for k,v in ranks_dict.items() if v!="<not present>"}
        id_to_name = ncbi.get_taxid_translator(ranks_filtered.values())
        des_rank_names = {}
        for k, v in ranks_filtered.items():
            des_rank_names[k] = (v, id_to_name[v])
        # des_rank_names = list(ncbi.get_taxid_translator(ranks_dict{"order"}).values())
        # des_rank_names = list(ncbi.get_taxid_translator(ranks_dict.values()).values())
        # s = f"{match.group(1)}_{match.group(2)}"
        # s = f"O_{des_rank_names['order']}_F_{des_rank_names['family']}"
        return des_rank_names
        
day_time = time.strftime('%Y_%m_%d',time.localtime(time.time()))
filename = "Least.JGI_genome_info1_"+str(day_time)+".html"
html = urllib.request.urlopen('https://mycocosm.jgi.doe.gov/fungi/fungi.info.html').read()
with open(filename, "wb") as f:
    f.write(html)


#htmlf = open('D:\Desktop\Least.info1.html',  'r',encoding= "utf-8")
htmlf = open(filename,  'r',encoding= "utf-8")
genome_list=htmlf.read()
htmlf.close()
soup = BeautifulSoup(genome_list, 'lxml')


write_file = 'Latest.JGI_genome_info1_'+str(day_time)+'.txt'
f = open(write_file, 'w')
f.write('JGI_No\tGenome_id\tJGI_link\tSpecies\tAssembly_Length\tGene_number\tStatus\tPublish_link\tTaxID\tsuperkingdom\tkingdom\tphylum\tclass\torder\tfamily\tgenus\tspecies\ttaxonomy\n')
desired_ranks=["superkingdom","kingdom","phylum","class", "order", "family", "genus", "species"]
for i in range(0,2500):
    #print(i)
    try:
        tr = soup.find_all(name="tr")[i]
        #print(tr)
        status = "".join(tr['class'])
        number = "".join(re.findall(r'>(.*?)</td>', str(list(tr)[1])))
        Genome_id = "".join(re.findall(r'href="/(.*?)">', str(list(tr)[3])))
        JGI_link = "https://mycocosm.jgi.doe.gov/"+Genome_id+"/"+Genome_id+".home.html"
        strain = "".join(re.findall(r'">(.*?)<', str(list(tr)[3])))
        genus = strain.split()[0]
        species = strain.split()[1]
        taxa_name = genus + " " + species

        try:
            taxID = call_taxonomy.call_taxID(taxa_name)
            lineage = call_taxonomy.call_lineage(taxID,desired_ranks)
        except Exception as err:
            taxID = ""
            lineage = ""
        Assembly_Length = "".join(re.findall(r'">(.*?)</', str(list(tr)[5])))
        Gene_num = "".join(re.findall(r'">(.*?)</', str(list(tr)[7])))
        Publish_link = "".join(re.findall(r'href="(.*?)">', str(list(tr)[9])))
        Publisher = "".join(re.findall(r'">(.*?)</a>', str(list(tr)[9])))
        desired_lineage=[]
        for rank in desired_ranks:
            if rank in lineage:
                taxN=lineage[rank][1]
            else:
                taxN=""
            desired_lineage.append(taxN)
        
        full_lineage=[]
        for rank_i in range(1,8):
            if rank_i == 1:
                full_lineage.append('k__'+desired_lineage[rank_i])
            elif rank_i == 2:
                full_lineage.append('p__'+desired_lineage[rank_i])
            elif rank_i == 3:
                full_lineage.append('c__'+desired_lineage[rank_i])
            elif rank_i == 4:
                full_lineage.append('o__'+desired_lineage[rank_i])
            elif rank_i == 5:
                full_lineage.append('f__'+desired_lineage[rank_i])
            elif rank_i == 6:
                full_lineage.append('g__'+desired_lineage[rank_i])
            elif rank_i == 7:
                full_lineage.append('s__'+desired_lineage[rank_i])


        desired_lineage.insert(0,taxID)
        taxName_full = ";".join(full_lineage)
        JGI_info = [number,Genome_id, JGI_link, taxa_name,Assembly_Length,Gene_num, status, Publish_link]
        all_info =  JGI_info + desired_lineage
        output ="\t".join(all_info) + '\t' + taxName_full + '\n'
        #print(output)
        f.writelines(output)
    except:
        pass
f.close()


JGI_info = pd.read_table(write_file, header = "infer", index_col=0)
JGI_info.columns
#print(JGI_info.head)

JGI_info_2 = JGI_info[JGI_info['Status'] == "published"][JGI_info['TaxID'].notna()]


#FungalTraits = pd.read_excel('FungalTraits.xlsx')
#FungalTraits.to_csv('FungalTraits.tsv', index=True, sep = "\t")
FungalTraits = pd.read_table('FungalTraits.tsv')
FungalTraits = FungalTraits.drop(columns = ['phylum', 'class', 'order', 'family'])
JGI_info_FungalTraits = pd.merge(JGI_info_2, FungalTraits, on = "genus", how = "left")
JGI_info_FungalTraits['primary_lifestyle'].fillna('Unassigned', inplace = True)

JGI_info_FungalTraits[["TaxID"]] = JGI_info_FungalTraits[["TaxID"]].astype(int)
JGI_info_FungalTraits.to_csv('FunDB_genomes_info_FungalTraits_' + day_time + '.tsv', index = True, sep = "\t")
JGI_info_FungalTraits.to_csv('FunDB_genomes_info_FungalTraits_Last_Update.tsv', index = True, sep = "\t")




