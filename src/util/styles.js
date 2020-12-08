import { Style, Circle, Fill, Stroke } from "ol/style";
import { Icon } from "ol/style";

const ICON_SCALE = 0.25;
const styles = {
  


  kommunStyle: new Style({
    stroke: new Stroke({
      color: "grey",
      width: 3,
    }),
    fill: new Fill({
      color: "rgba(232, 232, 232, 0.5)",
    }),
  }),

 /* trackStyles: [
    new Style({
      stroke: new Stroke({
        color: "black",
        lineDash: [1, 2.5],
        width: 4,
        lineDashOffset: 0,
      }),
    }),
    new Style({
      stroke: new Stroke({
        color: "rgb(204,144,122)",
        lineDash: [1, 2.5],
        width: 2.5,
        lineDashOffset: 0,
      }),
    }),
  ],*/
  trackStyles: [
    new Style({
      image: new Circle({
        fill: new Fill({
          color: "black",
        }),
        stroke: new Stroke({
          color: "transparent",
          width: 1.25,
        }),
        radius: 5,
      }),
    }),
  ],


  trackStylesHover: [
    new Style({
      stroke: new Stroke({
        color: "blue",
        lineDash: [1, 2.5],
        width: 6,
        lineDashOffset: 0,
      }),
    }),
    new Style({
      stroke: new Stroke({
        color: "rgb(204,144,122)",
        lineDash: [1, 2.5],
        width: 2.5,
        lineDashOffset: 0,
      }),
    }),
  ],

  hoverStyleFunction: (feature) => {
    if (feature.getProperties()["type"] === "track") {
      return styles.trackStylesHover;
    }
    if (feature.getProperties()["type"] === "gym") {
      return feature.getProperties()["hoverStyle"];
    }
    return undefined;
  },
};

export default styles;
