//상품 업로드 컴포넌트
import React, { useState, useRef, useContext } from "react"; //useContext
import axios from "axios";
import styled from "styled-components";
import { v4 as uuid } from 'uuid';
import mime from "mime-types";
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
    details, setDetails,
    detailImages, setDetailImages,
    type, setType,
    material, setMaterial,
    color, setColor,
  } = useContext(ProductContext);

	const imageHandler = async (e) => {
    const imgFiles = e.target.files; //파일정보 가져오기
    const newPreviews = []; //추가로 선택된 파일정보 저장

    for (const imgFile of imgFiles) {
      try {
        const fileReader = new FileReader();
        const formData = new FormData();

        const fileUuid = `${uuid()}.${mime.extension(imgFile.type)}`;

        formData.append("Content-Type", imgFile.type);
        formData.append("file", imgFile);
        formData.append("key", fileUuid);
				formData.append("filename", fileUuid);
				formData.append("originalname", imgFile.name);

        fileReader.readAsDataURL(imgFile);

        const imgSrc = await new Promise((resolve, reject) => {
          fileReader.onload = (e) => resolve(e.target.result);
          fileReader.onerror = (err) => reject(err);
        });

        newPreviews.push({
          formData,
          imgSrc,
          fileName: fileUuid,
          originalname: imgFile.name,
          type: imgFile.type
        });
        
      } catch (err) {
        console.error(err);
      }
    }

    if (mainImages.length + newPreviews.length > 4) {
      toast.error("대표 이미지는 최대 4개까지 업로드 가능합니다.");
      return;
    }
    
    setMainImages((prevMainImages) => [
      ...prevMainImages,
      ...newPreviews.map((preview) => ({
        formData: preview.formData,
        imgSrc: preview.imgSrc,
        fileName: preview.fileName,
        originalname: preview.originalname,
        type: preview.type,
      })),
    ]);
  };

  const imageDeleteHandler = (index) => {
    const updatedPreviews = [...mainImages];

    updatedPreviews.splice(index, 1);

    setMainImages(updatedPreviews);
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

    const formData = new FormData();

    mainImages.forEach((image) => {
      formData.append("mainImage", image.formData.get('file'), image.fileName);
    });

    detailImages.forEach((image) => {
      formData.append("detailImage", image.formData.get('file'), image.fileName);
    });

    formData.append("name", name);
    formData.append("price", price);
    formData.append("details", details);
    formData.append("type", type);
    formData.append("material", material);
    formData.append("color", color);

		try {

      const res = await axios.post("upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      // const presignedDataMain = await axios.post("upload/presigned", {
      //   contentTypes: mainImages.map((file) => ({
      //     type: file.type,
      //     fileName: file.fileName,
      //   })),
      // });
      
      // const presignedDataDetail = await axios.post("upload/presigned", {
      //   contentTypes: detailImages.map((file) => ({
      //     type: file.type,
      //     fileName: file.fileName,
      //   })),
      // });
      
      // await Promise.all(
      //   mainImages.map((file, index) => {
      //     const { presigned } = presignedDataMain.data[index];
      
      //     const formData = new FormData();
      
      //     for (const key in presigned.fields) {
      //       formData.append(key, presigned.fields[key]);
      //     }
      
      //     formData.append("Content-Type", file.type);
      //     formData.append("file", file);
      
      //     return axios.post(presigned.url, formData);
      //   })
      // );
      
      // await Promise.all(
      //   detailImages.map((file, index) => {
      //     const { presigned } = presignedDataDetail.data[index];
      
      //     const formData = new FormData();
      
      //     for (const key in presigned.fields) {
      //       formData.append(key, presigned.fields[key]);
      //     }
      
      //     formData.append("Content-Type", file.type);
      //     formData.append("file", file);
      
      //     return axios.post(presigned.url, formData);
      //   })
      // );
      
      // const res = await axios.post("upload", {
      //   mainImages: presignedDataMain.data.map((item) => ({
      //     imageKey: item.imageKey,
      //     originalname: item.originalname,
      //   })),
      //   detailImages: presignedDataDetail.data.map((item) => ({
      //     imageKey: item.imageKey,
      //     originalname: item.originalname,
      //   })),
      //   name,
      //   price,
      //   details,
      //   type,
      //   material,
      //   color,
      // });
  

      //form 유효성 검사 필요

      setProducts((prevData) => [res.data, ...prevData]); //실시간 업로드 반영
      setProductsAll((prevData) => [res.data, ...prevData]);
      toast.success("업로드 성공");

      setTimeout(() =>{ //초기화
        resetData();
      }, 1000);
		} catch (error) {
      toast.error(error.response.data.message);
      resetData();
			console.error(error);
		}
	};

  const resetData = () => {
    setName("");
    setPrice("");
    setMainImages([]);
    setDetails([]);
    setType("");
    setMaterial("");
    setColor("");
    setClose(true);

    setTimeout(() => {
      setModalView("off");
      setClose(false);
    }, 300);

    if (inputRef.current) inputRef.current.value = null;
  };

  const firstMainImageCheck = (index) => {
    setMainImgChecked(index);

    const checkedImage = mainImages.splice(index, 1)[0];

    mainImages.unshift(checkedImage);
    setMainImages([...mainImages]);
    setMainImgChecked(0);
  }

	const previewsImg = mainImages && mainImages.map((preview,index) => (
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

			{/* <UploadInput
				label="색상"
				placeholder="ex) 검정"
        type="radio"
				value={color}
				onChange={(e) => setColor(e.target.value)}
			/> */}

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