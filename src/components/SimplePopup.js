import React from "react";
import { Card } from "antd";
import styles from "../css/SimplePopup.module.css";
import { CloseOutlined } from "@ant-design/icons";

const SimplePopup = ({ popupId, title, text1,text2,text3,text4,onClose }) => {
  return (
    <div className={styles.popupContainer}>
      <div id={popupId}>
        <Card
          className={styles.popupCard}
          size="small"
          title={title}
          extra={<CloseOutlined onClick={onClose} />}
        >
          <p>Description : {text1}</p>
          <p>Superficie : {text2}</p>
          <p>Prix : {text3}</p>
          <p>Contact : {text4}</p>
        </Card>
      </div>
    </div>

    
  );
};

export default SimplePopup;
