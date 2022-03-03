var centros = "https://services5.arcgis.com/zZdalPw2d0tQx8G1/ArcGIS/rest/services/CENTROS_SALUDig/FeatureServer/0";


require([
    "esri/map",
    "esri/Color",
    "esri/graphic",
    "esri/graphicsUtils",
    
    "esri/layers/FeatureLayer",

    "esri/tasks/Geoprocessor",
    "esri/tasks/FeatureSet",

    "esri/graphic",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",

    "esri/geometry/webMercatorUtils",
    "esri/geometry/Point",


    "dojo/ready",
],


    function (Map, Color, Graphic, graphicsUtils,
        FeatureLayer,
        Geoprocessor,FeatureSet,
        Graphic,SimpleMarkerSymbol,SimpleLineSymbol,SimpleFillSymbol,

        webMercatorUtils, Point,
        
        ready
    ) 
    {


        ready(function () {
            var mapMain = new Map("divMap", {
                basemap: "gray",
                center:  [-3.691288,40.425840],
                zoom: 12
            });

            var lyrSalud = new FeatureLayer(centros, {
   
            });
            //Agregar Capa
            mapMain.addLayers([lyrSalud]);
            
            
            //Output fields
            var outFieldsCentros= ["*"];

        gp = new Geoprocessor("https://formacion.esri.es/server/rest/services/RedMadrid/NAServer/Service%20Area");
        gp.setOutputSpatialReference({wkid: 102100});
        mapMain.on("click", computeServiceArea);

        function computeServiceArea(evt) {

            var driveTimes = "3 5 7";
            mapMain.graphics.clear();
            var pointSymbol = new SimpleMarkerSymbol();
            pointSymbol.setOutline = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 1);
            pointSymbol.setSize(14);
            pointSymbol.setColor(new Color([0, 255, 0, 0.25]));
    
            var graphic = new Graphic(evt.mapPoint, pointSymbol);
            mapMain.graphics.add(graphic);

            // var pointLayer = new FeatureLayer("https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/New_Store_Location/FeatureServer/0");
    
            // var features = [];
            // features.push(graphic);
            var featureSet = new FeatureSet();
            featureSet.lyrSalud = lyrSalud;
            var params = { "Input_Location": featureSet, "Drive_Times": driveTimes };
            gp.execute(params, getDriveTimePolys);
          }

          function getDriveTimePolys(results, messages) {
            var features = results[0].value.features;
            // add drive time polygons to the map
            for (var f = 0, fl = lyrSalud.length; f < fl; f++) {
              var feature = lyrSalud[f];
              if (f === 0) {
                var polySymbolRed = new SimpleFillSymbol();
                polySymbolRed.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 0, 0.5]), 1));
                polySymbolRed.setColor(new Color([255, 0, 0, 0.7]));
                feature.setSymbol(polySymbolRed);
              }
              else if (f == 1) {
                var polySymbolGreen = new SimpleFillSymbol();
                polySymbolGreen.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                    new Color([0, 0, 0, 0.5]), 1));
                polySymbolGreen.setColor(new Color([0, 255, 0, 0.7]));
                feature.setSymbol(polySymbolGreen);
              }
              else if (f == 2) {
                var polySymbolBlue = new SimpleFillSymbol();
                polySymbolBlue.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 0, 0.5]), 1));
                polySymbolBlue.setColor(new Color([0, 0, 255, 0.7]));
                feature.setSymbol(polySymbolBlue);
              }
              mapMain.graphics.add(feature);
            }
            mapMain.setExtent(graphicsUtils.graphicsExtent(mapMain.graphics.graphics), true);
        }





            
 

        });




    }
    
);










