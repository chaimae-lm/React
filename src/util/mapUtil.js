import geoUtil from "./geoUtil";
import Polygon from "ol/geom/Polygon";
import Feature from "ol/Feature";
import styles from "./styles";
import OlView from "ol/View";
import { defaults } from "ol/interaction";
import OlMap from "ol/Map";
import OlLayerTile from "ol/layer/Tile";
import OlSourceOsm from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import {transform} from "ol/proj"
import VectorImageLayer from "ol/layer/Vector";
import GeoJSON from 'ol/format/GeoJSON';


export const GYM_LAYER_ID = "gym-layer";
export const TRACK_LAYER_ID = "track-layer";

const mapUtil = {
  createView: () => {
    return new OlView({
      projection: "EPSG:3857",
      center: transform([-11.63, 29.83], "EPSG:4326", "EPSG:3857"),
      zoom: 5.7,
    });
  },

  createMap: (view) => {
    const interactions = defaults({
      altShiftDragRotate: false,
      pinchRotate: false,
    });
    return new OlMap({
      view: view,
      layers: [
        new OlLayerTile({
          source: new OlSourceOsm(),
        }),
      ],
      interactions: interactions,
    });
  },

//create all-annonces layer
createTrackLayer: (trackFeatures) => {
  const trackLayer = new VectorImageLayer({
    layerId: TRACK_LAYER_ID,
    source: new VectorSource({}),
    format: new GeoJSON,
  });

  mapUtil.setStylesOnTracks(trackFeatures);
  trackLayer.getSource().addFeatures(trackFeatures);
  return trackLayer;
},
//set styles on all-annonces layer
setStylesOnTracks: (tracks) => {
  tracks.map((track) => {
    return track.setStyle(styles.trackStyles);
  });
},
createGymLayer: (gymFeatures) => {
  const outDoorGymLayer = new VectorImageLayer({
    layerId: GYM_LAYER_ID,
    source: new VectorSource({}),
    format: new GeoJSON,
  });

  mapUtil.setIconOnGymFeatures(gymFeatures);
  outDoorGymLayer.getSource().addFeatures(gymFeatures);
  return outDoorGymLayer;
},
setIconOnGymFeatures: (gymFeatures) => {
  const man = {
    icon: styles.manIconStyle,
    iconHover: styles.manSelectedIconStyle,
  };

  const woman = {
    icon: styles.womanIconStyle,
    iconHover: styles.womanSelectedIconStyle,
  };

  const randomOrderIcons = Math.random() >= 0.5 ? [man, woman] : [woman, man];

  gymFeatures.map((gym, index) => {
    var icons = randomOrderIcons[index % 2];
    gym.setProperties({ hoverStyle: icons.iconHover });
    return gym.setStyle([icons.icon]);
  });
},
};

export default mapUtil;
