import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDropzone } from "react-dropzone";

//INTERNAL IMPORT
import UploadICON from "./SVG/UploadICON";

const UploadLogo = ({
  imageUrl,
  setImageUrl,
  setLoader,
  PINATA_API_KEY,
  PINATA_API_SECRET,
}) => {
  const notifySuccess = (msg) => toast.success(msg, { duration: 200 });
  const notifyError = (msg) => toast.error(msg, { duration: 200 });

  const uploadToIPFS = async (file) => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          maxBodyLength: "Infinity",
          headers: {
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_API_SECRET,
            "Content-Type": "multipart/form-data", //this type is for file upload, for JSON data we use different content type
          },
        });

        const ImgHash = `http://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
        console.log("ipfss returned hassh", ImgHash);
        setImageUrl(ImgHash);
        setLoader(false);
        notifySuccess("Logo uploaded successfully");
      } catch (error) {
        setLoader(false);
        notifyError("Check your  Pinata key");
        console.log(error);
      }
    }
  };

  const onDrop = useCallback(async (acceptedFile) => {
    console.log(acceptedFile[0]);
    await uploadToIPFS(acceptedFile[0]);
  });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxSize: 500000000000,
  });
  return (
    <>
      {imageUrl ? (
        <div>
          <img
            src={imageUrl}
            alt=""
            style={{ width: "200px", height: "auto" }}
          />
        </div>
      ) : (
        <div {...getRootProps()}>
          <label htmlFor="file">
            <div className="custum-file-upload">
              <UploadICON />
            </div>
            <div className="text">
              <span>Click to upload Logo</span>
            </div>
            <input type="file" id="file" {...getInputProps()} />
          </label>
        </div>
      )}
    </>
  );
};

export default UploadLogo;
