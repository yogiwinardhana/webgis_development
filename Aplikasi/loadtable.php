<?php
        $db = new PDO(
            'pgsql:host=144.91.90.142;
            port=5432;
            dbname=osm_db;
            ','osm_cru','osm_cru'
        );

        $sql = $db->prepare(
        "SELECT id,
        pemilik,
        luas,
        nib,
        join_foto_pembatalan,
        surat_ukur,
        desa,
        kecamatan,
        kabupaten,
        provinsi
        FROM hgu ORDER BY id ASC"
        );

        $sql->execute();

        echo "<table class='table table-hover table-dark'>";
        echo "<tr>
        <td><b>ID</b></td>
        <td><b>Nama</b></td>
        <td><b>Luas</b></td>
        <td><b>NIB</b></td>
        <td><b>Pembatalan SK</b></td>
        <td><b>Surat Ukur</b></td>
        <td><b>Desa</b></td>
        <td><b>Kecamatan</b></td>
        <td><b>Kabupaten</b></td>
        <td><b>Provinsi</b></td>
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