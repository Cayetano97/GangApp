// import { useState } from "react";
import "./CameraUploader.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ImageUploader = (props) => {
  // const [image, setImage] = useState(null);
  // const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = () => {
    alert("Archivo subido [Emulado]");
    // const file = event.target.files[0];
    // setSelectedImage(file);
  };

  // const handleImageUpload = async () => {
  //   const formData = new FormData();
  //   formData.append("image", selectedImage);
  //   try {
  //      const response = await axios.post("/upload", formData, {
  //        headers: {
  //          "Content-Type": "multipart/form-data",
  //        },
  //      });
  //      console.log("Image uploaded:", response.data.filename);
  //     console.log("Image uploaded:", formData);

  //   } catch (error) {
  //     console.error("Error uploading image:", error);
  //   }
  // };

  // const handleImageUpload = (event) => {
  //   const file = event.target.files[0];
  //   const reader = new FileReader();

  //   reader.onload = () => {
  //     if (reader.readyState === 2) {
  //       setImage(reader.result);
  //     }
  //   };

  //   if (file) {
  //     reader.readAsDataURL(file);
  //   }
  // };

  return (
    <>
      <div className="Camera">
        <h3 id="titulo">{props.title}</h3>
        {/* <input type="file" accept="image/*" onChange={handleImageUpload} />
        {image && <img src={image} alt="Uploaded" />}
        <div className="CameraButton}>
          <button onClick={handleCameraButtonClick}>Abrir cámara</button>
        </div> */}
        <div>
          <input type="file" />
          <button className="btn" onClick={handleImageChange}>
            Subir archivo
          </button>
        </div>
      </div>
    </>
  );
};

export default ImageUploader;
