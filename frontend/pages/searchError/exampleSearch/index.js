import styles from "../../../styles/Home.module.css";
import Link from "next/link";


export default function exampleSearch(){
    return(
        <>
            <h1 className={styles.title}>BLAST Search Help</h1>
            <div className={styles.exampleSearchWrapper}>
                <p><strong className={styles.exampleHeaders}>BLAST searches take <a href="https://en.wikipedia.org/wiki/FASTA_format">FASTA</a> format input. <br/>
                    Below are valid examples: <br/><br/></strong>
                    {'>'}Anntru1_468781<br/>
                    MGFSLKGADASATTTSEINPDPVENTTPSSSDEKLREINVTTAIADLDKIQHNHQWDPNLPQEKLDAVKS<br/>
                    ALEHGDDKEIAEADLLFTEDSPYEEVRAAVRNTDGGEVACTVRAWVLGMIFVTIGSGLNMLLSMRSPLVN<br/>
                    FPALVVVLVSYPVANLWAKIMPTRVFNTFGLRWTLNTGPFTIKEHVVITIMSNVSIAYAYSTDALLALQG<br/>
                    KPFYDTNLGWGFSLIFTLSSQLMGISLSGLFRRFLVYPAAMLWPTQFSNTSLFYALHDKSKSDGSTANGW<br/>
                    TISRYRYFFLVTGGMFVYYWIPAVLWQGLSVFAFITWIKPNNVVLNQLFGGYTGLSLIPITFDWTYVSAY<br/>
                    LYDPLLAPTEAHVNTLIGLFIFVMIATIGIVYTGALYSEYLPMVTSQTYDNTQQAYTVRNILGDNFTLDL<br/>
                    EKYRSYSPLFLSPTLALNYGLSFAALTASLVHVGLFHGKEIWYRLKTARNQEPDIHLKLMKKYDEAPEWW<br/>
                    YTCLLLFSLALGLGTVLGYDSQLPWWGFFLSIIIAFLFVIPTCMIMAVSNIMLSLNVIAPFIAGFIFPGR<br/>
                    PIGVMIFKFLILAGIANTKQTSDLKLAHYMKVPPRVTFWCQVVASIWAVFVQIAVMNWTLGTIPDVCSST<br/>
                    QPNHFTCPNGRAFFSSSIVWGVLGPERMFGPGSMYVNFNWFWLIGAVMPVILWVLGRKMKIGFARHLNAP<br/>
                    ILFGAMAWLPPATPISFSTWAFWGLVFNYGIRKKFNGWWRTYNYVTAAALDAGLILSTIVIFFAITMSGV<br/>
                    TIPQWWGNVDVYNTVDATNTAWLKTVPEGETFGPATW<br/><br/>

                    <strong className={styles.exampleHeaders}>Or with multiple sequences:<br/><br/> </strong>

                    {'>'}Anntru1_468994<br/>
                    MENGLHVEDSIWFYAPNKGVPVFFAIAFATSGGVHFWQAMHYKSWRLTGLYFACSLLFVAGFIARVLGAF<br/>
                    DYTKLIYYVVSTCLIYAAPPLYELCNYYVLGRILYFVPYHSPIHPGRVLTTFAAISTIIETLSGIGAAYQ<br/>
                    SIRTLPIGLQQTGQTLLKAALTLQLVVVCLFLALAVTFHTRCLGNGINHVKINQALLTLYISSAIIMARC<br/>
                    IYRTVEFFDISSVNFSSPDTDLLVLSPIIRYEWFFYVFEATLMLCNSILLNIRHPRRWLPESTKVYLGRD<br/>
                    SITEISGPGYKQERNLLATLFDPFDVYGMIKGRDQRTRFWDDNGDAGKAEADAV<br/>
                    {'>'}Anntru1_469096<br/>
                    MLSTDIYIEPLTAAVVGLAMHHFVFIRGEWHVRAPVVFRFYLASTLLWCIAYYRACDRSIQTCSIHYFFS<br/>
                    LSTHYITLLASIVIYRCFFHPLRHFPGPYLAKATKFWHVWKCRNSNNHLLLEKLRHEYGNFVRTGPNEIT<br/>
                    IFHPAGLNLINKPDLVERSDWYDLVHPSFSLNTVRNQYFHDRRRKVWEFAFTNDAMKGYEERIRSYATKV<br/>
                    DDSIRGSNRSIIDTNAIIYRFAYDVMRDLAFAKTSNDTDQEWQTSVNTIHTGLSILGPLSPAPWIALLFF<br/>
                    SFTNLQLVSDWNNMMAYCREKMAERLALVTPKGRDISSWLIQDAKSRGQIDSPEEMQWLNGDAFSMILAG<br/>
                    SDTTASTLIFTFWHLAKTPRYQKLIHDEILKFGVLSPLISEMSFKDFERLPFLNAFINETLRLHHPLPTA<br/>
                    GSRIVRQKGLIIDNEHIPPGTKVVAPRWNFGRHEAHYKRAWEFLPERWLNDSDLISDRRAFTPWAGGKWA<br/>
                    CLGKQIALFELRYLISLLVHHYSISLPPGDDGSSVERDYKDQVTAFPGKLNLVFTARGSE<br/><br/>

                    <strong className={styles.exampleHeaders}>You can also add more information to the header line:<br/><br/> </strong>
                    {'>'}Anntru1_469096|header info here|header info here<br/>
                    MLSTDIYIEPLTAAVVGLAMHHFVFIRGEWHVRAPVVFRFYLASTLLWCIAYYRACDRSIQTCSIHYFFS<br/>
                    LSTHYITLLASIVIYRCFFHPLRHFPGPYLAKATKFWHVWKCRNSNNHLLLEKLRHEYGNFVRTGPNEIT<br/>
                    IFHPAGLNLINKPDLVERSDWYDLVHPSFSLNTVRNQYFHDRRRKVWEFAFTNDAMKGYEERIRSYATKV<br/>
                    DDSIRGSNRSIIDTNAIIYRFAYDVMRDLAFAKTSNDTDQEWQTSVNTIHTGLSILGPLSPAPWIALLFF<br/>
                    SFTNLQLVSDWNNMMAYCREKMAERLALVTPKGRDISSWLIQDAKSRGQIDSPEEMQWLNGDAFSMILAG<br/>
                    SDTTASTLIFTFWHLAKTPRYQKLIHDEILKFGVLSPLISEMSFKDFERLPFLNAFINETLRLHHPLPTA<br/>
                    GSRIVRQKGLIIDNEHIPPGTKVVAPRWNFGRHEAHYKRAWEFLPERWLNDSDLISDRRAFTPWAGGKWA<br/>
                    CLGKQIALFELRYLISLLVHHYSISLPPGDDGSSVERDYKDQVTAFPGKLNLVFTARGSE<br/>
                </p>
                <h2 className={styles.exampleHeaders}>Common mistakes:</h2>
                <ul>
                    <li>Leaving out the {'>'} as the first character</li>
                    <li>Adding an empty line between sequences</li>
                    <li>Not having a line break between the header and the sequence</li>
                </ul>
                <h2 className={styles.exampleHeaders}>Still having issues?<br/></h2>
                 <Link className={styles.examplesContactUsLink} href="/contactUs">Contact Us</Link>
            </div>    

        </>
    );
}