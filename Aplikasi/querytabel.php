<?php
        $slctKondisi1 = $_POST['slctKondisi1'];
        $slctFungsi1 = $_POST['slctFungsi1'];
        
        $db = new PDO('pgsql:host=localhost;port=5432;dbname=sigwebngrowo;','postgres','dimas12345');
        $sql = $db->prepare("SELECT id_bang,nomen_klat,nama_bangu,jenis_bang,petugas,lokasi_rua,tipe_kerus,kondisi_fi,kondisi_fu,jenis_pena,desa,kecamatan,kabupaten,nama_sunga,nama_das FROM point_bangunan_fix WHERE kondisi_fi = :slctKondisi1 AND 
        kondisi_fu = :slctFungsi1 ORDER BY id_bang ASC");

        $params = ["slctKondisi1"=>$slctKondisi1,"slctFungsi1"=>$slctFungsi1];
        $sql->execute($params);
        echo "<table class='table table-hover table-dark'>";
        echo "<tr>
        <td><b>ID Bangunan</b></td>
        <td><b>Nomenklatur</b></td>
        <td><b>Nama Bangunan</b></td>
        <td><b>Jenis Bangunan</b></td>
        <td><b>Nama Petugas</b></td>
        <td><b>Lokasi Ruas (km +)</b></td>
        <td><b>Tipe Kerusakan</b></td>
        <td><b>Kondisi Fisik</b></td>
        <td><b>Kondisi Fungsi</b></td>
        <td><b>Jenis Penanganan</b></td>
        <td><b>Nama Desa</b></td>
        <td><b>Nama Kecamatan</b></td>
        <td><b>Nama Kabupaten</b></td>
        <td><b>Nama Sungai</b></td>
        <td><b>Nama DAS</b></td>
        </tr>";

        while ($row = $sql->fetch(PDO::FETCH_ASSOC)){
            echo"<tr>";
            foreach ($row as $field=>$value){
                echo"<td>{$value}</td>";
            }
            echo "</tr>";
        }
        echo "</table>"
        
?>