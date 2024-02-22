//Quill 에디터 컴포넌트
import React, { useEffect, useMemo, useRef, useContext } from "react";
import styled from "styled-components";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'isomorphic-dompurify';
import { v4 as uuid } from 'uuid';
import mime from "mime-types";
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
	const {
    details, setDetails,
    detailImages, setDetailImages,
  } = useContext(ProductContext);

	useEffect(() => {
		const updatedDetails = details.map((detail) => {
			let newDetail = detail;
			const imgTags = newDetail.match(/<img.*?src="(.*?)".*?>/g);

			if (imgTags) {
				for (const imgTag of imgTags) {
					const imgSrc = imgTag.match(/src="(.*?)"/)[1];

					for (const image of detailImages) {
						if (imgSrc === image.imgSrc) {
							newDetail = newDetail.replace(imgSrc, "https://yongzin.s3.ap-northeast-2.amazonaws.com/raw/" + image.fileName);
						}
					}
				}
			};

			return newDetail;
		});

		if (JSON.stringify(details) !== JSON.stringify(updatedDetails)) {
			//무한루프 방지 후 업데이트
			setDetails(updatedDetails);
		}

	}, [details, detailImages, setDetails]);

	useEffect(() => {
		const imgTagsCount = details.reduce((count, detail) => {
			//details의 img태그 개수 알아내기
			const imgTags = detail.match(/<img.*?src="(.*?)".*?>/g);
			return count + (imgTags ? imgTags.length : 0);
		}, 0);
	
		if (imgTagsCount !== detailImages.length) {
			const imgSrcs = details.flatMap((detail) => {
				//<img>에서 src 추출
				const imgTags = detail.match(/<img.*?src="(.*?)".*?>/g) || [];
				return imgTags.map((imgTag) => imgTag.match(/src="(.*?)"/)[1]);
			});
	
			const updatedDetailImages = detailImages.filter((image) =>
				imgSrcs.includes(image.imgSrc) // image.fileName이 아닌 image.imgSrc와 비교
			);
	
			if (JSON.stringify(detailImages) !== JSON.stringify(updatedDetailImages)) {
				//무한루프 방지 후 업데이트
				setDetailImages(updatedDetailImages);
			}
		}
	}, [details, detailImages, setDetailImages]);

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
						type: file.type,
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