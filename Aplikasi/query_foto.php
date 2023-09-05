<?php
try {
    $db = new PDO(
        'pgsql:host=144.91.90.142;port=5432;dbname=osm_db;',
        'osm_cru',
        'osm_cru'
    );

    // Prepare the SQL query to retrieve unique names
    $sql = $db->prepare("SELECT id, pemilik, join_foto_bt_01, join_foto_bt_02, join_foto_su_01, join_foto_su_02 FROM hgu");

    // Execute the query
    $sql->execute();

    $names = array(); // Initialize an empty array to store names

    while ($row = $sql->fetch(PDO::FETCH_ASSOC)) {
        foreach ($row as $field => $value) {
            $names[] = $value; // Add each name to the array
        }
    }

    // Output all names as JSON
    header('Content-Type: application/json');
    echo json_encode($names);

} catch (PDOException $e) {
    // Handle database connection or query errors here
    echo 'Error: ' . $e->getMessage();
}
?>
