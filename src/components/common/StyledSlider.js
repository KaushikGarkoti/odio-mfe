import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick"
import styled from "styled-components"

const StyledSlider = styled(Slider) `
.slick-slider {
   width: 100%
}
.slick-slide {
   padding: 0 4px;
}`

export default StyledSlider