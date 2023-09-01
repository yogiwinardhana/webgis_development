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
        nama,
        luas,
        nib,
        surat_ukur,
        desa,
        kecamatan,
        kabupaten,
        provinsi,
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