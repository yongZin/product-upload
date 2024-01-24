//모든 페이지에서 사용되는 스타일
import { createGlobalStyle } from "styled-components";
import NanumSquareOTF_acL from "../fonts/NanumSquareOTF_acL.woff";
import NanumSquareOTF_acR from "../fonts/NanumSquareOTF_acR.woff";
import NanumSquareOTF_acB from "../fonts/NanumSquareOTF_acB.woff";
import NanumSquareOTF_acEB from "../fonts/NanumSquareOTF_acEB.woff";

const GlobalStyle = createGlobalStyle`
  :root{
    /* 폰트 변수 */
    --f-light:"NanumSquareOTF_acL";
    --f-reular:"NanumSquareOTF_acR";
    --f-bold:"NanumSquareOTF_acB";
    --f-ebold:"NanumSquareOTF_acEB";
    /* //폰트 변수 */
  }

  *{
    margin:0;
    padding:0;
    outline:none;
    list-style:none;
    box-sizing:border-box;
  }

  body{
    margin:0;
    padding:0;
    line-height:normal;
    border:0;
    font-family:var(--f-bold);
    overflow-x:hidden;
    &.scroll-ban{ //모달팝업 활성화 시 스크롤 금지
      overflow:hidden;
    }
  }

  img{
    width:100%;
  }

  button{
    border:0;
    background-color:transparent;
    font-family:var(--f-bold);
    cursor:pointer;
  }

  @font-face {
    font-family:"NanumSquareOTF_acL";
    src:url(${NanumSquareOTF_acL}) format("woff");
    /* src:url("./fonts/NanumSquareOTF_acL.eot");
    src:url("./fonts/NanumSquareOTF_acL.eot?#iefix") format("embedded-opentype"),
      url("./fonts/NanumSquareOTF__acL.svg#NanumSquareOTF_acB") format("svg"),
      url("./fonts/NanumSquareOTF_acL.ttf") format("truetype"),
      url("./fonts/NanumSquareOTF_acL.woff") format("woff"),
      url("./fonts/NanumSquareOTF_acL.woff2") format("woff2"); */
    font-weight:normal;
    font-style:normal;
  }

  @font-face {
    font-family:"NanumSquareOTF_acR";
    src:url(${NanumSquareOTF_acR}) format("woff");
    /* src:url("./fonts/NanumSquareOTF_acR.eot");
    src:url("./fonts/NanumSquareOTF_acR.eot?#iefix") format("embedded-opentype"),
      url("./fonts/NanumSquareOTF__acR.svg#NanumSquareOTF_acB") format("svg"),
      url("./fonts/NanumSquareOTF_acR.ttf") format("truetype"),
      url("./fonts/NanumSquareOTF_acR.woff") format("woff"),
      url("./fonts/NanumSquareOTF_acR.woff2") format("woff2"); */
    font-weight:normal;
    font-style:normal;
  }

  @font-face {
    font-family:"NanumSquareOTF_acB";
    src:url(${NanumSquareOTF_acB}) format("woff");
    /* src:url("./fonts/NanumSquareOTF_acB.eot");
    src:url("./fonts/NanumSquareOTF_acB.eot?#iefix") format("embedded-opentype"),
      url("./fonts/NanumSquareOTF__acB.svg#NanumSquareOTF_acB") format("svg"),
      url("./fonts/NanumSquareOTF_acB.ttf") format("truetype"),
      url("./fonts/NanumSquareOTF_acB.woff") format("woff"),
      url("./fonts/NanumSquareOTF_acB.woff2") format("woff2"); */
    font-weight:normal;
    font-style:normal;
  }

  @font-face {
    font-family:"NanumSquareOTF_acEB";
    src:url(${NanumSquareOTF_acEB}) format("woff");
    /* src:url("./fonts/NanumSquareOTF_acEB.eot");
    src:url("./fonts/NanumSquareOTF_acEB.eot?#iefix") format("embedded-opentype"),
      url("./fonts/NanumSquareOTF__acEB.svg#NanumSquareOTF_acB") format("svg"),
      url("./fonts/NanumSquareOTF_acEB.ttf") format("truetype"),
      url("./fonts/NanumSquareOTF_acEB.woff") format("woff"),
      url("./fonts/NanumSquareOTF_acEB.woff2") format("woff2"); */
    font-weight:normal;
    font-style:normal;
  }
`;

export default GlobalStyle;