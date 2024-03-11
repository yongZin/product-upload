//상품 업로드 컴포넌트
import React, { useState, useRef, useContext } from "react";
import axios from "axios";
import styled from "styled-components";
// import { v4 as uuid } from 'uuid';
// import mime from "mime-types";
import { toast } from "react-toastify";
import Quill from "./Quill";
import UploadInput from "./UploadInput";
import { ProductContext } from "../context/ProductContext";
import { ModalContext } from "../context/ModalContext";

const ImgWrap = styled.div`
  margin:40px 0 30px;
  font-size:0;
  @media ${props => props.theme.mobile} {
   margin:30px 0 0;
  }
`;
const ImgUploader = styled.div`
  width:19%;
  display:inline-block;
  vertical-align:middle;
  border-radius:10px;
  border:1px solid #ccc;
  background-color:rgba(255, 255, 255, 0.5);
  position:relative;
  div{
    padding-bottom:100%;
    &:before,
    &:after{
      content:"";
      width:30px;
      height:5px;
      background-color:#acacac;
      border-radius:5px;
      position:absolute;
      top:50%;
      left:50%;
      transform:translate(-50%, -50%);
      pointer-events:none;
    }
    &:after{
      transform:translate(-50%, -50%) rotate(90deg);
    }
  }
  input{
    display:none;
  }
  label{
    width:100%;
    height:100%;
    opacity:0;
    cursor:pointer;
    position:absolute;
    top:0;
    left:0;
  }
  @media ${props => props.theme.mobile} {
    width:85px;
    vertical-align:top;
    margin-bottom:30px;
  }
  @media ${props => props.theme.mobile_xs} {
    width:calc(33.333% - 10px);
  }
`;
const ImgPreview = styled.div`
  width:81%;
  display:inline-block;
  vertical-align:middle;
  li{
    width:calc(24.78% - 10px);
    display:inline-block;
    vertical-align:middle;
    margin-left:10px;
    position:relative;
    &:before{
      content:"";
      display:block;
      padding-bottom:100%;
    }
    button{
      width:22px;
      height:20px;
      border-radius:3px 3px 0 0;
      background-color:#ccc;
      position:absolute;
      top:-20px;
      right:0;
      z-index:2;
      &::before,
      &:after{
        content:"";
        width:10px;
        height:2px;
        background-color:#fff;
        position:absolute;
        top:10px;
        left:6px;
        transform:rotate(45deg);
      }
      &:after{
        transform:rotate(-45deg);
      }
    }
    input[type="radio"]{
      display:none;
      &:checked{
        & + label{
          border-color:orange;
          &:before{
            content:"대표";
            padding:2px 6px;
            display:block;
            font-size:12px;
            border-radius:0 0 3px 3px;
            color:#fff;
            background-color:orange;
            position:absolute;
            top:0;
            left:50%;
            transform:translateX(-50%);
          }
        }
        & ~ button{
          background-color:orange;
        }
      }
    }
    label{
      border-radius:10px 0 10px 10px;
      border:2px solid #ccc;
      overflow:hidden;
      position:absolute;
      inset:0;
      cursor:pointer;
      img{
        pointer-events:none;
      }
    }
  }
  @media ${props => props.theme.tablet} {
    li{
      label{
        border-color:#aaa;
      }
      button{
        background-color:#aaa;
      }
    }
  }
  @media ${props => props.theme.mobile} {
    width:calc(100% - 85px);
    vertical-align:top;
    li{
      width:85px;
      margin:0 0 30px 10px;
    }
  }
  @media ${props => props.theme.mobile_xs} {
    width:66.666%;
    li{
      width:calc(50% - 10px);
    }
  }
`;
const BtnBox = styled.div`
  width:65%;
  display:block;
  margin:30px auto 0;
  button{
    width:45%;
    padding:12px 0;
    font-size:18px;
    border-radius:6px;
    border:2px solid transparent;
    transition:0.2s;
    &:first-child{
      margin-right:5%;
      color:#555;
      background-color:rgba(255, 255, 255, 0.5);
      &:hover{
        color:#111;
        background-color:rgba(255, 255, 255, 0.65);
      }
    }
    &:last-child{
      color:#fff;
      background-color:rgba(0, 198, 4, 0.5);
      &:disabled{
        color:#bbb;
        background-color:rgba(204, 204, 204, 0.5);
        cursor:no-drop;
        &:hover{
          background-color:rgba(204, 204, 204, 0.5);
        }
      }
      &:hover{
        background-color:rgba(0, 198, 4, 0.65);
      }
    }
  }
  @media ${props => props.theme.tablet} {
    button{
      font-size:16px;
    }
  }
  @media ${props => props.theme.mobile} {
    width:100%;
    text-align:center;
    button{
      width:100px;
      font-size:14px;
    }
  }
`;

