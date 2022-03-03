var map, serviceAreaTask, params, clickpoint;
var centros = "https://services5.arcgis.com/zZdalPw2d0tQx8G1/ArcGIS/rest/services/CENTROS_SALUDig/FeatureServer/0";

require([
  "esri/map",
  "esri/tasks/ServiceAreaTask",
  "esri/tasks/ServiceAreaParameters",
  "esri/tasks/FeatureSet",

  "esri/layers/FeatureLayer",

  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol",
  "esri/geometry/Point",

  "esri/tasks/query",

  "esri/graphic",
  "dojo/parser",
  "dojo/dom",
  "dijit/registry",
  "esri/Color",
  "dojo/_base/array",
  "dojo/ready",

  "dijit/layout/BorderContainer",
  "dijit/layout/ContentPane",
  "dijit/form/HorizontalRule",
  "dijit/form/HorizontalRuleLabels",
  "dijit/form/HorizontalSlider",
  "dojo/domReady!"

], function (
  Map,
  ServiceAreaTask, ServiceAreaParameters, FeatureSet, FeatureLayer,
  SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol,
  Point,Query, Graphic,
  parser, dom, registry,
  Color, arrayUtils, ready
) {
  parser.parse();

  var mapMain = new Map("divMap", {
    basemap: "gray",
    center: [-3.691288, 40.425840],
    zoom: 12
  });

  var lyrSalud = new FeatureLayer(centros, {

  });
  //Agregar Capa
  mapMain.addLayers([lyrSalud]);

  map.on("click", mapClickHandler);

  params = new ServiceAreaParameters();
  params.defaultBreaks = [3, 5, 7];
  params.outSpatialReference = map.spatialReference;
  params.returnFacilities = false;

  serviceAreaTask = new ServiceAreaTask("https://formacion.esri.es/server/rest/services/RedMadrid/MapServer/1");

  registry.byId("hslider").on("change", updateHorizontalLabel);
  updateHorizontalLabel();

  // // Create function that updates label when changed
  // function updateHorizontalLabel() {
  //   // Get access to nodes/widgets we need to get/set values
  //   var hSlider = registry.byId("hslider");
  //   var label = dom.byId("decValue");
  //   // Update label
  //   label.innerHTML = hSlider.get("value");
  //   params.defaultBreaks = [hSlider.value / 60];
  //   if (clickpoint) {
  //     mapClickHandler(clickpoint);
  //   }
  // }

  queryTask = new QueryTask("https://services5.arcgis.com/zZdalPw2d0tQx8G1/ArcGIS/rest/services/CENTROS_SALUDig/FeatureServer/0");

  //initialize query
  query = new Query();
  query.where = '1 = 1';
  query.outFields = ["LONGITUDE", "LATITUDE"];
  console.log(query)




  function mapClickHandler(evt) {
    clickpoint = evt;
    map.graphics.clear(); //clear existing graphics
    //define the symbology used to display the results and input point
    var pointSymbol = new SimpleMarkerSymbol(
      "diamond",
      20,
      new SimpleLineSymbol(
        "solid",
        new Color([88, 116, 152]), 2
      ),
      new Color([88, 116, 152, 0.45])
    );


    var inPoint = new Point(evt.mapPoint.x, evt.mapPoint.y, map.spatialReference);
    var location = new Graphic(inPoint, pointSymbol);

    map.graphics.add(location);
    var features = [];
    features.push(location);
    var facilities = new FeatureSet();
    facilities.features = features;
    params.facilities = facilities;
    console.log(params)
    //solve
    serviceAreaTask.solve(params, function (solveResult) {
      var polygonSymbol = new SimpleFillSymbol(
        "solid",
        new SimpleLineSymbol("solid", new Color([232, 104, 80]), 2),
        new Color([232, 104, 80, 0.25])
      );
      arrayUtils.forEach(solveResult.serviceAreaPolygons, function (serviceArea) {
        serviceArea.setSymbol(polygonSymbol);
        map.graphics.add(serviceArea);
      });

    }, function (err) {
      console.log(err.message);
    });
  }
});
