//미디어쿼리 믹스인
const size = {
	mobile_xs:"400px",
  mobile:"600px",
  tablet:"800px",
  laptop:"1000px",
  pc:"1200px",
}

const theme = {
	mobile_xs:`(max-width: ${size.mobile_xs})`,
  mobile:`(max-width: ${size.mobile})`,
  tablet:`(max-width: ${size.tablet})`,
  laptop:`(min-width: ${size.laptop})`,
  pc:`(min-width: ${size.pc})`,
}

export default theme