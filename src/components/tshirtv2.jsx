// tshirt.jsx
import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Image as KonvaImage, Rect, Transformer, Group } from "react-konva";
import useImage from "use-image";
import BackgroundImage from "../images/tshirtMockup.png"; // đường dẫn của bạn
import Konva from "konva";

function TshirtV2({ color }) {
  const [bgImage] = useImage(BackgroundImage);
  const shirtRef = useRef(null);
  const trRef = useRef(null);

  // Định nghĩa vùng in cố định (print area) – điều chỉnh theo mockup thật của bạn
  const printArea = {
    id: "front",
    x: 130,          // ← Đo bằng công cụ đo pixel (Photoshop/Figma/Preview)
    y: 50,           // ← Đo từ đỉnh mockup xuống
    width: 190,      // ← Chiều rộng vùng in (pixel trên ảnh 850px)
    height: 200,     // ← Chiều cao vùng in
    label: "Ngực áo",
  };

  // State lưu thiết kế đã upload
  const [design, setDesign] = useState(null); // { url, x, y, width, height, rotation }

  useEffect(() => {
    if (shirtRef.current && color) {
      shirtRef.current.cache();
      shirtRef.current.red(color.r || 255);
      shirtRef.current.green(color.g || 255);
      shirtRef.current.blue(color.b || 255);
      shirtRef.current.getLayer().batchDraw();
    }
  }, [color]);

  // Xử lý upload ảnh
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => {
      // Ước lượng DPI (giả sử vùng in thực tế ~12 inch rộng)
      const realWidthInch = 12; // inch (thay đổi nếu mockup khác)
      const dpi = img.width / realWidthInch;
      if (dpi < 250) {
        alert(`Ảnh của bạn khoảng ~${Math.round(dpi)} DPI. Nên dùng file ≥300 DPI để in đẹp nhé!`);
      }

      const objectUrl = URL.createObjectURL(file);
      setDesign({
        url: objectUrl,
        x: printArea.x + 20,               // đặt giữa vùng một chút
        y: printArea.y + 20,
        width: printArea.width - 400,
        height: (printArea.width - 400) * (img.height / img.width), // giữ tỷ lệ
        rotation: 0,
      });
    };
    img.src = URL.createObjectURL(file);
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Input file ẩn */}
      <input
        type="file"
        accept="image/png,image/jpeg"
        style={{ display: "none" }}
        id="upload-design"
        onChange={handleFileChange}
      />

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

        {/* Layer 2: Vùng in + thiết kế upload */}
        <Layer>
          {/* Vùng in placeholder (đen mờ + viền đứt) */}
          <Rect
            x={printArea.x}
            y={printArea.y+100}
            width={printArea.width}
            height={printArea.height}
            fill="black"
            opacity={0.12}
            stroke="#000"
            strokeWidth={2}
            dash={[6, 4]}
            listening={false} // không click được
          />

          {/* Thiết kế người dùng upload */}
          {design && (
            <Group>
              <KonvaImage
                image={useImage(design.url)[0]}
                x={design.x}
                y={design.y}
                width={design.width}
                height={design.height}
                rotation={design.rotation}
                draggable
                onDragEnd={(e) => {
                  const node = e.target;
                  // Giới hạn không ra ngoài vùng in
                  if (node.x() < printArea.x) node.x(printArea.x);
                  if (node.y() < printArea.y) node.y(printArea.y);
                  if (node.x() + node.width() > printArea.x + printArea.width) {
                    node.x(printArea.x + printArea.width - node.width());
                  }
                  if (node.y() + node.height() > printArea.y + printArea.height) {
                    node.y(printArea.y + printArea.height - node.height());
                  }
                  setDesign({ ...design, x: node.x(), y: node.y() });
                }}
                onTransformEnd={(e) => {
                  const node = e.target;
                  setDesign({
                    ...design,
                    width: node.width() * node.scaleX(),
                    height: node.height() * node.scaleY(),
                    rotation: node.rotation(),
                  });
                  node.scaleX(1);
                  node.scaleY(1);
                }}
              />
              <Transformer
                ref={trRef}
                nodes={[trRef.current?.nodes()[0]]} // tự động attach khi có design
                rotateEnabled={true}
                enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
                boundBoxFunc={(oldBox, newBox) => {
                  return newBox.width < 50 || newBox.height < 50 ? oldBox : newBox;
                }}
              />
            </Group>
          )}
        </Layer>
      </Stage>

      {/* Nút upload */}
      <div style={{ marginTop: 15, textAlign: "center" }}>
        <label htmlFor="upload-design">
          <button style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}>
            Upload arwork
          </button>
        </label>
        {design && <p>Đã upload! Kéo thả / resize để điều chỉnh.</p>}
      </div>
    </div>
  );
}

export default TshirtV2;