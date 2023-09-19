<?php
        $slctNIB = $_POST['slctNIB'];

        $db = new PDO(
            'pgsql:host=144.91.90.142;
            port=5432;
            dbname=osm_db;
            ','osm_cru','osm_cru'
        );

        $sql = $db->prepare(
        "SELECT
        id,
        pemilik,
        luas,
        nib,
        surat_ukur,
        desa,
        kecamatan,
        kabupaten,
        provinsi,
        join_foto_bt_01,
        join_foto_bt_02,
        join_foto_su_01,
        join_foto_su_02,
        join_foto_pembatalan2,
        ST_AsGeoJSON(geom) as geom FROM hgu
        WHERE nib = :slctNIB"
        );

        $params = ["slctNIB"=>$slctNIB];
        $sql->execute($params);

        $features=[];
        while($row = $sql->fetch(PDO::FETCH_ASSOC)) {
            $feature =['type'=>"Feature"];
            $feature['geometry']=json_decode($row['geom']);
            unset($row['geom']);
            $feature['properties']=$row;
            array_push($features,$feature);
            }
        $featureCollection=['type'=>'FeatureCollection','features'=>$features];
        echo json_encode($featureCollection);

?>