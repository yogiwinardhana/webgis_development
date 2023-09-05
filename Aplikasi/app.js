
        var mymap;
        var lyrThunderFrstPnr;
        var lyrOpenStreetHot;
        var lyrArcgis;
        var lyrThunderFrst;
        var baseLayers;
        var overlayLayers;
        var queryLayer;
        var queryLayer1;
        var lyrSearch;
        var lyrMarkerCluster;
        var ctrlPan;
        var ctrlZoomSlider;
        var ctrlScale;
        var ctrlAttribution;
        var mouseCoord;
        var ctrlSidebar;
        var ctrlSidebarRight;
        var ctrlEasyBtn;
        var ctrlEasyBtnRight;
        var ctrlLayers;

        //---------------Attribution Variable
        var attrLeaflet = '<a href="https://leafletjs.com/">leaflet</a>'
        var attrArcGis = '<a href="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer">©ESRI</a>'

        //---------------Make sure Html and Css loaded first
        $('document').ready(function(){

        //---------------MAP INITIALIZATION
        mymap =L.map('mapdiv',{fullscreenControl: {
        pseudoFullscreen: false} ,attributionControl:false,zoomControl:false,minZoom:8,maxZoom:17})
        mymap.setView([-2.534, 103.884], 12);

        //---------------Ruler INITIALIZATION
        L.control.polylineMeasure(
            {position:'topright',
             unit:'metres',
             showBearings:true,
             clearMeasurementsOnStop: false,
             showClearControl: true,
             showUnitControl: true
            }).addTo(mymap);

        //---------------Sidebar Plugin
        ctrlSidebar = L.control.sidebar('side-panel').addTo(mymap);
        ctrlSidebarRight = L.control.sidebar('side-panel-right',{position:'right'}).addTo(mymap);
        ctrlEasyBtn = L.easyButton('glyphicon-search',function(){
        ctrlSidebar.toggle();
        }).addTo(mymap);
        ctrlEasyBtnRight = L.easyButton('glyphicon-list-alt',function(){
        ctrlSidebarRight.toggle();
        }).addTo(mymap);

        //----------------Get Center Plugin
        L.easyButton('glyphicon-home', function() {
            $.ajax({
                url: 'loaddata.php',
                type: 'POST',
                data: {},
                success: function(response) {
                    console.log("Easy button")

                                            if (queryLayer) {
                            mymap.removeLayer(queryLayer);
                        }
                        queryLayer = L.geoJSON(JSON.parse(response), {
                            style: function(feature) {
                                return {
                                    fillColor: 'green',
                                    fillOpacity: 0.5,
                                    color: 'black', // Border color
                                    weight: 1       // Border width
                                };
                            },
                            onEachFeature: function(feature, layer) {

                              var popupContent = "<h5>ID : " + feature.properties.id + "</h5>" +
                                "<h5>Nama : " + feature.properties.pemilik + "</h5>" +
                                "<h5>Luas : " + feature.properties.luas + "</h5>" +
                                "<h5>NIB : " + feature.properties.nib + "</h5>" +
                                "<h5>Surat Ukur : " + feature.properties.surat_ukut + "</h5>" +
                                "<h5>Desa : " + feature.properties.desa + "</h5>" +
                                "<h5>Kabupaten : " + feature.properties.kabupaten + "</h5>" +
                                "<h5>Provinsi : " + feature.properties.provinsi + "</h5>" +
                                "<h5>Images:</h5>" +
                                "<img src='" + feature.properties.join_foto_bt_01 + "' width='100'><br>" +
                                "<img src='image2.jpg' width='100'><br>" +
                                "<img src='image3.jpg' width='100'><br>" +
                                "<img src='image4.jpg' width='100'><br>";

                                layer.bindPopup(popupContent);

                                layer.on({
                                    mouseover: function(event) {
                                        layer.setStyle({
                                            fillColor: 'blue',    // Highlighted fill color
                                            fillOpacity: 0.7     // Highlighted fill opacity
                                        });
                                    },
                                    mouseout: function(event) {
                                        queryLayer.resetStyle(layer);
                                    }
                                });
                            }
                        });
                        queryLayer.addTo(mymap);
                        mymap.fitBounds(queryLayer.getBounds(), {paddingTopLeft: [0, 0]});

                },
                error: function(xhr, status, error) {
                    console.error("An error occurred: " + error);
                }
            });


<!--        $.ajax({-->
<!--            url: 'loaddata.php',-->
<!--            type: 'POST',-->
<!--            data: {},-->
<!--            dataType: 'json', // Specify the expected data type-->
<!--            success: function(response) {-->
<!--                var parsedResponse = JSON.parse(response);-->
<!--                if (parsedResponse && parsedResponse.features) {-->
<!--                    queryLayer = L.geoJSON(parsedResponse).addTo(mymap);-->
<!--                } else {-->
<!--                    console.error("Invalid or missing GeoJSON data in the response.");-->
<!--                }-->
<!--            },-->
<!--            error: function(xhr, status, error) {-->
<!--                console.error("An error occurred: " + error);-->
<!--            }-->
<!--        });-->


       //*********2.Query Load All Features TABLES
            $.ajax({
                    url:'loadtable.php',
                    type:'POST',
                    data:{},
                    success: function(response){
                        $('#resultTable-right').html(response);
                    }
                    })
        }).addTo(mymap);

        //---------------Tile Layer Added to mymap
        lyrOpenStreetHot = L.tileLayer.provider('OpenStreetMap.HOT',{attribution:false}).addTo(mymap);
        lyrArcgis = L.tileLayer.provider('Esri.WorldImagery',{opacity:1,attribution:false});

        baseLayers={
            "Open Street Map":lyrOpenStreetHot,
            "ESRI World Imagery":lyrArcgis
        };
        overlayLayers={

        };
        ctrlLayers = L.control.layers(baseLayers,overlayLayers,{position:'topleft'}).addTo(mymap);


        //---------------Control Plugin
        ctrlZoomSlider = L.control.zoomslider({position:'topright'}).addTo(mymap);
        ctrlAttribution = L.control.attribution({prefix:attrLeaflet,position:'bottomleft'}).addAttribution(attrArcGis).addTo(mymap);
        //---------------Mouse Plugin
        mouseCoord = L.control.mousePosition({numDigits:3}).addTo(mymap);
        ctrlScale = L.control.scale({imperial:false,maxWidth:200}).addTo(mymap);

        //---------------Minimap Plugin
        var tileArcgis = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
        var rect1 = {color: "#ff1100", weight: 2};
        var osm2 = new L.TileLayer(tileArcgis);
        var miniMap = new L.Control.MiniMap(osm2,{aimingRectOptions : rect1,height:100,
                        width:150,
                        centerFixed:[-2.534,103.884],
                        toggleDisplay: true}).addTo(mymap);

        //*********1.Query Load All Features Data
                $.ajax({
                    url: 'loaddata.php',
                    type: 'POST',
                    data: {},
                    success: function(response) {
                        if (queryLayer) {
                            mymap.removeLayer(queryLayer);
                        }
                        queryLayer = L.geoJSON(JSON.parse(response), {
                            style: function(feature) {
                                return {
                                    fillColor: 'green',
                                    fillOpacity: 0.5,
                                    color: 'black', // Border color
                                    weight: 1       // Border width
                                };
                            },
                            onEachFeature: function(feature, layer) {
                                var popupContent = "<h5>ID : " + feature.properties.id + "</h5>" +
                                                    "<h5>Nama : " + feature.properties.pemilik + "</h5>" +
                                                    "<h5>Luas : " + feature.properties.luas + "</h5>" +
                                                    "<h5>NIB : " + feature.properties.nib + "</h5>" +
                                                    "<h5>Surat Ukur : " + feature.properties.surat_ukut + "</h5>" +
                                                    "<h5>Desa : " + feature.properties.desa + "</h5>" +
                                                    "<h5>Kabupaten : " + feature.properties.kabupaten + "</h5>" +
                                                    "<h5>Provinsi : " + feature.properties.provinsi + "</h5>" +
                                                    "<h5>Images:" + feature.properties.join_foto_bt_01 +"</h5>";
                                layer.bindPopup(popupContent);

                                layer.on({
                                    mouseover: function(event) {
                                        layer.setStyle({
                                            fillColor: 'blue',    // Highlighted fill color
                                            fillOpacity: 0.7     // Highlighted fill opacity
                                        });
                                    },
                                    mouseout: function(event) {
                                        queryLayer.resetStyle(layer);
                                    }
                                });
                            }
                        });
                        queryLayer.addTo(mymap);
                        mymap.fitBounds(queryLayer.getBounds(), {paddingTopLeft: [0, 0]});
                    },
                    error: function(xhr, status, error) {
                        console.error("An error occurred: " + error);
                    }
                });



             //*********2.Query Load All Features TABLES
            $.ajax({
                    url:'loadtable.php',
                    type:'POST',
                    data:{},
                    success: function(response){
                        $('#resultTable-right').html(response);
                    }
                    });

        //*********1.Query Data by Pemilik
        $("#btnSearch").click(function(){
            $.ajax({
                url: 'query_nama_spasial.php',
                type: 'POST',
                data: { slctKondisi: $('#slctKondisi').val() },
                success: function(response) {
                    if (queryLayer) {
                        mymap.removeLayer(queryLayer);
                    }
//                    console.log(response)
                    queryLayer = L.geoJSON(JSON.parse(response), {
                        style: function(feature) {
                            return {
                                fillColor: 'green',
                                fillOpacity: 0.5,
                                color: 'black', // Border color
                                weight: 1       // Border width
                            };
                        },
                        onEachFeature: function(feature, layer) {
                            var popupContent = "<h5>ID : " + feature.properties.id + "</h5>"+
                            "<h5>Nama : " + feature.properties.pemilik + "</h5>"+
                            "<h5>Luas : " + feature.properties.luas + "</h5>"+
                            "<h5>NIB : " + feature.properties.nib + "</h5>"+
                            "<h5>Surat Ukur : " + feature.properties.surat_ukut + "</h5>"+
                            "<h5>Desa : " + feature.properties.desa + "</h5>"+
                            "<h5>Kabupaten : " + feature.properties.kabupaten + "</h5>"+
                            "<h5>Provinsi : " + feature.properties.provinsi + "</h5>";
                            layer.bindPopup(popupContent);

                            layer.on({
                                mouseover: function(event) {
                                    layer.setStyle({
                                        fillColor: 'blue',    // Highlighted fill color
                                        fillOpacity: 0.7     // Highlighted fill opacity
                                    });
                                },
                                mouseout: function(event) {
                                    queryLayer.resetStyle(layer);
                                }
                            });
                        }
                    });
                    queryLayer.addTo(mymap);
                    mymap.fitBounds(queryLayer.getBounds(), {paddingTopLeft: [0, 0]});
                },
                error: function(xhr, status, error) {
                    console.error("An error occurred: " + error);
                }
            });
        });


        //*********2.Query Data By NIB
       $("#btnSearch2").click(function(){
            $.ajax({
                url: 'query_nib_spasial.php',
                type: 'POST',
                data: { slctNIB: $('#slctNIB').val() },
                success: function(response) {
                    if (queryLayer) {
                        mymap.removeLayer(queryLayer);
                    }
//                    console.log(response)

                    queryLayer = L.geoJSON(JSON.parse(response), {
                        style: function(feature) {
                            return {
                                fillColor: 'green',
                                fillOpacity: 0.5,
                                color: 'black', // Border color
                                weight: 1       // Border width
                            };
                        },
                        onEachFeature: function(feature, layer) {
                            var popupContent = "<h5>ID : " + feature.properties.id + "</h5>"+
                            "<h5>Nama : " + feature.properties.pemilik + "</h5>"+
                            "<h5>Luas : " + feature.properties.luas + "</h5>"+
                            "<h5>NIB : " + feature.properties.nib + "</h5>"+
                            "<h5>Surat Ukur : " + feature.properties.surat_ukut + "</h5>"+
                            "<h5>Desa : " + feature.properties.desa + "</h5>"+
                            "<h5>Kabupaten : " + feature.properties.kabupaten + "</h5>"+
                            "<h5>Provinsi : " + feature.properties.provinsi + "</h5>";
                            layer.bindPopup(popupContent);

                            layer.on({
                                mouseover: function(event) {
                                    layer.setStyle({
                                        fillColor: 'blue',    // Highlighted fill color
                                        fillOpacity: 0.7     // Highlighted fill opacity
                                    });
                                },
                                mouseout: function(event) {
                                    queryLayer.resetStyle(layer);
                                }
                            });
                        }
                    });
                    queryLayer.addTo(mymap);
                    mymap.fitBounds(queryLayer.getBounds(), {paddingTopLeft: [0, 0]});
                },
                error: function(xhr, status, error) {
                    console.error("An error occurred: " + error);
                }
            });
        });

        //*********3.Query Foto by Pemilik
        $("#btnSearch").click(function(){
            console.log('Button clicked for photo');
            $.ajax({
                url: 'query_foto.php',
                type: 'POST',
                dataType: 'json', // Assuming the response is in JSON format
                success: function(response) {
                    console.log('JSON response from server:', response);
                    // Proceed with updating the imageGallery or any other logic
                },
                error: function(xhr, status, error) {
                    console.log('Error: ' + error);
                }
            });
        });



<!--            -->
<!--        $("#btnSearch").click(function(){-->
<!--            $.ajax({-->
<!--                    url:'querytabel.php',-->
<!--                    type:'POST',-->
<!--                    data:{-->
<!--                    slctKondisi1 : $('#slctKondisi').val(),-->
<!--                    slctFungsi1 : $('#slctFungsi').val()    -->
<!--                    },-->
<!--                    success: function(response){-->
<!--                        $('#resultTable-right').html(response);-->
<!--                    } -->
<!--                    });           -->
<!--        })-->
<!--            -->
<!--            $("#btnSearchbuilding").click(function(){-->
<!--            $.ajax({-->
<!--                    url:'querytabel1.php',-->
<!--                    type:'POST',-->
<!--                    data:{-->
<!--                    slctBangunan : $('#slctBangunan').val(),-->
<!--                    slctAdmin : $('#slctAdmin').val()-->
<!--                    },-->
<!--                    success: function(response){-->
<!--                        $('#resultTable-right').html(response);-->
<!--                    } -->
<!--                    });   -->
<!--            })-->
<!--            -->
<!--            $("#btnsearchadmin").click(function(){-->
<!--            $.ajax({-->
<!--                    url:'querytabel2.php',-->
<!--                    type:'POST',-->
<!--                    data:{-->
<!--                    slctKondisi1 : $('#slctKondisi1').val(),-->
<!--                    slctFungsi1 : $('#slctFungsi1').val(),    -->
<!--                    slctAdmin : $('#slctAdmin1').val()-->
<!--                    },-->
<!--                    success: function(response){-->
<!--                        $('#resultTable-right').html(response);-->
<!--                    } -->
<!--                    });-->
<!--            })-->


<!--populateDropdownNama()-->

       function populateDropdownNama() {
            // Make an AJAX request to your PHP script
            $.ajax({
                type: "POST",
                url: "query_nama.php", // Replace with the actual URL of your PHP script
                dataType: "json",
                success: function (data) {

                    // Loop through the received JSON data and populate the dropdown
                    var select = $("#slctKondisi");
                    select.empty(); // Clear existing options
                    $.each(data, function (index, value) {
                        select.append($('<option>', {
                            value: index,
                            text: value
                        }));
                    });
                },
                error: function (xhr, status, error) {
                    console.error("Error: " + error);
                }
            });
        }

        // Initial population of the dropdown
        populateDropdownNama();

        // Attach event handler to the button to trigger AJAX when clicked
        $("#btnSearch").click(function() {
            populateDropdownNama(); // Populate the dropdown again
        });

<!-- populateDropdownNIB() -->

       function populateDropdownNIB() {
            // Make an AJAX request to your PHP script
            $.ajax({
                type: "POST",
                url: "query_nib.php", // Replace with the actual URL of your PHP script
                dataType: "json",
                success: function (data) {

                    console.log(data)

                    // Loop through the received JSON data and populate the dropdown
                    var select = $("#slctNIB");
                    select.empty(); // Clear existing options
                    $.each(data, function (index, value) {
                        select.append($('<option>', {
                            value: index,
                            text: value
                        }));
                    });
                },
                error: function (xhr, status, error) {
                    console.error("Error: " + error);
                }
            });
        }

        // Initial population of the dropdown
        populateDropdownNIB();

        // Attach event handler to the button to trigger AJAX when clicked
        $("#btnSearch2").click(function() {
            populateDropdownNIB(); // Populate the dropdown again
        });


});//Comma punya document.ready
