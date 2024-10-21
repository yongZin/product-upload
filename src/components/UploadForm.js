//상품 업로드 컴포넌트
import React, { useState, useRef, useContext, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { toast } from "react-toastify";
import Quill from "./Quill";
import UploadInput from "./UploadInput";
import { ProductContext } from "../context/ProductContext";
import { ModalContext } from "../context/ModalContext";
import apiClient from "../clientAPI/apiClient";

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
        height:100%;
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
        color:#aaa;
        background-color:#bbb;
        position:relative;
        cursor:no-drop;
        &:before{
          content:"모든 정보를 입력해주세요";
          width:100px;
          padding:5px;
          font-size:12px;
          border-radius: 6px;
          border:1px solid rgba(0, 0, 0, 0.1);
          color: #333;
          background-color:#c2c2c2;
          position:absolute;
          top:-44px;
          left:50%;
          box-sizing: border-box;
          opacity:0;
          transition:0.2s;
          pointer-events:none;
          transform: translateX(-50%);
        }
        &:after{
          content:"";
          width:7px;
          height:7px;
          background-color:#c2c2c2;
          position:absolute;
          top:-7px;
          left:40%;
          border-bottom:1px solid rgba(0, 0, 0, 0.1);
          border-right:1px solid rgba(0, 0, 0, 0.1);
          opacity:0;
          transition:0.2s;
          pointer-events:none;
          transform: translateX(-50%) rotate(45deg);
        }
        &:hover{
          background-color:#bbb;
          &:before{
            top:-51px;
            opacity:1;
          }
          &:after{
            top:-14px;
            opacity:1;
          }
        }
      }
      &:hover{
        background-color:rgba(0, 198, 4, 0.65);
      }
    }
    &.loading{
      position:relative;
      color:transparent;
      pointer-events:none;
      &:before{
        content:"";
        width:25px;
        height:25px;
        border-radius:50%;
        border:5px solid #eee;
        border-bottom-color:#ccc;
        animation:rotation 0.6s linear infinite;
        position:absolute;
        top:calc(50% - 13px);
        left:calc(50% - 13px);
        box-sizing:border-box;
      }
      @keyframes rotation {
        0%{
          transform:rotate(0deg);
        }
        100%{
          transform:rotate(360deg);
        }
      }
    }
  }
  @media ${props => props.theme.tablet} {
    button{
      font-size:16px;
      &:last-child{
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
  const [loading, setLoading] = useState(false);
  const {setModalView, setClose} = useContext(ModalContext);
  const {
    setProducts,
    productsAll, setProductsAll,
    productForm,
    updateProductForm,
    resetProductForm,
    previews, setPreviews,
    confirm, setConfirm,
    setTotalProductCount
  } = useContext(ProductContext);

  useEffect(() => { //상품정보 입력 유효성 검사
    const { mainImages, detailImages, name, price, details, type, material, color } = productForm;
    const allValuesFilled = [mainImages, detailImages, name, price, details, type, material, color].every(value => value);

    setConfirm(allValuesFilled);
  }, [productForm, setConfirm]);

  const imageHandler = async (e) => {
    const imageFiles = e.target.files; //파일정보 가져오기
    const currentMainImages = productForm.mainImages;

    if (currentMainImages.length + imageFiles.length > 4) {
      toast.error("대표 이미지는 최대 4개까지 업로드 가능합니다.");
    } else {
      const newImages = [...new Set([...currentMainImages, ...imageFiles])];

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

      updateProductForm("mainImages", newImages);
      setPreviews((prevPreviews) => [...prevPreviews, ...imagePreviews]);
    }
  }

  const imageDeleteHandler = (index) => {
    const newMainImages = [...productForm.mainImages];
    
    newMainImages.splice(index, 1);
    updateProductForm('mainImages', newMainImages);

    setPreviews((prevPreviews) => {
      const newPreviews = [...prevPreviews];
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

	const priceCommaToNumber = (e) => {
		let value = e.target.value;
		
		if (!value) return;

    const numberValue = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;

    updateProductForm("price", numberValue);
  };

  const numberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const onSubmit = async (e) => {
    e.preventDefault();

    const { mainImages, detailImages, name, price, details, type, material, color } = productForm;

    try {
      if (!mainImages || !detailImages || !name || !price || !details || !type || !material || !color) {
        throw new Error("모든 정보를 입력해주세요.");
      }

      setLoading(true);

      const mainPresignedData = await apiClient.post("/upload/presigned", {
        contentTypes: mainImages.map((image) => image.type)
      });

      const detailPresignedData = await apiClient.post("/upload/presigned", {
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

      const typeFilter = productsAll.filter(item => item.type === type);
      const typeIndex = typeFilter.length + 1;
      const newName = `${name}_${String(typeIndex).padStart(3, "0")}`

      const res = await apiClient.post("/upload", {
        mainImages: mainPresignedData.data.map((data) => ({
          imageKey: data.imageKey,
        })),
        detailImages: detailPresignedData.data.map((data) => ({
          imageKey: data.imageKey,
        })),
        name: newName,
        price,
        details,
        type,
        material,
        color,
      });

      setProducts((prevData) => [res.data, ...prevData]);
      setProductsAll((prevData) => [res.data, ...prevData]);
      setTotalProductCount((prevCount) => prevCount + 1);

      setLoading(false);
      resetData();
      toast.success("업로드 성공");
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
      console.error(error);
      setLoading(false);
    }
  };

  const resetData = () => {
    setClose(true);
    setPreviews([]);
    resetProductForm();

    setTimeout(() => {
      setModalView("off");
      setClose(false);
    }, 300);

    if (inputRef.current) inputRef.current.value = null;
  };

  const firstMainImageCheck = (index) => {
    setMainImgChecked(index);

    const newMainImages = [...productForm.mainImages];
    const selectedImage = newMainImages[index];

    newMainImages.splice(index, 1);
    newMainImages.unshift(selectedImage);

    updateProductForm("mainImages", newMainImages);
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
				value={productForm.name}
				onChange={(e) => updateProductForm('name', e.target.value)}
			/>

			<UploadInput
				label="상품가격"
				placeholder="ex) 248000"
        type="text"
				value={numberWithCommas(productForm.price)}
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

			<Quill />

			<UploadInput
				label="종류"
				placeholder="ex) 메신저백"
        type="text"
				value={productForm.type}
				onChange={(e) => updateProductForm("type", e.target.value)}
			/>

			<UploadInput
				label="소재"
				placeholder="ex) 타프원단"
        type="text"
				value={productForm.material}
				onChange={(e) => updateProductForm("material", e.target.value)}
			/>

      <UploadInput
        label="색상"
        type="radio"
        value={productForm.color}
        onChange={(e) => updateProductForm("color", e.target.value)}
        colorOptions={["red", "orange", "yellow", "saddlebrown", "antiquewhite", "green", "blue", "purple", "pink", "white", "gray", "black", "etc"]}
      />

      <BtnBox>
        <button type="button" onClick={() => resetData()}>닫기</button>
        <button
          type={confirm ? "submit" : "button"}
          className={loading ? "loading" : ""}
          disabled={!confirm}
        >
          업로드
        </button>
      </BtnBox>
		</form>
	)
}

export default UploadForm;