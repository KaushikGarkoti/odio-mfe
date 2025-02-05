import Slider from "react-slick"
import styled from "styled-components"

export const StyledSlider = styled(Slider) `
.slick-slider {
   width: 100%,
   display: 'flex'
}
.slick-slide {
   padding: 0 4px;
}`

export const StyledButton = styled.button `
   display: block;
   box-sizing: border-box;
   transition: 0.3s;
   background-color: rgba(103, 58, 183, 0.1);
   color: rgb(153, 153, 153);
   box-shadow: rgb(51, 51, 51) 0px 0px 2px 0px;
   border-radius: 50%;
   border: none;
   padding: 0px;
   line-height: 50px;
   align-self: center;
   cursor: pointer;
   outline: none;
   font-size: 25px;
   min-width: 0;
   width: 0;
   &:hover {
   opacity: 0.8;
   z-index: 10;
`