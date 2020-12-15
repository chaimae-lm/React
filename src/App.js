import React, { useState } from "react";

import "ol/ol.css";
import "antd/dist/antd.css";
import css from "./css/App.css";
import "./css/react-geo.css";
import $ from 'jquery'; 
import {
  SimpleButton,
  MapComponent,
  MeasureButton,
  NominatimSearch,
} from "@terrestris/react-geo";

import { Drawer } from "antd";
import all_annonces from "./data/all_annonces.json";
import TList from "./components/TList";
import geoUtil from "./util/geoUtil";
import mapUtil, { ANNONCES_LAYER_ID, TRACK_LAYER_ID, annonces , vectorSource_Annonces} from "./util/mapUtil";
import SimplePopup from "./components/SimplePopup";
import Select from "ol/interaction/Select";
import Draw from "ol/interaction/Draw"
import Overlay from "ol/Overlay";
import { singleClick } from "ol/events/condition";
import styles from "./util/styles";
import AuthorPanel from "./components/AuthorPanel";
import { isMobile } from "react-device-detect";
import Control from "ol/control/Control"
//import Overlay from "ol-ext/control/Overlay";
//import Toggle from "ol-ext/control/Overlay";

const POPUP_ID = "my-popup";

geoUtil.registerProjections();

const view = mapUtil.createView();
const map = mapUtil.createMap(view);

const isGymOrTrackLayer = (layer) => {
  return (
    layer.get("layerId") &&
    (layer.get("layerId") === ANNONCES_LAYER_ID ||
      layer.get("layerId") === TRACK_LAYER_ID)
  );
};

// control ajout d'annonce
var draw = new Draw({
  source: vectorSource_Annonces,
  type: 'Point'
});
const drawIcon = document.createElement("div");
drawIcon.className = css.dragB;
drawIcon.innerHTML = '<button title="Zoom Box"><i class="fa fa-search-plus" style="font-size:16px"></i></i></button>';
drawIcon.addEventListener("click", function () {
draw.setActive(true);
map.addInteraction(draw);
});
map.addControl(
new Control({
element: drawIcon,
})
);

draw.on('drawend', function(evt){
  draw.setActive(false);
  var feature = evt.feature;
  var p = feature.getGeometry();
  console.log(p.getCoordinates());
});
//fin control ajout d'annonce
const select = new Select({
  condition: singleClick,
  style : styles.AnnonceSelectedStyle,
  layer: annonces,
});
map.addInteraction(select);


const AnnoncesFeatures = geoUtil.toFeatures(all_annonces, "track");
const AnnoncesLayer = mapUtil.createTrackLayer(AnnoncesFeatures);
annonces.setStyle(styles.AnnonceStyle);
map.addLayer(annonces);

const popup = new Overlay({});
const onPopupClose = () => {
  popup.setPosition(undefined);
};

function App() {
  const [visible, setVisible] = useState(false);
  
  const [hoveredFeatureType, setHoveredFeatureType] = useState("");
  const [hoveredFeatureDesc, setHoveredFeatureDesc] = useState("");
  const [hoveredFeatureSuperficie, setHoveredFeatureSuperficie] = useState("");
  const [hoveredFeaturePrix, setHoveredFeaturePrix] = useState("");
  const [hoveredFeatureContact, setHoveredFeatureContact] = useState("");


  //const trackNames = geoUtil.getSortedFeatureName(trackFeatures);
  //const gymNames = geoUtil.getSortedFeatureName(gymFeatures);

  const toggleDrawer = () => {
    setVisible(!visible);
  };

  const centerOnTrack = (trackName) => {
    if (isMobile) {
      setVisible(!visible);
    }
    var extent = geoUtil.getExtentOfFeaturesByName(AnnoncesFeatures, trackName);
    var buffered = geoUtil.bufferExtent(extent, 200);
    map.getView().fit(buffered);
  };

  map.on("click", function (evt) {
    var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
      return feature;
    });

    if(feature){
      if (!popup.getElement()) {
        popup.setElement(document.getElementById(POPUP_ID));
        map.addOverlay(popup);
      }
      //feature.setProperties({ hoverStyle: styles.AnnonceSelectedStyle });
      //feature.setStyle(feature.getProperties()["hoverStyle"]);
      setHoveredFeatureDesc(feature.getProperties()["desc"]);
      const typeName = feature.getProperties()["type_bienn"];
      setHoveredFeatureType(typeName);
      setHoveredFeatureSuperficie(feature.getProperties()["surface"]);
      setHoveredFeaturePrix(feature.getProperties()["prix"]);
      setHoveredFeatureContact(feature.getProperties()["nomcomplet"]);

      popup.setPosition(evt.coordinate);
    }
    else {
      return undefined;
    }
  });

  return (
    <div className="App">
      <MapComponent map={map} />
      <SimplePopup
        popupId={POPUP_ID}
        title={hoveredFeatureType}
        text1={hoveredFeatureDesc}
        text2={hoveredFeatureSuperficie}
        text3={hoveredFeaturePrix}
        text4={hoveredFeatureContact}
        onClose={onPopupClose}
      />
      <SimpleButton
        title="Filtrer"
        className="showDrawerButton"
        type="primary"
        onClick={toggleDrawer}
      >
        Filtrer
      </SimpleButton>
      <Drawer
        title="Drawer"
        placement="left"
        onClose={toggleDrawer}
        visible={visible}
        mask={false}
        footer={<AuthorPanel />}
      >
        <NominatimSearch key="search" map={map} />
        <TList
          key="2"
          header="List"
          //locationNames={Names}
          //onLocationClicked={centerOnTrack}
        />
        <MeasureButton
          key="measureButton"
          name="line"
          map={map}
          measureType="line"
          icon="pencil"
        ></MeasureButton>
      </Drawer>
    </div>
  );
  };

export default App;
