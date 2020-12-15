import { Style, Circle, Fill, Stroke } from "ol/style";
import { Icon } from "ol/style";
import icon from "../img/icon.png";
import iconSelected from "../img/iconSelected.png";
import womanGymIcon from "../img/woman-gym.png";
import womanGymSelectedIcon from "../img/woman-gym-selected.png";
import ANNONCES_LAYER_ID, { annonces , Afeatures} from "./mapUtil"

const ICON_SCALE = 0.10;
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
//dont j'ai besoin
AnnonceStyle: new Style({
    image: new Icon({
      src: icon,
      scale: ICON_SCALE,
    }),
  }),

AnnonceSelectedStyle:new Style({
  image: new Icon({
    src: iconSelected,
    scale: 0.15,
  }),
}),


womanIconStyle: new Style({
  image: new Icon({
    src: womanGymIcon,
    scale: ICON_SCALE,
  }),
}),

womanSelectedIconStyle: new Style({
  image: new Icon({
    src: womanGymSelectedIcon,
    scale: ICON_SCALE,
  }),
}),
//dont j'ai besoin
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
 
};

export default styles;
