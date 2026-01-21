import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Image } from "react-konva";
import BackgroundImage from "../images/tshirtMockup.png";
import Konva from "konva";

function Tshirt(props) {
  const [images, setImage] = useState(new window.Image());
  const shirtRef = useRef(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    const myImage = new window.Image();
    myImage.src = BackgroundImage;
    myImage.onload = () => {
      setImage(myImage);
    };
  }, []);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
    } else {
      shirtRef.current.cache();
      shirtRef.current.getLayer().batchDraw();

      if (props.color) {
        shirtRef.current.blue(props.color.b || 0);
        shirtRef.current.red(props.color.r || 0);
        shirtRef.current.green(props.color.g || 0);
      }
    }
  }, [props.color]);

  return (
    <Stage width={850} height={500}>
      <Layer>
        <Image
          filters={[Konva.Filters.RGB]}
          image={images}
          x={0}
          y={0}
          width={850}
          height={500}
          ref={shirtRef}
        />
      </Layer>
    </Stage>
  );
}

export default Tshirt;
