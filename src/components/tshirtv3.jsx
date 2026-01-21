// tshirt.jsx (TshirtV3 - full code với clip khi kéo ra ngoài)
import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Image as KonvaImage, Rect, Transformer, Group } from "react-konva";
import useImage from "use-image";
import BackgroundImage from "../images/tshirtMockup.png";

// Import ảnh artwork local (bundler sẽ resolve URL đúng)
import testArtwork from "../images/artwork/future_in.png";

function TshirtV3({ color }) {
  const [bgImage] = useImage(BackgroundImage);
  const [artworkImage] = useImage(testArtwork);

  const shirtRef = useRef(null);
  const trRef = useRef(null);
  const imageRef = useRef(null);

  // Vùng in cố định (giữ nguyên như bạn cung cấp)
  const printArea = {
    id: "front",
    x: 130,
    y: 50,
    width: 190,
    height: 200,
    label: "Ngực áo",
  };

  // State cho vị trí/kích thước artwork (sau khi fit)
  const [design, setDesign] = useState(null);

  // Tự động fit artwork vào vùng in khi ảnh load xong
  useEffect(() => {
    if (artworkImage) {
      const areaW = printArea.width;
      const areaH = printArea.height;

      let newWidth = areaW;
      let newHeight = areaW * (artworkImage.height / artworkImage.width);

      // Nếu chiều cao vượt quá vùng → fit theo height
      if (newHeight > areaH) {
        newHeight = areaH;
        newWidth = areaH * (artworkImage.width / artworkImage.height);
      }

      const centerX = printArea.x + (areaW - newWidth) / 2;
      const centerY = printArea.y + (areaH - newHeight) / 2 + 100; // giữ offset +100 như cũ

      setDesign({
        x: centerX,
        y: centerY,
        width: newWidth,
        height: newHeight,
        rotation: 0,
      });
    }
  }, [artworkImage]);

  // Áp dụng màu cho áo thun
  useEffect(() => {
    if (shirtRef.current && color) {
      shirtRef.current.cache();
      shirtRef.current.red(color.r);
      shirtRef.current.green(color.g);
      shirtRef.current.blue(color.b);
      shirtRef.current.getLayer().batchDraw();
    }
  }, [color]);

  // Tự động attach Transformer khi design sẵn sàng
  useEffect(() => {
    if (design && trRef.current && imageRef.current) {
      trRef.current.nodes([imageRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [design]);

  return (
    <div style={{ position: "relative" }}>
      <Stage width={850} height={500}>
        {/* Layer 1: Áo thun nền + thay đổi màu */}
        <Layer>
          {bgImage && (
            <KonvaImage
              ref={shirtRef}
              image={bgImage}
              x={0}
              y={0}
              width={850}
              height={500}
              filters={[Konva.Filters.RGB]}
            />
          )}
        </Layer>

        {/* Layer 2: Viền vùng in + artwork với clipping */}
        <Layer>
          {/* Chỉ viền dashed (không fill background) */}
          <Rect
            x={printArea.x}
            y={printArea.y + 100}
            width={printArea.width}
            height={printArea.height}
            stroke="#000"
            strokeWidth={2}
            dash={[6, 4]}
            listening={false}
          />

          {/* Artwork với clip: chỉ hiển thị phần nằm trong vùng in */}
          {design && artworkImage && (
            <Group
              clipX={printArea.x}
              clipY={printArea.y + 100}
              clipWidth={printArea.width}
              clipHeight={printArea.height}
            >
              <KonvaImage
                ref={imageRef}
                image={artworkImage}
                x={design.x}
                y={design.y}
                width={design.width}
                height={design.height}
                rotation={design.rotation}
                draggable
                onDragEnd={(e) => {
                  const node = e.target;
                  console.log("Dragged to:", node.x(), node.y());
                  // Nếu bạn muốn lưu vị trí mới (cho export sau này)
                  // setDesign(prev => ({ ...prev, x: node.x(), y: node.y() }));
                }}
                onTransformEnd={(e) => {
                  const node = e.target;
                  console.log("Resized to:", node.width() * node.scaleX(), node.height() * node.scaleY());
                  node.scaleX(1);
                  node.scaleY(1);
                  // Nếu muốn cập nhật state
                  // setDesign(prev => ({
                  //   ...prev,
                  //   width: node.width(),
                  //   height: node.height(),
                  //   rotation: node.rotation(),
                  // }));
                }}
              />
            </Group>
          )}

          {/* Transformer (không bị clip) */}
          {design && artworkImage && (
            <Transformer
              ref={trRef}
              rotateEnabled={true}
              enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
              boundBoxFunc={(oldBox, newBox) => {
                return newBox.width < 50 || newBox.height < 50 ? oldBox : newBox;
              }}
            />
          )}
        </Layer>
      </Stage>

      {/* Thông báo debug */}
      <div style={{ marginTop: 15, textAlign: "center", color: "green" }}>
        <p>Artwork được clip theo vùng in (chỉ hiển thị phần nằm trong khung viền khi kéo ra ngoài).</p>
        <p>Kéo artwork ra ngoài viền để kiểm tra clipping. Resize/rotate vẫn hoạt động bình thường.</p>
      </div>
    </div>
  );
}

export default TshirtV3;