import React, { useEffect, useMemo, useRef, useContext } from "react";
import styled from "styled-components";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'isomorphic-dompurify';
import { v4 as uuid } from 'uuid';
import mime from "mime-types";
import { ProductContext } from "../context/productContext";

const UploadReactQuill = styled(ReactQuill)`
  height:500px;
  margin-bottom:30px;
  border-radius:15px;
  border:1px solid #ccc;
  background-color:rgba(255,255,255,0.5);
  .ql{
    &-toolbar{
      height:42px !important;
      padding:8px !important;
      border:0 !important;
      font-family:var(--f-bold) !important;
      input{
        &.ql-image[type=file]{
          display:none;
        }
      }
    }
    &-container{
      height:calc(100% - 42px);
      border:0 !important;
      border-top:1px solid #ccc !important;
      font-family:var(--f-bold) !important;
    }
    &-editor{
      p{
        font-size:16px !important;
        strong{
          font-size:20px !important;
          font-family:var(--f-ebold) !important;
        }
      }
      img{
        max-width:50% !important;
				display:block !important;
      }
			&::-webkit-scrollbar{
				width:12px;
				background-color:transparent;
				&-thumb{
					border-radius:10px;
					border:2px solid transparent;
					background-clip:padding-box;
					background-color:#c7c7c7;
				}
				&-track{
					background-color:transparent;
				}
				&-button{
					&:start:decrement{
						height:4px;
						display:block;
					}
					&:end:increment{
						height:10px;
						display:block;
					}
				}
			}
    }
  }
`;

const Quill = () => {
	const quillRef = useRef();
	const {
    details, setDetails,
    detailImages, setDetailImages,
  } = useContext(ProductContext);

	useEffect(() => {
    const updatedDetails = details.map((htmlString) => {
			//details의 base64 이미지소스 고유 네이밍으로 변경(uuid)

			const matchSource = htmlString.match(/<img.*?src=['"](.*?)['"].*?>/);

			if (matchSource && matchSource[1]) {
				const base64Source = matchSource[1];
				const matchingImage = detailImages.find((image) => image.imgSrc === base64Source); //details와 detailImages의 이미지 소스비교

				if (matchingImage) {
					const updatedHtmlString = htmlString.replace(base64Source, matchingImage.fileName); //base64 소스를 uuid를 적용한 고유 소스로 변경

					return updatedHtmlString;
				}
			}

			return htmlString;
    });

    const updatedDetailImages = detailImages.filter((image) => {
			//삭제된 이미지 detailImages에 적용하여 재배열

			return updatedDetails.some((detail) => {
				const matchSource = detail.match(/<img.*?src=['"](.*?)['"].*?>/);

				return matchSource && matchSource[1] === image.fileName;
			});
    });

    if (JSON.stringify(updatedDetails) !== JSON.stringify(details)) {
			setDetails(updatedDetails);
    }

    if (JSON.stringify(updatedDetailImages) !== JSON.stringify(detailImages)) {
			setDetailImages(updatedDetailImages);
    }
	}, [details, detailImages, setDetails, setDetailImages]);

	const purifyHandler = (value) => {
		//공격성 코드 검열
		const sanitizedHTML = DOMPurify.sanitize(value);
		const resultHTML = sanitizedHTML.replace(/<p>(.*?)<img/g, "<p>$1</p><p><img"); //<img> 앞에 강제로 <p> 추가 (텍스트와 이미지 분리용)
		const cleanedHTML = resultHTML.replace(/<p><br\s?\/?><\/p>|<p><\/p>/g, "");
		const splitHTML = cleanedHTML.split("</p>").filter(Boolean);
		const arrayHTML = splitHTML.map((p) => p + "</p>");

		setDetails(arrayHTML);
	};

	const imageHandler = () => {
		//quill 에디터의 이미지 선택시 formData형식으로 상태관리
		const input = document.createElement("input");
		input.setAttribute("type", "file");
		input.setAttribute("accept", "image/*");
		input.click();

		input.onchange = async () => {
			const file = input.files[0];

			try {
				const fileReader = new FileReader();
				const formData = new FormData();

				const fileUuid = `${uuid()}.${mime.extension(file.type)}`;

				formData.append("Content-Type", file.type);
				formData.append("file", file);
				formData.append("key", fileUuid);
				formData.append("filename", fileUuid);
				formData.append("originalname", file.name);

				fileReader.readAsDataURL(file);

        const imgSrc = await new Promise((resolve, reject) => {
          fileReader.onload = (e) => resolve(e.target.result);
          fileReader.onerror = (err) => reject(err);
        });

				setDetailImages((prevDetailsImages) => [
					...prevDetailsImages,
					{
						formData,
						imgSrc,
						fileName: fileUuid,
						originalname: file.name,
					},
				]);

				if (imgSrc) {
					const range = quillRef.current.getEditor().getSelection();

					quillRef.current.getEditor().insertEmbed(range.index, 'image', imgSrc);
				}
				
			} catch (error) {
				console.error(error);
			}
		}
	};
	
	const quillModules = useMemo(() => ({
    toolbar: {
      container: [
        ["bold"], ["image"]
      ],
      handlers: {
        image: imageHandler,
			}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  const quillFormats = useMemo(() => (
    ["bold", "image"]
	), []);

	return (
		<UploadReactQuill
			ref={quillRef}
			theme="snow"
			onChange={(value) => purifyHandler(value)}
			modules={quillModules}
			formats={quillFormats}
			placeholder="상세 이미지 및 설명을 작성하세요."
		/>
	)
}

export default Quill;