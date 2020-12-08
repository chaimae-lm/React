import React, { useState } from "react";

import "ol/ol.css";
import "antd/dist/antd.css";
import "./css/App.css";
import "./css/react-geo.css";

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
import mapUtil, { GYM_LAYER_ID, TRACK_LAYER_ID } from "./util/mapUtil";
import SimplePopup from "./components/SimplePopup";
import Select from "ol/interaction/Select";
import Overlay from "ol/Overlay";
import { pointerMove } from "ol/events/condition";
import styles from "./util/styles";
import AuthorPanel from "./components/AuthorPanel";
import { isMobile } from "react-device-detect";

const POPUP_ID = "my-popup";

geoUtil.registerProjections();

const view = mapUtil.createView();
const map = mapUtil.createMap(view);

const isGymOrTrackLayer = (layer) => {
  return (
    layer.get("layerId") &&
    (layer.get("layerId") === GYM_LAYER_ID ||
      layer.get("layerId") === TRACK_LAYER_ID)
  );
};

const select = new Select({
  condition: pointerMove,
  style: styles.hoverStyleFunction,
  layers: function (layer) {
    return isGymOrTrackLayer(layer);
  },
});
map.addInteraction(select);


const AnnoncesFeatures = geoUtil.toFeatures(all_annonces, "track");
const AnnoncesLayer = mapUtil.createTrackLayer(AnnoncesFeatures);
map.addLayer(AnnoncesLayer);


const popup = new Overlay({});

const onPopupClose = () => {
  popup.setPosition(undefined);
};

function App() {
  const [visible, setVisible] = useState(false);
  const [hoveredFeatureName, setHoveredFeatureName] = useState("");
  const [hoveredFeatureType, setHoveredFeatureType] = useState("");

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
    var feature = map.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
      if (isGymOrTrackLayer(layer)) {
        return feature;
      }
    });
    if (feature) {
      if (!popup.getElement()) {
        popup.setElement(document.getElementById(POPUP_ID));
        map.addOverlay(popup);
      }
      setHoveredFeatureName(feature.getProperties()["name"]);
      const typeName =
        feature.getProperties()["type"] === "Annonce" ? "Name" : "AnnonceName";
      setHoveredFeatureType(typeName);
      popup.setPosition(evt.coordinate);
    } else {
      popup.setPosition(undefined);
    }
  });

  return (
    <div className="App">
      <MapComponent map={map} />
      <SimplePopup
        popupId={POPUP_ID}
        title={hoveredFeatureType}
        text={hoveredFeatureName}
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
          /*locationNames={Names}
          onLocationClicked={centerOnTrack}*/
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
}

export default App;
