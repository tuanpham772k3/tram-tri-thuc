import React, { useState } from "react";
import { ReactReader } from "react-reader";

export default function BookReaderPage() {
  // Đường dẫn đến file epub bạn lưu trong thư mục public
  const [location, setLocation] = useState(null);

  return (
    <div style={{ height: "100vh", padding: "20px" }}>
      <h2>Trình đọc sách số </h2>
      <div style={{ height: "80vh", border: "1px solid #ccc" }}>
        <ReactReader
          url="/books/alice.epub"
          location={location}
          locationChanged={(epubcfi) => setLocation(epubcfi)}
        />
      </div>
    </div>
  );
}