const UploadForm = () => {
	const inputRef = useRef();
  const [mainImgChecked, setMainImgChecked] = useState(0);
  const {setModalView, setClose} = useContext(ModalContext);
  const {
    setProductsAll,
    setProducts,
    name, setName,
    price, setPrice,
    mainImages, setMainImages,
    previews, setPreviews,
    details, setDetails,
    detailImages, setDetailImages,
    type, setType,
    material, setMaterial,
    color, setColor,
  } = useContext(ProductContext);

  const imageHandler = async (e) => {
    const imageFiles = e.target.files; //파일정보 가져오기
    setMainImages(imageFiles);

    if (mainImages.length + imageFiles.length > 4) {
      toast.error("대표 이미지는 최대 4개까지 업로드 가능합니다.");
    } else{
      const newImages = [...new Set([...mainImages, ...imageFiles])];

      const imagePreviews = await Promise.all(
        [...imageFiles].map(async (file) => {
          return new Promise((resolve, reject) => {
            try {
              const fileReader = new FileReader();
              fileReader.readAsDataURL(file);
              fileReader.onload = (e) => resolve({
                imgSrc: e.target.result,
                fileName: file.name
              })
            } catch (error) {
              reject(error);
            }
          })
        })
      )

      setMainImages(newImages); 
      setPreviews((prevPreviews) => [...prevPreviews, ...imagePreviews]);
    }
  }

  const imageDeleteHandler = (index) => {

    setMainImages((prevMainImages) => {
      const newMainImages = [...prevMainImages];
      newMainImages.splice(index, 1);
      return newMainImages;
    });

    setPreviews((prevPreviews) => {
      const newPreviews = [...prevPreviews];
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

	const priceCommaToNumber = (e) => {
		let value = e.target.value;
		
		if (!value) return;

    const numberValue = value.replace(/[^0-9]/g, '');
		const numberWithCommas = numberValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    setPrice(numberWithCommas);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      if (
        !mainImages ||
        !detailImages ||
        !name ||
        !price ||
        !details ||
        !type ||
        !material ||
        !color
      ) throw new Error("모든 정보를 입력해주세요.");

      const mainPresignedData = await axios.post("/upload/presigned", {
        contentTypes: mainImages.map((image) => image.type)
      });

      const detailPresignedData = await axios.post("/upload/presigned", {
        contentTypes: detailImages.map((image) => image.file.type)
      });

      await Promise.all(mainImages.map(async (file, index) => {
        const { presigned } = mainPresignedData.data[index];
        const formData = new FormData();
      
        for (const key in presigned.fields) {
          formData.append(key, presigned.fields[key]);
        }
      
        formData.append("Content-Type", file.type);
        formData.append("file", file);
      
        return axios.post(presigned.url, formData);
      }));

      await Promise.all(detailImages.map(async (file, index) => {
        const { presigned } = detailPresignedData.data[index];
        const formData = new FormData();
      
        for (const key in presigned.fields) {
          formData.append(key, presigned.fields[key]);
        }
      
        formData.append("Content-Type", file.file.type);
        formData.append("file", file.file);
      
        return axios.post(presigned.url, formData);
      }));

      const res = await axios.post("/upload", {
        mainImages: mainPresignedData.data.map((data) => ({
          imageKey: data.imageKey,
        })),
        detailImages: detailPresignedData.data.map((data) => ({
          imageKey: data.imageKey,
        })),
        name,
        price,
        details,
        type,
        material,
        color,
      });

      console.log({ res });

      setProducts((prevData) => [res.data, ...prevData]);
      setProductsAll((prevData) => [res.data, ...prevData]);
      toast.success("업로드 성공");

      setTimeout(() => {
        resetData();
      }, 1000);

    } catch (error) {
      const errorMessage = error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : error.message;
      toast.error(errorMessage);
      // resetData();
      console.error(error);
    }
  };

  const resetData = () => {
    setClose(true);
    setName("");
    setPrice("");
    setMainImages([]);
    setPreviews([]);
    setDetails([]);
    setType("");
    setMaterial("");
    setColor("");

    setTimeout(() => {
      setModalView("off");
      setClose(false);
    }, 300);

    if (inputRef.current) inputRef.current.value = null;
  };

  const firstMainImageCheck = (index) => {
    setMainImgChecked(index);

    setMainImages((prevMainImages) => {
      const newMainImages = [...prevMainImages]; 
      const selectedImage = newMainImages[index];
  
      newMainImages.splice(index, 1);
      newMainImages.unshift(selectedImage);
  
      return newMainImages; 
    });
  }

	const previewsImg = previews && previews.map((preview,index) => (
    <li key={preview.fileName}>
      <input
        type="radio"
        name="previewsImg"
        id={preview.fileName}
        checked={mainImgChecked === index}
        onChange={() => firstMainImageCheck(index)}
      />
      <label htmlFor={preview.fileName}>
        <img 
          alt="상품 이미지"
          src={preview.imgSrc}
        />
      </label>
      <button type="button" onClick={() => imageDeleteHandler(index)}></button>
    </li>
  ));

	return (
		<form onSubmit={onSubmit}>
			<UploadInput
				label="상품명"
				placeholder="ex) F41 HAWAII FIVE-O"
        type="text"
				value={name}
				onChange={(e) => setName(e.target.value)}
			/>

			<UploadInput
				label="상품가격"
				placeholder="ex) 248000"
        type="text"
				value={price}
				onChange={(e) => priceCommaToNumber(e)}
			/>
      
      <ImgWrap>
        <ImgUploader>
          <div>
            <input
              ref={ref => (inputRef.current = ref)}
              id="mainImage"
              type="file"
              multiple
              accept="image/*"
              onChange={imageHandler}
              name="mainImages"
            />
            <label htmlFor="mainImage"></label>
          </div>
        </ImgUploader>

        <ImgPreview>
          {previewsImg}
        </ImgPreview>
      </ImgWrap>

			<Quill
				details={details}
        detailImages={detailImages}
				setDetails={setDetails}
        setDetailImages={setDetailImages}
			/>

			<UploadInput
				label="종류"
				placeholder="ex) 메신저백"
        type="text"
				value={type}
				onChange={(e) => setType(e.target.value)}
			/>

			<UploadInput
				label="소재"
				placeholder="ex) 타프원단"
        type="text"
				value={material}
				onChange={(e) => setMaterial(e.target.value)}
			/>

      <UploadInput
        label="색상"
        type="radio"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        colorOptions={["red", "orange", "yellow", "saddlebrown", "antiquewhite", "green", "blue", "purple", "pink", "white", "gray", "black", "etc"]}
      />

      <BtnBox>
        <button type="button" onClick={() => resetData()}>닫기</button>
        <button type="submit">업로드</button>
      </BtnBox>
		</form>
	)
}

export default UploadForm;