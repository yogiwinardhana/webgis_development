<?php
try {
    $db = new PDO(
        'pgsql:host=144.91.90.142;port=5432;dbname=osm_db;',
        'osm_cru',
        'osm_cru'
    );

    // Prepare the SQL query to retrieve unique names
    $sql = $db->prepare("SELECT nama FROM hgu");

    // Execute the query
    $sql->execute();

    $names = array(); // Initialize an empty array to store names

    while ($row = $sql->fetch(PDO::FETCH_ASSOC)) {
        foreach ($row as $field => $value) {
            $names[] = $value; // Add each name to the array
        }
    }

    // Get unique values using array_unique
    $uniqueNames = array_unique($names);

    // Convert the unique names array to an associative array with the same key and value
    $result = array_combine($uniqueNames, $uniqueNames);

    // Output the unique array as JSON
    header('Content-Type: application/json');
    echo json_encode($result);
} catch (PDOException $e) {
    // Handle database connection or query errors here
    echo 'Error: ' . $e->getMessage();
}
?>
