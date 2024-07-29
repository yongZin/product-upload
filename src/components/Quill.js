//Quill 에디터 컴포넌트
import React, { useMemo, useRef, useContext } from "react";
import styled from "styled-components";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'isomorphic-dompurify';
import { ProductContext } from "../context/ProductContext";

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
	const {setDetails, setDetailImages} = useContext(ProductContext);

	const purifyHandler = (value) => {
		deleteImageHandler(value);
		
    const sanitizedHTML = DOMPurify.sanitize(value); //공격성 코드 검열
    const cleanedValue = sanitizedHTML.replace(/(<img[^>]*src=)"[^"]*"/g, '$1""'); //base64 이미지 소스 지우기
		const arrayHTML = cleanedValue.replace(/<p><\/p>|<p><br><\/p>/g, ""); //불필요한 태그 삭제

    setDetails(arrayHTML);
	};

	const deleteImageHandler = (value) => { //에디터에서 삭제된 이미지 찾아 지우기
		let parser = new DOMParser();
		let htmlDoc = parser.parseFromString(value, "text/html");
		let imgSrcValues = Array.from(htmlDoc.getElementsByTagName("img")).map(img => img.getAttribute("src")); //img태그 소스 가져오기

		setDetailImages(prevImages => prevImages.filter(image => imgSrcValues.includes(image.dataUrl)));
	};

	const imageHandler = () => {
		//quill 에디터의 이미지 선택시 formData형식으로 상태관리
		const input = document.createElement("input");
		input.setAttribute("type", "file");
		input.setAttribute("accept", "image/*");
		input.click();

		input.onchange = async () => {
			const imageFile = input.files[0];
			const fileReader = new FileReader();
			
			fileReader.onload = async (e) => {
				const imgSrc = e.target.result;

				// setDetailImages((prevImages) => [...prevImages, imageFile]);
				setDetailImages((prevImages) => [...prevImages, { file: imageFile, dataUrl: imgSrc }]);
				
				const range = quillRef.current.getEditor().getSelection();
				
				quillRef.current.getEditor().insertEmbed(range.index, "image", imgSrc);
				quillRef.current.getEditor().insertText(range.index + 1, "\n");
				quillRef.current.getEditor().setSelection(range.index + 2);
			};

			if (imageFile) {
				fileReader.readAsDataURL(imageFile);
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