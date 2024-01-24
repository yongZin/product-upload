import React, { useMemo, useRef, useState } from "react";
import styled from "styled-components";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'isomorphic-dompurify';
import { v4 as uuid } from 'uuid';
import mime from "mime-types";

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

const Quill = ({
	detailImages,
	setDetailImages,
	setDetails
}) => {
	const quillRef = useRef();

	const purifyHandler = (value) => {
		const sanitizedHTML = DOMPurify.sanitize(value); //공격성 코드 검열
		const resultHTML = sanitizedHTML.replace(/<p>(.*?)<img/g, "<p>$1</p><p><img"); //<img> 앞에 강제로 <p> 추가 (텍스트와 이미지 분리용)
		const cleanedHTML = resultHTML.replace(/<p><br\s?\/?><\/p>|<p><\/p>/g, "");
		const splitHTML = cleanedHTML.split("</p>").filter(Boolean);
		const arrayHTML = splitHTML.map((p) => p + "</p>");

		setDetails(arrayHTML);
	};

	const imageHandler = () => {
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

				setDetailImages((prevDetailsImages) => [...prevDetailsImages, {
					formData,
					imgSrc,
					fileName: fileUuid,
					originalname: file.name
				}]);

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

	const handleQuillChange = (value) => {
		// Quill 에디터의 내용을 정제합니다.
		purifyHandler(value);
	
		// const extractedBase64Sources = value.match(/<img[^>]+src=['"]([^'"]+)['"][^>]*>/g) || [];

		// const extractedBase64Images = extractedBase64Sources.map(source => {
		// 	const matches = source.match(/src=['"]([^'"]+)['"]/);
		// 	return matches ? matches[1] : null;
		// });

		// console.log(extractedBase64Images);
	};

	return (
		<>
			<UploadReactQuill
			ref={quillRef}
			theme="snow"
			onChange={(value) => handleQuillChange(value)}
			modules={quillModules}
			formats={quillFormats}
			placeholder="상세 이미지 및 설명을 작성하세요."
		/>

		{/* <button type="button" onClick={() => console.log(detailImages)}>123123</button> */}
		</>
	)
}

export default Quill;